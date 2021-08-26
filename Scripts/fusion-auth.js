#!/usr/bin/env node


const express = require('express')();
const router = express;
var http = require('http');
var cookieParser = require('cookie-parser');
express.use(cookieParser());

var bodyParser = require('body-parser');
express.use(bodyParser.json());
express.use(bodyParser.urlencoded({ extended: true }));

const {FusionAuthClient} = require('@fusionauth/node-client');
const clientId = 'REDACTED';
const clientSecret = 'REDACTED';
const apiKey = 'REDACTED';
const client = new FusionAuthClient(apiKey, 'REDACTED');
express.set('etag', false)

/* GET home page. */
router.get('/', function (req, res, next) {
  const roleRequired = req.header('x-role-required');
  client.introspectAccessToken(clientId, req.cookies.access_token).then(
    (response) => {
      const userIsNotRegisteredToApplication  = response.successResponse.applicationId != clientId ;
      const tokenIsActive                     = response.successResponse.active;
      const userRoles                         = response.successResponse.roles || [];
      const userHasRequiredRole               = userRoles.indexOf(roleRequired) > -1 ;
      const requiredRoleIsAny                 = roleRequired == "any" || roleRequired == undefined ;
      
      if ( tokenIsActive && (userHasRequiredRole || requiredRoleIsAny ) ){
        client.retrieveUserByEmail(response.successResponse.email).then( (userData) => {
                response.successResponse.userData = userData;
                return res.status(200).send(response);
        } )
        // return res.status(200).send(response);
        return 0;
      }
      
      if ( tokenIsActive && userIsNotRegisteredToApplication) {
        return res.status(403).send("Forbidden");
      }
      
      res.status(401).send("Unauthenticated")
      
      
    }
  ).catch( (err)=>{console.log(err); res.status(401).send("Unauthorized");} );


});

router.get("/unauthorized", function(req, res, next){
  res.send("<h3>You do not have permission to access this resource.</h3>  <h4>Either you do not have the role required to access this resource or you are not registered to use this application</h4>")
});

router.get("/login", function(req, res, next){
  res.sendFile(`${__dirname}/login.html`);
});

router.post('/login', function(req, res, next){
  const reqObject = {
    applicationId: clientId,
    loginId: req.body.user,
    password: req.body.pw
  };
  client.login(reqObject).then(
    (response) => {
  
      res.cookie('access_token', response.successResponse.token, {httpOnly: true, domain: ".mmpmg.com"});
      res.redirect(302, req.query.redirect);

    }
  ).catch((err) => {res.status(401).send("Invalid Login"); console.log("in error"); console.log(err); console.error(JSON.stringify(err));});
});

router.get("/logout", function(req, res, next){
  client.logout(true);
  res.cookie('access_token', '', {httpOnly: true, domain: ".mmpmg.com"});
  res.send("Logged Out");
});

/* OAuth return from FusionAuth */
router.get('/oauth-redirect', function (req, res, next) {

  
   client.exchangeOAuthCodeForAccessToken(req.query.code,
                                          clientId,
                                          clientSecret,
                                          'http://formio.mmpmg.com:3000/oauth-redirect')
       .then((response) => {
         
         res.cookie('access_token', response.successResponse.access_token, {httpOnly: true, domain: ".mmpmg.com"});
         res.redirect(302, '/');
       }).catch((err) => {console.log("in error"); console.log(err); console.error(JSON.stringify(err));});
});

//express.set('port', 3000);
var server = http.createServer(express);
server.listen(3000);
