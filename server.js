require('dotenv').config()
const mongoose = require('mongoose')
const express = require("express");
const app = express();
const { Schema } = mongoose;
//env file theke ansi ejnno ante hoise
var bodyParser = require("body-parser");

const port = process.env.PORT
const blogSchema = new Schema({
  fname: String, // String is shorthand for {type: String}
  lname: String,
  email: String
});
const Blog = mongoose.model('Blog', blogSchema);

app.use(bodyParser.json());

const uri = process.env.MONGODB_URI
mongoose.connect(uri,{useNewUrlParser:true})

mongoose.connection.on('connected', ()=>{
  console.log("successfully connected")
})

mongoose.connection.on('error', ()=>{
  console.log("successfully connected")
})

const users = [];
let id = 0;
app.get("/", (req, res) => {
  res.status(200).json(users);
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id
  const user= users.find((user) => user.id == id)
  if(user) {
    res.json(user)
  } else {
    res.status(404).json({message:'user not found'})
  }
    
});

app.post("/", (req, res) => {
  const user = req.body;
  user.id = id++
  users.push(user);
  res.status(201).json(user);
  
});

app.put("/users/:id", (req, res) => {
  const id = req.params.id
  const body= req.body
  const user = users.find((user)=> user.id== id)
  if(user) {
        user.fname= body.fname
        user.lname =body.lname
        res.json(user)
  }else{
    res.status(404).json({message:'user not found'})
  }
  }
);

app.delete("/users/:id",( req, res) =>{

  const id = req.params.id;
  const userIndex = users.findIndex((user)=> user.id== id)
  if(userIndex) {
    users.splice(userIndex,1);
    res.json(users)
  }

})

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
