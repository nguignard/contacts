console.log('INDEX');

var myScroll = new IScroll('#wrapper', {
    vScrollbar: false, hScrollbar: false, hScroll: false
});
var db;


(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Gérer les événements de suspension et de reprise Cordova
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );

        db = window.openDatabase("AnnuaireAbiDB", "1.0", "Gestion contact", 5 * 1024 * 1025);
        db.transaction(createLocalDB, transaction_error, populateDB_success);

        console.log(db);
    };


    function onPause() {
        // TODO: cette application a été suspendue. Enregistrez l'état de l'application ici.
    };

    function onResume() {
        // TODO: cette application a été réactivée. Restaurez l'état de l'application ici.
    };

    function createLocalDB(tx) {
        console.log("populateDB");
        console.log(tx);

        $('#busy').show();
        tx.executeSql('DROP TABLE IF EXISTS employe');

        var sql =
            " CREATE TABLE IF NOT EXISTS employe (" +
            " id INTEGER PRIMARY KEY, " +
            " prenom VARCHAR(50), " +
            " nom VARCHAR(50), " +
            " telPortable VARCHAR(50))";
        console.log('createsql base', sql);
        tx.executeSql(sql);
        console.log('createsql baseOK');

        // Exécution des requêtes d'insertion du jeu d'essai.

        $.ajax({
            url: "http://bip08:8080/ServiceStagiaire.svc/web/stagiaires/1",
            cache: false, // pas de cache pour avoir les donnees à jour tout le temps
            type: 'GET',
            dataType: 'json',
            success: function (data, statut) {
                db.transaction(getExtDb, ExtTransaction_error);
            }
        });
    }

        function getExtDb(tx, data) {

            data.foreach((e) => {
                console.log('e',e);
                //var sql = `INSERT INTO employe (id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville) VALUES (4, 'Catherine', 'Bouisse', 1, 'Chef de ventes','Ventes','0492458743','0625126187','cbouisse@fakemail.com','Cannes')`;
                //tx.executeSql(sql);
               
            });
        };

        function ExtTransaction_error(tx) {
            ('#busy').hide(); // on cache le chargement
            alert("Erreur d'accès bdd: " + error); //
        }

    
    


    function ManualValues(tx) {


        tx.executeSql(" INSERT INTO employe " +
            "(id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville) VALUES " +
            "(3, 'Steve', 'Dutronc', 4, 'Architecte Logiciel', 'Ingénierie', '0492458741', '0625874169', 'sdutronc@fakemail.com','Nice') ");


        tx.executeSql(" INSERT INTO employe (id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville)" +
            "VALUES (2, 'Emma', 'Jones', 5, 'Chef des ventes', 'Ventes', '0492458742', '0625876164', 'ejones@fakemail.com','Nice')");

        tx.executeSql(" INSERT INTO employe (id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville)" +
            "VALUES (1, 'Gérard', 'Houlet', 0, 'PDG', 'Direction', '0492458700', '0612489423', 'ghoulet@fakemail.com' ,'Monaco') ");
        tx.executeSql("INSERT INTO employe (id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville) VALUES (4, 'Catherine', 'Bouisse', 1, 'Chef de ventes','Ventes','0492458743','0625126187','cbouisse@fakemail.com','Cannes')");
        tx.executeSql("INSERT INTO employe (id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville) VALUES (5, 'Guillaume', 'Durand', 1, 'Marketing', 'Marketing', '0492458740', '0624121167', 'gdurand@fakemail.com','Nice')");
        tx.executeSql("INSERT INTO employe (id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville) VALUES (6, 'Lisa', 'Wong', 1, 'Directrice Marketing','Marketing','0492458744','0684541147','lwong@fakemail.com','Cagnes sur Mer')");
        tx.executeSql("INSERT INTO employe (id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville) VALUES (7, 'Paulette', 'Martin', 2, 'Architecte Logiciel','Ingénierie','0492458745','0634544122','pmartin@fakemail.com','Nice')");
        tx.executeSql("INSERT INTO employe (id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville) VALUES  (8, 'Raymond', 'Milau', 1, 'Commercial', 'Ventes', '0492458746', '0631554128', 'rmilau@fakemail.com','Cannes')");
        tx.executeSql("INSERT INTO employe (id, prenom, nom, managerId, titre, departement, telBureau, telPortable, email, ville) VALUES (9, 'Paul', 'Juste', 3, 'Responsable Technique','Ingénierie','0492458747','0644161761','pjuste@fakemail.com','Nice')");
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

        var sql2 = "select e.id, e.prenom, e.nom, e.titre, count(r.id) rapportCount " +
            "from employe e left join employe r on r.managerId = e.id " +
            "group by e.id order by e.nom, e.prenom";

        var sql = "select e.id, e.prenom, e.nom, e.telPortable " +
            "from employe e order by e.nom, e.prenom";

        tx.executeSql(sql, [], getEmployes_succes);
    };

    function getEmployes_succes(tx, results) {
        console.log("Im getEmployes_succes");
        $('#busy').hide();
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
        setTimeout(scroll.refresh, 1000);
         db = null;
    }




} )();