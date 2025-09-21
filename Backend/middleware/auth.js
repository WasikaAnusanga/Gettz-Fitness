import jwt, { decode } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
function verifyJWT(req,res,next){
    const header = req.header("authorization");
    if(header != null){
        const token = header.replace("Bearer ","")
        jwt.verify(token,process.env.JWT_KEY,(err,decoded)=>{
            if(decoded !=null){
                req.user = decoded;
                
            }
        })
    }
    next()
}
export default verifyJWT;
