import { UserRepository } from '../repository/index.js'

class UserService {
    constructor() {
        this.userRepository = new UserRepository
    }
async signup(data)
{
    try {
        const user = await this.userRepository.create(data)
        return user
    } catch (error) {
        console.log(error)
    }
}

async getUserByEmail(email)
{
    try {
        const user = await this.userRepository.findBy({email})
        return user
    } catch (error) {
        console.log("something went wrong ")
    }
}
async signin(email,password)
{
    try {
        const user = await this.getUserByEmail(email)
         if(!user)
         {
           throw {
            message:'no user found',
            success:false
           }
        }
        if(!user.comparePassword(password))
        {    throw{
                message:'incorrect password',
                success:false
            }
        }
        const token = user.genJWT()
        return token
    } catch (error) {
        throw error
    }
}

}

export default UserService