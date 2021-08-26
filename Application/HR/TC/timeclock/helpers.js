function isEmployee(usr) {
    var idx = usr.roles.findIndex((role) => role == "Employee")
    if(idx >= 0) {
        return true;
    } else {
        return false;
    }
}