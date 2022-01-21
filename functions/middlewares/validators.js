const { body, validationResult } = require('express-validator');

const typeError = 'Le champ n\'est pas du bon type';
const emptyError = 'Le champ est vide';
const lengthError = 'Le champ est trop long';

const nameValidator = [
    body('name').isString().withMessage(typeError).trim().escape().notEmpty().withMessage(emptyError).isLength({max: 64}).withMessage(lengthError).exists(),
]

const moviesValidators = [
    ...nameValidator,
    body('author').isString().withMessage(typeError).trim().escape().notEmpty().withMessage(emptyError).isLength({max: 64}).withMessage(lengthError).exists(),
    body('img').isURL().withMessage(typeError).notEmpty().withMessage(emptyError).isLength({max: 2000}).withMessage(lengthError).exists(),
    body('video').isURL().withMessage(typeError).notEmpty().withMessage(emptyError).isLength({max: 2000}).withMessage(lengthError).exists(),
    body('category').isString().withMessage(typeError).trim().escape().notEmpty().withMessage(emptyError).exists(),
    body('description').isString().withMessage(typeError).trim().escape().notEmpty().withMessage(emptyError).isLength({max: 255}).withMessage(lengthError).exists(),
]

const moviesEditValidators = [
    body('name').isString().withMessage(typeError).trim().escape().notEmpty().withMessage(emptyError).isLength({max: 64}).withMessage(lengthError).optional(),
    body('author').isString().withMessage(typeError).trim().escape().notEmpty().withMessage(emptyError).isLength({max: 64}).withMessage(lengthError).optional(),
    body('img').isURL().withMessage(typeError).notEmpty().withMessage(emptyError).isLength({max: 2000}).withMessage(lengthError).optional(),
    body('video').isURL().withMessage(typeError).notEmpty().withMessage(emptyError).isLength({max: 2000}).withMessage(lengthError).optional(),
    body('category').isString().withMessage(typeError).trim().escape().notEmpty().withMessage(emptyError).optional(),
    body('description').isString().withMessage(typeError).trim().escape().notEmpty().withMessage(emptyError).isLength({max: 255}).withMessage(lengthError).optional(),
]

const validate = (request, res, next) => { 
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

module.exports = { moviesValidators, nameValidator, moviesEditValidators, validate }