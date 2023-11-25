const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb+srv://mathurinmalandain:764G8rRa82HIPLpj@cluster0.6vvwj8u.mongodb.net/?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true})
.then(console.log("mongodb connected successfully...."))
.catch(err =>console.log(err));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use((req, res, next) => {
  res.json({ message: 'Votre requête a bien été reçue !' });
});


module.exports = app;