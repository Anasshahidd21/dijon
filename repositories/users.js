const fs = require('fs');
const crypto = require('crypto');

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

    async create(credentials) {
        credentials.id = this.randomID();
        const users = await this.getAll();
        users.push(credentials);
        this.writeFile(this.filename, users);
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
    }
}

// Only for testing purposes
const test = async () => {
    const users = new Users('hello.json');
    const allUsers = await users.getAll();
    console.log(allUsers);
    const user = {
        username: 'anas',
        password: 'testing'
    };
    await users.create(user);
    await users.delete('6f43cf3a');
    const userx = await users.getOne('6f43cf3a');
    console.log(userx);
    await users.update('6f43cf3a', {
        sexy: 'yolo'
    });
}

// test();