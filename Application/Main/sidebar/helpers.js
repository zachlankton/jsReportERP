function showHide(path, options){
    var paths = path.split(" ");
    var pathLen = paths.length;
    var hide = "w3-hide";
    if (this.uri == null) return hide;
    for (var i=0; i<pathLen; i++){
        if (this.uri.indexOf(paths[i]) > -1){hide = ""; break;}
    }
    return hide;
}

function menu_link(icon, text){

    var toggleAccordion = `onclick="toggleAccordion(this)"`;

        const link_html = `
            <div 
                ${toggleAccordion}
                class="w3-bar-item w3-btn w3-hover-theme w3-padding">
                <i class="fa ${icon} fa-fw"></i> ${text}</div>
        `;
        return new Handlebars.SafeString(link_html);    
}

function nested_menu_link(href, icon, text){

        const link_html = `
            <a href="${href}"
                class="w3-btn w3-block w3-left-align">
                <i class="fa ${icon} fa-fw"></i> ${text}</a>
        `;
        return new Handlebars.SafeString(link_html);    
}