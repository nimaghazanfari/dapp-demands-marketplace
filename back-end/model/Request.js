const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true
    },
    tx: String,
    payer: String,
    doer: String,
    customer_username: String,
    ethers: String,
    open: Number,
    title: String,
    desc: String
});

const Request = mongoose.model('Request', requestSchema, 'Requests');
module.exports = Request;