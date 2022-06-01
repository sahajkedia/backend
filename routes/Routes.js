const router = require('express').Router();
const clientRef = require('../controller/Controller.js')

router.post('/signin',clientRef.Signin)
router.post('/signup',clientRef.Signup)
router.get('/logout',clientRef.Logout)
// router.get('/reset-pass')
 router.post('/google-sign-in',clientRef.Signinwithgoogle)
//router.get('verify-email')

module.exports = router;