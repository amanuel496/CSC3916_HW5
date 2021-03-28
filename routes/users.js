const router = require('express').Router();
let User = require('../models/Users');
const jwt = require('jsonwebtoken');

var bodyParser = require('body-parser');
var passport = require('passport');
//var authController = require('./auth');
//var authJwtController = require('../auth_jwt');
//db = require('./db')(); //hack
//var jwt = require('jsonwebtoken');
// var cors = require('cors');
const bcrypt = require("bcrypt-nodejs");



router.post('/signup', function(req, res) {
    if (!req.body.name || !req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include name, username and password to signup.'})
    } else {
        //console.log("inside the first else");
        // User = {
        //     username: req.body.username,
        //     password: req.body.password
        // };

      const username = req.body.username;
        User.findOne({username: username})
            .then(user => {
                let errors = {};
                if(user) {
                    if(user.username === req.body.username){
                        errors.username = "already exists";
                    }
                    return res.status(400).json(errors);
                }
                else {
                  //  const { name, username, password } = req.body;
                    const createdUser = new User({
                        name: req.body.name,
                        username: req.body.username,
                        password: req.body.password
                    });
                    try {
                        createdUser.save()
                    } catch (err) {
                    }
                    // let token;
                    // token = jwt.sign(
                    //     {name: createdUser.name, email: createdUser.username},
                    //     process.env.SECRET_KEY
                        // { expiresIn: '1h' });
                    // );
                    res.status(201).json({ success: true, msg: 'Successfully created new user.'});

                    // db.save(newUser); //no duplicate checking
                    // res.json({success: true, msg: 'Successfully created new user.'})
                }}).catch(err => {
            return res.status(500).json({
                error: err
            })
        });
}});

router.post('/signin', function (req, res) {
//     //var user = db.findOne(req.body.username);
//
//     if (!user) {
//         res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
//     } else {
//         if (req.body.password == user.password) {
//             var userToken = { id: user.id, username: user.username };
//             var token = jwt.sign(userToken, process.env.SECRET_KEY);
//             res.json ({success: true, token: 'JWT ' + token});
//         }
//         else {
//             res.status(401).send({success: false, msg: 'Authentication failed.'});
//         }
//     }
// });

    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signin.'})
    } else {
        console.log("inside the second else");
        // User = {
        //     username: req.body.username,
        //     password: req.body.password
        // };

        const username = req.body.username;
        const password = req.body.password;
        User.findOne({username: username})
            .then(user => {
                        if(user.username === req.body.username){
                            console.log(password);
                            console.log(user.password);
                        //    console.log("user exists");
                            bcrypt.compare(req.body.password, user.password, (err, isMatch)=>{
                                if(err) return res.status(500).json({
                                    error: err
                                })
                                if(isMatch){
                                    console.log("user exists");
                                    let token;
                                    token = jwt.sign(
                                        { name: user.name, email: user.username },
                                        process.env.SECRET_KEY,
                                        //{ expiresIn: '1h' }
                                    );
                                    return  res.status(200).json({ token: token, userId: user.id });
                                }
                                else  return res.status(400).json('Invalid credentials, could not log you in.');




                            })
                        } else  return res.status(400).json('Invalid credentials, could not log you in.');
                    }).catch(err => {
            return res.status(500).json({
                error: err
            })
        });
    }});
module.exports = router;