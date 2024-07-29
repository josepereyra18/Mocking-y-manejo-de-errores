import cartsModel from  '../models/cart.model.js'

export default class Carts {
    getCarts = async () => {
        try {
            let result = await cartsModel.find();
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getCartbyId = async (cartId) => {
        try {
            let result = await cartsModel.find({ _id: cartId}).populate("products.product");
            return result
        } catch (error) {
            return null
        }
    }

    createCart = async () => {
        try {
            let result = await cartsModel.create({});
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    findProductInCart = async (id, pid) => {
        try {
            let result = await cartsModel.findOne({_id: id , products: {$elemMatch: {product:pid}}})
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    updateCart = async (cartId, cart) => {
        try {
            let result = await cartsModel.updateOne({_id:cartId}, cart);
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    delateproductfromCart = async (cartId, productId) => {
        try {
            let result = await cartsModel.updateOne({ _id: cartId },{ $pull: { products: { product: productId } } });
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }


    findCartById = async (cartId) => {
        try {
            let result = await cartsModel.findById(cartId)
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    updateMany = async (prodid) => {
        try {
            let result = await cartsModel.updateMany({ $pull: { products: {product : prodid} } });
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }



}


