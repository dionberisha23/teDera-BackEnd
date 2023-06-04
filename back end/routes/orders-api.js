const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userModel = require("../models/users");
const foodModel = require("../models/food");
const favoritesModel = require("../models/favorites");
const ordersModel = require("../models/orders");
const db = require("../models/connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const orderModel = require("../models/orders");

const secret = "secret";

router.post("/add-order", async (req, res) => {
  await db();
  const foodTitle = req.body.foodTitle;
  const token = req.body.token;
  const getUser = await userModel.findOne({
    token: token,
  });
  if (getUser != null && getUser.role == "user") {
    const getFood = await foodModel.findOne({
      title: foodTitle,
    });
    if (getFood != null) {
      const setOrder = await new orderModel({
        title: foodTitle,
        date: new Date(),
        cookPhone: getFood.phone,
        userPhone: getUser.phone,
        cook: getFood.cook,
        status: "not confirmed",
        user: getUser.username,
        price: getFood.price,
      });
      await setOrder.save();
      res.status(200).send("food ordered successfully");
    } else {
      res.status(405).send("food does not exist");
    }
  } else {
    res.status(404).send("token is not valid or role is not user");
  }
});

/**
 * @swagger
 *   /add-order:
 *     post:
 *       summary: add order from user
 *       description: get the token from body and add order from that user
 *       parameters:
 *         - name: foodTitle
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
 *           description: order added succesfully
 *         404:
 *           description: token is not valid
 *         405:
 *           description: food does not exist
 *
 */

router.post("/get-orders-user", async (req, res) => {
  await db();
  const token = req.body.token;
  const getUser = await userModel.findOne({
    token: token,
  });
  if (getUser != null) {
    const getOrder = await orderModel.find({
      user: getUser.username,
    });
    if (getOrder != null) {
      res.status(200).send({
        message: "orders displayed succesfully",
        getOrder,
      });
    } else {
      res.status(405).send("you do not have any orders yet");
    }
  } else {
    res.status(404).send("token is not valid");
  }
});

/**
 * @swagger
 *   /get-orders-user:
 *     post:
 *       summary: get all orders of user
 *       description: get the token from body and get all orders from that user
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
 *           description: order dipslayed successfully
 *         404:
 *           description: token is not valid
 *         405:
 *           description: user does not have any orders
 *
 */

router.post("/get-orders-user/:title", async (req, res) => {
  await db();
  const title = req.params.title;
  const token = req.body.token;
  const getUser = await userModel.findOne({
    token: token,
  });
  if (getUser != null) {
    const getOrder = await orderModel.find({
      user: getUser.username,
      title: title,
    });
    if (getOrder != null) {
      res.status(200).send({
        message: "orders displayed succesfully",
        getOrder,
      });
    } else {
      res.status(405).send("you do not have any orders with that title");
    }
  } else {
    res.status(404).send("token is not valid");
  }
});

/**
 * @swagger
 *
 *   paths:
 *     /get-orders-user/{title}:
 *      post:
 *        summary: get all orders of user by title
 *        description: get the token from localstorage and show all orders by title of the user with that token
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
 *            description: orders by title showed successfully
 *          404:
 *            description: the token is not valid
 *          405:
 *            description: the user does not have any orders that match the title
 *
 */

router.delete("/delete-order-user", async (req, res) => {
  await db();
  const token = req.body.token;
  const title = req.body.title;
  const getUser = await userModel.findOne({
    token: token,
  });
  if (getUser != null && getUser.role == "user") {
    const getOrder = await orderModel.find({
      title: title,
      user: getUser.username,
    });
    if (getOrder != null) {
      await orderModel.findOneAndDelete({
        title: title,
        user: getUser.username,
      });
      res.status(200).send("order deleted");
    } else {
      res.status(405).send("user has no orders");
    }
  } else {
    res.status(404).send("token is not valid or role is not user");
  }
});

/**
 * @swagger
 *   /delete-order-user:
 *     delete:
 *       summary: delete order
 *       description: get the token from body and title of order and delete it from user
 *       parameters:
 *         - name: token
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *         - name: title
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *
 *
 *       responses:
 *         200:
 *           description: order deleted
 *         404:
 *           description: token is not valid or role is not user
 *         405:
 *           description: user does not have any orders
 *
 */

router.post("/get-all-orders-cook", async (req, res) => {
  await db();
  const token = req.body.token;
  const getUser = await userModel.findOne({
    token: token,
  });
  if (getUser != null && getUser.role == "cook") {
    const getOrder = await orderModel.find({
      cook: getUser.username,
    });
    if (getOrder != null) {
      res.status(200).send({
        message: "orders displayed successfully",
        getOrder,
      });
    } else {
      res.send(405).status("you do not have any orders yet");
    }
  } else {
    res.status(404).send("role is not a cook or token is not valid");
  }
});

/**
 * @swagger
 *   /get-all-orders-cook:
 *     post:
 *       summary: get all orders of cook
 *       description: get the token from body and get all orders from that cook
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
 *           description: order dipslayed successfully
 *         404:
 *           description: token is not valid or role is not cook
 *         405:
 *           description: cook does not have any orders
 *
 */

router.post("/get-all-orders-cook/:title", async (req, res) => {
  await db();
  const title = req.params.title;
  const token = req.body.token;
  const getUser = await userModel.findOne({
    token: token,
  });
  if (getUser != null && getUser.role == "cook") {
    const getOrder = await orderModel.find({
      cook: getUser.username,
      title: title,
    });
    if (getOrder != null) {
      res.status(200).send({
        message: `${title} orders displayed successfully`,
        getOrder,
      });
    } else {
      res.send(405).status("you do not have any orders yet");
    }
  } else {
    res.status(404).send("role is not a cook or token is not valid");
  }
});

/**
 * @swagger
 *
 *   paths:
 *     /get-all-orders-cook/{title}:
 *      post:
 *        summary: get all orders of user by title
 *        description: get the token from localstorage and show all orders by title of the user with that token
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
 *            description: orders by title showed successfully
 *          404:
 *            description: the token is not valid or role is not cook
 *          405:
 *            description: the cook does not have any orders that match the title
 *
 */

router.put("/update-order-status-cook", async (req, res) => {
  await db();
  const token = req.body.token;
  const title = req.body.title;
  const getUser = await userModel.findOne({
    token: token,
  });
  if (getUser != null && getUser.role == "cook") {
    const getOrder = await orderModel.find({
      title: title,
      cook: getUser.username,
      status: "not confirmed",
    });
    if (getOrder != null) {
      await orderModel.findOneAndUpdate(
        {
          title: title,
          cook: getUser.cook,
        },
        {
          status: "confirmed",
        }
      );
      res.status(200).send("order confirmed");
    } else {
      res.status(405).send("cook has no orders");
    }
  } else {
    res.status(404).send("token is not valid or role is not cook");
  }
});

/**
 * @swagger
 *   /update-order-status-cook:
 *     put:
 *       summary: confirm order
 *       description: get the token from body and title of order and confirm it from cook
 *       parameters:
 *         - name: token
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *         - name: title
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *
 *
 *       responses:
 *         200:
 *           description: order confirmed
 *         404:
 *           description: token is not valid or role is not cook
 *         405:
 *           description: cook does not have any orders to confirm
 *
 */

router.delete("/delete-order-cook", async (req, res) => {
  await db();
  const token = req.body.token;
  const title = req.body.title;
  const getUser = await userModel.findOne({
    token: token,
  });
  if (getUser != null && getUser.role == "cook") {
    const getOrder = await orderModel.find({
      title: title,
      cook: getUser.username,
    });
    if (getOrder != null) {
      await orderModel.findOneAndDelete({
        title: title,
        cook: getUser.username,
      });
      res.status(200).send("order deleted");
    } else {
      res.status(405).send("cook has no orders");
    }
  } else {
    res.status(404).send("token is not valid or role is not cook");
  }
});

/**
 * @swagger
 *   /delete-order-cook:
 *     delete:
 *       summary: delete order
 *       description: get the token from body and title of order and delete it from cook
 *       parameters:
 *         - name: token
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *         - name: title
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *
 *
 *       responses:
 *         200:
 *           description: order deleted
 *         404:
 *           description: token is not valid or role is not cook
 *         405:
 *           description: cook does not have any orders to confirm
 *
 */

router.post("/get-all-orders-driver", async (req, res) => {
  await db();
  const token = req.body.token;
  const getUser = await userModel.findOne({
    token: token,
  });
  if (getUser != null && getUser.role == "driver") {
    const getOrder = await orderModel.find({
      cook: getUser.username,
      status: "confirmed",
    });
    if (getOrder != null) {
      res.status(200).send({
        message: "orders displayed successfully",
        getOrder,
      });
    } else {
      res.send(405).status("you do not have any orders yet");
    }
  } else {
    res.status(404).send("role is not a driver or token is not valid");
  }
});

/**
 * @swagger
 *   /get-all-orders-driver:
 *     post:
 *       summary: get all orders of driver
 *       description: get the token from body and get all orders from available to driver
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
 *           description: order dipslayed successfully
 *         404:
 *           description: token is not valid or role is not driver
 *         405:
 *           description: driver does not have any orders
 *
 */

router.post("/get-all-orders-driver/:title", async (req, res) => {
  await db();
  const title = req.params.title;
  const token = req.body.token;
  const getUser = await userModel.findOne({
    token: token,
  });
  if (getUser != null && getUser.role == "driver") {
    const getOrder = await orderModel.find({
      cook: getUser.username,
      title: title,
    });
    if (getOrder != null) {
      res.status(200).send({
        message: `${title} orders displayed successfully`,
        getOrder,
      });
    } else {
      res.send(405).status("you do not have any orders yet");
    }
  } else {
    res.status(404).send("role is not a driver or token is not valid");
  }
});

/**
 * @swagger
 *
 *   paths:
 *     /get-all-orders-cook/{title}:
 *      post:
 *        summary: get all orders of user by title
 *        description: get the token from localstorage and show all orders by title of the user with that token
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
 *            description: orders by title showed successfully
 *          404:
 *            description: the token is not valid or role is not driver
 *          405:
 *            description: the driver does not have any orders that match the title
 *
 */

router.put("/update-order-status-driver", async (req, res) => {
  await db();
  const token = req.body.token;
  const title = req.body.title;
  const getUser = await userModel.findOne({
    token: token,
  });
  if (getUser != null && getUser.role == "driver") {
    const getOrder = await orderModel.find({
      title: title,
      status: "confirmed",
    });
    if (getOrder != null) {
      await orderModel.findOneAndUpdate(
        {
          title: title,
          status: "confirmed",
        },
        {
          driver: getUser.username,
          driverPhone: getUser.phone,
          status: "accepted by driver",
        }
      );
      res.status(200).send("order accpeted");
    } else {
      res.status(405).send("driver has no orders");
    }
  } else {
    res.status(404).send("token is not valid or role is not driver");
  }
});

/**
 * @swagger
 *   /update-order-status-driver:
 *     put:
 *       summary: accept order
 *       description: get the token from body and title of order and confirm it from driver
 *       parameters:
 *         - name: token
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *         - name: title
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *
 *
 *       responses:
 *         200:
 *           description: order accepted
 *         404:
 *           description: token is not valid or role is not driver
 *         405:
 *           description: driver does not have any orders to accept
 *
 */

router.delete("/delete-order-driver", async (req, res) => {
  await db();
  const token = req.body.token;
  const title = req.body.title;
  const getUser = await userModel.findOne({
    token: token,
  });
  if (getUser != null && getUser.role == "driver") {
    const getOrder = await orderModel.find({
      title: title,
      driver: getUser.username,
    });
    if (getOrder != null) {
      await orderModel.findOneAndDelete({
        title: title,
        driver: getUser.username,
      });
      res.status(200).send("order deleted");
    } else {
      res.status(405).send("driver has no orders");
    }
  } else {
    res.status(404).send("token is not valid or role is not driver");
  }
});

/**
 * @swagger
 *   /delete-order-driver:
 *     delete:
 *       summary: delete order
 *       description: get the token from body and title of order and delete it from driver
 *       parameters:
 *         - name: token
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *         - name: title
 *           in: formData
 *           required: true
 *           schema:
 *             type: String
 *
 *
 *       responses:
 *         200:
 *           description: order deleted
 *         404:
 *           description: token is not valid or role is not driver
 *         405:
 *           description: driver does not have any orders to confirm
 *
 */

module.exports = router;
