const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userModel = require("../models/users");
const db = require("../models/connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const secret = "secret";

router.post("/register", async (req, res) => {
  await db();
  const user = await req.body
  console.log(user)
  const password = await bcrypt.hash(user.password, 10)
  const token = await jwt.sign(user, secret)
  const getUsername = await userModel.findOne({username : user.username})
  const getPhone = await userModel.findOne({phone : user.phone})
  const getEmail = await userModel.findOne({email : user.email})
  
  if(getUsername != null || getPhone != null || getEmail !== null) {
  res.status(409).json("user already exists")
  }
  else{
    const setUser = await new userModel({
  username : user.username,
  email :user.email,
  password : password,
  phone : user.phone,
  role : user.role,
  token : token
  })
  await setUser.save()
  res.status(200).json("user added sucessfully")
   }
})

/**
 * @swagger
 *   /register:
 *     post:
 *       summary: register with credentials
 *       description: complete the form about register and enter the website as a user
 *       parameters:
 *         - name: username
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *         - name: email
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *         - name: password
 *           in: formData
 *           required: true
 *           schema:
 *             type: Password
 *         - name: phone
 *           in: formData
 *           required: true
 *           schema:
 *             type: Number
 *         - name: role
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *
 *       responses:
 *         200:
 *           description: User registered successfully
 *         409:
 *           description: User with the same email,password,or phone number already exists
 *
 */

module.exports = router;
