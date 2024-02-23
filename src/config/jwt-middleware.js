//in authentication service first we verify token and if it is verficed then it get decoded,we get email and id from response token after varifcation
//and then we pass it to and get full user object and then we get its id by user.id
import JWT from 'passport-jwt';
import User from '../models/user.js';

const JwtStrategy = JWT.Strategy;
const ExtractJwt = JWT.ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'twitter_secret'
}

export const passportAuth = (passport) => {
    try {
        console.log("inside strategy");
        passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
            console.log("req sent to strategy");
            const user = await User.findById(jwt_payload.id);
            if(!user) {
                done(null, false);
            } else {
                done(null, user);
            }
        }));
    } catch(err) {
        console.log(err);
        throw err;
    }
    
}