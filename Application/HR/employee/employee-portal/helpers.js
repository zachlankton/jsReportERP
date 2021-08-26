function pdfViewer(opts) {
    const stubid = this.query.stubid;
    const otherid = this.query.otherid;
    const aeid = this.query.aeid;
    
    if (stubid){
        const firstName = this.user.firstName;
        const lastName = this.user.lastName;
        const userName = `${lastName}_${firstName}`;
        return new Handlebars.SafeString(`
        <embed width="100%" height="750px"
                src="data:application/pdf;base64,
                {#asset /Uploads/Employee_Docs/${userName}/Pay_Stubs/${stubid} @encoding=base64}"  >`)
    }
    
    if (otherid){
        const firstName = this.user.firstName;
        const lastName = this.user.lastName;
        const userName = `${lastName}_${firstName}`;
        return new Handlebars.SafeString(`
        <embed width="100%" height="750px"
                src="data:application/pdf;base64,
                {#asset /Uploads/Employee_Docs/${userName}/Other_Docs/${otherid} @encoding=base64}"  >`)
    }

    if (aeid){
        return new Handlebars.SafeString(`
        <embed width="100%" height="750px"
                src="data:application/pdf;base64,
                {#asset /Uploads/Employee_Docs/ALL_EMPLOYEES/${aeid} @encoding=base64}"  >`)
    }

    return "";
    
}

function modalDisplay(opts) {
    const stubid = this.query.stubid;
    const otherid = this.query.otherid;
    const aeid = this.query.aeid;

    if (stubid) {
        return "block";
    }
    if (otherid) {
        return "block";
    }
    if (aeid) {
        return "block";
    }
    return "none"
}
