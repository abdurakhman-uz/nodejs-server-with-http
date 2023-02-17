const crypto = require("crypto")

function PassHash(password) {
    if ( password.length < 8) {
        return "Password must be 8 symbol"
    }

    return crypto.createHash('sha256').update(password).digest('hex')
}

function PassCheck(password, hash) {
    const pass = crypto.createHash('sha256').update(password).digest('hex')

    if ( pass === hash ) {
        return true
    } else {
        return false
    }
    
}

module.exports = { PassHash, PassCheck }