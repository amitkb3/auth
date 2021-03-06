const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
   //subject and issued at time 
     return jwt.encode(
     { 
        sub: user.id,
        iat: timestamp
     },
     config.secret
  );
}

exports.signin = function(req, res, next) {
   // User has already had their email and password auth'd
   // we just need to give them a token
   res.send( { token: tokenForUser(req.user) });
}

// function tokenForUser(user) {
//    const timestamp = new Date().getTime();
//    //subject and issued at time
//    const userid = user['_id'];
//    return jwt.encode({ sub: userid, iat: timestamp }, config.secret);
//  }

exports.signup = function(req,res,next) {

   //Pull off email and password from incoming request
   const email = req.body.email;
   const password = req.body.password;

   if(!email || !password) {
      return res.status(422).send({ 
         error: 'You must provide email and password'
      });
   }

   // See if a user with a given email exist
    User.findOne({ email: email }, function(err, existingUser) {
      // connection with database failed
      if (err) {return next(err); }

      // If a user with email does exist, return error
      if(existingUser) {
         return res.status(422).send({ error: 'Email is in use'});
      }

      //  If a user with email does NOT exist, create and save record
      const user = new User({
          email: email,
          password: password
      });

      user.save(function(err) {
        if (err) { return next(err); }
      });
      // Respond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    }); 

}