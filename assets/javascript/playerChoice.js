$(document).ready(function(){

    firebase.initializeApp(firebaseConfig);

    // Create a variable to reference the database.
    var database = firebase.database();


    $("#player1-btn").on("click", function(){

        sessionStorage.clear();
        var myPlayer = "player1";
        sessionStorage.setItem("player", myPlayer);

        database.ref(myPlayer).set({
                guess: "",
                wins: 0,
                losses: 0,
                ties: 0
            });

        window.location.href = "player-1.html";

    });

    $("#player2-btn").on("click", function(){

        sessionStorage.clear();
        var myPlayer = "player2";
        sessionStorage.setItem("player", myPlayer);

        database.ref(myPlayer).set({
                guess: "",
                wins: 0,
                losses: 0,
                ties: 0
            });

        window.location.href = "player-2.html";        

    });


});


