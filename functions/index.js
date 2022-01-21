const functions = require("firebase-functions");
const admin = require('firebase-admin');
const express = require('express');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();

app.get('/', (req, res) => {
    res.send('Hello world !')
})

const moviesRouter = require('./routers/movies.router');
const categoriesRouter = require('./routers/categories.router');
app.use('/v1/movies', moviesRouter(db, admin));
app.use('/v1/categories', categoriesRouter(db));

exports.api = functions.region('europe-west-3').https.onRequest(app);