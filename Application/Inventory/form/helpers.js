function log(elm) {
    console.log(elm);
}

function prettyDate(d){
    var nd = new Date(d);
    var prettyDate = nd.toLocaleString('en-US', {
        timeZone: 'America/Detroit'
    });
    return prettyDate;
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

function dSpanPrettyDate(name){
    var d = this[name] || "";
    var nd = new Date(d);
    var prettyDate = nd.toLocaleString('en-US', {
        timeZone: 'America/Detroit'
    });
    return new Handlebars.SafeString(`<span name="${name}">${prettyDate || ""}</span>`); 
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

function removeBtn() {
    return new Handlebars.SafeString(`
        <button class="w3-btn w3-tiny w3-red w3-padding-small w3-right" 
                style="margin-left: 2px;" 
                onclick="dData.remove(this)">x</button>
    `);
}

function addButton(label, name) {
    return new Handlebars.SafeString(`
        <button class="w3-btn w3-right w3-green w3-margin" 
                onclick="dData.add('${name}', this)">${label}</button>
    `);
}

function textarea(label, name, options) {
    return new Handlebars.SafeString(`
    <p>
        <label> ${label} </label>
        <textarea   class="w3-input w3-border w3-round w3-padding-small" 
                    style="resize:none; height:150px;"
                    name="${name}" 
                >${this[name] || ""}</textarea>
    </p>
    `);
}

function smalltext(label, name, options) {
    return new Handlebars.SafeString(`
    <p>
        <label> ${label} </label>
        <textarea   class="w3-input w3-border w3-round w3-padding-small" 
                    style="resize:none; height:100px;"
                    name="${name}" 
                >${this[name] || ""}</textarea>
    </p>
    `);
}

function input() {
    const args = arguments;
    const argLen = args.length;
    var options = args[argLen - 1];
    var label = argLen > 2 ? args[0] : "";
    var endLabel = "";
    var name = argLen > 2 ? args[1] : args[0];

    if (label) {
        label = `<p><label> ${label} </label>`;
        endLabel = "</p>";
    }
    return new Handlebars.SafeString(`
        ${label}
        <input  class="w3-input w3-border w3-round w3-padding-small" 
                name="${name}" 
                value="${this[name] || ""}"
        />
        ${endLabel}
    `);
}

function date(label, name, options) {
    var d = new Date(this[name]);
    this[name] = d.toLocaleDateString("en-CA");
    return new Handlebars.SafeString(`
    <p>
        <label> ${label} </label>
        <input  class="w3-input w3-border w3-round w3-padding-small" 
                type="date"
                name="${name}" 
                value="${this[name] || ""}"
        />
    </p>
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

function datalist(label, name, list, options) {
    var listItems = options.data.root[list];
    if (!listItems.forEach) return "";
    var listItemStr = "";
    listItems.forEach(function(item) {
        listItemStr += `<option value="${item}">`
    })
    return new Handlebars.SafeString(`
    <p>
        <label> ${label} </label>
        <input  class="w3-input w3-border w3-round w3-padding-small" 
                list="${list}"
                name="${name}"
                onblur="this.reportValidity()" 
                value="${this[name] || ""}"
        />

        <datalist id="${list}">
            ${listItemStr}
        </datalist>
    </p>
    `);
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
function select(label, name, options){
    var context = this[name];
    return new Handlebars.SafeString(`
    <p>
        <label>${label}</label>
        <select name="${name}" class="w3-input w3-border w3-round w3-padding-small" >
            ${options.fn(context)}
        </select>
    </p>
    `);
}

function opt(value){
    var selected = "";
    if (this == value) selected = "selected";
    return new Handlebars.SafeString(`<option value="${value}" ${selected}>${value}</option>`);
}

function isSel(context, value){
    if (context == value) return `selected`;
}