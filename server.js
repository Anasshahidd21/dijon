const express = require('express');
const app = express();
const repo = require('./repositories/users');

app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(3000, () => {
    console.log('listening to port req');
});