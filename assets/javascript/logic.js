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
        var sv = snapshot.val();
        console.log(sv);

        // Console.logging the last user's data
        opponentGuess = sv;

        if(opponentGuess !== ""){
            play(userGuess);
        }

        // Handle the errors
        }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    }); 


    // This function is run whenever the user presses a key.
    document.onkeyup = function(event) {
        if((event.key === "r") || (event.key === "p") || (event.key === "s")) {
            play(event.key);
        }
    };

    function play(keyPress){
        // Determines which key was pressed.
        userGuess = keyPress;

        database.ref(player).set({
            guess: userGuess,
            wins: wins,
            losses: losses,
            ties: ties
        }).then(function() {
            console.log(userGuess);
            console.log('Synchronization succeeded');
          })
          .catch(function(error) {
            console.log('Synchronization failed');
          });

        // Reworked our code from last step to use "else if" instead of lots of if statements.
        if(opponentGuess !== ""){
            // This logic determines the outcome of the game (win/loss/tie), and increments the appropriate number
            //if ((userGuess === "r") || (userGuess === "p") || (userGuess === "s")) {

                if ((userGuess === "r" && opponentGuess === "s") ||
                (userGuess === "s" && opponentGuess === "p") || 
                (userGuess === "p" && opponentGuess === "r")) {
                wins++;
                } else if (userGuess === opponentGuess) {
                ties++;
                } else {
                losses++;
                }

                // Hide the directions
                directionsText.textContent = "";

                // Display the user and computer guesses, and wins/losses/ties.
                userChoiceText.textContent = "You chose: " + userGuess;
                opponentChoiceText.textContent = "Your opponent chose: " + opponentGuess;
                winsText.textContent = "wins: " + wins;
                lossesText.textContent = "losses: " + losses;
                tiesText.textContent = "ties: " + ties;

                //reset opponents input value after complete
                database.ref(opponent).set({
                    guess: "",
                    wins: wins,
                    losses: losses,
                    ties: ties
                    });
            //}
        }
        else{
            opponentChoiceText.textContent = "Waiting for opponent to chose their weapon..";
            console.log("no input from opponent, checking again..");
            //play(userGuess);
        }
    }
});