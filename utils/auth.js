const bycrypt = require('bcryptjs')
const salt = 10

async function encryptPin(pin){
    try{
        const encryptPin = await bycrypt.hash(pin, salt)
        return encryptPin
    }catch(e){
        throw new Error(e)
    }
}
async function checkPin(pin, encryptPin){
    try{
        const isCorrect = await bycrypt.compare(pin, encryptPin)
        return isCorrect
    }catch(e){
        throw new Error(e)
    }
}

module.exports = {
    encryptPin,
    checkPin
}