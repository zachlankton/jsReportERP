/*
    This authorization code looks for the JSON Web Token (jwt)
    If present it is verified using our key
    If verified the user details are then fetched from the auth provider (Fusion-Auth  https://fusionauth.io/)
    The "req.data.user.isAuthenticated" is then set to true for use downstream in templates or otherwise.
    Access to specific content can then be controlled in templates by checking for this as well as user roles
    ifHasRole Helper is implemented here: /Helpers/hasRoleHelper.js/content.js
    
    (API Keys have been redacted)
*/

const {FusionAuthClient} = require('@fusionauth/node-client');
const apiKey = 'REDACTED';
const client = new FusionAuthClient(apiKey, 'REDACTED');

const util = require("util");
var jwt = require('jsonwebtoken');
var cookie = require('cookie');

async function beforeRender(req, res) {
    if (req.data.user) return;
    if (!req.context.http) return;

    req.fusion = {};
    req.fusion.client = client; 
    
    const query = req.context.http.query;
    const cookieStr = req.context.http.headers.cookie || "";
    req.data.query = query;
    req.data.method = req.context.http.headers['request-method'];
    req.data.path = req.context.currentFolderPath;
    req.data.uri = req.context.http.headers.uri;

    req.data.user = {};
    req.data.user.isAuthenticated   = false;
    req.data.user.email             = "";
    req.data.user.username          = "";
    req.data.user.roles             = [];

    var cookies = cookie.parse(cookieStr);
    try {
        var user_token = jwt.verify(cookies.access_token, 'REDACTED');    
    } catch (err) {
        console.log(err);
    }

    if (user_token != undefined){
        req.data.user.isAuthenticated   = true;
        req.data.user.email             = user_token.email;
        req.data.user.username          = user_token.preferred_username;
        req.data.user.firstName         = user_token.first_name;
        req.data.user.lastName         = user_token.last_name;
        req.data.user.roles             = user_token.roles || [];
        req.data.user.id                = user_token.sub.substr(0,4);

        // Retrieve User by Email Address
        try {
            const user_data = await client.retrieveUserByEmail(user_token.email);
            const user_info = user_data.successResponse.user;
            req.data.user.birthDate = user_info.birthDate;
            req.data.user.firstName = user_info.firstName;
            req.data.user.lastName  = user_info.lastName;
            req.data.user.mobilePhone = user_info.mobilePhone
        }catch(e){
            console.log("========Fusion Error retrieveUserByEmail=======");
            console.log(e);
            console.log("========Fusion Error retrieveUserByEmail=======");
        }
        

        
    }
    
    
    
}
