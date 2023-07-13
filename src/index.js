const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service : "gmail",
    auth: {
        user: process.env.Email,
        pass: process.env.PASS
    },
});

// const mailOptions = {
//     from : process.env.Email,
//     // to : "abhinavyishu70911@gmail.com",
//     // to : "akshatburnwal@gmail.com",
//     to : process.env.Email,
//     subject : 'Learning to send mail',
//     html : '<p>To verify your email click on <a href="http://localhost:8000/verification">Verify</a></p>'
// };

// transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//         console.log(error);
//     } else {
//         console.log("Email sent" + info.response);
//     }
// });

const VerifyEmail = require("../src/models/DefModel");

app.get("/", (req,res) => {
    // res.setContentType("text/html");
    res.setHeader('content-type', 'text/html');
    // res.send("<h1> Verify Email </h1>");
    res.send("<h1> Hello Rajjo </h1>");
})


let verifier;
app.post("/", async (req,res) => {
    const data = req.body;
    verifier = data;
    console.log(data);

    const mailOptions = {
        from : process.env.Email,
        to : data.email,
        subject : 'Learning to send mail',
        html : '<p>To verify your email click on <a href="http://localhost:8000/verification">Verify</a></p>'
        // http://localhost:8000 will be replaced with ngrok link if we use ngrok to share the website on other device
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent" + info.response);
        }
    });
})

// function verifier(email, password)


app.get("/verification", async(req, res) => {
    const user = new VerifyEmail({
        email : verifier.email,
        password : verifier.password
    })
    const result = await user.save();
    res.send(result);
})

app.post("/login", async (req, res)=> {
    const data = req.body;
    const user = await VerifyEmail.findOne({email : data.email});
    // console.log(user);
    if(user.isVerified){
        if(user.password === data.password){
            res.send("Login Success")
        }
    } else {
        res.send("Please Verify Your Email");
    }
})


// =======================  for testing purpose ============================
app.get("/test", (req,res) => {
    res.send("Rajjo MF");
})

const Connection = require("./db/Connection");
const DBConnection = async () => {
    try {
        const result = await Connection(process.env.MONGOOSE_URL);
        if(result !== "undefined"){
            app.listen(port, console.log(`Listening to port at ${port}`));
        }
    } catch (error) {
        console.log(error);
    }
}

DBConnection();