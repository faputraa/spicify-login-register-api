import express from 'express';
const mysql = require('mysql');
const auth = require('./middlewares/auth');
const errors = require('./middlewares/errors');
const unless = require('express-unless');

const app = express(); 

const connection = mysql({
    host: 'ip cloud sql',
    user: 'user-root',
    password: 'pw',
    database: 'spicify_logreg'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

auth.unless = unless;
app.use(
    auth.unless({
        path: [
            { url: "/users/login", methods: ["POST"] },
            { url: "/users/register", methods: ["POST"] },
        ]
    })
);

app.use(express.json());

app.use("/users", require("./routes/users.routes"));

app.use(errors);

app.listen(process.env.PORT || 4000, function () {
    console.log("Ready To Go!");
});
