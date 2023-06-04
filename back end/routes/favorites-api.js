const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userModel = require("../models/users");
const foodModel = require("../models/food");
const favoritesModel = require("../models/favorites");
const db = require("../models/connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const secret = "secret";

router.post("/favorites", async (req, res) => {
  await db();
  const title = req.body.title;
  const token = req.body.token;

  const getUser = await userModel.findOne({ token: token });
  if (getUser != null) {
    const getFood = await foodModel.findOne({ title: title });
    if (getFood != null) {
      const setFavorite = new favoritesModel({
        title: title,
        description: getFood.description,
        image: getFood.image,
        category: getFood.category,
        cook: getFood.cook,
        user: getUser.username,
      });
      await setFavorite.save();
      res.status(200).send("food added to favorites");
    } else {
      res.status(405).send("food does not exist");
    }
  } else {
    res.status(404).send("token is not valid");
  }
});

/**
 * @swagger
 *   /favorites:
 *     post:
 *       summary: set food as favorite
 *       description: get the token from localstorage and cook from food title and set the food as favorite
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
 *           description: food added to favorites
 *         404:
 *           description: the token is invalid
 *         405:
 *           description: the food title is not correct
 *
 */

router.post("/get-favorites", async (req, res) => {
  await db();
  const token = req.body.token;
  const getUser = await userModel.findOne({ token: token });
  if (getUser != null) {
    const getFavorites = await favoritesModel.find({ user: getUser.username });
    if (getFavorites.length > 0) {
      res.status(200).send({
        message: "successfully showed favorite foods",
        getFavorites,
      });
    } else {
      res.status(405).send("no favorite food");
    }
  } else {
    res.status(404).send("token is not valid");
  }
});

/**
 * @swagger
 *   /get-favorites:
 *     post:
 *       summary: get all favorite foods of user
 *       description: get the token from localstorage and show all favorite foods of the user with that token
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
 *           description: favorites showed successfully
 *         404:
 *           description: the token is not valid
 *         405:
 *           description: the user does not have any favorite foods
 *
 */

router.delete("/favorites", async (req, res) => {
  await db();
  const title = req.body.title;
  const token = req.body.token;

  const getUser = await userModel.findOne({ token: token });
  if (getUser != null) {
    const getFavorites = await favoritesModel.findOne({ title: title });
    if (getFavorites != null) {
      if (getUser.username == getFavorites.user) {
        await favoritesModel.deleteOne({ title: title });
        res.status(200).send("food removed from favorites");
      } else {
        res
          .status(406)
          .send("u dont have the privileges to delete favorite food");
      }
    } else {
      res.status(405).send("food title is wrong or it is not a favorite one");
    }
  } else {
    res.status(404).send("token is not valid");
  }
});

/**
 * @swagger
 *   /favorites:
 *     delete:
 *       summary: remove food from favorites
 *       description: get the token from localstorage and remove product from favorites
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
 *           description: food removed from favorites
 *         404:
 *           description: the token is not valid
 *         405:
 *           description: food title is wrong or food isnt a favorite
 *         406:
 *           description: this user cant remove this food from favorites
 *
 */

router.post("/get-favorites/:category", async (req, res) => {
  await db();
  const category = req.params.category;
  const token = req.body.token;
  const getUser = await userModel.findOne({ token: token });
  if (getUser != null) {
    const getFavorites = await favoritesModel.find({
      user: getUser.username,
      category: category,
    });
    if (getFavorites.length > 0) {
      res.status(200).send({
        message: "successfully showed favorite foods by category",
        getFavorites,
      });
    } else {
      res.status(405).send("no favorite food in that category");
    }
  } else {
    res.status(404).send("token is not valid");
  }
});

/**
 * @swagger
 *
 *   paths:
 *     /get-favorites/{category}:
 *      post:
 *        summary: get all favorite foods of user
 *        description: get the token from localstorage and show all favorite foods of the user with that token
 *        parameters:
 *          - name: token
 *            in: formData
 *            required: true
 *            schema:
 *              type: String
 *          - in: path
 *            name: category
 *            schema:
 *              type: String
 *
 *
 *        responses:
 *          200:
 *            description: favorites showed successfully
 *          404:
 *            description: the token is not valid
 *          405:
 *            description: the user does not have any favorite foods
 *
 */

router.post("/get-favorites/:title", async (req, res) => {
  await db();
  const title = req.params.title;
  const token = req.body.token;
  const getUser = await userModel.findOne({ token: token });
  if (getUser != null) {
    const getFavorites = await favoritesModel.find({
      user: getUser.username,
      title: title,
    });
    if (getFavorites.length > 0) {
      res.status(200).send({
        message: "successfully showed favorite foods by title",
        getFavorites,
      });
    } else {
      res.status(405).send("no favorite food with that title");
    }
  } else {
    res.status(404).send("token is not valid");
  }
});

/**
 * @swagger
 *
 *   paths:
 *     /get-favorites/{title}:
 *      post:
 *        summary: get all favorite foods of user by title
 *        description: get the token from localstorage and show all favorite foods by title of the user with that token
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
 *            description: favorites by title showed successfully
 *          404:
 *            description: the token is not valid
 *          405:
 *            description: the user does not have any favorite foods that match the title
 *
 */

module.exports = router;
