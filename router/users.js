const express = require('express');
const router = express.Router();

const controller = require('../app/controller')
// const { auth } = require('../utils/jwt');

router.get('/api/users', controller.users.get);
router.get('/api/users/:id', controller.users.getById);
router.post('/api/users', controller.users.create);
router.delete('/api/users/:id',controller.users.destroy);

module.exports = router;