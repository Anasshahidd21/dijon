const express = require('express');
const {
    check,
    validationResult
} = require('express-validator');

const app = express();
const router = express.Router();
const productsRepo = require('../repositories/products');


const layoutView = require('../views/layout');
const newProduct = require('../views/products/new');
const listView = require('../views/products/list');
const editProducts = require('../views/products/editProduct');

const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage()
});

let errorString = '';

router.get('/products/create', async (req, res) => {

    if (!req.session.userID) {
        res.send('Please Login/Signup first');
    }
    res.send(layoutView(newProduct({
        req
    }, errorString), 'Create Product'));

});

router.post('/products/create', upload.single('image'), [check('title', 'Title cannot be less than 5 characters').trim().isLength({
        min: 5
    }), check('price', 'Price needs to be atleast 1$').trim().notEmpty().custom(price => {
        const value = parseInt(price);
        if (value && value <= 0) {
            throw new Error('Must be atleast 1$');
        }
        return true;
    })],

    async (req, res) => {
        const error = validationResult(req).array();
        const {
            title,
            price,
        } = req.body;

        const value = price && parseInt(price);
        const image = req.file && req.file.buffer.toString('base64');
        if (error.length <= 0 && image) {
            const product = await productsRepo.create({
                title,
                value,
                image
            });

            res.send('Product Created Successfully');
        }

        error.push({
            param: 'image',
            msg: 'Please upload an image'
        });
        res.send(layoutView(newProduct({
            req
        }, joinErrors(error)), 'Create Product'));
    });

router.get('/products', async (req, res) => {
    if (!req.session.userID) {
        res.send('Please Login/Signup first');
    }
    const products = await productsRepo.getAll();
    res.send(layoutView(listView(products), 'View Products'));

})

router.get('/edit/:id', async (req, res) => {
    if (!req.session.userID) {
        res.send('Please Login/Signup first');
    }
    const id = req.params.id;
    const product = await productsRepo.getOne(id);

    if (!product) {
        res.send('No product with this id found');
    }

    res.send(layoutView(editProducts({
        product
    }, errorString), 'Edit Product'));
})

router.post('/edit/:id', upload.single('image'), [check('title', 'Title cannot be less than 5 characters').trim().isLength({
        min: 5
    }), check('price', 'Price needs to be atleast 1$').trim().notEmpty().custom(price => {
        const value = parseInt(price);
        if (!value || value <= 0) {
            throw new Error('Must be atleast 1$');
        }
        return true;
    })],

    async (req, res) => {
        const id = req.params.id;
        const product = await productsRepo.getOne(id);
        const error = validationResult(req).array();
        const {
            title,
            price,
        } = req.body;

        const value = price && parseInt(price);
        const image = req.file && req.file.buffer.toString('base64');
        if (error.length <= 0 && image && product) {
            await productsRepo.update(req.params.id, {
                title,
                value,
                image
            });
            res.redirect('/products');
        }

        if (error.length <= 0 && !image && product) {
            await productsRepo.update(req.params.id, {
                title,
                value
            });
            res.redirect('/products');
        }
        res.send(layoutView(editProducts({
            product
        }, joinErrors(error)), 'Edit Product'));
    });

function joinErrors(err) {
    const error = err.reduce(
        (obj, item) => Object.assign(obj, {
            [item.param]: item.msg
        }), {});
    return error ? error : undefined;
}


module.exports = router;