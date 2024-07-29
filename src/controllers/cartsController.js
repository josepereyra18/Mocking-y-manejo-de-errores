import cartsService from '../dao/classes/cart.DAO.js'
import  productsService from '../dao/classes/products.DAO.js'
import CustomError from '../service/CustomError.js';
import EErrors from '../service/enums.js';
import { databaseError } from '../service/info.js'

const  cartService = new cartsService();
const productService = new productsService();



export const getCarts =async (req,res) =>{
    try{
        let carts = await cartService.getCarts()
        res.send({result: "success", payload: carts});
    } catch (error){
        console.log(error);
    }
}


export const getCartbyId =async (req, res) =>{
    const cartId = req.params.cid;
    try {
        if (!isNaN(id)){
            CustomError.createError({
                name: "Param incorrecto",
                cause: routingType(id),
                message: "tipo de datos Invalido",
                code: EErrors.ROUTING_ERROR
            });
        }
        const cart = await cartService.getCartbyId(cartId);
        if (!cart) {
            CustomError.createError({
                name: "Cart not found",
                cause: databaseError(cartId),
                message: "Carrito no encontrado",
                code: EErrors.DATABASE_ERROR
            });
        }
        console.log(JSON.stringify(cart, null, '\t'))
        res.send({result: "success", payload: cart});
    } catch (error) {
        console.log(error.cause);
        res.send({status: "error",error: error.message});
    }
}


export const createCart = async (req, res) =>{
    await cartService.createCart();
    res.send({result: "success", message: "Carrito creado"});
}

export const addProductToCart = async (req,res) =>{
    let { id } = req.params;
    let { pid } = req.params;
    try{
        if (!isNaN(id) || !isNaN(pid)){
            CustomError.createError({
                name: "Param  incorrecto",
                cause: routingType(id),
                message: "tipo de datos Invalido",
                code: EErrors.ROUTING_ERROR
            });
        }
        
        let producto = await productService.getProductById({_id:pid});
        let carrito = await cartService.getCartbyId(id);

        if (!carrito ){
            CustomError.createError({
                name: "Cart not found",
                cause: databaseError(carrito,id),
                message: "Carrito no encontrado",
                code: EErrors.DATABASE_ERROR
            });
        }

        if (!producto){
            CustomError.createError({
                name: "Product not found",
                cause: databaseError(producto, pid),
                message: "Producto no encontrado",
                code: EErrors.DATABASE_ERROR
            });
        }
        if ( await cartService.findProductInCart(id, pid)){
            carrito.products.find(prod => prod.product.toString() === producto._id.toString()).quantity++;
        }else{
            carrito.products.push({product:pid , quantity: 1});
        }

        let prodAgregado = await cartService.updateCart(id, carrito);
        res.send({result: "success", payload: prodAgregado});
    }catch(error){
        console.log(error.cause);
        res.send({status: "error",error: error.message});
    }
}


export const updateCart = async (req, res)=>{
    let arregloProductos = req.body;
    let { cid } = req.params;

    try{
        if (!isNaN(id)){
            CustomError.createError({
                name: "Param incorrecto",
                cause: routingType(id),
                message: "tipo de datos Invalido",
                code: EErrors.ROUTING_ERROR
            });
        }
        let cart = await cartService.findCartById(cid); // find cart by id
        if (!cart){
            CustomError.createError({
                name: "Cart not found",
                cause: databaseError(carrito,cartId),
                message: "Carrito no encontrado",
                code: EErrors.DATABASE_ERROR
            });
        }

        cart.products = arregloProductos;

        let cartUpdated = await cartService.updateCart(cid, cart); //update cart
        res.send({result: "success", payload: cartUpdated});
    }catch(error){
        console.log(error.cause);
        res.send({status: "error",error: error.message});
    }    
}

