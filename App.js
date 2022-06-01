const app = require('express')();
const mongoose = require('mongoose');
const bp = require('body-parser');
const routes = require('../backend/routes/Routes')
app.use(bp.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
  app.use('/api/',routes);
mongoose.connect('mongodb+srv://sahajkedia:sahajkedia@companycluster.ybldu.mongodb.net/frontend?retryWrites=true&w=majority')
.then(()=>{
    console.log('DB Connected')
    app.listen(4000);
})
.catch((err) => {
    console.log(err)
})