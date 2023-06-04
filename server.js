require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT
var bodyParser = require("body-parser");

app.use(bodyParser.json());

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
