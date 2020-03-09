const express = require('express');

const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authLogic = require('./logic/serverLogic');
const productsAuth = require('./logic/productsLogic');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieSession({
    keys: ['skjfdalkj']
}));
app.use(authLogic);
app.use(productsAuth);

app.listen(3000, () => {
    console.log('listening to port req');
});