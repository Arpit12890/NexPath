import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { createCheckoutSession, getAllPurchasedCourse, getCourseDetailWithPurchaseStatus, stripeWebhook } from '../controllers/coursePurchase.controller.js';

const router = express.Router();    

//for session
router.route('/checkout/create-checkout-session').post(isAuthenticated, createCheckoutSession);

//for webhook
router.route('/webhook').post(express.raw({type: 'application/json'}),stripeWebhook);

//get status of a course purchase
router.route('/course/:courseId/detail-with-status').get(isAuthenticated,getCourseDetailWithPurchaseStatus);

//for getting all the purchases course of a user
router.route('/').get(isAuthenticated,getAllPurchasedCourse);

export default router;