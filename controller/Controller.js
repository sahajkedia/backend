const User = require('../models/Model')
const { v4: uuidv4 } = require('uuid');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID)
const nodemailer = require("nodemailer");
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
                    res.status(400).json({
                        id:data.id
                    })
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

let otpGlobal ;
const OtpSendControl = async(req,res,next) =>{
    const {email} = req.params
    
    let otpcode = await Math.floor(100000 + Math.random() * 900000)
    otpcode = otpcode.toString().substring(0,4);
    console.log(otpcode);
    async function main() {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
        user: testAccount.user, 
        pass: testAccount.pass,
        },
    });

    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to: email, 
        subject: "Email Verification", 
        text: "Please use this OTP?", 
        html: `<b>${otpcode}</b>`, 
    });
  res.status(200).json({msg:"email sent"});
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
}

main().catch(console.error);
otpGlobal = otpcode
    
}


const OtpVerifyControl = async(req,res,next) =>{
    const otp = req.params.otp;

    if(otp==otpGlobal){
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
        let otpcode = await Math.floor(100000 + Math.random() * 900000)
    otpcode = otpcode.toString().substring(0,4);
    console.log(otpcode);
    async function main() {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
        user: testAccount.user, 
        pass: testAccount.pass,
        },
    });

    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to: email, 
        subject: "Email Verification", 
        text: "Please use this OTP?", 
        html: `<b>${otpcode}</b>`, 
    });
  res.status(200).json({msg:"email sent"});
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
}

main().catch(console.error);
otpGlobal = otpcode
    }
    else{
        return res.json({error: "User Not Found"}).status(400)
    }
    
}

const ResetPassword = (req,res,next) => {
    const {email,newpass} = req.params;
        User.updateOne({email : email}, {password : newpass}, function(err,result){
            if(err) return res.status(404).json({ msg : "Password can't be changed"})
            else return res.status(200).json({ msg : "Password changed"})
        })
    
}
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
exports.ResetPassword = ResetPassword
