const express = require('express');
const { matchedData } = require('express-validator');
const categoriesRouter = express.Router();
const { nameValidator, validate } = require('../middlewares/validators');

const categoriesAllRoutes = (db) => {
    categoriesRouter.route('/')
      .get(function(req, res) {
        db.collection('categories')
        .get()
        .then(qs => {
            allCategories = [];
            qs.forEach(doc => allCategories.push({ id: doc.id, ...doc.data() }));
            res.status(200).send(allCategories);
        })
        .catch((error) => res.status(500).send(error))
      })
      .post(nameValidator, validate, function(req, res) {
        db.collection('categories')
        .add({
            name: req.body.name
        })
        .then(() => res.status(200).send('Catégorie ajouté à la liste'))
        .catch((error) => res.status(500).send(error))
      })
    
    categoriesRouter.route('/:categorieId')
      .get(function(req, res) {
        db.collection('categories').doc(req.params.categorieId)
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
        db.collection('categories').doc(req.params.categorieId)
        .delete()
        .then(() => res.status(200).send('La catégorie a bien été supprimée'))
        .catch((error) => res.status(500).send(error))
      })
      .patch(nameValidator, validate, function(req, res) {
        const content = matchedData(req, {locations: ['body']});
        db.collection('categories').doc(req.params.categorieId)
        .get()
        .then(doc => {
            if (doc.exists) {
                db.collection('categories').doc(req.params.categorieId)
                .update(content) 
                .then(() => res.status(200).send('La catégorie a bien été modifiée'))
                .catch((error) => res.status(500).send(error))
            } else {
                res.status(500).send('ID invalide');
            }
        })
        .catch((error) => res.status(500).send(error))
      })

    return categoriesRouter;
}

module.exports = categoriesAllRoutes