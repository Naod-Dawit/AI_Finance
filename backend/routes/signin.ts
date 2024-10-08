import express from 'express'
import  signin  from '../controllers/SigninController';


const router=express.Router();

router.post('/api/signin',signin)

export default router