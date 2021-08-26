function processRunningTotals(options){
    totalIndex = {}
    if (this.ledger.first_error_message){
        return this.ledger.first_error_message;
    }
    this.ledger.forEach( function(entry){
        if (entry.location == null){entry.location = "null"}
        var index = `${entry.partNo}-${entry.partRev}-${entry.partStatus}-${entry.location}`;
        totalIndex[index] = totalIndex[index] || 0;
        totalIndex[index] += entry.qty;
        entry.runningTotal = totalIndex[index];
    } )
}

function form(id){
    return `/Sales/form?docid=${docid}`;
}

function pdf(id){
    return `/Sales/pdf?docid=${docid}`;
}

function del(id){
    return `/Sales/delete?docid=${docid}`;
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
    return new Handlebars.SafeString(`style="cursor:pointer" onclick="location.href='/Sales/form?docid=${docid}'" `);
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