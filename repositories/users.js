const {
    Repository
} = require('./repo')

const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);




class Users extends Repository {
    async create(credentials) {
        credentials.id = this.randomID();
        const users = await this.getAll();
        const hashedPass = await this.hashing(credentials.password);

        const user = {
            ...credentials,
            password: hashedPass,
        };
        users.push(user);
        this.writeFile(this.filename, users);

        return user;
    }
}
module.exports = new Users('users.json');