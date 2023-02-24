const crypto = require("crypto");

const id = crypto.randomBytes(16).toString("hex");

const uuid = () => {
    return id
} // => f9b327e70bbcf42494ccb28b2d98e00e


function encode(id) {
    const str = id;
    const buff = Buffer.from(str, 'utf-8');
    const base64 = buff.toString('base64');
    return base64
}

function decode(id) {
    const base64 = id;
    const buff = Buffer.from(base64, 'base64');
    const str = buff.toString('utf-8');
    return str;
}


module.exports = {
    uuid,
    encode,
    decode
}
