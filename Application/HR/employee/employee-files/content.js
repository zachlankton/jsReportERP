const jsreport = require('jsreport-proxy');
const cluster = require("mmp-couch");

async function beforeRender(req, res) {
    const first = req.data.user.firstName;
    const last = req.data.user.lastName;
    const user = `${last}_${first}`; // Used to lock out access to Employee folders (See Line 10)

// Get Folder that is marked for All Employees
    const ae_folder = await jsreport.documentStore.collection('folders').find({name:'ALL_EMPLOYEES'});
    const ae_folderID = ae_folder[0].shortid;
    const ae_folder_docs = await jsreport.documentStore.collection('assets').find({folder:{shortid:ae_folderID}});

// Get Employee's Folder - Named after the Employee (lastName_firstName)
    const folder = await jsreport.documentStore.collection('folders').find({name:user});
    const folderID = folder[0].shortid;

// Get all sub-folders
    const subfolders = await jsreport.documentStore.collection('folders').find({folder:{shortid:folderID}});
    subfolders.sort((a, b) => (a.name < b.name) ? -1 : 1);  // Sort Sub-Folders Alphabetically b/c default sorts by ID
// Current sub-folder order
// 1 - Other_Docs
// 2 - Pay_Stubs

// Get assets from Other_Docs folder
    const otherFolderID = subfolders[0].shortid;
    const otherDocs = await jsreport.documentStore.collection('assets').find({folder:{shortid:otherFolderID}});

// Get assets from Pay_Stubs folder
    const stubsFolderID = subfolders[1].shortid;
    const stubs = await jsreport.documentStore.collection('assets').find({folder:{shortid:stubsFolderID}});
    stubs.sort((a, b) => (a.name < b.name) ? 1 : -1);  // Sort Newest to Oldest [lastName_firstName_YYYY-MM-DD]

// Set data to variables for use with Handlebars
    req.data.aeDocs = ae_folder_docs;
    req.data.stubs = stubs;
    req.data.otherDocs = otherDocs;

    // ========= Use code below to see the items pulled in the console ==============

    // console.log("====== Employee Files Script =======");
    // console.log("---------------------- Parent Folder ----------------------");
    // console.log(folder[0].name+"  ( "+folder[0].shortid+" )");
    // console.log("------------------------ subfolder ------------------------")
    // subfolders.forEach(element => console.log(element.name+"  ( "+element.shortid+" )"));
    // console.log("--------------------- Assets (Pay Stubs) ------------------")
    // stubs.forEach(element => console.log(element.name+"  ( "+element.shortid+" )"));
    // console.log("-------------------- Assets (Other Docs) ------------------")
    // otherDocs.forEach(element => console.log(element.name+"  ( "+element.shortid+" )"));
    // console.log("====================================");

}
