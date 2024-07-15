const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6001;
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
require("colors")
const morgan = require("morgan")
require('dotenv').config()

// middleware
app.use(cors(
  {
    origin: ["https://deploy-mern-1whq.vercel.app"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
  }
));
app.use(express.json());
app.use(morgan("dev"))

// mongodb configuration using mongoose

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@prabal.ejkvh93.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=prabal`
  )
  .then(
    console.log("MongoDB Connected Successfully!".bgCyan.white)
  )
  .catch((error) => console.log(`Error connecting to MongoDB: ${error}`.bgRed.white));

  // jwt authentication
  app.post('/jwt', async(req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1hr'
    })
    res.send({token});
  })


//   import routes here
const menuRoutes = require('./api/routes/menuRoutes');
const cartRoutes = require('./api/routes/cartRoutes');
const userRoutes = require('./api/routes/userRoutes')
app.use('/menu', menuRoutes)
app.use('/carts', cartRoutes);
app.use('/users', userRoutes);

app.get("/", (req, res) => {
  res.send("Hello Foodi Client Server!");
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`.bgMagenta.white);
});