const express = require('express');
const {
    check,
    validationResult
} = require('express-validator');
const signupView = require('../views/signupView');
const bcrypt = require('bcrypt');
const repo = require('../repositories/users');
const app = express();
const router = express.Router();

let errorString = '';
// Signup
router.get('/signup', (req, res) => {
    console.log(req.session);
    res.send(signupView({
        req
    }, errorString));
});

router.post('/signup', [check('email').trim().normalizeEmail().isEmail().custom(async (email, {
    req
}) => {

    const emailValidation = await repo.getOneBy({
        email
    });

    if (emailValidation) {
        throw new Error('User with the email already exists');
    }
}), check('password', 'Your password must be at least 5 characters').trim().not().isEmpty().exists().custom((value, {
    req
}) => {
    if (value !== req.body.passwordConfirmation) {
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
        res.send(signupView({
            req
        }, joinErrors(errors)));
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
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <button>Sign In</button>
        </form>
    </div>`);
});

router.post('/signin', async (req, res) => {
    const {
        email,
        password
    } = req.body;

    const user = await repo.getOneBy({
        email
    });

    if (!user) {
        res.send("user doesn't exist");
    }

    const passCheck = await repo.comparePasswords(password, user.password);
    if (!passCheck) {
        res.send('passwords dont match');
    }

    req.session.userID = user.id;
    res.send('Successfully logged in');
});




function joinErrors(err) {
    let errorStr = '';
    err.forEach(element => {
        errorStr = errorStr + element.msg;
    });
    // for (er in err) {
    //     errorString = er + er.msg;
    // }
    return errorStr;
}




module.exports = router;