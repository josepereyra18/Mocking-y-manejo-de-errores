import passport from "passport";
import local from "passport-local";
import User from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";
import Cart from "../dao/models/cart.model.js";


const LocalStrategy = local.Strategy;
const initializepassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, age, email } = req.body;
            try {
                let newUser
                let user = await User.findOne({ email: username });
                if (user){
                    console.log ("el usuario ya existe")
                    return done(null, false)
                }
                let cart = await Cart.create({})
                if (email ==="admin@coder.com" && password === "Cod3r123"){
                    newUser = new User({
                        first_name, 
                        last_name, 
                        email, 
                        password: createHash(password), 
                        age, 
                        isAdmin: 'admin'});
                    
                }else{
                    newUser = new User({
                        first_name,
                        last_name, 
                        email, 
                        password: createHash(password), 
                        age,
                        cartId: cart._id});
                }
                let result = await User.create(newUser);
                cart.userId = result._id;
                await cart.save();
                return done(null, result)
            } catch (error) {
                return done("Error al obtener el usuario " + error)
            }
        }
    ));

    passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username, password, done) =>{
        try {
            const user = await User.findOne({email: username});
            if (!user){
                console.log("Usuario no encontrado")
                return done(null, false)
            }
            if (!isValidPassword(user, password)){
               return done(null, false) 
            } 

            return done(null, user)
        }catch (error) {
            return done("Error al obtener el usuario " + error)
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: "Iv23liVLQvrMmFomDdSm", 
        clientSecret: "8601951c22332cbc1f0f8926516e8ecc6318e665",
        callbackURL: "http://localhost:8080/api/session/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try{
            console.log(profile)
            let user = await User.findOne({email:profile._json.email});
            if (!user){
                let newUser ={
                    first_name: profile._json.name,
                    last_name:"",
                    email: profile._json.email,
                    age: 18,
                    password:""
                    
                }
                let result = await User.create(newUser);
                done(null, result)
            }else{
                done(null, user)
            }
        }catch(error){
            return one(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    })
    

};


export default initializepassport;