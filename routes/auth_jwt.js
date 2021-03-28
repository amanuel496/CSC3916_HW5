var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/Users');

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.find({name: jwt_payload.name}).then(user => {
        done(null, user);
    }).catch(err => {
        console.log(jwt_payload);
        done(null, false);
    });

}));
exports.isAuthenticated = passport.authenticate('jwt', { session : false });
exports.secret = opts.secretOrKey ;