export const updateProductFromCart = async (req, res) =>{
    let { cid } = req.params;
    let { pid } = req.params;
    let { quantity } = req.body;

    try {

        if (!isNaN(id) || !isNaN(pid)){
            CustomError.createError({
                name: "Param  incorrecto",
                cause: routingType(id),
                message: "tipo de datos Invalido",
                code: EErrors.ROUTING_ERROR
            });
        }

        let cart = await cartService.findCartById(cid); // fIND CART BY ID
        if (!cart) {
            CustomError.createError({
                name: "Cart not found",
                cause: databaseError(carrito,cartId),
                message: "Carrito no encontrado",
                code: EErrors.DATABASE_ERROR
            });
        }
        let producto = cart.products.find(prod => prod.product.toString() === pid);
        if (producto === undefined) {
            CustomError.createError({
                name: "Product not found",
                cause: databaseError(producto, pid),
                message: "Producto no encontrado",
                code: EErrors.DATABASE_ERROR
            });
        }
        producto.quantity = quantity;

        let cartUpdated = await cartService.updateCart(cid, cart); //update cart

        res.send({ result: "success", payload: cartUpdated });
    } catch (error) {
        console.log(error.cause);
        res.send({status: "error",error: error.message});
    }
}


export const deleteProductFromCart = async (req, res) =>{
    let { id } = req.params;
    let { pid } = req.params;
    let prodAgregado;
    try{

        if (!isNaN(id) || !isNaN(pid)){
            CustomError.createError({
                name: "Param  incorrecto",
                cause: routingType(id),
                message: "tipo de datos Invalido",
                code: EErrors.ROUTING_ERROR
            });
        }

        let carrito = await cartService.getCartbyId(id);
        let producto = await productService.findOne({_id: pid});
        if (!carrito ){
            CustomError.createError({
                name: "Cart not found",
                cause: databaseError(carrito,cartId),
                message: "Carrito no encontrado",
                code: EErrors.DATABASE_ERROR
            });
        }

        if (!producto){
            CustomError.createError({
                name: "Product not found",
                cause: databaseError(producto, pid),
                message: "Producto no encontrado",
                code: EErrors.DATABASE_ERROR
            });
        }

        if (carrito.products.find(prod => prod.product.toString() === producto._id.toString()).quantity > 1){
            carrito.products.find(prod => prod.product.toString() === producto._id.toString()).quantity--;
            prodAgregado = await cartService.updateCart(id, carrito);
        }else{
            prodAgregado = await cartService.delateproductfromCart(id, pid);
        }
        
        res.send({result: "success", payload: prodAgregado});
    }catch(error){
        console.log(error.cause);
        res.send({status: "error",error: error.message});
    }
}


export const deleteAllProductsFromCart = async (req, res) =>{
    let { id } = req.params;
    try{

        if (!isNaN(id) ){
            CustomError.createError({
                name: "Param  incorrecto",
                cause: routingType(id),
                message: "tipo de datos Invalido",
                code: EErrors.ROUTING_ERROR
            });
        }
        
        let carrito = await cartService.getCartbyId(id);
        if (!carrito ){
            CustomError.createError({
                name: "Cart not found",
                cause: databaseError(carrito,cartId),
                message: "Carrito no encontrado",
                code: EErrors.DATABASE_ERROR
            });
        }
        carrito.products = [];
        let prodEliminado = await cartService.updateCart(id, carrito);

        res.send({result: "success", payload: prodEliminado});
    }catch(error){
        console.log(error.cause);
        res.send({status: "error",error: error.message});
    }
}


// no se usa
// export const deleteCart = async (req, res) =>{
//     let { id } = req.params;
//     try{
//         let carrito = await cartsModel.findOne({_id: id});
//         if (!carrito){
//             return res.status(404).send({ message: "Carrito no encontrado" });
//         }
//         let prodEliminado = await cartsModel.deleteOne({_id: id});

//         res.send({result: "success", payload: prodEliminado});
//     }catch(error){
//         console.log(error);
//         res.send({message: "No se pudo eliminar el carrito"});
//     }
// }

