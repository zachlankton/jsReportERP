
// Apparently declaring cluster in db_query.js is enough
// to work everywhere inside of helpers?

// const cluster = require("mmp-couch");

async function use_delete_handler_for_db(dbNamespace){

    if (this.method == "POST") {

        const d = Date.now();
        const t = new Date(d);
        const jDate = t.toJSON();

        const query = this.query
        const user = this.user;
        var data = this.post_data;

        if (query.docid == undefined) {
            return "docid needs to be specified in url query params";
        }
        
        if (query.docid == "new") {
            return "Cannot Delete 'New' Docid";
        }

        var results = {};
        const sql = `
            DELETE FROM mmp WHERE meta(mmp).id = "${dbNamespace}/${query.docid}";
        `;

        


        try {
            results = await cluster.query(sql);
        } catch (error) {
            console.log(error);
            results = error;
        }


        return JSON.stringify({
            results,
            query,
            d,
            dbNamespace
        });
    }

}


