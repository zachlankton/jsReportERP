async function beforeRender(req, res) {
    var ts = Date.now();
    req.data.serverTime = ts;
}