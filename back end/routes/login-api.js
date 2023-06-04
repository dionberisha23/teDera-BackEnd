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

router.post("/login", async (req, res, next) => {
  await db();
  const user = await req.body;
  username = user.username;

  const getUser = await userModel.findOne({ username: username });
  if (getUser != null) {
    const token = getUser.token;
    const checkPasswords = await bcrypt.compare(
      user.password,
      getUser.password
    );
    if (checkPasswords) {
      res.status(200).send({
        message: "user loged in successfully",
        token,
      });
    } else {
      res.status(401).send("password or authentication token is incorrect");
    }
  } else {
    res.status(404).send("user does not exist");
  }
});

/**
 * @swagger
 *   /login:
 *     post:
 *       summary: log in with credentials
 *       description: complete the form about login and enter the website as a user
 *       parameters:
 *         - name: username
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *         - name: password
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *
 *
 *       responses:
 *         200:
 *           description: User Loged in successfully
 *         401:
 *           description: User password or token incorrect
 *         404:
 *           description: user does not exist in the database
 *
 */

router.put("/login", async (req, res) => {
  await db();
  const user = req.body;

  const getUser = await userModel.findOne({ token: user.token });
  if (getUser != null) {
    const validatePassword = await bcrypt.compare(
      user.oldPassword,
      getUser.password
    );
    if (validatePassword) {
      const newPassword = await bcrypt.hash(user.newPassword, 10);
      await userModel.findOneAndUpdate(
        { token: user.token },
        { password: newPassword }
      );
      res.status(200).send("user password has been updated");
    } else {
      res.status(401).send("user password is incorrect");
    }
  } else {
    res.status(404).send("user does not exist");
  }
});

/**
 * @swagger
 *   /login:
 *     put:
 *       summary: Update user password
 *       description: complete the form with old and new password with token stored in localstorage and update user password
 *       parameters:
 *         - name: oldPassword
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *         - name: newPassword
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *         - name: token
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *
 *
 *       responses:
 *         200:
 *           description: User Updated successfully
 *         401:
 *           description: User old password or token incorrect
 *         404:
 *           description: user does not exist in the database
 *
 */

router.delete("/login", async (req, res) => {
  await db();
  const token = req.body.token;

  const getUser = await userModel.findOne({ token: token });
  if (getUser != null) {
    await userModel.findOneAndDelete({ token: token });
    res.status(200).send("user deleted successfully");
  } else {
    res.status(404).send("user does not exist");
  }
});

/**
 * @swagger
 *   /login:
 *     delete:
 *       summary: delete user from database
 *       description: get user token from localstorage and delete that user
 *       parameters:
 *         - name: token
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *
 *
 *       responses:
 *         200:
 *           description: User Updated successfully
 *         404:
 *           description: user does not exist in the database
 *
 */

module.exports = router;
