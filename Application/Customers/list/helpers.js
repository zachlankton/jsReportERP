function form(id){
    return `/Customers/form?docid=${docid}`;
}

function pdf(id){
    return `/Customers/pdf?docid=${docid}`;
}

function del(id){
    return `/Customers/delete?docid=${docid}`;
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
    return new Handlebars.SafeString(`style="cursor:pointer" onclick="location.href='/Customers/form?docid=${docid}'" `);
}

