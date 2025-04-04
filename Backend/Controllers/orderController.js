import orderModel from "../Model/orderModel.js"
import userModel from "../Model/userModel.js";
import Stripe from 'stripe';
import crypto from 'crypto';
import  Razorpay from 'razorpay';
import dotenv from 'dotenv';
import paypal from 'paypal-rest-sdk' 
  
dotenv.config();

//global veriables 
const currency = "USD"
const deliveryCharge = 10



//gateway intialize 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});
paypal.configure({
  "mode" : "sandbox",
  "client_id" : process.env.PAYPAL_CLIENT_ID,
  "client_secret" : process.env.PAYPAL_SECRET_KEY
})


//place order using  COD method 
const placeOrderCOD = async (req,res) => {
   try {
      const {userId, amount , address, items} = req.body

      const orderData ={
        userId,
        amount, items,
        address, 
        paymentMethod : "COD",
        payment : false,
        date : Date.now()
      }

      const newOrder = new orderModel(orderData);

      await newOrder.save();

      await userModel.findByIdAndUpdate(userId,{cartData : {}});

      res.json({ success : true , message: "Order  placed  successfully", order: newOrder });

   } catch (error) {
    res.status(500).json({ success : false ,message: "Server error", error: error.message });

   }
}


//place order using Stripe method 
const placeOrderStripe = async (req, res) => {
  try {
   const { userId, amount, address, items } = req.body;
   const { origin } = req.headers;

   const orderData = {
       userId,
       amount,
       items,
       address,
       paymentMethod: "Stripe",
       payment: false,
       date: Date.now()
   };
   
   const newOrder = new orderModel(orderData);
   await newOrder.save();

   const line_items = items.map((item) => ({
       price_data: {
           currency: currency,
           product_data: {
               name: item.name,
           },
           unit_amount: item.price * 100 // ✅ Fixed
       },
       quantity: item.quantity
   }));

   line_items.push({
       price_data: {
           currency: currency,
           product_data: {
               name: "Delivery Charges",
           },
           unit_amount: deliveryCharge * 100 // ✅ Fixed
       },
       quantity: 1
   });

   const session = await stripe.checkout.sessions.create({
       success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
       cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`, // ✅ Fixed typo
       line_items,
       mode: 'payment',
   });

   res.json({ success: true, session_url: session.url });
   
  } catch (error) {
     res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

//verfiy Stripe 
const verifyStripe = async( req,res) => {
  const { orderId, success, userId } = req.query;  

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      return res.json({
        success: true,
        message: "Payment verified and order updated!"
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({
        success: false,
        message: "Payment failed. Order deleted."
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}

// Create Razorpay Order 
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, amount, address, items } = req.body;

    // ✅ नया Order डेटाबेस में save करें
    const orderData = {
      userId,
      amount,
      items,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
      razorpayOrderId: "" // Initialize razorpay order ID
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // ✅ Amount को paise में convert करें (INR के लिए)
    const razorpayAmount = Math.round(amount * 100); // USD के लिए 100 से गुणा

    const options = {
      amount: razorpayAmount,
      currency: 'INR', // Razorpay में INR को default currency रखें
      receipt: `order_${newOrder._id}`,
      payment_capture: 1 // Auto-capture payment
    };

    const razorpayOrder = await razorpay.orders.create(options);
    
    // ✅ डेटाबेस में razorpayOrderId update करें
    newOrder.razorpayOrderId = razorpayOrder.id;
    await newOrder.save();

    res.status(200).json({ 
      success: true,
      order: razorpayOrder,
      message: "Razorpay order created successfully" 
    });

  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ 
      success: false,
      message: error.error?.description || 'Error creating Razorpay order',
      error: error.message 
    });
  }
};

// ✅ Verify Payment & Create Order
const verifyRazorpayPayment = (req, res) => {
  try {
    const { paymentResponse } = req.body; // ✅ पूरा paymentResponse object लें
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = paymentResponse || {};

    // ✅ Error handling जोड़ें
    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
            success: false,
            error: "Missing payment details in request"
        });
    }
      
    
      if (!process.env.RAZORPAY_SECRET) {
          return res.status(500).json({ error: "Razorpay secret key is missing in environment variables!" });
      }

       
      const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generatedSignature = hmac.digest("hex");
       

      if (generatedSignature === razorpay_signature) {
          return res.status(200).json({ success: true, message: "Payment verified successfully!" });
      } else {
          return res.status(400).json({ error: "Invalid signature, payment verification failed!" });
      }
  } catch (error) {
      console.error("Error in verifyRazorpayPayment:", error);
      return res.status(500).json({ error: "Internal server error" });
  }
};





 

//place order using  Paypal method 
const placeOrderPaypal = async (req, res) => {
  try {
    const { userId, address, items, subtotal, discount, shipping, total } = req.body;

    // ✅ Use frontend's total
    const totalAmount = parseFloat(total.toFixed(2));

    // ✅ Create Order in Database
    const orderData = {
      userId,
      amount: totalAmount,
      items,
      address,
      paymentMethod: "PayPal",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // ✅ Prepare Items for PayPal (products, shipping, discount)
    const itemsList = items.map((item) => ({
      name: item.name || "Item",
      sku: item.sku || "item",
      price: parseFloat(item.price).toFixed(2),
      currency: "USD",
      quantity: parseInt(item.quantity),
      image: item.image 
    }));

    // Add Shipping as a line item
    itemsList.push({
      name: "Shipping Fee",
      sku: "shipping",
      price: parseFloat(shipping).toFixed(2),
      currency: "USD",
      quantity: 1,
    });

    // Add Discount as a negative line item
    if (discount > 0) {
      itemsList.push({
        name: "Discount",
        sku: "discount",
        price: (-discount).toFixed(2),
        currency: "USD",
        quantity: 1,
      });
    }

    // ✅ PayPal Payment Data
    const paymentData = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: `${process.env.CLIENT_URL}/verify-paypal?success=true&orderId=${newOrder._id}`,
        cancel_url: `${process.env.CLIENT_URL}/verify-paypal?success=false&orderId=${newOrder._id}`,
      },
      transactions: [
        {
          item_list: { items: itemsList },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
            details: {
              subtotal: (subtotal - discount + shipping).toFixed(2), // Adjusted subtotal
              shipping: "0.00", // Shipping is included in line items
            },
          },
          description: "Order Payment",
        },
      ],
    };

    // ✅ Handle PayPal payment with promises
    const payment = await new Promise((resolve, reject) => {
      paypal.payment.create(paymentData, (error, payment) => {
        if (error) reject(error);
        else resolve(payment);
      });
    });

    const approvalUrl = payment.links.find(link => link.rel === 'approval_url')?.href;
    if (!approvalUrl) throw new Error("Approval URL missing");

    res.status(200).json({ success: true, approvalUrl });

  } catch (error) {
    console.error("❌ Error in placeOrderPaypal:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Verify PayPal Payment
const verifyPaypal = async (req, res) => {
  try {
    const { orderId, success, paymentId, payerId } = req.query;

    if (!orderId || !paymentId || !payerId) {
      return res.status(400).json({ success: false, message: "Missing parameters." });
    }

    if (success === "true") {
      // ✅ Capture PayPal payment
      const captureResult = await new Promise((resolve, reject) => {
        paypal.payment.execute(paymentId, { payer_id: payerId }, (error, payment) => {
          if (error) reject(error);
          else resolve(payment);
        });
      });

      if (captureResult.state === "approved") {
        // ✅ Update order as paid
        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, {
          payment: true,
          paymentDetails: {
            paymentId: captureResult.id,
            payerId: payerId,
            paymentMethod: 'PayPal',
            amount: captureResult.transactions[0].amount.total,
            currency: captureResult.transactions[0].amount.currency,
            status: captureResult.state
          }
        }, { new: true });

        console.log(`✅ Payment successful for orderId: ${orderId}`);
        return res.json({ success: true, message: "Payment verified and order updated!", order: updatedOrder });
      } else {
        throw new Error("Payment not approved");
      }
    } else {
      // ❌ Delete order if payment fails
      await orderModel.findByIdAndDelete(orderId);
      console.log(`❌ Payment failed for orderId: ${orderId}`);
      return res.json({ success: false, message: "Payment failed. Order deleted." });
    }
  } catch (error) {
    console.error("❌ Error in verifyPaypal:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

//all order data for admin panel 
const allOrder = async (req, res) => {
   try {
     const order = await orderModel.find({});
     
     // ✅ Convert string to array if necessary
     order.forEach((order) => {
       order.items.forEach((item) => {
         if (!Array.isArray(item.image) && typeof item.image === 'string') {
           item.image = [item.image]; // ✅ Convert to array
         }
       });
     });
 
     res.json({
       success: true,
       order
     });
   } catch (error) {
     res.status(500).json({ success: false, message: error.message });
   }
 };


 

// user order data for  frontend 
const  userOrder = async (req,res) => {
      try {
         const {userId} = req.body
         const orders = await orderModel.find({userId})

         res.json({
            success : true,
            orders
         })
      } catch (error) {
         res.status(500).json({ success : false ,message: "Server error", error: error.message });

      }
}
 
// ✅ Update order status from admin panel
const updateStatus = async (req, res) => {
   try {
     const { orderId, status } = req.body;
 
     const updatedOrder = await orderModel.findByIdAndUpdate(
       orderId,
       { status },
       { new: true }
     );
 
     if (!updatedOrder) {
       return res.status(404).json({ success: false, message: "Order not found" });
     }
 
     res.json({ success: true, message: "Order status updated", order: updatedOrder });
   } catch (error) {
     console.error("❌ Error updating order status:", error.message);
     res.status(500).json({ success: false, message: "Server error", error: error.message });
   }
 };
 

// Update the getTotalRevenue function
const getTotalRevenue = async (req, res) => {
  try {
    const totalRevenue = await orderModel.aggregate([
      { 
        $match: { 
          payment: true, // Filter only paid orders
          status: { $ne: "Cancelled" } // Exclude cancelled orders
        } 
      },
      { 
        $group: { 
          _id: null, 
          totalRevenue: { $sum: "$amount" },
          totalOrders: { $sum: 1 }
        } 
      }
    ]);

    res.status(200).json({
      success: true,
      totalRevenue: totalRevenue[0]?.totalRevenue || 0,
      totalOrders: totalRevenue[0]?.totalOrders || 0
    });
  } catch (error) {
    console.error("Error calculating revenue:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
  }
};

// Update the productSales function
const productSales = async (req, res) => {
  try {
    const sales = await orderModel.aggregate([
      { 
        $match: { 
          payment: true,
          status: { $ne: "Cancelled" },
          date: { $exists: true, $type: "number" } // Ensure date is numeric timestamp
        } 
      },
      {
        $addFields: {
          convertedDate: {
            $toDate: "$date" // Convert numeric timestamp to Date
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$convertedDate" },
            year: { $year: "$convertedDate" }
          },
          totalSales: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const formattedSales = sales.map(sale => ({
      ...sale,
      monthName: monthNames[sale._id.month - 1],
      year: sale._id.year
    }));

    res.json({ 
      success: true, 
      sales: formattedSales 
    });
  } catch (error) {
    console.error('Failed to fetch sales data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch sales data',
      error: error.message 
    });
  }
};

export {placeOrderRazorpay,productSales, placeOrderStripe, updateStatus, userOrder, allOrder , placeOrderPaypal , placeOrderCOD , verifyStripe, verifyRazorpayPayment, verifyPaypal, getTotalRevenue };