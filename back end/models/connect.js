const mongoose = require("mongoose")

const url =
  "mongodb+srv://dionberisha23:vb8I5LSbeipqibHh@cluster0.wa22vs8.mongodb.net/?retryWrites=true&w=majority";
async function connect() {
    try {
      await mongoose.connect(url);
      console.log("connected successfully");
    } catch (err) {
      console.log(err);
    }
  }

 module.exports = connect