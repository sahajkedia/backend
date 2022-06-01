const router = require('express').Router();
const clientRef = require('../controller/Controller.js')

router.post('/signin',clientRef.Signin)
router.post('/signup',clientRef.Signup)
router.get('/logout',clientRef.Logout)
router.post('/forgot-pass/:email',clientRef.ForgotPassword)
router.post('/google-sign-in',clientRef.Signinwithgoogle)
router.post('/verify-email/:email',clientRef.OtpSendControl)
router.post('/verify/:otp',clientRef.OtpVerifyControl)
router.put('/reset-pass/:newpass/:email',clientRef.ResetPassword);
module.exports = router;