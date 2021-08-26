function onclickPDF(options){
    var url = options.data.root.baseURL;
    var docid = options.data.root.query.docid;
    const rev = this.rev;
    return new Handlebars.SafeString(`onclick="location.href='${url}/pdf?docid=${docid}&rev=${rev}'"`);
}

function onclickDelete(options){
    var url = options.data.root.baseURL;
    var docid = options.data.root.query.docid;
    return new Handlebars.SafeString(`onclick="location.href='${url}/delete?docid=${docid}'"`);
}

function onclickGoBackToList(options){
    var url = options.data.root.baseURL;
    var docid = options.data.root.query.docid;
    return new Handlebars.SafeString(`onclick="location.href='${url}/list'"`);
}

function generate_nav_links(){
    const docid = this.docid;
    const curRev = this.rev;
    const lastRev = this.latestRev
    const prevRev = Math.max(curRev - 1, 1);
    const nextRev = Math.min(curRev + 1, lastRev);
    const prevQuery = `docid=${docid}&rev=${prevRev}`;
    const nextQuery = `docid=${docid}&rev=${nextRev}`;
    const prevLink = `<a href="?${prevQuery}">&lt;--</a>`;
    const nextLink = `<a href="?${nextQuery}">--&gt;</a>`;
    return new Handlebars.SafeString(prevLink + " " + nextLink);
}