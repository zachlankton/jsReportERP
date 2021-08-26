const cluster = require("mmp-couch");

async function db_query(){
    var that = this;
    var argLen = arguments.length;
    var queriesLen = (argLen - 1) / 2;
    var options = arguments[argLen - 1];

    if (that.method == "POST"){ return "";}

    for (var i=0; i<queriesLen; i++){
        var name = arguments[i*2];
        var query = arguments[i*2+1];
        query = parseQuery(query, that);

        console.log("=================db_query================");
        console.log(name, query);

        try {
            let result = await cluster.query(query)
            if (result.rows.length == 0){
                that[name] = [{}]
            }else{
                that[name] = result.rows;
                that[name].dbQuery = result;  
                that[name].dbQuery.rows = [];  
            }
        } catch (error) {
            console.log(error);
            that[name] = error;
        }
    }

    return options.fn(that);

}

function parseQuery(query, context){

    function replacer(match, p1, offset, string) {
        var objKeys = p1.split(".");
        var param = context;
        objKeys.forEach(function (key){
            param = param[key];
        })
        return param;
        
    }

    let parsedQuery = query.replace(/\(\((.*?)\)\)/g, replacer);
    return parsedQuery;
}

