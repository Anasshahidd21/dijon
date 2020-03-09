const express = require('express');
const {
    check,
    validationResult
} = require('express-validator');
const signupView = require('../views/signupView');
const signInView = require('../views/signInView');
const bcrypt = require('bcrypt');
const repo = require('../repositories/users');
const app = express();
const router = express.Router();
const layoutView = require('../views/layout');
const productsRepo = require('../repositories/products');
const newProduct = require('../views/products/new');
let errorString = '';

router.get('/products/create', async (req, res) => {

    if (!req.session.userID) {
        throw new Error('Access blocked');
    }
    res.send(layoutView(newProduct({
        req
    }, errorString), {
        req
    }, 'Create Product'));

});

router.post('/products/create', check('title', 'Title cannot be less than 5 characters').trim().isLength({
    min: 5
}), check('price', 'Price needs to be atleast 1$').trim().optional().isNumeric().notEmpty().custom((req) => {
    if (req.price <= 0) {
        throw new Error('Cant be less than 0');
    }

    return true;
}), async (req, res) => {
    const error = validationResult(req).array();
    const {
        title,
        price,
        image
    } = req.body;

    if (error.length <= 0) {
        const product = await productsRepo.create({
            title,
            price,
            image
        });

        res.send('Product Created Successfully');
    }


    res.send(layoutView(newProduct({
        req
    }, joinErrors(error)), {
        req
    }, 'Create Product'));



});



function joinErrors(err) {
    const error = err.reduce(
        (obj, item) => Object.assign(obj, {
            [item.param]: item.msg
        }), {});
    return error;
}

module.exports = router;