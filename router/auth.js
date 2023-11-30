const express = require('express')
const router = express.Router();
const controller = require('../app/controller')
const { auth } = require('../utils/jwt')

const passport = require('../utils/passport')

router.post('/auth/login', controller.auth.login)
router.post('/auth/register', controller.auth.register)

router.get('/register', (req, res)=>{
    res.render('register.ejs')
})
router.post('/register', controller.auth.registerForm)


router.get('/login', (req, res)=>{
    res.render('login.ejs')
})
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}))

router.get('/dashboard', controller.auth.getDashboard);

router.post('/dashboard/updatestatus/:id', controller.auth.updateStatus);
router.post('/dashboard/addtodo', controller.auth.addTodo);

module.exports = router;