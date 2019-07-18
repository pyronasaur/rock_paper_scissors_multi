$(document).ready(function(){

    // Creating variables to hold the number of wins, losses, and ties. They start at 0.
    var wins = 0;
    var losses = 0;
    var ties = 0;

    // Create variables that hold references to the places in the HTML where we want to display things.
    var directionsText = document.getElementById("directions-text");
    var userChoiceText = document.getElementById("userchoice-text");
    var opponentChoiceText = document.getElementById("opponentchoice-text");
    var winsText = document.getElementById("wins-text");
    var lossesText = document.getElementById("losses-text");
    var tiesText = document.getElementById("ties-text");
  
    firebase.initializeApp(firebaseConfig);

    // Create a variable to reference the database.
    var database = firebase.database();

    // Initial Values
    var player = sessionStorage.getItem("player");
    var opponent = setOpponent(player);
    var userGuess = "";
    var opponentGuess = "";

    console.log(player);
    console.log(opponent);

    function setOpponent(myPlayer) {

        if(myPlayer === "player1"){
            return "player2";
        }
        if(myPlayer === "player2"){
            return "player1";
        }
    }

    function getOpponentGuess(myOpponent) {
        
    }

    // Firebase watcher for opponent guess
    database.ref(opponent + "/guess").on("value", function(snapshot) {
        // storing the snapshot.val() in a variable for convenience and logging the last user's data
        opponentGuess = snapshot.val();
        console.log(opponentGuess);

        if((userGuess === "r") || (userGuess === "p") || (userGuess === "s")) {
            play(userGuess);
        }

        // Handle the errors
        }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    }); 


    // This function is run whenever the user presses a key.
    document.onkeyup = function(event) {
        if(!$("#chatArea").is(":focus")){
            if((event.key === "r") || (event.key === "p") || (event.key === "s")) {
                play(event.key);
            }
        }
    };
    

    function play(keyPress){
        // Determines which key was pressed.
        userGuess = keyPress;

        userChoiceText.textContent = "You chose: " + userGuess;

        database.ref(player).set({
            guess: userGuess,
            wins: wins,
            losses: losses,
            ties: ties
        })
        .then(function() {
            console.log(userGuess);
            console.log('Synchronization succeeded');
        })
        .catch(function(error) {
            console.log('Synchronization failed');
        });

        if ((opponentGuess === "r") || (opponentGuess === "p") || (opponentGuess === "s")) {                

            battle(userGuess, opponentGuess);                
        }
        
        else{
            opponentChoiceText.textContent = "Waiting for opponent to chose their weapon..";
            console.log("no input from opponent, checking again..");
            //play(userGuess);

        }
    }

    function battle(u, o) {
        if ((u === "r" && o === "s") ||
            (u === "s" && o === "p") || 
            (u === "p" && o === "r")) {
            wins++;
            } else if (u === o) {
            ties++;
            } else {
            losses++;
            }

            // Hide the directions
            directionsText.textContent = "";

            // Display the user and computer guesses, and wins/losses/ties.
            
            opponentChoiceText.textContent = "Your opponent chose: " + opponentGuess;
            winsText.textContent = "wins: " + wins;
            lossesText.textContent = "losses: " + losses;
            tiesText.textContent = "ties: " + ties;

            //reset input values after complete
            resetPlayerChoices();
    }

    function resetPlayerChoices(){

        
        //reset opponents input value after complete
        database.ref(opponent + "/guess").set("");

        database.ref(player).set({
            guess: "",
            wins: wins,
            losses: losses,
            ties: ties
        });

        database.ref(opponent + "/guess").once("value", function(snapshot)
        {
            opponentGuess = snapshot.val();
            console.log("opponentGuess reset to: " + opponentGuess);
        });
        
        database.ref(player + "/guess").on("value", function(snapshot) 
        {
            userGuess = snapshot.val();
            console.log("opponentGuess reset to: " + userGuess);
        });
        
    }


    // #SECTION# Chat window logic #SECTION#
    $("#chat-btn").on("click", function(){
        event.preventDefault();
        
        var chatCard = $("#chatWin");
        var chatArea = $("#chatArea");

        var newP = $("<p>");
        newP.css("color","green");
        newP.css("margin-top","0px");
        newP.css("margin-bottom","0px");
        newP.text(chatArea.val());

        database.ref(player + "/msg").set(chatArea.val());

        chatCard.append(newP);
    });

    // Firebase watcher for opponent guess
    database.ref(opponent + "/msg").on("value", function(snapshot) {

        var opponentMsg = snapshot.val();
        console.log(opponentMsg);

        if(opponentMsg){

            var chatCard = $("#chatWin");
            var chatArea = $("#chatArea");

            var newP = $("<p>");
            newP.css("color","red");
            newP.css("margin-top","0px");
            newP.css("margin-bottom","0px");
            newP.css("text-align","right");
            newP.text(opponentMsg);

            chatCard.append(newP);
        }
        // Handle the errors
        }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
});