const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userModel = require("../models/users");
const foodModel = require("../models/food");
const favoritesModel = require("../models/favorites");
const cartModel = require("../models/cart");
const db = require("../models/connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const secret = "secret";

router.post("/cart", async (req, res) => {
  await db();
  const title = req.body.title;
  const token = req.body.token;

  const getUser = await userModel.findOne({ token: token });
  if (getUser != null) {
    const getFood = await foodModel.findOne({ title: title });
    if (getFood != null) {
      const setCart = new cartModel({
        title: title,
        price: getFood.price,
        user: getUser.username,
      });
      await setFavorite.save();
      res.status(200).send("food added to cart");
    } else {
      res.status(405).send("food does not exist");
    }
  } else {
    res.status(404).send("token is not valid");
  }
});

/**
 * @swagger
 *   /cart:
 *     post:
 *       summary: set food to cart
 *       description: get the token from localstorage and cook from food title and set the food to cart
 *       parameters:
 *         - name: title
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
 *           description: food added to cart
 *         404:
 *           description: the token is invalid
 *         405:
 *           description: the food title is not correct
 *
 */

router.post("/get-cart", async (req, res) => {
  await db();
  const token = req.body.token;
  const getUser = await userModel.findOne({ token: token });
  if (getUser != null) {
    const getCart = await cartModel.find({ user: getUser.username });
    if (getCart.length > 0) {
      res.status(200).send({
        message: "successfully showed cart",
        getCart,
      });
    } else {
      res.status(405).send("no food in cart");
    }
  } else {
    res.status(404).send("token is not valid");
  }
});

/**
 * @swagger
 *   /get-cart:
 *     post:
 *       summary: get all cart foods of user
 *       description: get the token from localstorage and show all cart foods of the user with that token
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
 *           description: cart showed successfully
 *         404:
 *           description: the token is not valid
 *         405:
 *           description: the user does not have any food in cart
 *
 */

router.delete("/cart", async (req, res) => {
  await db();
  const title = req.body.title;
  const token = req.body.token;

  const getUser = await userModel.findOne({ token: token });
  if (getUser != null) {
    const getCart = await cartModel.findOne({ title: title });
    if (getCart != null) {
      if (getUser.username == getCart.user) {
        await cartModel.deleteOne({ title: title });
        res.status(200).send("food removed from cart");
      } else {
        res
          .status(406)
          .send("u dont have the privileges to delete food from cart");
      }
    } else {
      res.status(405).send("food title is wrong or it is not in cart");
    }
  } else {
    res.status(404).send("token is not valid");
  }
});

/**
 * @swagger
 *   /cart:
 *     delete:
 *       summary: remove food from cart
 *       description: get the token from localstorage and remove product from cart
 *       parameters:
 *         - name: title
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
 *           description: food removed from cart
 *         404:
 *           description: the token is not valid
 *         405:
 *           description: food title is wrong or food isnt in cart
 *         406:
 *           description: this user cant remove this food from cart
 *
 */

router.post("/get-cart/:title", async (req, res) => {
  await db();
  const title = req.params.title;
  const token = req.body.token;
  const getUser = await cartModel.findOne({ token: token });
  if (getUser != null) {
    const getCart = await cartModel.find({
      user: getUser.username,
      title: title,
    });
    if (getCart.length > 0) {
      res.status(200).send({
        message: "successfully showed cart foods by title",
        getCart,
      });
    } else {
      res.status(405).send("no cart food with that title");
    }
  } else {
    res.status(404).send("token is not valid");
  }
});

/**
 * @swagger
 *
 *   paths:
 *     /get-cart/{title}:
 *      post:
 *        summary: get all cart foods of user by title
 *        description: get the token from localstorage and show all cart foods by title of the user with that token
 *        parameters:
 *          - name: token
 *            in: formData
 *            required: true
 *            schema:
 *              type: String
 *          - in: path
 *            name: title
 *            schema:
 *              type: String
 *
 *
 *        responses:
 *          200:
 *            description: cart by title showed successfully
 *          404:
 *            description: the token is not valid
 *          405:
 *            description: the user does not have any foods in cart that match the title
 *
 */

module.exports = router;
