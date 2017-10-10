var monScroll = new IScroll('#wrapper', {
    vScrollbar: false, hScrollbar: false, hScroll: false
});
var db;
var id = getUrlVars["id"];

function getUrlVars(s) {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    //console.log(hashes);

    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        console.log(hash);
        vars.push(hashes[0]);
        vars[hash[0]] = hash[1]
    }
    //console.log(vars);
    return vars;
}


function OnDeviceready() {

    db.transaction(populateDB, transaction_error, getEmploye);



}




