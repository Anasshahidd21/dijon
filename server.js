const express = require('express');
const repo = require('./repositories/users');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

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

app.post('/signup', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirmation = req.body.passwordConfirmation;

    const emailValidation = await repo.getOneBy({
        email
    });

    if (emailValidation) {
        res.send('User with the email already exists');
    }

    if (password != passwordConfirmation) {
        res.send('Passwords doesnt match');
    }

    const user = await repo.create({
        email,
        password
    });

    req.session.userID = user.id;
    res.send('account created');
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

    if (user.password != password) {
        res.send('passwords dont match');
    }

    req.session.userID = user.id;
    res.send('Successfully logged in');
});
app.listen(3000, () => {
    console.log('listening to port req');
});