async function btnPlayersClick() {
    var players = getPlayersInput(document.getElementById("txt_inPlayers").value);
    var teamsString = await sendImageClueApiRequest("getteams", players);

    // Store this raw JSON in a hidden field so we can submit it to the API later
    setElementTextContent("outTeams", teamsString);

    // Display the teams in a clear format
    var userFriendlyTeams = getUserFriendlyTeams(teamsString);
    setElementTextContent("outTeamsUserFriendly", userFriendlyTeams);
}

function getPlayersInput(rawInput) {
    return rawInput.replace(/\n/g, "|");
}

function getUserFriendlyTeams(teamsString) {
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
    return userFriendlyTeams;
}

function getElementTextContent(elementId) {
    return document.getElementById(elementId).textContent;
}

function setElementTextContent(elementId, text) {
    document.getElementById(elementId).textContent = text;
    document.getElementById(elementId).hidden = false;
}

async function btnClues() {
    // Now do the clues request
    var teams = getTeamsInput();
    var cluesString = await sendImageClueApiRequest("getclues", teams);
    var userFriendlyClues = getUserFriendlyClues(cluesString);
    setElementTextContent("outClues", userFriendlyClues);
}

function getTeamsInput() {
    // TODO: something more clever for testing here
    return getElementTextContent("outTeams");
}

async function sendImageClueApiRequest(apiMethod, apiParameter) {
    const url = 'http://35.179.62.132:44354/imageclueapi/' + apiMethod + '/' + apiParameter;
    const ourHeaders = new Headers();
    ourHeaders.append("Access-Control-Allow-Origin", "*");
    ourHeaders.append("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    ourHeaders.append("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
    let fetchData = {
        method: 'GET',
        headers: ourHeaders
    }

    let response = await fetch(url, fetchData);
    let data = await response.text();
    var responseString = data;
    console.log(responseString);
    return responseString;
}

function getUserFriendlyClues(cluesString) {
    var userFriendlyClues = "";
    var cluesArray = JSON.parse(cluesString);
    for (var clueIndex = 0; clueIndex < cluesArray.length; clueIndex++) {
        var currentClue = cluesArray[clueIndex];
        console.log(currentClue);
        userFriendlyClues += "Team " + (clueIndex + 1) + ": please draw a " + currentClue.Adjective + " " + currentClue.Noun + "\n";
    }
    return userFriendlyClues;
}