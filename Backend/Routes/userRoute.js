import express from 'express';
import  {registerUser,loginUser,adminLogin, getTotalUsers, getUsersData, getCustomerLocations, getGeoSpatialData}  from '../Controllers/userControllers.js';
import adminAuth from '../Middleware/adminAuth.js';
const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/total-users', getTotalUsers)
userRouter.get('/all-users', getUsersData)

//map location of users 
userRouter.get('/customer-location',adminAuth, getCustomerLocations );
userRouter.get('/geo-data', adminAuth, getGeoSpatialData)

export default userRouter;