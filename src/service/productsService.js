import productsModel from '../../dao/models/products.model.js'

async function getProducts() {
    return await productsModel.find()
}


async function getProductById(productId) {
    return await productsModel.findById(productId)
}


async function createProduct(product) {
    return await productsModel.create(product)
}

async function updateProduct(productId, product) {
    return await productsModel.updateOne({_id: productId}, product)
}

async function deleteProduct(productId) {
    return await productsModel.deleteOne({_id: productId});
}


export default {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}