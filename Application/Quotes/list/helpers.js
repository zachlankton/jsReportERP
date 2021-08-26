function form(id){
    return `/Quotes/form?docid=${docid}`;
}

function pdf(id){
    return `/Quotes/pdf?docid=${docid}`;
}

function del(id){
    return `/Quotes/delete?docid=${docid}`;
}

function defineSearch(vari, val, options){
    this[vari] = this[vari] || val;
    const searchTerm = this[vari];
    options.data.root.searchQuery = "";
    
    if (searchTerm != ""){

    console.log(searchTerm);
    options.data.root.searchQuery = `
        AND SEARCH(mmp, '${searchTerm}', {"index":"mmp_search_en"})
        `
    }
}

function clicker(){
    docid = this.docid;
    return new Handlebars.SafeString(`style="cursor:pointer" onclick="location.href='/Quotes/form?docid=${docid}'" `);
}

function getToday(options) {
    var today = new Date().toLocaleDateString("en-CA");
    options.data.root.today = `"${today}"`;
}

function getNextWeek(options){
    var d = new Date();
    d.setDate(  d.getDate() + 7);
    var nextWeek = d.toLocaleDateString("en-CA");

    options.data.root.nextWeek = `"${nextWeek}"`;
}