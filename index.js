var express = require('express');
const jwt = require("jsonwebtoken");

var app = express();
var cors = require('cors')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('posts.db');

class Database {

    constructor() {
        console.log("moi1")
        let sql = "CREATE TABLE  IF NOT EXISTS USERS7 ( contact_id INTEGER PRIMARY KEY AUTOINCREMENT,fullname TEXT,email TEXT NOT NULL UNIQUE,token TEXT,ip TEXT);"
        db.run(sql)
        //  db.run("INSERT INTO USERS7 (contact_id,email) VALUES(3,'A')");
        console.log(("database created"))

    }

    async checkUserExists(username, password) {
        return await new Promise((resolve, reject) => {
            const parameter = username
            db.get("SELECT * FROM USERS7 where email=?", [parameter], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    updateUserInformation() {
    }
}

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/getUserInformation', async function (req, res) {
    let data = new Database();
    var promise1 = {};

    try {
        promise1.token = req.body.token;
        console.log(promise1.token)
        const verified = jwt.verify(req.body.token.split(":")[1], "RANDOM-TOKEN");
        promise1.ok = verified.userEmail;
        let promise2 = await data.checkUserExists(verified.userEmail)
        promise1.token = promise2.fullname;
        promise1.email = promise2.email;
        promise1.exp = verified.b;
    } catch (err) {
        promise1.token = null;
    }
    res.status(200).send(promise1)
})

app.put('/', async function (req, res) {
    //let sql = "CREATE TABLE  IF NOT EXISTS USERS7 ( contact_id INTEGER PRIMARY KEY AUTOINCREMENT,fullname TEXT,email TEXT NOT NULL UNIQUE,token TEXT,ip TEXT);"
    //db.run(sql)
    console.log("email=" + req.body.username)
    console.log("full name=" + req.body.fullname)

    db.get("SELECT EXISTS(SELECT 1 FROM USERS7 WHERE email = ?) AS isExists", ["c1@c.fi"], (err, row) => {
        if (err) {
            return console.error('Error running query:', err.message);
        }

        console.log("row.isExists=" + row.isExists)
        // The result is 1 if the email exists or 0 otherwise
        if (row.isExist == 0) {
            db.run("INSERT INTO USERS7 (email) VALUES('" + req.body.username + "')")
        }
        if (row.isExists) {
            console.log("The email already exists in the database.");
        } else {
        console.log("The email does not exist, it is unique.");
        }

      })

    var promise1 = {};

    console.log("Tappara=" + req.body.username)
    res.status(200).send(promise1)
})

app.post('/', async function (req, res) {
    let data = new Database();

    try {

        const username = req.body.username;
        const password = req.body.password;
        let promise1 = await data.checkUserExists(username)
        const now = new Date();
        let token = null;
        try {
            token = jwt.sign(
                {
                    userEmail: username,
                    b: (now)
                },

                "RANDOM-TOKEN",
                { expiresIn: "38h" }
            );
        } catch (error) {

        }
        promise1.token1 = token
        console.log("token1", token)

        if (password === promise1.password) {
            await res.status(200).send(promise1);
        } else {
            await res.status(400).send("promise1");
        }
    } catch (err) {
        await res.status(400).send("missing username or password");
    }
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
