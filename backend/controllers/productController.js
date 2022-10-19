const asyncHandler = require("express-async-handler")
const Product = require("../models/productModel")

const getProducts = asyncHandler(async (req,res) => {
    const products = await Product.find()
    res.status(200).json(products)
})

const createProduct = asyncHandler(async (req,res) => {
    if (!req.body.name || !req.body.categoryId || !req.body.description || !req.body.purchasePrice){
        res.status(400).send({error: "Fields name, categoryId, description and purchasePrice required"})
    }else{
        const newProduct = await Product.create({
            name: req.body.name,
            categoryId: req.body.categoryId,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice
        })
        res.status(201).json(newProduct)
    }
})

// pass id as param
const updateProduct = asyncHandler(async (req,res) => {
    const product = await Product.findById(req.params.id)
    if (!product){
        res.status(400).json({error: "Product not found"})        
    }
    // Todo check if not user
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body,{new: true})
    res.status(200).json(updatedProduct)
})

// pass id as param
const deleteProduct = asyncHandler(async (req,res) => {
    const product = await Product.findById(req.params.id)
    if (!product){
        res.status(400)
        throw new Error("Product not found")        
    }
    await Product.deleteOne({id: req.params.id})
    res.status(200).json({id: req.params.id})
})

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
}
// then go to routes to call controllers