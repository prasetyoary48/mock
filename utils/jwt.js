const jwt = require('jsonwebtoken')
let { JWT_SECRET_KEY } = process.env

async function auth(req, res, next){
    const { authorization } = req.headers

    if(!authorization){
        return res.status(401).json({
            status: 'failed',
            message: `you\'re not authorized`,
            data: null
        })
    }

    jwt.verify(authorization, JWT_SECRET_KEY, (err, decode)=>{
        if(err){
            return res.status(401).json({
                status: 'failed',
                message: `you\'re not authorized`,
                err: err.message,
                data: null
            })
        }

        req.user = decode
        next()
    })
}

async function JWTsign(user){
    let token = jwt.sign(user, JWT_SECRET_KEY, { expiresIn: 60 * 60 })
    return token;
}

module.exports = {
    auth,
    JWTsign
}