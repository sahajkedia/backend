const User = require('../models/Model')
const { v4: uuidv4 } = require('uuid');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID)
const sgMail = require('@sendgrid/mail')
const GoogleUsers = []

const Signinwithgoogle = async(req,res,next) =>{
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken:token,
        audience:process.env.CLIENT_ID,
    })
    const {name, email} = ticket.getPayload();
    GoogleUsers.push({name,email});
    res.status(201).json({name, email});
}


const Signin = async (req,res,next) => {
    let {email,password} = req.body;
    let data;
    if(email.length>0 && email.includes("@") && password.length>0){
        let user = User.findOne({email}).exec((err,item) => {
            if(err){
                console.log(err)
                res.status(400).json({
                    "message":"Create an account first"
                })
            }
            else{ 
                data = item
                passwordCorrect  = (password && data.password);
                if(passwordCorrect){
                    res.status(400)
                }
                else{
                    res.send({error:"please enter valid data."})
                }
        }
        })

    }    
}


const Signup = async (req,res,next) => {
    let {email,password,firstName,lastName} = req.body;
    if( !firstName || !lastName || !password || !email ){
        return res.status(422).json({
            "error" : "Something is missing"
        })   
    }

    const userExists = await User.findOne({email})
    if(!userExists){
        
    const newUser = new User({
        id:uuidv4(),
        email:email,
        password:password,
        firstName:firstName,
        lastName:lastName
    })
    
    try{
        let user = await newUser.save()
        res.status(201).json({
            message:"User Successfully Created",
        })
    }
    catch(err){
        res.status(400).json({
            message:"Invalid Credentials"
        })
        return next(err)
    }

}
else return res.status(400).json({
        "message":"could not complete your request"
    })  
}


const OtpSendControl = async(req,res,next) =>{
    const {email} = req.params
    
    let otpcode = Math.floor((Math.random()*10000)+1);
    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email, 
      from: 'test@test.com', 
      subject: 'Email for Verification',
      text: otpcode,
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })

    
}


const OtpVerifyControl = async(req,res,next) =>{
    const otp = req.params.otp;
    if(otp==otpcode){
        return res.json({message : "Signed In Successfully"}).status(201)
    }
    else{
        return res.json({message : "Wrong OTP"}).status(404)
    }

}


const ForgotPassword = async(req,res,next) =>{
    const {email} = req.params
    const userExists = await User.findOne({email})
    if(userExists){
        let otpcode = Math.floor((Math.random()*10000)+1);
    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email, 
      from: 'test@test.com', 
      subject: 'Email for Verification',
      text: otpcode,
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })

    }
    else{
        return res.json({error: "User Not Found"}).status(400)
    }
    
}


//think about logout
const Logout = async (req,res,next) => {
    req.logout()
    //redirect to homepage
}

exports.Signin = Signin;
exports.Signup = Signup;
exports.Logout = Logout;
exports.Signinwithgoogle = Signinwithgoogle;
exports.ForgotPassword = ForgotPassword;
exports.OtpSendControl = OtpSendControl;
exports.OtpVerifyControl = OtpVerifyControl;

