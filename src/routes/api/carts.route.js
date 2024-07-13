import { Router } from "express";
import { getCarts,getCartbyId,createCart,addProductToCart,updateCart,updateProductFromCart,deleteProductFromCart,deleteAllProductsFromCart } from "../../controllers/cartsController.js";
const router = Router();

router.get('/cart', getCarts); 

router.get('/cart/:cid',getCartbyId); 

router.post('/cart', createCart) 

router.post('/cart/:id/product/:pid', addProductToCart)

router.put ('/carts/:cid',updateCart ) 

router.put('/carts/:cid/products/:pid',updateProductFromCart); 

router.delete('/cart/:id/product/:pid', deleteProductFromCart)

router.delete('/cart/:id', deleteAllProductsFromCart )


export default router;
