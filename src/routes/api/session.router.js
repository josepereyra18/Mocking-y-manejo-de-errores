import { Router } from "express";
import passport from "passport";
import { register, faillogin, failregister, logout, login, githubcallback } from "../../controllers/sessionController.js";

const router = Router();


router.post('/register', passport.authenticate('register', {failureRedirect : 'failregister'}),register);

router.get('/failregister', failregister);

router.post('/login', passport.authenticate('login', {failureRedirect: 'faillogin'}) , login);

router.get('/faillogin', faillogin);

router.get('/logout', logout);

router.get('/github', passport.authenticate('github',{scope:["user:email"]}), async(req,res)=>{ });

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), githubcallback)


export default router;
