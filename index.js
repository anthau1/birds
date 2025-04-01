var express = require('express');
const jwt = require("jsonwebtoken");
var app = express();
var cors = require('cors')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('posts.db');

 class Database  {

    constructor() {
        console.log("moi1")
        let sql = "CREATE TABLE  IF NOT EXISTS USERS7 ( contact_id INTEGER PRIMARY KEY,fullname TEXT,email TEXT NOT NULL UNIQUE,token TEXT,ip TEXT);"
          //  db.run(sql)
         //  db.run("INSERT INTO USERS7 (contact_id,email) VALUES(3,'A')");
        console.log(("database created"))

    }

    async checkUserExists  (username,password) {
        return await new Promise((resolve, reject) => {
            const parameter=username
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
  
    promise1.token = req.body.token;
    const verified = jwt.verify(req.body.token.split(":")[1], "RANDOM-TOKEN");
    promise1.ok = verified.userEmail;

    let promise2 = await data.checkUserExists(verified.userEmail)
    promise1.token = promise2.fullname;
    res.status(200).send(promise1)
})

app.post('/', async function(req, res){
    let data = new Database();

    try {
        const username = req.body.username;
        const password = req.body.password;
        let promise1 = await data.checkUserExists(username)

        const token = jwt.sign(
            {
    
                userEmail: username
            },

            "RANDOM-TOKEN",
            {expiresIn: "24h"}
        );
        promise1.token1=token
        console.log("token1", token)
        if (password === promise1.password) {
            await res.status(200).send(promise1);
        } else {
            await res.status(400).send("promise1");
        }
    }catch(err){
        await res.status(400).send("missing username or password");
    }
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
