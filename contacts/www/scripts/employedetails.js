console.log('EMPLOYE DETATAILS');

var monScroll = new IScroll('#wrapper', {
    vScrollbar: false, hScrollbar: false, hScroll: false
});
var db;
var id = getUrlVars()["id"];

console.log(id);

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
        console.log('vars1',vars);
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

        //var sql = "select e.id, e.prenom, e.nom, e.managerId, e.titre, e.departement, e.ville, e.telBureau, e.telPortable, " +
        //"e.email,  m.prenom managerPrenom, m.nom managerNom, count(r.id) reportCount " +
        //    "from employe e left join employe r on r.managerId = e.id left join employe m on e.managerId = m.id " +
        //    "where e.id=" + id + " group by e.nom order by e.nom, e.prenom";

        var sqlT = `select e.id, e.prenom, e.nom, e.managerId, e.titre, e.departement, e.ville, e.telBureau, e.telPortable, e.email,  
                    m.prenom managerPrenom, m.nom managerNom, count(r.id) reportCount
                    from employe e 
                    left join employe r on r.managerId = e.id
                    left join employe m on e.managerId = m.id
                    where e.id= :id group by e.nom
                    order by e.nom, e.prenom`;


        var sql = "select e.id, e.prenom, e.nom, e.titre, count(r.id) rapportCount " +
            "from employe e left join employe r on r.managerId = e.id " +
            "group by e.id order by e.nom, e.prenom";


        console.log(sqlT);
        tx.executeSql(sqlT,[id], getEmploye_succes);

    };


    function getEmploye_succes(tx, results) {
        console.log("I'm getEmployes_succes");
        $('#busy').hide;



        var employe = results.rows.item(0);
            console.log(employe.nom);


            $('#fullName').append(employe.nom + ' ' + employe.prenom);
            $('#employeTitre').text(employe.titre);
            $('#ville').text(employe.ville);

            $('#busy').hide();

            console.log(employe.managerId);

            if (employe.managerId > 0) {
                $('#actionList').append(
                    '<li class="list-group-item"> '
                    + '<a href="employedetails.html?id=' + employe.managerID + '" > '
                    + '<p class="list-group-item"> Voir Manager </p>'
                    + '<p class="list-group-item">'+ employe.managerPrenom + ' ' + employe.managerNom + '</p>' +
                    '</a></li>');
            }

            if (employe.reportCount > 0) {
                $('#actionList').append(
                    '<li class="list-group-item"> '
                    + '<a href="reportList.html?id=' + employe.id + '" > '
                    + '<p class="list-group-item"> Voir subordonnes </p>'
                    + '<p class="list-group-item">' + employe.reportCount +'</p>' +
                    '</a></li>');
            }


            if (employe.email != null) {
                $('#actionList').append(
                    '<li class="list-group-item"> <p>'
                    + '<a href="mailto:' + employe.email + '" > '
                    + 'sendMail : '+employe.email
                    +  '</p>' +
                    '</a></li>'
                );
            }

            $('#actionList').append(
                '<li class="list-group-item">'
                + '<a href="#" id="adcontact"><p class="list-group-item" >  Ajouter Contact '
                + '</p ></a >'
                + '</li>'
            );

        


            $('#actionList').append(
            '<a href=index.html><button type="button" class="btn btn-primary">Home</button></a>'
            );
        
            var call = addContact(employe); 
            $('#adcontact').bind('click', call);

        setTimeout(scroll.refresh, 1000);
        db = null;
    }

        
    

    function addContact(employe) {
        return function () {

      
        var contact = navigator.contacts.create();
        contact.displayName = employe.prenom + ' ' + employe.nom;

        var name = new ContactName();
        name.givenName = employe.prenom;
        name.familyName = employe.nom;
        contact.name = name;

        var phoneNumber = [];
        if (employe.telBureau) {
            phoneNumber.push(new ContactField('work', employe.telBureau, true));
        }
        if(employe.telPortable) {
            phoneNumber.push(new ContactField('mobile', employe.telPortable, false));
        }

        var emails = [];
        if (employe.email) {
            emails.push(new ContactField('work', employe.email, true));
        }
        contact.emails = emails;
        contact.save(onContactSuccess, onContactError);
        }
    }


    function onContactSuccess(contact) {
        alert("Le contact " + contact.displayName + " a bien été enregistré.");
    }

    function onContactError(contact) {
        alert("Erreur = " + contactError.code);
    }








})();

