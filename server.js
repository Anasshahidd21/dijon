const express = require('express');
const repo = require('./repositories/users');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const {
    check,
    validationResult
} = require('express-validator');
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieSession({
    keys: ['skjfdalkj']
}));
app.get('/signup', (req, res) => {
    res.send(`
    <div>
        ${req.session.userID}
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordConfirmation" placeholder="passwordConfirmation" />
            <button>Sign up</button>
        </form>
    </div>`);
});

app.post('/signup', [check('email').trim().normalizeEmail().isEmail().custom(async (value, {
    req
}) => {

    // console.log(repo);
    const emailValidation = await repo.getOneBy({
        'email': value
    });
    // console.log(value);
    console.log(emailValidation);
    if (emailValidation) {
        throw new Error('User with the email already exists');
    }
})], async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirmation = req.body.passwordConfirmation;



    if (password != passwordConfirmation) {
        res.send('Passwords doesnt match');
    }

    if (errors.isEmpty()) {
        const user = await repo.create({
            email,
            password
        });
        req.session.userID = user.id;
        res.send('account created');
    }

});

app.get('/signout', (req, res) => {
    if (!req.session.userID) {
        res.send('please login/signup first');
    }
    req.session.userID = undefined;
    res.send('you have successfully logged out');
})

app.get('/signin', (req, res) => {
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <button>Sign In</button>
        </form>
    </div>`);
});

app.post('/signin', async (req, res) => {
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
app.listen(3000, () => {
    console.log('listening to port req');
});