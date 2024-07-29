import productsModel from '../models/products.model.js'

export default class Products {
    getProducts = async () => {
        try {
            let result = await productsModel.find()
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getProductById = async (productId) => {
        try {
            let result = await productsModel.findById(productId)
            return result
        } catch (error) {
            return null
        }
    }

    createProduct = async (product) => {
        try{
            let result = await productsModel.create(product)
            return result
        }catch (error){
            console.log(error)
            return null
        }
    }
    updateProduct = async (productId, product) => {
        try {
            let result = await productsModel.updateOne({_id: productId}, product)
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    deleteProduct = async (productId) => {
        try {
            let result = await productsModel.deleteOne({_id: productId});
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }
}
