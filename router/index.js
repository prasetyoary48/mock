const express = require('express');
const router = express.Router();

const users = require('./users');
const todolist = require('./todolist');
const auth = require('./auth');

router.get("/", (req, res)=> {
    res.send("Selamat Datang")
});

router.use(users);
router.use(todolist);
router.use(auth);

module.exports = router;

