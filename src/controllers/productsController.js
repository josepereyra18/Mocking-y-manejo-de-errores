import cartsService from '../dao/classes/cart.DAO.js'
import  productService from '../dao/classes/products.DAO.js'
import { createProductsFaker } from '../utils.js';
import CustomError from '../service/CustomError.js';
import EErrors from '../service/enums.js';
import { generateProductErrorInfo, typeError, routingType} from '../service/info.js'

const  cartService = new cartsService();
const productsService = new productService();

export const getProducts = async (req, res) =>{
    try{
        let productos = await productsService.getProducts();
        res.send({result: "success", payload: productos});
    } catch (error){
        console.log(error);
    }
}

export const getProductById = async (req, res) =>{
    const { id } = req.params;
    try{
        if (!isNaN(id)){
            CustomError.createError({
                name: "Param incorrecto",
                cause: routingType(id),
                message: "tipo de datos Invalido",
                code: EErrors.ROUTING_ERROR
            });
        }
        let producto = await productsService.getProductById(id);
        res.send({result: "success", payload: producto});
    } catch (error){
        console.log(error.cause);
        res.send({status: "error",error: error.message});
    }
}

export const createProduct = async (req, res) =>{
    try{
        const { title, description, price, code, stock, status, category } = req.body;

        if (!title || !description || !price || !code || !stock || !status || !category) {
            CustomError.createError({
                name: "User creation error",
                cause: generateProductErrorInfo({title, description, price, code, stock, status, category}),
                message: "Faltan datos",
                code: EErrors.INVALID_FORMAT_ERROR
            });
        
        }

        if (typeof price !== 'number' || typeof stock !== 'number' || typeof code !== 'string' || typeof status !== 'boolean' || typeof category !== 'string' || typeof title !== 'string' || typeof description !== 'string'){
            CustomError.createError({
                name: "User creation error",
                cause: typeError({title, description, price, code, stock, status, category}),
                message: "tipo de datos Invalido",
                code: EErrors.INVALID_TYPES_ERROR
            });
        }

        let result = await productsService.createProduct({ title, description, price, code, stock, status, category });
        res.send({ result: "success", payload: result });

    }catch(error){
        console.log(error.cause);
        res.send({status: "error",error: error.message});
    }
}

export const updateProduct = async (req, res) =>{
    let { id } = req.params;
    let prductModified = req.body;
    try{
        if (!isNaN(id)){
            CustomError.createError({
                name: "Param incorrecto",
                cause: routingType(id),
                message: "tipo de datos Invalido",
                code: EErrors.ROUTING_ERROR
            });
        }

        if (!prductModified.title || !prductModified.description || !prductModified.price || !prductModified.code || !prductModified.stock || !prductModified.status || !prductModified.category){
            CustomError.createError({
                name: "User creation error",
                cause: generateProductErrorInfo({title, description, price, code, stock, category}),
                message: "Faltan datos",
                code: EErrors.INVALID_FORMAT_ERROR
            });
        }


        if (typeof price !== 'number' || typeof stock !== 'number' || typeof code !== 'string' || typeof category !== 'string' || typeof title !== 'string' || typeof description !== 'string'){
            CustomError.createError({
                name: "User creation error",
                cause: typeError({title, description, price, code, stock, category}),
                message: "tipo de datos Invalido",
                code: EErrors.INVALID_TYPES_ERROR
            });
        }
    
        let result = await productsService.updateProduct(id, prductModified);
        res.send({result: "success", payload: result});
    }catch(error){
        console.log(error);
        res.send({status: "error",error: error.message});
    }

}

export const deleteProduct = async (req, res) =>{
    let { id } = req.params;
    // await cartModel.updateMany({ products: {_id : id}}, { $pull: { products: {_id : id} } });
    if (!isNaN(id)){
        CustomError.createError({
            name: "Param incorrecto",
            cause: routingType(id),
            message: "tipo de datos Invalido",
            code: EErrors.ROUTING_ERROR
        });
    }
    await cartService.updateMany(id);
    let result = await productsService.deleteProduct(id);
    res.send({result: "success", payload: result});
}


export const generateProducts = async (req, res) =>{
    let products = []
    for (let i = 0; i < 10; i++){
        products.push(createProductsFaker());
    }

    res.send({result: "success", payload: products});
}