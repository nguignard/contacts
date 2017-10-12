console.log('REPORTLIST');


var monScroll = new IScroll('#wrapper', {
    vScrollbar: false, hScrollbar: false, hScroll: false
});
var db;
var id = getUrlVars()["id"];

console.log('Boss', id);

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    console.log('H',hashes);

    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        console.log('hash0 ', hash);
        vars.push(hashes[0]);
        console.log('vars0', vars);
        vars[hash[0]] = hash[1];
        console.log('vars1', vars);
    }
    //console.log(vars);
    return vars;
}

(function () {
    "use strict";
    document.addEventListener('deviceready', OnDeviceReady.bind(this), false);

    function OnDeviceReady() {
        console.log("Im Ondevice ready");

        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        db = window.openDatabase("AnnuaireEmployesDB", "1.0", "Gestion subordonnes", 200000);

        console.log("database opened");
        db.transaction(getReportList, transaction_error);
    };

    function onPause() {
        alert('en Pause');
    };

    function onResume() {
        //TODO
    };

    function transaction_error(tx, error) {
        $('#busy').hide();
        alert("Erreur d'accès bdd: " + error);
    };


    function getReportList(tx) {

        console.log("getEmploye");
        $('#busy').show;

        var sql = "select e.id, e.prenom, e.nom, e.managerId, e.titre, e.departement, e.ville, e.telBureau, e.telPortable, " +
            "e.email,  m.prenom managerPrenom, m.nom managerNom, count(r.id) reportCount " +
            "from employe e left join employe r on r.managerId = e.id left join employe m on e.managerId = m.id " +
            "where e.managerId=" + id + " group by e.nom order by e.nom, e.prenom";


        var sqlT = `select e.id, e.prenom, e.nom, e.managerId, e.titre, e.departement, e.ville, e.telBureau, e.telPortable, e.email,  
                    m.prenom managerPrenom, m.nom managerNom, count(r.id) reportCount
                    from employe e 
                    left join employe r on r.managerId = e.id
                    left join employe m on e.managerId = m.id
                    where e.managerId= :id group by e.nom
                    order by e.nom, e.prenom`;

        console.log(sqlT);
        tx.executeSql(sqlT, [id], getReport_succes);
    };


    function getReport_succes(tx, results) {
        console.log("Im getEmployes_succes");

        $('#busy').hide();
       
         var len = results.rows.length;

        for (var i = 0; i < len; i++) {
            var employe = results.rows.item(i);
            console.log(employe.nom);
            $('#rep').append(
                '<li class="list-group-item " > <a href="employedetails.html?id=' + employe.id + '">'
                + '<p class="list-group-item active">'
                + employe.id + ' '
                + employe.nom + ' '
                + employe.prenom
                + '</p>'
                + '<p class="list-group-item">'
                + employe.titre
                + '</p>'
                + '<span class="bubble">'
                + employe.reportCount
                + '</span></a></li>');
        }

        $('#rep').append(
            '<a href=index.html><button type="button" class="btn btn-primary">Home</button></a>'
        );


        setTimeout(
            scroll.refresh, 1000);

        db = null;




    }









})();

