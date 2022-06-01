const app = require('express')();
require('dotenv').config()
const mongoose = require('mongoose');
const bp = require('body-parser');
const routes = require('../backend/routes/Routes')
app.use(bp.json());
const database = process.env.DATABASE;
const port = process.env.PORT;
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
  app.use('/api/',routes);
mongoose.connect(database)
.then(()=>{
    console.log('DB Connected')
    app.listen(port);
})
.catch((err) => {
    console.log(err)
})