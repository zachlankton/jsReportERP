
(function dDataPrototypeBuilder() {

    window.dData = {};
    window.dDataOriginals = {};
    window.dDataDocChanges = {};
    var templates = {}

    dData.templates = templates;
    dData.cacheTemplates = cacheTemplates;
    dData.addTemplate = addTemplate;
    dData.insertTemplate = insertTemplate;
    dData.add = add;
    dData.remove = remove;
    dData.dDataSet = dDataSet;
    dData.dDataGet = dDataGet;
    dData.templateObjects = {};
    dData.getObjectPath = getDDataPath;
    dData.getParent = getParent;
    dData.getObject = getObject;
    dData.save = save;
    dData.saveNew = saveNew;
    dData.testSave = testSave;  // This displays the object that will be pushed to the DB in the console

    // dData Document Change Listener and Logger
    document.addEventListener("change", changeHandler);

    function changeHandler(ev){
        var formPath = dData.getObjectPath(ev.target);
        var newVal = eval(`dData.${formPath}`);
        var oldVal = "";
        try {
            oldVal = eval(`dDataOriginals.${formPath}`)
        }catch(e){}

        // get the root d data element name
        var dDataRootName = formPath.split(".", 1)[0];

        // setup global doc changes object for that root d data element
        dDataDocChanges[dDataRootName] = dDataDocChanges[dDataRootName] || {};

        // remove the root name from the object path
        formPath = formPath.replace(`${dDataRootName}.`, "");

        // check if values end up the same after a change was already made and
        // delete original change log
        if (oldVal == newVal && dDataDocChanges[dDataRootName][formPath]){
            delete(dDataDocChanges[dDataRootName][formPath]);
        }else{

            // push change to the log
            dDataDocChanges[dDataRootName][formPath] = {oldVal, newVal};
            document.getElementById("dDataSaveBtn").disabled = false;
        }

        if (Object.keys( dDataDocChanges[dDataRootName] ).length === 0){
            document.getElementById("dDataSaveBtn").disabled = true;
        }
    }

    function cacheTemplates(specificElement) {
        specificElement = specificElement || document;
        var dDataElements = specificElement.querySelectorAll("[d-data]");
        var dDataLen = dDataElements.length;
        var placeholdersAdded = [];

        // first label all template parents and strip template ("d-data") elements from the DOM
        
        for (var i = 0; i < dDataLen; i++) {
            var elem = dDataElements[i];
            var name = elem.getAttribute("name");
            
            
            // for all d-data elements create a place holder div
            // a template-placeholder for templates to be reinserted after
            if (placeholdersAdded.indexOf(name) == -1){
                var div = document.createElement("div");
                div.setAttribute("template-placeholder", name);
                div.style.display = "none"
                elem.parentElement.insertBefore(div, elem);
                placeholdersAdded.push(name);
            }
                
           
            if (!isDDataChild(elem)) {
                // setup the dData Object
                setupDataObject(div, name);

                // get original data in template if any
                dDataOriginals[name] = JSON.parse(  JSON.stringify( dDataGet(elem) )  );
            } 
            
            
        }

        // start over with a cloned version of the specific element (or document)
        specificElement = specificElement.cloneNode(true);
        dDataElements = specificElement.querySelectorAll("[d-data]");

        for (i = 0; i < dDataLen; i++) {
            elem = dDataElements[i];
            name = elem.getAttribute("name");
            
            // // if this dData Element is Top Level than push to render list
            // // and add it to d-data Global
            // if (!isDDataChild(elem)) {
            //     templatesToRender.push(name);
            // } 
            
            // create an placeholder for object 
            // templates to show how d-data expects
            // the object to look (devloper helper)
            const data = Object.assign({}, dDataGet(elem));
            const cleanData = removeData(data);
            dData.templateObjects[name] = JSON.stringify(cleanData, null, '\t');
            
            elem.remove();
        }

        for (i = 0; i < dDataLen; i++) {
            elem = dDataElements[i];
            name = elem.getAttribute("name");
            createTemplate(elem, name);
        }

        // var tLen = templatesToRender.length;
        // for (i = 0; i < tLen; i++) {
        //     name = templatesToRender[i];
        //     dData[name] = {};
        // }

    }

    function createTemplate(element, name) {
        var template = document.createElement("template");
        template.content.appendChild(element);
        const cleanData = JSON.parse(dData.templateObjects[name]);
        dDataSet(element, cleanData);
        templates[name] = template;
    }

    function removeData(data){
        const keys = Object.keys(data);
        keys.forEach(function(key){
            const isStr = typeof( data[key] ) == "string";
            const isArr = Array.isArray( data[key] );
            const isObj = !isStr && !isArr;

            if ( isStr ) data[key] = "";
            if ( isArr ) data[key] = [];
            if ( isObj ) data[key] = {};
        })
        return data;
    }

    function isDDataChild(elem) {
        var isChild = false;
        while (elem.parentElement != null) {
            if (elem.parentElement.hasAttribute("d-data")) {
                isChild = true;
                break;
            }
            elem = elem.parentElement;
        }
        return isChild;
    }

    function setupDataObject(elem, name) {

        Object.defineProperty(dData, name, {
            get,
            set
        });

        function get() {
            return dDataGet(elem.nextElementSibling);
        }

        function set(data) {
            var dDataElm = elem.nextElementSibling;
            if (dDataElm && dDataElm.hasAttribute("d-data") && dDataElm.getAttribute("name") == name){
                elem.nextElementSibling.remove();    
            }
            return insertTemplate(templates[name], elem, data);
        }
    }

    cacheTemplates();

    function dDataGet(selector) {

        var parentElm = undefined;
        if (selector.attributes != undefined) {
            // Selector can be either a string or an actual element
            parentElm = selector;
        } else {
            parentElm = document.querySelector(selector);
        }
        
        // if (!parentElm.hasAttribute("d-data")) {
        //     return {error: "dDataGet: expects a d-data element (ie: element with a [d-data] attribute"};
        // }

        var dDataObject = {};
        Object.defineProperty(dDataObject, "element", {
            value: parentElm
        });
        
        Object.defineProperty(dDataObject, "remove", {
            value: function() {
                parentElm.remove();
            }
        });

                            // doing this crazy nonsense to return an array instead of node list
        var namedElements = Array.prototype.slice.call( parentElm.querySelectorAll("[name]") );
        var templateParentElements = Array.prototype.slice.call( parentElm.querySelectorAll("[template-placeholder]") );
        var props = namedElements.concat(templateParentElements);
        var propsLen = props.length;

        for (var i = 0; i < propsLen; i++) {
            var propElm = props[i];
            if ( propElm.hasAttribute("template-placeholder") ){ setupTemplateParent(); continue; }
            var propName = propElm.getAttribute("name")
            if (belongsToCurrentParent(propElm)) {
                if (hasChildren(propElm)) {
                    if (isArray(propElm)) {
                        // There are multiple instances of this property with children
                        dDataArrProp(propElm);
                    } else {
                        // This is a single instance of this property with children
                        dDataObjProp(propElm);
                    }
                } else {
                    // This property is a single value property
                    dDataValProp(propElm);

                }
            }

        }

        return dDataObject;
        
        function setupTemplateParent(){
            var tParentName = propElm.getAttribute("template-placeholder");
            var template = dData.templates[tParentName];
            if (dDataObject[tParentName] == undefined){
                Object.defineProperty(dDataObject, tParentName, {get});
            }
            
            function get(){
                return {
                    add: function(data) {
                        dData.insertTemplate(template, propElm, data);
                    }  
                };
            }
        }

        function dDataArrProp(e) {
            var propName = e.getAttribute("name")
            if (dDataObject[propName] == undefined) {
                dDataObject[propName] = [];
                
                var parent = e.parentElement
                Object.defineProperty(dDataObject[propName], "element", {
                    value: parent
                });
                
                
                Object.defineProperty(dDataObject[propName], "add", {
                    value: function(data) {
                        var template = dData.templates[propName];
                        dData.insertTemplate(template, e, data);
                    }
                });
                
            }
            dDataObject[propName].push(dDataGet(e));
        }

        function dDataObjProp(e) {
            dDataObject[propName] = dDataGet(e);
        }

        function dDataValProp(e) {
            if (dDataObject.hasOwnProperty(propName)){ return 0; }
            Object.defineProperty(dDataObject, propName, {
                get,
                set,
                enumerable: true
            });

            Object.defineProperty(dDataObject, propName + "Element", {
                value: propElm
            });

            function get() {
                if (e.type == 'checkbox'){
                    if (e.checked){
                        return e.getAttribute("true") || true;
                    }else{
                        return e.getAttribute("false") || false;
                    }
                }else if (e.type == 'radio'){
                    return dDataObject.element.querySelector("[name='"+e.getAttribute('name')+"']:checked").value;
                }else if (e.value === undefined){
                    return e.innerHTML;    
                }else{
                    return e.value;
                }
            }

            function set(newVal) {
                if (e.type == "checkbox"){
                    if (e.getAttribute("true") == newVal){
                        e.checked = true;
                    }else if (e.getAttribute("false") == newVal) {
                        e.checked = false;
                    }else{
                        e.checked = newVal;    
                    }
                }else if (e.type == 'radio'){
                    dDataObject.element.querySelector("[name='"+e.getAttribute('name')+"'][value='"+newVal+"']").checked = true;
                }else if (e.value != undefined) {
                    e.value = newVal;
                } else {
                    e.innerHTML = newVal;
                }
            }
        }

        function belongsToCurrentParent(e) {
            e = e.parentElement;
            while (!e.hasAttribute("name") && e != parentElm) {
                e = e.parentElement;
                if (e == null) {
                    break;
                }
            }
            if (e == parentElm) {
                return true;
            } else {
                return false;
            }
        }

        function hasChildren(e) {
            var children = e.querySelector("[name]");
            var isArr = e.hasAttribute("array");
            var isObj = e.hasAttribute("object");

            if (children != null || isArr || isObj) {
                return true;
            } else {
                return false;
            }
        }

        function isArray(e) {
            var isArr = e.hasAttribute("array");
            var isObj = e.hasAttribute("object");

            if (isArr || !isObj) {
                return true;
            } else {
                return false;
            }
        }
    }

    function dDataSet(docFrag, data) {

        for (var key in data) {

            if (typeof (data[key]) == "object"  && data[key] !== null) {
                var propParent = docFrag.querySelector(`[template-placeholder="${key}"]`);

                if (Array.isArray(data[key])) {
                    var arr = data[key];
                    var arrLen = arr.length;
                    for (var i = 0; i < arrLen; i++) {
                        if (propParent == null) {
                            var parent = docFrag.querySelector("[d-data]");
                            addHiddenDiv(parent, key, arr[i]);
                        } else {
                            insertTemplate(templates[key], propParent, arr[i])
                        }
                    }
                } else {
                    if (propParent == null) {
                        var parent = docFrag.querySelector("[d-data]");
                        addHiddenDiv(parent, key, data[key], true);
                    } else {
                        insertTemplate(templates[key], propParent, data[key]);
                    }
                }

            } else {
                var elm = docFrag.querySelector(`[name="${key}"]`);
                if (elm == null) {
                    // element does not exist
                    var parent = docFrag.querySelector("[d-data]");
                    addHiddenInput(parent, key, data[key]);
                } else {
                    // element exists to apply value to
                    
                    // if element is a checkbox
                    if (elm.type == "checkbox"){
                        //  if the checkbox has true and/or false attributes use those to apply arbitrary values
                        // ie ( <input type="checkbox" true="valueIfChecked"  false="valueifNOTchecked" /> )
                        if (elm.getAttribute("true") == data[key]){
                            elm.checked = true;
                        }else if (elm.getAttribute("false") == data[key]) {
                            elm.checked = false;
                        }else{
                            elm.checked = data[key];    
                        }
                    }else if (elm.type == "radio"){  
                        docFrag.querySelector("[name='"+key+"'][value='"+data[key]+"']").checked = true;
                    }else if (elm.value != undefined) {
                        elm.value = data[key];
                    } else {
                        elm.innerHTML = data[key];
                    }
                }

            }

        }

        function addHiddenDiv(docFrag, key, data, objectBool) {
            var template = document.createElement("template");
            var div = document.createElement("div");
            template.content.appendChild(div);

            div.style.display = "none";
            div.setAttribute("d-data", "");
            div.setAttribute("name", key);
            if (objectBool) {
                div.setAttribute("object", "")
            }
            return addTemplate(template, docFrag, data);
        }

        function addHiddenInput(docFrag, key, data) {
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = data;
            docFrag.appendChild(input);
        }

    }

    function addTemplate(template, toElement, data) {

        var clone = document.importNode(template.content, true);
        if (data) {
            dDataSet(clone, data);
        }
        var retElem = clone.children[0];
        toElement.appendChild(clone);
        return retElem;

    }
    
    function insertTemplate(template, afterElement, data){
        var parent = afterElement.parentElement;
        var name = afterElement.getAttribute("template-placeholder") || afterElement.getAttribute("name");
        if (name == null) { throw "element needs to be a template placeholder or a d-data element"; }
        var elms = parent.querySelectorAll("[template-placeholder='"+name+"'], [d-data][name='"+name+"']");
        afterElement = elms[ elms.length - 1 ];
        
        var clone = document.importNode(template.content, true);
        if (data) {
            dDataSet(clone, data);
        }
        var retElem = clone.children[0];
        afterElement.after(clone);
        return retElem;
    }
    
    function add(templateName, elm){
        var parent = elm.parentElement;
        var template = dData.templates[templateName];
        var clone = document.importNode(template.content, true);
        parent.insertBefore(clone, elm);
        const focus = elm.previousElementSibling.querySelector("[autofocus]");
        focus.focus();
        
    }
    
    function remove(elm){
        var pElm = elm.parentElement;
        while (!pElm.hasAttribute("d-data")){
            pElm = pElm.parentElement;
        }

        // loop through each element and set to blank string
        // and run changeHandler to update audit log
        var data = dDataGet(pElm);
        var keys = Object.keys(data);
        keys.forEach(function(key){
            // if this has a nested dData element
            if (Array.isArray(data[key])){
                // then loop through each child and remove it
                // using this remove function so that the audit log
                // will get updated with the old children values
                var childLen = data[key].length - 1;
                for (var i=childLen; i>-1; i--){
                    var child = data[key][i];
                    remove(child.element.children[0]);
                }
            }else{
                data[key] = "";
                var element = data[key + "Element"];
                changeHandler({target: element})
            }
        })

        pElm.remove();
    }
    
    function getParent(elm){
        var pElm = elm.parentElement;
        while (!pElm.hasAttribute("d-data") && pElm != document.body){
            pElm = pElm.parentElement;
        }
        if (pElm == document.body) return false;
        return pElm;
    }
    
    function getObject(elm){
        if (elm.hasAttribute("d-data")){
            return dDataGet(elm);
        }else{
            return dDataGet(getParent(elm));
        }
    }

    function getDDataPath(elm){
        var objectPath = elm.getAttribute("name");
        
        var dDataParents = [];
        var pElm = dData.getParent(elm);
        dDataParents.push(pElm);
        while (pElm = dData.getParent(pElm)){
            dDataParents.push(pElm);
        }

        var dParLen = dDataParents.length;
        dDataParents.forEach(function(dDataElm, index){
            var idx = "";
            var dDataName = dDataElm.getAttribute("name")
            if (index < dParLen - 1){
                var dDataElms = dDataElm.parentElement.querySelectorAll(`[name="${dDataName}"]`);
                idx = Array.prototype.indexOf.call(dDataElms, dDataElm);
                idx = `[${idx}]`;
            }
            objectPath = `${dDataName}${idx}.${objectPath}`;
            
        });

        return `${objectPath}`;

    }

    function parseChangeLog(changesLog){
        // This function takes a log of object keys and converts it
        // into an array of alphabetical changes.
        if (changesLog == undefined) return [];
        var keys = Object.keys(changesLog);
        if (keys.length == 0) return {};
        keys.sort();
        var changesArr = [];
        keys.forEach(function(key){
            var change = changesLog[key];
            var oldVal = change.oldVal;
            var newVal = change.newVal;
            changesArr.push( {key, oldVal, newVal} )
        })
        return changesArr;
    }

    function saveNew(elm){
        if (confirm("Duplicate ?")){
            var params = new URLSearchParams(window.location.search);
            params.set("docid", "new");
            window.history.replaceState({}, null, location.pathname + "?" + params.toString() );

            save(elm);
        }
        
    }

    function toggle_overlay(){
        d = savingOverlay.style.display;
        d = d == "none" ? "block" : "none";
        savingOverlay.style.display = d;
    }

    function testSave(elm) {
        var pElm = getParent(elm);
        var pName = pElm.getAttribute("name");

        var data = JSON.parse(   JSON.stringify( dData.dDataGet(pElm) )    );
        data._docChangeLog = parseChangeLog(dDataDocChanges[pName]);

        console.log("=========== dData Save Test =============");
        console.log(JSON.stringify(data,null,2));
        console.log("=========================================");
    }

    async function save(elm){
        toggle_overlay()
        var pElm = getParent(elm);
        var pName = pElm.getAttribute("name");

        var data = JSON.parse(   JSON.stringify( dData.dDataGet(pElm) )    );
        data._docChangeLog = parseChangeLog(dDataDocChanges[pName]);

        try {
            const search = location.search || "?";
            var results = await post(location.pathname + 
                                    search + "&nowrap", data);
            results = JSON.parse(results);
            if (results.audit.meta.status == "success"){
                setTimeout(function(){
                    location.search = `docid=${results.query.docid}&saved=${results.d}`;
                }, 100);
                
            } else {
                alert ("POST Error: Was not able to save!");
                console.log(results);
            }
        }catch(e){
            alert("Error: Was not able to save!");
            console.log("dData2 SAVE ERROR: ", e);
        }
        
        
    }

}
)();











// XHR / AJAX Functions!



let request = obj => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(obj.method || "GET", obj.url);
        xhr.withCredentials = true;
        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                var cType = xhr.getResponseHeader("content-type");
                if (cType == "application/json") {
                    resolve(JSON.parse(xhr.response));
                }
                else {
                    resolve(xhr.response);
                }
            }
            else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(obj.body);
    });
};

function serialize( obj ) {
    if (obj == null || obj == undefined){return ""}
    return Object.keys(obj).reduce(function(a,k){a.push(k+'='+encodeURIComponent(obj[k]));return a},[]).join('&')
}

async function get(url, body){
    body = JSON.stringify(body);
    return await request({
        url,
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        body
        
    });
}

async function put(url, body){
    body = JSON.stringify(body);
    return await request({
        url,
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body
        
    });
}

async function post(url, body){
    body = JSON.stringify(body);
    return await request({
        url,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body
        
    });
}

async function del(url, body){
    body = JSON.stringify(body);
    return await request({
        url,
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body
        
    });
}
