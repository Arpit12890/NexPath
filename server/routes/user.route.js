// Init router
import express from 'express';
import { getUserProfile, login,logout,register, updateProfile } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../utils/multer.js';

const router = express.Router();

//define the route using .route()
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/profile').get(isAuthenticated,getUserProfile) //1st check if user is authenticated or not then get user profile
router.route('/profile/update').put(isAuthenticated,upload.single("profilePhoto"),updateProfile) 

export default router;

