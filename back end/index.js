const express = require("express");
const registerApi = require("./routes/register-api.js");
const loginApi = require("./routes/login-api.js");
const foodApi = require("./routes/food-api.js");
const favoritesApi = require("./routes/favorites-api.js");
const ordersApi = require("./routes/orders-api.js");
const cartApi = require("./routes/cart-api.js");
const app = express();
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const port = 9000;
app.set("view engine", "ejs");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "api",
      version: "1.0.0",
    },
  },
  servers: [
    {
      url: "localhost:9000",
    },
  ],

  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(registerApi);
app.use(loginApi);
app.use(favoritesApi);
app.use(foodApi);
app.use(ordersApi);
app.use(cartApi);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
