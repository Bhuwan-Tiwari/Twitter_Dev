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
}

}