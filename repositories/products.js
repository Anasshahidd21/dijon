const {
    Repository
} = require('./repo')
const fs = require('fs');

class Products extends Repository {}

module.exports = new Products('products.json');