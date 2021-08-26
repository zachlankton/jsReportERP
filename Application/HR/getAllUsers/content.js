// CODE TO GET ALL USERS!
const {FusionAuthClient} = require('@fusionauth/node-client');
const apiKey = 'OacLvgaoOGctEKvJQJI8RTVA3Qz-l7dCw_8TWDn08es';
const client = new FusionAuthClient(apiKey, 'http://10.10.10.70:9011');
const cluster = require("mmp-couch");
const Handlebars = require("handlebars");
const nodemailer = require('nodemailer');

// =============  Test of Handlebars Helper in Script ===============
Handlebars.registerHelper('niceDate', function (ms, options) {
        var date = new Date(ms);
        return date.toString();
    });
// ==================================================================


// ============  Map Object Function ================================
    function mapOBJ(objToMap) {
        var path = [];
        var newObj = {};
        Object.assign(newObj,objToMap);

        function itterateObj(objToItt) {
            if(typeof(objToItt) != "object") {   // If is only value
                // mapArr.push({path:path.join(""),value:obj});
                eval("newObj" + path.join("") +"={_value:objToItt,_path:path.join('')}");  // Change Value to an object with _value and _path keys
            }

            if(typeof(objToItt) === "object") {
                if(Array.isArray(objToItt)) {  // If is Array
                    for (idx in objToItt) {
                        path.push("["+idx+"]");
                        itterateObj(objToItt[idx]);
                        path.pop();
                    }
                    return objToItt;                        
                } else { // If is Object
                    for (key in objToItt) {
                        path.push("['"+key+"']");
                        itterateObj(objToItt[key]);
                        path.pop();
                    }
                    return objToItt;
                }
            }

        } // End itterateObj

        itterateObj(objToMap);

        return newObj;
    }  // ===============================================================


// =======================  Begin beforeRender function =============
async function beforeRender(req, res) {

    if (req.context.http.query.nowrap != undefined) {
        return;
    }

// Query Users from FUSION ------------------------------------------
    const users = await client.searchUsersByQuery({
        search: {
            queryString: "*"
        }
    });

// Flatten out FUSION object for ease of use
    let fusionArray = users.successResponse.users.map(obj => {
        let rObj = {};
        rObj.id        = obj.id.substr(0,4);
        rObj.active    = obj.active;
        rObj.username  = obj.username;
        rObj.email     = obj.email;
        rObj.firstName = obj.firstName;
        rObj.lastName  = obj.lastName;
        rObj.fullName  = obj.fullName;

// Getting user roles and lastLoginInstant timestamp
        for(var i=0; i<obj.registrations.length; i++) {
            if(obj.registrations[i].applicationId == '2909695c-d633-4a21-ad58-444d62fbca29') {
                rObj.roles = obj.registrations[i].roles;
                rObj.lastLogin = obj.registrations[i].lastLoginInstant;
            }

        }

        return rObj;  // Return constructed object to fusionArray variable
    });
// ------------------------------------------------------------------

// Query DB for additional info on each employee --------------------

    let dbArray = [];

    try {
            let result = await cluster.query(
                "SELECT mmp.* FROM mmp WHERE meta(mmp).id LIKE '/HR/employees/%'"
            );
            if (result.rows.length == 0){
                dbArray = [{}];
            }else{
                //console.log("getAllUsers results: ", result.rows[0]);
                dbArray = result.rows;
            }
        } catch (error) {
            console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
            console.log("getAllUsers.js - Query DB ERROR: ", error);
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        }
// ------------------------------------------------------------------

// ----------- FILTER Fusion Array for Role = Employee --------------
var filteredFA = fusionArray.filter(fusionObj => {if(fusionObj.roles.includes('Employee')){return fusionObj}});
//console.log("XXXXXX ",filteredFA);
// ------------------------------------------------------------------

// Merge fusionArray and dbArray when IDs match ---------------------
 let mergedArray = filteredFA.map(function (fusionUser, i) {
    let matchingInfo = dbArray.filter(function (dbUser) {
        return fusionUser.id.substr(0,4) == dbUser.docid;
    });

    if(matchingInfo > 1) {
        console.log("getAllUsers.js - DB has too many entries for " + fusionUser.fullName);
    } else if(matchingInfo < 1) {
        fusionArray[i].info = {};
    } else {
        // console.log("INFO No." + i + " ---->> ",mapOBJ(matchingInfo[0]));
        // console.log("-------------------------------------");
        filteredFA[i].info = mapOBJ(matchingInfo[0]);
    }


    return filteredFA[i];
});
// ------------------------------------------------------------------
    // console.log(">>>>>>>>>>>>>>>>>>>");
    // console.log(mergedArray);
    // console.log(">>>>>>>>>>>>>>>>>>>");

    req.data.users = mergedArray;

// ==================================================================
// ========  TEST - TO SEE IS NODEJS EMAIL IS WORKING ===============
// ==================================================================

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'gavin@mmpmg.com',
//     pass: '20Magnesium2336'
//   }
// });

// var mailOptions = {
//   from: 'gavin@mmpmg.com',
//   to: 'gavin@mmpmg.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log("ERROR: " + error + " ================");
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });

// // =================================================================
// console.log(">>>>>  TEST  <<<<<<<");
// console.log(transporter)
    
} // End beforeRender function ======================================


