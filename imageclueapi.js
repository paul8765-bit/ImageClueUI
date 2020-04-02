function btnPlayersClick() {
    var textbox = document.getElementById("txt_inPlayers");
    var players = textbox.value;

    const Http = new XMLHttpRequest();
    const url = 'http://35.179.62.132:44354/imageclueapi/getteams/' + players;
    Http.open("GET", url);
    Http.setRequestHeader("Access-Control-Allow-Origin", "*");
    Http.setRequestHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    Http.setRequestHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
    Http.send();

    Http.onreadystatechange = (e) => {
        var teamsString = Http.responseText;

        // For some reason the first time this code runs, this variable is blank. If so, skip
        if (teamsString == "") {
            return;
        }
        console.log(teamsString);
        document.getElementById("outTeams").textContent = teamsString;

        // Display the teams in a clear format
        var teamsArray = JSON.parse(teamsString);
        var userFriendlyTeams = "";
        for (var teamIndex = 0; teamIndex < teamsArray.length; teamIndex++) {
            var currentTeam = teamsArray[teamIndex];
            console.log(currentTeam);
            userFriendlyTeams += "Team " + (teamIndex + 1) + " has " + currentTeam.length + " members\n";
            for (var teamMemberIndex = 0; teamMemberIndex < currentTeam.length; teamMemberIndex++) {
                var currentTeamMember = currentTeam[teamMemberIndex];
                console.log(currentTeamMember);
                userFriendlyTeams += "    " + currentTeamMember + "\n";
            }
        }
        document.getElementById("outTeamsUserFriendly").textContent = userFriendlyTeams;
        document.getElementById("outTeamsUserFriendly").hidden = false;
    }
}

function btnClues() {
    // Now do the clues request
    var teams = document.getElementById("outTeams").textContent;
    const Http = new XMLHttpRequest();
    const url = 'http://35.179.62.132:44354/imageclueapi/getclues/' + teams;
    Http.open("GET", url);
    Http.setRequestHeader("Access-Control-Allow-Origin", "*");
    Http.setRequestHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    Http.setRequestHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
    Http.send();

    Http.onreadystatechange = (e) => {
        var cluesString = Http.responseText;
        if (cluesString == "") {
            return;
        }
        console.log(cluesString);

        // Pretty this up before displaying
        var userFriendlyClues = "";
        var cluesArray = JSON.parse(cluesString);
        for (var clueIndex = 0; clueIndex < cluesArray.length; clueIndex++) {
            var currentClue = cluesArray[clueIndex];
            console.log(currentClue);
            userFriendlyClues += "Team " + (clueIndex + 1) + ": please draw a " + currentClue.Adjective + " " + currentClue.Noun + "\n";
        }

        document.getElementById("outClues").textContent = userFriendlyClues;
        document.getElementById("outClues").hidden = false;
    }
}