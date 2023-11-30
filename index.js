const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const express = require('express')
const app = express()
const port = 3000
const path = require('path')

const flash = require('express-flash')
const session = require('express-session')

const routers = require('./router')
const swaggerJSON = require('./openapi.json')
const swaggerUI = require('swagger-ui-express')

const passport = require('./utils/passport')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, './app/view'))

app.use('/docs',swaggerUI.serve,swaggerUI.setup(swaggerJSON))
app.use('/', routers);


app.listen(port, () => 
    console.log(`Example app listening at http://localhost:${port}`))