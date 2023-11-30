const express = require('express');
const router = express.Router();

const controller = require('../app/controller')
// const { auth } = require('../utils/jwt');

router.get('/api/todolist', controller.todolist.get);
router.get('/api/todolist/:id', controller.todolist.getById);
router.post('/api/todolist', controller.todolist.create);
router.delete('/api/todolist/:id',controller.todolist.destroy);

module.exports = router;