const mongoose = require('mongoose');
const Food = mongoose.model('Food');

const addItem = async (req,res)=>{
    const {name,price,category,imageUrl} = req.body;
    const itemData = {name,price,category,imageUrl};
    console.log(itemData, 'item data from req.body')
    try{
        const foodItem = new Food(itemData)
        const itemSaved = await foodItem.save();
        console.log(itemSaved, 'item saved from db')
        if(!itemSaved){
            return res.status(400).send({
                success: false,
                message: 'Item not saved'
            });
        }
        return res.status(200).send({
            success: true, 
            message: 'Item Saved',
            data: itemSaved
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

const getAllItems = async (req,res)=>{
    try{
        let allFoodItems = await Food.find();

        if(!allFoodItems){
            return res.status(400).send({
                success: false,
                message: 'No Food Items Found'
            });
        }
        return res.status(200).send({
            success: true,
            message: 'All Food Items',
            data: allFoodItems
        });
    }    
    catch(err){
        console.log(err);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

const getItemById = async (req,res)=>{
    console.log(req.params.id,'id in params');
    const id = req.params.id;
    if(!id){
        return res.status(400).send({
            success: false,
            message: 'No Id Found'
        });
    }
    try{
        const foodItem = await Food.findById(id);
        console.log(foodItem,'food item from db');
        if(!foodItem){
            return res.status(400).send({
                success: false,
                message: 'No Food Item Found'
            });
        }
        return res.status(200).send({
            success: true,
            message: 'Food Item',
            data: foodItem
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

const getItemsByCategory = async (req,res)=>{
    console.log(req.params.category,'category name in params');
    const category = req.params.category;

    if(category === 'all'){
        try{
            return getAllItems(req,res);
        }
        catch(err){
            console.log(err);
            return res.status(500).send({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    try{
        let filteredData = await Food.find({category});
        if(!filteredData){
            return res.status(400).send({
                success: false,
                message: 'No Food Items Found'
            })
        }
        return res.status(200).send({
            success: true,
            message: 'Filtered Food Items',
            data: filteredData
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

module.exports = {
    addItem,
    getAllItems,
    getItemById,
    getItemsByCategory
}