
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
        //document.addEventListener( 'pause', onPause.bind( this ), false );
        //document.addEventListener( 'resume', onResume.bind( this ), false );

        db = window.openDatabase("AnnuaireEmployesDB", "1.0", "Gestion Salariés", 5 * 1024 * 1025);
        db.transaction(populateDB, transaction_error, populateDB_success);
    };


    function populateDB(tx) {
        $('#busy').show();

        console.log("populateDB", tx);
        tx.executeSql('DROP TABLE IF EXISTS employe');

        var sql = "CREATE TABLE IF NOT EXISTS employe (id INTEGER PRIMARY KEY, prenom VARCHAR(50), nom VARCHAR(50), telPortable VARCHAR(30))";
        console.log('sql', sql);
        tx.executeSql(sql);

        console.log('LocalDB ok')

        //var sql = "INSERT INTO employe (id, prenom, nom, telPortable) VALUES (9, 'Paul', 'Juste', '0644161761')";
        //tx.executeSql(sql);

        $.ajax({
            url: "http://bip10:10000/Service1.svc/Collaborateurs/",
            cache: false,
            type: 'GET',
            dataType: "json",
            success: function (data) {
                (
                    () => {
                        db.transaction(tx => {
                            data.GetListCollResult.forEach(col => {
                                var sql = `INSERT INTO employe (id, prenom, nom, telPortable) VALUES (${col.Matricule}, "${col.NomCollaborateur}", "${col.PrenomCollaborateur}", "${col.NumeroSecu}")`;
                                tx.executeSql(sql);
                            })
                        });
                    }
                )();

            }
        });


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

        //var sqloLD = "select e.id, e.prenom, e.nom, e.titre, count(r.id) rapportCount " +
        //    "from employe e left join employe r on r.managerId = e.id " +
        //    "group by e.id order by e.nom, e.prenom";

        var sql = "select e.id, e.prenom, e.nom " +
            "from employe e  " +
            "group by e.id order by e.nom, e.prenom";

        console.log(sql);

        tx.executeSql(sql, [], getEmployes_succes);
    };

    function getEmployes_succes(tx, results) {
        console.log("Im getEmployes_succes");
        $('#busy').hide();

        var len = results.rows.length;
        for (var i = 0; i < len; i++) {
            var employe = results.rows.item(i);
            console.log(employe.id);
            $('#employeList').append(
                `<li class="list-group-item "> <a href="employedetails.html?id=${employe.id}"><p class="list-group-item active"> ${employe.id} ${employe.nom} ${employe.prenom}</p></a></li>`)
        };

        $('#employeList').append(
            '<a href=index.html><button type="button" class="btn btn-primary">Home</button></a>'
        );

        setTimeout(
            scroll.refresh, 1000);
         db = null;




    }




} )();