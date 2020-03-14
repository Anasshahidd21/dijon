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

let errorString = '';
// Signup
router.get('/signup', (req, res) => {

    res.send(layoutView(signupView({
        req
    }, errorString), 'Sign Up'));
});

router.post('/signup', [check('email').trim().normalizeEmail().isEmail().withMessage('Invalid Email').custom(async (email, {
    req
}) => {

    const emailValidation = await repo.getOneBy({
        email
    });

    if (emailValidation) {
        throw new Error('User with the email already exists');
    }
}), check('password', 'Your password must be at least 5 characters').trim().not().isEmpty().exists().isLength({
    min: 5
}), check('passwordConfirmation').custom((value, {
    req
}) => {
    if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
    }
    // Indicates the success of this synchronous custom validator
    return true;
})], async (req, res) => {
    const errors = validationResult(req).array();
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirmation = req.body.passwordConfirmation;



    if (errors.length === 0) {
        const user = await repo.create({
            email,
            password
        });
        req.session.userID = user.id;
        res.send('account created');
    } else {
        res.send(layoutView(signupView({
            req
        }, joinErrors(errors)), 'signup'));
    }
});



// Signout
router.get('/signout', (req, res) => {
    if (!req.session.userID) {
        res.send('please login/signup first');
    }
    req.session.userID = undefined;
    res.send('you have successfully logged out');
})



// SignIn
router.get('/signin', (req, res) => {
    res.send(layoutView(signInView({
        req
    }, errorString), 'Login'));
});

router.post('/signin', [
        check('email').trim().custom(async (email, {
            req
        }) => {

            const user = await repo.getOneBy({
                email
            });

            if (!user) {
                throw new Error('User doesnt exist');
            }
        }),
        check('password').custom(async (password, {
            req
        }) => {
            const user = await repo.getOneBy({
                email: req.body.email
            })

            if (!user) {
                throw new Error('Incorrect Password');
            }
            const pass = await repo.comparePasswords(password, user.password);

            if (!pass) {
                throw new Error('Incorrect Password');
            }
            // Indicates the success of this synchronous custom validator
            return true;
        })
    ],
    async (req, res) => {
        const {
            email,
            password
        } = req.body;
        const user = await repo.getOneBy({
            email
        });
        const errors = validationResult(req).array();
        if (errors.length == 0) {
            req.session.userID = user.id;
            res.send('Successfully logged in');
        } else {
            res.send(layoutView(signInView({
                req
            }, joinErrors(errors)), 'signin'));
        }
    });

function joinErrors(err) {
    const error = err.reduce(
        (obj, item) => Object.assign(obj, {
            [item.param]: item.msg
        }), {});
    return error;
}




module.exports = router;