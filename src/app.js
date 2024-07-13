import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import productsRouter from './routes/api/products.route.js'
import cartRouter from './routes//api/carts.route.js'
import mongoose from 'mongoose';
import productsModel from '../dao/models/products.model.js'
import cartModel from '../dao/models/cart.model.js';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import sessionRouter from './routes/api/session.router.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';  
import passport from 'passport';
import initializepassport from './middlewares/passport.config.js';
import sharedSession from 'express-socket.io-session';


const app = express();

const PORT = process.env.PORT_LIVE;
const httpServer = app.listen(PORT, console.log(`Server is running on port ${PORT} 
    url :${process.env.MONGO_URL}`));
const socketServer = new Server(httpServer);
const sessionMiddleware = session(
    {secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL})
})

app.use(sessionMiddleware)


socketServer.use(sharedSession(sessionMiddleware, {
    autoSave: true
}));

mongoose.connect(process.env.MONGO_URL).then(
    () => {console.log('Conectado a la base de datos')}).catch(error => console.log("error en la conexion ", error))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.engine('handlebars', handlebars.engine({
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));


initializepassport();
app.use(passport.initialize());
app.use(passport.session());


app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/api', productsRouter);
app.use('/api', cartRouter);
app.use('/api/session', sessionRouter);
app.use('/', viewsRouter);


socketServer.on('connection', async socket => {
    const session = socket.handshake.session;
    console.log('Un cliente se ha conectado');
    //socket agregar productos al carrito 

    if (session && session.user && session.user.cartId) {
        const cartId = session.user.cartId;
        console.log('Cart ID from session:', cartId);
        socket.emit('cartId', cartId);
    }


    socket.on ('agregarProducto', async (productId, cartId) => {
        let producto = await productsModel.findOne({_id:productId});
        let carrito = await cartModel.findOne({_id:cartId});

        if (await cartModel.findOne({_id: cartId , products: {$elemMatch: {product:productId}}})){
            carrito.products.find(prod => prod.product.toString() === producto._id.toString()).quantity++;
        }else{
            carrito.products.push({product:productId , quantity: 1});
        }
        
        await cartModel.updateOne({_id:cartId}, carrito);
        socket.emit('productoAgregado', producto);
    })
    
})
