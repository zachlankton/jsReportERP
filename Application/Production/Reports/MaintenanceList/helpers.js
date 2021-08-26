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