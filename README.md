# jsReportERP

This was a custom ERP style application built on top of a jsreport installation that I customized to work as a platform for building applications. [See jsReport.net](https://jsreport.net).  The backend database used is [Couchbase](https://www.couchbase.com/).  Handlebars Server Side Rendering of templates was used heavily including some unique helper methods that were designed to make writing the application more declarative.  No frontend frameworks were used.  This was intentional and I believe resulted in a very manageable codebase.

PHP was used for handling, routing, and rendering requests to the jsReport Platform.  This allowed me to utilize the file structure inside jsReport as the route schema.  Manually updating new, removed, or changed routes was not required as it was handled automatically by these PHP scripts.

Check out [This PDF](https://github.com/zachlankton/jsReportERP/blob/2c870af86a3c2400d55576727aac11f26b2d2bc5/ERP2-Updated.pdf) for some screen shots a links to the code behind the screen shot.
