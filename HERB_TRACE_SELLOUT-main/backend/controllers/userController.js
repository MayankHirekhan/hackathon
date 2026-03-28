const User = require("../models/User")

exports.createUser = async(req,res)=>{

 try{

  const user = new User(req.body)

  await user.save()

  res.json(user)

 }catch(err){

  res.status(500).json(err)

 }

}

exports.getUsers = async(req,res)=>{

 const users = await User.find()

 res.json(users)

}