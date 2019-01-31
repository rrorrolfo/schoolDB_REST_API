const { User } = require("../models");
const bcryptjs = require("bcryptjs");
const authenticator = require("basic-auth");

const authentication = {
    "authenticateUser": // Validation middleware
    function (req, res, next) {
    
        // Parses users credentials from Authorization header.
        const credentials = authenticator(req);
        let message = "";
    
        if (credentials) {
            // Attemps to find one user from DB that matches the email provided
            User.findOne( {emailAddress: credentials.name}, null, (err, user) => {
            
                    if (user) {
                        // Compares provided password with the one stored in DB for the user found 
                        const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
    
                        if(authenticated) {
                            // If the passwords match then the user is stored in the currentUser property of the req object
                            console.log(`Authentication successful for username: ${user.firstName}`);
                            req.currentUser = user;
                            
                        } else {
                            message = `Authentication failure for email ${user.emailAddress}`;
                        }
    
                    } else {
                    message = `User not found for ${credentials.name}`;
                    }
    
                // If there is an error, a message is returned and logged to console, status 401 is sent
                if(message) {
                    console.warn(message);
                    res.status(401).json({message: "Access Denied"});
                } else {
                    next();
                }
    
            }); // Finished working with the user to authenticate
    
        // If credentials not found - authentication header
        } else {
            message = "Authentication header not found";
            console.warn(message);
            res.status(401).json({message: "Authentication header not found"});
        } 
    
    } // Finished authentication function
}

module.exports.authentication = authentication; 