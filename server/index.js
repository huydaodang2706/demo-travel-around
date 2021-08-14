const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");
const userRoute = require('./routes/users')

const config = require("./config/key");
// const session = require('express-')



const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
    console.log("MongoDB cannot be connected");
    process.exit(1);
  }
};

connectDB();


const app = express();
app.use(express.json())
app.use(cors());

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
// app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
// app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/users", userRoute);

//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use("/uploads", express.static("uploads"));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});

var sockets = require('./socket')
sockets.init(server)
