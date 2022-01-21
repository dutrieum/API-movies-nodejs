const express = require('express');
const { matchedData } = require('express-validator');
const moviesRouter = express.Router();
const { moviesValidators, moviesEditValidators, validate } = require('../middlewares/validators');

const moviesAllRoutes = (db, admin) => {
    moviesRouter.route('/')
      .get(function(req, res) {
        db.collection('movies')
        .get()
        .then(qs => {
            allMovies = [];
            qs.forEach(doc => allMovies.push({ id: doc.id, ...doc.data() }));
            res.status(200).send(allMovies);
        })
        .catch((error) => res.status(500).send(error))
      })
      .post(moviesValidators, validate, function(req, res) {
        db.collection('categories').doc(req.body.category)
        .get()
        .then(doc => {
            if (doc.exists) {
                db.collection('movies').add({
                    name: req.body.name,
                    author: req.body.author,
                    img: encodeURI(req.body.img),
                    video: encodeURI(req.body.video),
                    category: req.body.category,
                    description: req.body.description,
                    likes: 0,
                })
                .then(() => res.status(200).send('Filmé ajouté à la liste'))
                .catch((error) => res.status(500).send(error))
            } else {
                res.status(500).send('Catégorie inexistante');
            }
        })
        .catch((error) => res.status(500).send(error))
      })

    moviesRouter.route('/:movieId')
      .get(function(req, res) {
        db.collection('movies').doc(req.params.movieId)
        .get()
        .then(doc => {
            if (doc.exists) {
                res.status(200).send({ id: doc.id, ...doc.data() })
            } else {
                res.status(500).send('ID invalide');
            }
        })
        .catch((error) => res.status(500).send(error))
      })
      .delete(function(req, res) {
        db.collection('movies').doc(req.params.movieId)
        .delete()
        .then(() => res.status(200).send('Le film a bien été supprimé'))
        .catch((error) => res.status(500).send(error))
      })
      .patch(moviesEditValidators, validate, function(req, res) {
        const content = matchedData(req, {locations: ['body']});
        db.collection('movies').doc(req.params.movieId)
        .get()
        .then(doc => {
            if (doc.exists) {
                db.collection('movies').doc(req.params.movieId)
                .update(content)
                .then(() => res.status(200).send('Le film a bien été modifié'))
                .catch((error) => res.status(500).send(error))
            } else {
                res.status(500).send('ID invalide');
            }
        })
        .catch((error) => res.status(500).send(error))
      })

    moviesRouter.route('/:movieId/like')
      .patch(function(req, res) {
        db.collection('movies').doc(req.params.movieId)
        .get()
        .then(doc => {
            if (doc.exists) {
                db.collection('movies').doc(req.params.movieId)
                .update({
                    likes: admin.firestore.FieldValue.increment(1)
                })
                .then(() => res.status(200).send('Like ajouté'))
                .catch((error) => res.status(500).send(error))
            } else {
                res.status(500).send('ID invalide');
            }
        })
        .catch((error) => res.status(500).send(error))
      })

    return moviesRouter;
}

module.exports = moviesAllRoutes