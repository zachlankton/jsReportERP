
// Apparently declaring cluster in db_query.js is enough
// to work everywhere inside of helpers?

// const cluster = require("mmp-couch");

async function use_save_handler_for_db(dbNamespace){

    if (this.method == "POST") {

        const d = Date.now();
        const t = new Date(d);
        const jDate = t.toJSON();

        const query = this.query
        const user = this.user;
        var data = this.post_data;

        if (query.docid == undefined && data.docid == undefined) {
            return "docid needs to be specified in url query params";
        }

        query.docid = query.docid || data.docid;
        
        if (query.docid == "new" || query.docid === "") {
            query.docid = user.id + d.toString();
            data.createdBy = user.email;
            data.created = jDate;
            data.auditLog = [];
        }
        
        var changeLog = JSON.parse(  JSON.stringify(data._docChangeLog) );
        delete(data._docChangeLog);
        
        data.dbNamespace = dbNamespace;
        data.modifiedBy = user.email;
        data.modified = jDate;
        data.docid = query.docid;
        data.rev = parseInt(data.rev) || 0;
        data.rev += 1;
        data.auditLog = data.auditLog || [];
        data.auditLog.unshift({
            rev: data.rev,
            modifiedBy: user.email,
            modified: jDate,
            changes: changeLog
        });

        var results = {};
        const sql = `
            UPSERT INTO mmp (KEY, VALUE)
            VALUES ("${dbNamespace}/${query.docid}", ${JSON.stringify(data)} )
        `;

        data.dbNamespace = `/Audit${dbNamespace}`;
        const audit_sql = `
            INSERT INTO mmp (KEY, VALUE)
            VALUES ("/Audit${dbNamespace}/${query.docid}rev${data.rev}", ${JSON.stringify(data)} )
        `;


        try {
            var insert = await cluster.query(sql);
            results = insert;
            var audit = await cluster.query(audit_sql);
        } catch (error) {
            console.log(error);
            results = error;
        }


        return JSON.stringify({
            results,
            insert,
            audit,
            query,
            d,
            dbNamespace
        });
    }

}


