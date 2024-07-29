import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, generateProducts} from '../../controllers/productsController.js';
import productHandler from '../../middlewares/errors/index.js';

const router = Router();


router.get('/products',getProducts); 

router.get('/products/:id', getProductById); 

router.get('/mockingproducts', generateProducts)

router.post('/products',productHandler,createProduct) 

router.put('/products/:id',updateProduct ); 

router.delete('/products/:id',deleteProduct )




export default router;

