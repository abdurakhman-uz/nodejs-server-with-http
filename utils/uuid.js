const crypto = require("crypto");

const id = crypto.randomBytes(16).toString("hex");

const uuid = () => { return id } // => f9b327e70bbcf42494ccb28b2d98e00e

module.exports = { uuid }

