function lineNo(idx){ return idx + 1 }

function trNotes(notes){
    notes = notes.split("\n");
    var trNotes = "";
    notes.forEach(function(note){
        trNotes += `<tr><td class="w3-xxxlarge">${note}</td></tr>`
    })
    return new Handlebars.SafeString(trNotes);
}

function check_if_request_for_revision(){
    console.log("====================check rev===================");
    console.log(this.oldrev);
    const revQuery = this.query.rev;
    const latestRev = this.quote[0].rev;
    this.quote[0].latestRev = latestRev;
    if (revQuery && revQuery != latestRev){
        this.oldrev[0].latestRev = latestRev;
        this.quote = this.oldrev
    }
}
