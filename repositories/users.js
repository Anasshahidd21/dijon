const fs = require('fs');

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
        const users = await this.getAll();
        users.push(credentials);
        await fs.promises.writeFile(this.filename, JSON.stringify(users));
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
}

test();