const router = require('express').Router();
const clientRef = require('../controller/Controller.js')

router.post('/signin',clientRef.Signin)
router.post('/signup',clientRef.Signup)
router.get('/logout',clientRef.Logout)
// router.get('/reset-pass')
// router.get('/google-sign-in')
// router.get('/google-sign-up')
//router.get('verify-email')

module.exports = router;