function prettyDate(d){
    var nd = new Date(d);
    var prettyDate = nd.toLocaleString('en-US', {
        timeZone: 'America/Detroit'
    });
    return prettyDate;
}

function dSpan(name){
    return new Handlebars.SafeString(`<span name="${name}">${this[name] || ""}</span>`);
}

function dSpanPre(name){
    return new Handlebars.SafeString(`<span style="white-space:break-spaces;" name="${name}">${this[name] || ""}</span>`);
}

function dSpanKey(name){
    var key = this[name] || "";
    key = key.split(".").join("\n");
    return new Handlebars.SafeString(`<span style="white-space:break-spaces;" name="${name}">${key || ""}</span>`);
}

function row() {
    const args = arguments;
    const argLen = args.length;
    var options = args[argLen - 1];
    var extraClasses = argLen > 1 ? args[0] : "";
    return new Handlebars.SafeString(`
        <div class="w3-row ${extraClasses}"> ${options.fn(this)} </div>
    `);
}

function col(extraClasses, options) {
    return new Handlebars.SafeString(`
        <div class="w3-col ${extraClasses}"> ${options.fn(this)} </div>
    `);
}

function arrayOfStrings(name, property) {
    var arrOfObjects = this[name];
    if (!arrOfObjects.forEach) return "";
    var arr = [];
    arrOfObjects.forEach(function(obj) {
        arr.push(obj[property])
    });
    this[name] = arr;
}

function log(elm) {
    console.log(elm);
}



function hidden(name){
    return new Handlebars.SafeString(`<input type="hidden" name="${name}" value="${this[name]}"/>`)
}

function dDataEach(contextName, label, options) {
    var context = this[contextName] || [];
    options.data.index = "";
    var ret = "";

    if (context.length == 0) {
        ret = `<div d-data name="${contextName}"> ${options.fn(this)} </div>`
    }

    for (var i = 0, j = context.length; i < j; i++) {
        options.data.index = i + 1;
        ret = ret + `<div d-data name="${contextName}"> ${options.fn(context[i])} </div>`;
    }

    var btn = label != "" ? addButton(label, contextName) : "";

    options.data.index = "";
    return new Handlebars.SafeString(`
        ${ret}  
        ${btn}
        `);
}

function fix_jsreport_child_template_percent_sign_bug(id, options){
    return new Handlebars.SafeString(`
        <script>
            // this removes the text node that contains a % percent sign
            document.currentScript.previousSibling.remove();
            document.currentScript.remove();
        </script>
    `);

    
}