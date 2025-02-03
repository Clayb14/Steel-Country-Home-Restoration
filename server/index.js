const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
const port = process.env.PORT || 8080;
const SALT_ROUNDS = 10;
require('dotenv').config();

app.use(express.json());

const Login = require("./models/login.schema.js");

mongoose.connect(process.env.MONGO_DB)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

  const authenticateUser = async (req, res, next) => {
    try {
        // get the token from the request headers
        const token = req.headers['auth'];

        // validate the token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication failed"
            })
        }

        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // get the user from the database
        const user = await Login.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Authentication failed"
            })
        }

        // add the user to the request object
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
    }
}

//inquiry schema
const inquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  service: String,
  message: String,
});

//inquiry model
const Inquiry = mongoose.model("Inquiry", inquirySchema);


//routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api/register", async(req, res) => {
  const { username, password } = req.body;

  // validate the request body
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the fields",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const loginUser = new Login({
      username,
      password: hashedPassword
  });

  await loginUser.save();

  res.status(201).json(loginUser)
  } catch (error) {
    console.log(error);
  }
});

// app.post("/api/login", (req, res) => {});
app.post("/api/login", async (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
      return response.status(400).json({
          success: false,
          message: "Please provide all the fields"
      })
  }

  try {
      // find the user in the database
      const user = await Login.findOne({ username });

      // if the user is not found then return an error
      if (!user) {
          return response.status(404).json({
              success: false,
              message: "User not found"
          })
      }

      // compare the password
      const isValidPassword = await bcrypt.compare(password, user.password)

      // validate the password
      if (!isValidPassword) {
          return response.status(401).json({
              success: false,
              message: "Invalid credentials"
          })
      }

      // generate a jwt token
      const token = jwt.sign(
          {
              userId: user._id,
              username: user.username,
              password: user.password,
          },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      )

      // send the success response
      response.status(200).json(token)
  } catch (error) {
      console.log(error);
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
