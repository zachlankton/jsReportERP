function lineNo(idx){ return idx + 1 }

function trNotes(notes){
    notes = notes.split("\n");
    var trNotes = "";
    notes.forEach(function(note){
        trNotes += `<tr><td class="w3-xxxlarge">${note}</td></tr>`
    })
    return new Handlebars.SafeString(trNotes);
}