const express = require('express');
const repo = require('./repositories/users');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authLogic = require('./logic/serverLogic');

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieSession({
    keys: ['skjfdalkj']
}));
app.use(authLogic);

app.listen(3000, () => {
    console.log('listening to port req');
});