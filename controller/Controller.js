const User = require('../models/Model')
const { v4: uuidv4 } = require('uuid');


const Signinwithgoogle = async(req,res,next) =>{
    
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
                    res.send({
                        username:data.firstName,
                        user_id:data.id,
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


//think about logout
//Signin and Signup are working think about the other 2-3 routes

const Logout = async (req,res,next) => {
    req.logout()
    //redirect to homepage
}

exports.Signin = Signin;
exports.Signup = Signup;
exports.Logout = Logout;

