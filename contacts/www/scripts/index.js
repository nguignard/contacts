// Pour obtenir une présentation du modèle Vide, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkID=397704
// Pour déboguer du code durant le chargement d'une page dans cordova-simulate ou sur les appareils/émulateurs Android, lancez votre application, définissez des points d'arrêt, 
// puis exécutez "window.location.reload()" dans la console JavaScript.



console.log('INDEX');
var db;
var myScroll = new IScroll('#wrapper', {
    vScrollbar: false, hScrollbar: false, hScroll: false
});

(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Gérer les événements de suspension et de reprise Cordova
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );

        db = window.openDatabase("AnnuaireEmployesDB", "1.0", "Gestion Salariés", 5 * 1024 * 1025);
        db.transaction(populateDB, transaction_error, populateDB_success);
    };

    function onPause() {
        // TODO: cette application a été suspendue. Enregistrez l'état de l'application ici.
    };

    function onResume() {
        // TODO: cette application a été réactivée. Restaurez l'état de l'application ici.
    };

    function getRest() {
        $.ajax({
            url: "http://bip08:8080/ServiceStagiaire.svc/web/stagiaires/1",
            cache: false,
            type: 'GET',
            dataType: "json",
            success: function (data, statut) {


                tx.executeSql("INSERT INTO employe (id, prenom, nom, telPortable) VALUES (9, 'Paul', 'Juste', '0644161761')");




            }
        });
       }


       






    function populateDB(tx) {
        $('#busy').show();

        console.log("populateDB");
        console.log(tx);

        tx.executeSql('DROP TABLE IF EXISTS employe');

        var sql =
            "CREATE TABLE IF NOT EXISTS employe (" +
            "id INTEGER PRIMARY KEY, " +
            "prenom VARCHAR(50), " +
            " nom VARCHAR(50), " +
            " titre VARCHAR(50), " +
            " departement VARCHAR(50)," +
            " managerId INTEGER, " +
            " ville VARCHAR(50), " +
            " telBureau VARCHAR(30), " +
            " telPortable VARCHAR(30)," +
            " email VARCHAR(30) )";

        tx.executeSql(sql);

        getRest();







        // Exécution des requêtes d'insertion du jeu d'essai.
        //tx.executeSql(" INSERT INTO employe " +
        //    "(id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville) VALUES " +
        //    "(3, 'Steve', 'Dutronc', 4, 'Architecte Logiciel', 'Ingénierie', '0492458741', '0625874169', 'sdutronc@fakemail.com','Nice') ");

        //tx.executeSql(" INSERT INTO employe (id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville)" +
        //    "VALUES (2, 'Emma', 'Jones', 5, 'Chef des ventes', 'Ventes', '0492458742', '0625876164', 'ejones@fakemail.com','Nice')");

        //tx.executeSql(" INSERT INTO employe (id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville)" +
        //    "VALUES (1, 'Gérard', 'Houlet', 0, 'PDG', 'Direction', '0492458700', '0612489423', 'ghoulet@fakemail.com' ,'Monaco') ");

        //tx.executeSql("INSERT INTO employe (id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville) VALUES (4, 'Catherine', 'Bouisse', 1, 'Chef de ventes','Ventes','0492458743','0625126187','cbouisse@fakemail.com','Cannes')");
        //tx.executeSql("INSERT INTO employe (id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville) VALUES (5, 'Guillaume', 'Durand', 1, 'Marketing', 'Marketing', '0492458740', '0624121167', 'gdurand@fakemail.com','Nice')");
        //tx.executeSql("INSERT INTO employe (id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville) VALUES (6, 'Lisa', 'Wong', 1, 'Directrice Marketing','Marketing','0492458744','0684541147','lwong@fakemail.com','Cagnes sur Mer')");
        //tx.executeSql("INSERT INTO employe (id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville) VALUES (7, 'Paulette', 'Martin', 2, 'Architecte Logiciel','Ingénierie','0492458745','0634544122','pmartin@fakemail.com','Nice')");
        //tx.executeSql("INSERT INTO employe (id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville) VALUES  (8, 'Raymond', 'Milau', 1, 'Commercial', 'Ventes', '0492458746', '0631554128', 'rmilau@fakemail.com','Cannes')");
        //tx.executeSql("INSERT INTO employe (id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville) VALUES (9, 'Paul', 'Juste', 3, 'Responsable Technique','Ingénierie','0492458747','0644161761','pjuste@fakemail.com','Nice')");








    }

    function transaction_error(tx,error) {
        console.log('transaction_error : ' , error, tx);
        $('#busy').hide();
    }

    function populateDB_success() {
        console.log("populateDB_success");
        db.transaction(getEmployes,transaction_error);
    }

    function getEmployes(tx){
        console.log("Im getEmploye");

        var sql = "select e.id, e.prenom, e.nom, e.titre, count(r.id) rapportCount " +
            "from employe e left join employe r on r.managerId = e.id " +
            "group by e.id order by e.nom, e.prenom";

        tx.executeSql(sql, [], getEmployes_succes);
    };

    function getEmployes_succes(tx, results) {
        console.log("Im getEmployes_succes");
        $('#busy').hide();
        //var employees = JSON.parse(JSON.stringify(results.rows));
        //$.each(employees, (k, v) => {
        //    let c = "list-group-item ";
        //    if (k === "0") {
                
        //        c += "active";
        //    }
        //        console.log(c);
        //    $('#employeesList').append(`<a class="${c}">${v.nom} ${v.prenom}</a>`);
        //});


        var len = results.rows.length;

        for (var i = 0; i < len; i++) {

            var employe = results.rows.item(i);
            console.log(employe.nom);

            $('#employeList').append(
                '<li class="list-group-item " > <a href="employedetails.html?id='+ employe.id + '">'
                + '<p class="list-group-item active">'
                + employe.id + ' '
                + employe.nom +     ' '
                + employe.prenom
                + '</p>'
                + '<p class="list-group-item">'
                + employe.titre
                + '</p>'
                + '<span class="bubble">'
                + employe.rapportCount
                + '</span></a></li>');
        }


        $('#employeList').append(
            '<a href=index.html><button type="button" class="btn btn-primary">Home</button></a>'
        );

        setTimeout(
            scroll.refresh, 1000);

         db = null;




    }




} )();