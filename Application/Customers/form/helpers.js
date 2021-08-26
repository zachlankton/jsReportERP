
function dSpanPrettyDate(name){
    var d = this[name] || "";
    var nd = new Date(d);
    var prettyDate = nd.toLocaleString('en-US', {
        timeZone: 'America/Detroit'
    });
    return new Handlebars.SafeString(`<span name="${name}">${prettyDate || ""}</span>`); 
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