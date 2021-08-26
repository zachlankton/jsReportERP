function ifHasRole(role, options){
    
    var roles = options.data.root.user.roles;

    // if user is Admin... allow no matter what
    if (roles.indexOf("Admin") > -1) return options.fn(this);

    // if AnyRole is specified allow for all users as well
    if (role == 'AnyRole') return options.fn(this);

    // finally check if user has specific role
    if (roles.indexOf(role) > -1){
        return options.fn(this);

    // and if not then we will not render the protected template
    }else{
        return options.inverse(this);
    }
    
}