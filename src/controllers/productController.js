const Product = require("../models/Product");
const AppError = require("../utils/AppError");

// Create new product
async function handleCreateProduct(req, res, next){
const {name, description, currentPrice, discountPrice, category, availableSizes, imageUrls, stockQuantity} = req.body;

try {
    if(!name || !description || !currentPrice || !category || !availableSizes || !imageUrls || !stockQuantity){
        return next(new AppError("All fields are required", 400));
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ name });
    if(existingProduct){
        return next(new AppError("Product already exists", 409));
    }

    // Create new product
    const newProduct = await Product.create({ name, description, currentPrice, discountPrice, category, availableSizes, imageUrls, stockQuantity});
    return res.status(201).send({ status: true, message: "Product created successfully", data: newProduct });
    
} catch (error) {
    next(error);
}
}

// Get all products with pagination and sorting
async function handleGetAllProducts(req, res, next) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || "createdAt"; 
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1; // Default to descending

        const totalProducts = await Product.countDocuments({});
        const totalPages = Math.ceil(totalProducts / limit);

        if (totalProducts === 0) {
            return res.status(404).json({ 
                status: false, 
                message: "No products found", 
                data: [] 
            });
        }

        const paginatedProducts = await Product.find({})
            .sort({ [sortBy]: sortOrder }) // Dynamic sorting
            .skip(skip)
            .limit(limit)
            .lean();

        return res.status(200).json({ 
            status: true, 
            message: "Products retrieved successfully", 
            data: {
                products: paginatedProducts,
                totalProducts,
                totalPages,
                currentPage: page,
            } 
        });
    } catch (error) {
        next(error);
    }
}



module.exports = {
    handleCreateProduct,
    handleGetAllProducts
}