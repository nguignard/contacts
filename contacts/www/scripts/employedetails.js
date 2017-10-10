var monScroll = new IScroll('#wrapper', {
    vScrollbar: false, hScrollbar: false, hScroll: false
});
var db;
var id = getUrlVars()["id"];

console.log(id);

function getUrlVars() {
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

(function() {
    "use strict";
    document.addEventListener('deviceready', OnDeviceReady.bind(this), false);

    function OnDeviceReady() {
        console.log("Im Ondevice ready");
        
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        db = window.openDatabase("AnnuaireEmployesDB", "1.0", "Gestion Salariés", 200000);

        console.log("database opened");
        db.transaction(getEmploye, transaction_error);
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


    function getEmploye(tx) {
        console.log("getEmploye");
        $('#busy').show;

        var sql = "select e.id, e.prenom, e.nom, e.managerId, e.titre, e.departement, e.ville, e.telBureau, e.telPortable, " +
        "e.email,  m.prenom managerPrenom, m.nom managerNom, count(r.id) reportCount " +
            "from employe e left join employe r on r.managerId = e.id left join employe m on e.managerId = m.id " +
            "where e.id=:id group by e.nom order by e.nom, e.prenom";

        console.log(sql);
        tx.executeSql(sql,[id], getEmploye_succes);

    };


    function getEmploye_succes(tx, results) {
        console.log("I'm getEmployes_succes");
        $('#busy').hide;

        var employe = results.rows.item(0);
            console.log(employe.nom);


            console.log('<li> <a href="employedetails.html?id=' + employe.id + '">' +
                '<p class="line1">' + employe.nom + '</p>' +
                '<p class="line2">' + employe.prenom + '</p>' +
                '<span class="bubble">' + employe.rapportCount + '</span></a></li>');

            $('#fullName').append(employe.nom + ' ' + employe.prenom);
            $('#employeTitre').text(employe.titre);
            $('#ville').text(employe.ville);


            $('#busy').hide();

            if (employe.managerID>0) {
                $('#actionList').append('<li> ' +
                    '<a href="employedetails.html?id=' + employe.managerID + '" > ' +
                    '<p class="list-group-item"> Voir Manager </p>' +
                    '<p class="list-group-item">'+ employe.managerPrenom + ' ' + employe.managerNom + '</p>' +
                    '</a></li>');
                


                 
            }






        setTimeout(scroll.refresh, 1000);
        db = null;
    }





})();

