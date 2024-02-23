import UserService from "../services/user-service.js";

const userService = new  UserService();

export const signup = async (req,res)=>
{
    
try {
    const response = await userService.signup({
        email:req.body.email,
        password:req.body.password,
        name:req.body.name

    })
    return res.status(200).json({
        success: true,
        data:response,
        err:{},
        message:"successfully create a new user"
    })

} catch (error) {
   return res.status(500).json({
        success:false,
        data:{},
        err:error,
        message:"something went wrong"
    })
}}
  export const login = async (req,res)=>
  {
    try {
        const token = await userService.signin(req.body.email,req.body.password)
        return res.status(200).json({
            success:true,
            data:token,
            message:'sucessfully logged in',
            err:{}
           
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            data:{},
            err:error,
            message:"something went wrong"
        })
    }
  }

