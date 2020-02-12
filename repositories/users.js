const fs = require('fs');
const crypto = require('crypto');
const util = require('util');


const scrypt = util.promisify(crypto.scrypt);

class Users {
    constructor(filename) {
        this.filename = filename;
        if (!filename) {
            throw new Error('Please provide a filename');
        }
        try {
            fs.accessSync(this.filename); //checks to see if the file is already created
        } catch (err) {
            fs.writeFileSync(this.filename, '[]'); //creates a file if didnt exist before
        }
    }
    async getAll() {
        const users = (await fs.promises.readFile(this.filename));
        return JSON.parse(users);
    }

    async hashing(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hashed = await scrypt(password, salt, 64);
        password = `${hashed.toString('hex')}.${salt}`;
        return password;
    }

    async comparePasswords(userPassword, databasePassword) {
        const [hashed, salt] = databasePassword.split('.');
        const uPasswordHashed = await scrypt(userPassword, salt, 64);
        return uPasswordHashed.toString('hex') === hashed;
    }

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

    async writeFile(filename, users) {
        const write = await fs.promises.writeFile(this.filename, JSON.stringify(users, null, 2));
        return write;
    }

    randomID() {
        return crypto.randomBytes(4).toString('hex');
    }

    async delete(id) {
        let users = await this.getAll();
        users = users.filter(users => users.id !== id);
        await this.writeFile(this.filename, users);
    }

    async getOne(id) {
        const users = await this.getAll();
        return users.find(users => users.id === id);
    }

    async update(id, userAttributes) {
        const users = await this.getAll();
        const user = users.find(users => users.id === id);

        if (!user) {
            throw new Error('Sorry buddy, user not found');
        }

        Object.assign(user, userAttributes);
        await this.writeFile(this.filename, users);
    }

    async getOneBy(filters) {
        const users = await this.getAll();

        for (let user of users) {
            let found = true;

            for (let key in filters) {
                if (user[key] !== filters[key]) {
                    found = false
                }
            }
            if (found) {
                return user;
            }
        }
        return undefined;
    }
}

module.exports = new Users('users.json');