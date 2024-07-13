import cartsModel from  '../../dao/models/cart.model.js'

async function getCarts() {
    return await cartsModel.find();
}

async function getCartbyId(cartId) {
    return await cartsModel.find({ _id: cartId}).populate("products.product");
}

async function createCart() {
    return await cartsModel.create({});
}

async function getOneCart(cartId) {
    return await cartsModel.findOne({_id: cartId});
}

async function findProductInCart(id, pid) {
    return await cartsModel.findOne({_id: id , products: {$elemMatch: {product:pid}}})
}

async function updateCart(cartId, cart){
        return await cartsModel.updateOne({_id:cartId}, cart);
}


async function delateproductfromCart(cartId, productId){
    return await cartsModel.updateOne({ _id: cartId },{ $pull: { products: { product: productId } } });
}

async function findCartById(cartId){
    return await await cartsModel.findById(cartId)
}

async function updateMany(prodid){
    return await cartsModel.updateMany({ $pull: { products: {product : prodid} } });
}


export default {
    createCart,
    getCarts,
    getCartbyId,
    getOneCart,
    findProductInCart,
    updateCart,
    findCartById,
    delateproductfromCart, 
    updateMany
}



