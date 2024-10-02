const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    category:{
        type: String,
    },
    imageUrl:{
        type: String,
    }
});

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;