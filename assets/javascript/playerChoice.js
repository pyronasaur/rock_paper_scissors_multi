$(document).ready(function(){

    firebase.initializeApp(firebaseConfig);

    // Create a variable to reference the database.
    var database = firebase.database();

    resetPlayerChoices();


    $("#player1-btn").on("click", function(){

        sessionStorage.clear();
        var myPlayer = "player1";
        sessionStorage.setItem("player", myPlayer);

        window.location.href = "player-1.html";

    });

    $("#player2-btn").on("click", function(){

        sessionStorage.clear();
        var myPlayer = "player2";
        sessionStorage.setItem("player", myPlayer);

        window.location.href = "player-2.html";        

    });

    function resetPlayerChoices(){

        //reset opponents input value after complete
        database.ref("player1").set({
            guess: "",
            wins: 0,
            losses: 0,
            ties: 0
        });

        database.ref("player2").set({
            guess: "",
            wins: 0,
            losses: 0,
            ties: 0
        });
    }


});


