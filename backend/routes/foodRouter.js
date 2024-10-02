const express = require('express');
const foodRouter = express.Router();

const {addItem,getAllItems,getItemById,getItemsByCategory} = require('../controllers/food.controller');

foodRouter.post('/',addItem);
foodRouter.get('/',getAllItems);
foodRouter.get('/:id',getItemById);
foodRouter.get('/categories/:category',getItemsByCategory);

module.exports = foodRouter;