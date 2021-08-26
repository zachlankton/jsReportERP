const jsreport = require('jsreport-proxy');
const cluster = require("mmp-couch");

async function beforeRender(req, res) {

    if (req.context.http.query.nowrap != undefined) {
        return;
    }
    const assets = await jsreport.documentStore.collection(
        'templates').find({
        shortid: '7B0b2_rnuu'
    });

    var main_wrapper = assets[0].content;

    req.template.content = main_wrapper.replace(
        "$$$page_content$$$", req.template.content);

}