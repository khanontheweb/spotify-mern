const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    clientSecret: process.env.clientSecret,
    clientID: process.env.clientID,
    port: process.env.port
};