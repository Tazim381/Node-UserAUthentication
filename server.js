require('dotenv').config()
const mongoose = require('mongoose')
const express = require("express");
const app = express();
const { Schema } = mongoose;
//env file theke ansi ejnno ante hoise
var bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const port = process.env.PORT

//create schema for db
const blogSchema = new Schema({
  fname: String, // String is shorthand for {type: String}
  lname: String,
  email: String,
  password:String,
});
//create model 
const User = mongoose.model('User', blogSchema);

app.use(bodyParser.json());

const uri = process.env.MONGODB_URI
mongoose.connect(uri,{useNewUrlParser:true})

mongoose.connection.on('connected', ()=>{
  console.log("successfully connected")
})

mongoose.connection.on('error', ()=>{
  console.log("successfully connected")
})

app.get("/users",async(req, res) => {
  try{
    const users = await User.find()
    res.status(200).json(users);

  }catch(error) {
     res.status(500).json({message:"paoa jy ni"})
  }
});


//middlewire to authenticate JWT access token

const authenticateToken = (req,res,next) => {

  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if(!token) {
    res.status(401).json({message:"unAuthorized user"})
    return
  } else {
    jwt.verify(token,process.env.JWT_SECRET,(error,user) =>{
      if(error) {
        res.status(401).json({message:"unAuthorized user"})
      } else {
        req.user = user
        next()
      }
    })
  }
}

app.get("/users/:id", authenticateToken,async(req, res) => {
  try{
    const id = req.params.id 
    const user= await User.findById(id)
    if(user) {
      res.json(user)
    } else {
      res.status(404).json({message:'user not found'})
    }
  } catch(error){
    res.status(500).json({message:"id dea khuje paoa jyni"})
  }
  
    
});

app.post("/users", async(req, res) => {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(req.body.password,salt)
  const password = hash
  
  try{
    const userObj ={
      fname:req.body.fname,
      lname:req.body.lname,
      email:req.body.email,
      password:password
    }
    const user = new User(userObj);
  await user.save()
  res.status(201).json(user);
  }  catch(error) {
    console.log(error)
    res.status(500).json({message:"can't get user from postman"})
  }
  
});

app.post("/users/login",async(req,res) =>{
  try{
     const {email,password} = req.body
     const user = await User.findOne({email:email})
     if(!user) {
      res.status(401).json({message:"user not found"})  
     }
     else{
      const isValidPassword = await bcrypt.compare(password,user.password)
      if(!isValidPassword) {
        res.status(401).json({message:"password invalid"})
      } else {
        //generate token
          const token = jwt.sign({email:user.email, id:user._id},process.env.JWT_SECRET,{expiresIn:'2m'})
          const userObj = user.toJSON()
          userObj['token'] = token
          res.status(201).json(userObj);   
      }
     }
  }catch(error) {
    res.status(500).json({message:"login failed"})
    
  }
})


app.get('/profile',authenticateToken,async(req,res) =>{
  try{
    const id = req.user.id 
    const user= await User.findById(id)
    if(user) {
      res.json(user)
    } else {
      res.status(404).json({message:'user not found'})
    }
  } catch(error){
    res.status(500).json({message:"id dea khuje paoa jyni"})
  }
})
app.put("/users/:id", async(req, res) => {

  try{
  const id = req.params.id
  const body= req.body
  const user =await  User.findByIdAndUpdate(id,body,{new:true})
  if(user) {
        res.json(user)
  }else{
    res.status(404).json({message:'user not found'})
  }
  }catch(error) {
    res.status(500).json({message:"update e jhamela hoitese"})
  }
}
);

app.delete("/users/:id",async( req, res) =>{

  try{
  const id = req.params.id;
  const user = await User.findByIdAndDelete(id)
  if(user) {
    res.status(201).json(user);
  }
  else{
    res.status(404).json({message:'user not found'})
  }
}catch(error) {
  res.status(500).json({message:"delete e jhamela hoise"})
}
})

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
