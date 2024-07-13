import productsModel from '../../dao/models/products.model.js'
import cartService from '../service/cartsService.js'



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
        const cart = await cartService.getCartbyId(cartId);
        if (!cart) {
            return res.status(404).send({ message: "Carrito no encontrado" });
        }
        console.log(JSON.stringify(cart, null, '\t'))
        res.send({result: "success", payload: cart});
    } catch (error) {
        console.log(error);
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

        let producto = await productsModel.findOne({_id:pid});
        let carrito = await cartService.getOneCart(id);

        if (!carrito || !producto){
            return res.status(404).send({ message: "Datos inexistentes" });
        }

        if ( await cartService.findProductInCart(id, pid)){
            carrito.products.find(prod => prod.product.toString() === producto._id.toString()).quantity++;
        }else{
            carrito.products.push({product:pid , quantity: 1});
        }

        let prodAgregado = await cartService.updateCart(id, carrito);
        res.send({result: "success", payload: prodAgregado});
    }catch(error){
        console.log(error);
        res.send({message: "No se pudo agregar el producto al carrito"});
    }
}


export const updateCart = async (req, res)=>{
    let arregloProductos = req.body;
    let { cid } = req.params;

    try{
        let cart = await cartService.findCartById(cid); // find cart by id
        if (!cart){
            return res.status(404).send({message: "El carrito no existe"});
        }

        cart.products = arregloProductos;

        let cartUpdated = await cartService.updateCart(cid, cart); //update cart
        res.send({result: "success", payload: cartUpdated});
    }catch(error){
        console.log(error);
        res.send({message: "Existe un error en los datos brindados. No se pudo modificar el carrito"});
    }    
}

export const updateProductFromCart = async (req, res) =>{
    let { cid } = req.params;
    let { pid } = req.params;
    let { quantity } = req.body;

    try {
        let cart = await cartService.findCartById(cid); // fIND CART BY ID
        if (!cart) {
            return res.status(404).send({ message: "Carrito no encontrado" });
        }
        let producto = cart.products.find(prod => prod.product.toString() === pid);
        if (producto === undefined) {
            return res.status(404).send({ message: "Producto no encontrado en el carrito" });
        }
        producto.quantity = quantity;

        let cartUpdated = await cartService.updateCart(cid, cart); //update cart

        res.send({ result: "success", payload: cartUpdated });
    } catch (error) {
        console.log(error);
        res.send({ message: "No se pudo actualizar la cantidad del producto en el carrito" });
    }
}


export const deleteProductFromCart = async (req, res) =>{
    let { id } = req.params;
    let { pid } = req.params;
    let prodAgregado;
    try{
        let carrito = await cartService.getOneCart(id);
        let producto = await productsModel.findOne({_id: pid});
        if (!carrito || !producto){
            return res.status(404).send({ message: "Datos inexistentes" });
        }
        if (carrito.products.find(prod => prod.product.toString() === producto._id.toString()).quantity > 1){
            carrito.products.find(prod => prod.product.toString() === producto._id.toString()).quantity--;
            prodAgregado = await cartService.updateCart(id, carrito);
        }else{
            prodAgregado = await cartService.delateproductfromCart(id, pid);
        }
        
        res.send({result: "success", payload: prodAgregado});
    }catch(error){
        console.log(error);
        res.send({message: "No se pudo eliminar el producto del carrito"});
    }
}


export const deleteAllProductsFromCart = async (req, res) =>{
    let { id } = req.params;
    try{
        let carrito = await cartService.getOneCart(id);
        if (!carrito){
            return res.status(404).send({ message: "Carrito no encontrado" });
        }
        carrito.products = [];
        let prodEliminado = await cartService.updateCart(id, carrito);

        res.send({result: "success", payload: prodEliminado});
    }catch(error){
        console.log(error);
        res.send({message: "No se pudo eliminar el producto del carrito"});
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

