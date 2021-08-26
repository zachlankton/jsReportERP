

// const selectors = [
//     { selector: "[d-data]", name: "{{name}}", value: {}, oneTimeOnly: true },
//     { selector: "[d-data]", name: "{{name}}", value: [] },
//     { selector: "[name]",   name: "{{name}}", value: "{{value||innerHTML}}" }
// ];

const selectors = [
    { selector: "[d-data]",     name: "{{name}}", value: {},    topLevelOnly:true   },
    { selector: "[d-data]",     name: "{{name}}", value: []                         },
    { selector: "[name]",       name: "{{name}}", value: "{{value||innerHTML}}"     }
];
const selectors_len = selectors.length;


let matchStack = [];

function dom_walk(element, returnObj){

    returnObj = returnObj || {};
    
    forEachChild(element, function(child){
        
        const elmFunction = findFirstSelectorMatchFunc(child);
        if (elmFunction !== false){
            matchStack.push(child);
            elmFunction(child, returnObj);
            matchStack.pop();
        } else {
            dom_walk(child, returnObj);
        }
        
    })
    
    return returnObj;
}

function forEachChild(elm, func){
    const child_len = elm.children.length;
    const children = elm.children;
    for (var i=0; i<child_len; i++){
        const child = children[i];
        func(child, i);
    }
}


function findFirstSelectorMatchFunc(elm){
    for (var i=0; i<selectors_len; i++){
        const selectorObj   = selectors[i];
        const selector      = selectorObj.selector;
        const topLevelOnly  = selectorObj.topLevelOnly;
        const stackLen      = matchStack.length;
        const enabled       = selectorObj.enabled === undefined ? true : false;
        
        if (enabled && elm.matches(selector)) {
            if (topLevelOnly && stackLen > 0) continue;
            return getSelectorFunction(selectorObj);
        }
        
    }
    return false;
}

function getSelectorFunction(selectorObj){
    if (selectorObj.func) return selectorObj.func;
    if (selectorObj.name && selectorObj.value) return nameValueFunc(selectorObj);
    return defaultFunction;
}

function nameValueFunc(selectorObj){
    const name = selectorObj.name;
    const val  = selectorObj.value;

    func = function(elm, returnObj){
        const nameVal = getElmPropertyValue(elm, name);
        const propVal = getElmPropertyValue(elm, val);

        if (Array.isArray(returnObj[nameVal])){
            returnObj[nameVal].push(propVal[0])
        }else{
            returnObj[nameVal] = propVal;
        }

    }
    return func;
}

function getElmPropertyValue(elm, property){
    if ( typeof(property) == "function" ) return property(elm);
    if ( Array.isArray(property) )        return [dom_walk(elm)]
    if ( typeof(property) == "object" )   return dom_walk(elm);

    const parsedVar = parseVariable(elm, property)
    if (parsedVar !== undefined) return parsedVar;

    return property;
}

function parseVariable(elm, property){
    const variableRegEx = /{{(.+?)}}/
    const parsedVariable = variableRegEx.exec(property);
    if (parsedVariable) {
        const varSplit = parsedVariable[1].split("||");  // multipe OR "||" variables allowed
        let propIndex = 0;
        let propName = varSplit[propIndex++];
        let retVal = "";
        while (propName) {
            retVal = elm[propName] || elm.getAttribute(propName);
            if (retVal !== undefined) return retVal;
            propName = varSplit[propIndex++]
        }
    } 
    
    return false;
}

function defaultFunction(elm, returnObj){
    returnObj.push( {
        elm, 
        children: dom_walk(elm)
    } ); 
}

