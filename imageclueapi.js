exports.getUrl = getUrl;
exports.getUserFriendlyTeams = getUserFriendlyTeams;
exports.createCSharpTuple = createCSharpTuple;
exports.convertTupleArrayToJSON = convertTupleArrayToJSON;

function btnAddRows() {
    var table = document.getElementById("tbl_Players");
    var row = table.insertRow(table.rows.length);

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    // Add some text to the new cells:
    cell1.innerHTML = '<div name="tbl_editable_name_fields" contenteditable="">player</div>';
    cell2.innerHTML = '<div name="tbl_editable_phone_fields" contenteditable="">44</div>';
}

async function btnPlayersClick() {
    var players = getPlayersAndPhones(document.getElementById("tbl_Players"));
    var teamsString = await sendImageClueApiRequest("getteams", players);

    // Store this raw JSON in a hidden field so we can submit it to the API later
    setElementTextContent("outTeams", teamsString);

    // Display the teams in a clear format
    var userFriendlyTeams = getUserFriendlyTeams(teamsString);
    setElementTextContent("outTeamsUserFriendly", userFriendlyTeams);
}

async function btnSendSMS() {
    var teams = getElementTextContent("outTeams");
    var clues = getElementTextContent("outCluesHidden");
    try {
        var smsSendResult = await sendImageClueApiRequest("sendsms", teams + '|' + clues);
        if (smsSendResult === 'true') {
            setElementTextContent("outSendSMSStatus", 'Successfully sent SMS messages!');
        }
        else {
            setElementTextContent("outSendSMSStatus", 'Failed to send one or more SMS messages');
        }
    }
    catch (err) {
        console.log(err);
        setElementTextContent("outSendSMSStatus", err);
    }
}

function getPlayersAndPhones(table) {
    //gets rows of table
    var rowsArray = table.rows;

    // Player 1d array
    var playerArray = new Array(rowsArray.length - 1);

    //loops through rows (skipping the header row)   
    for (currentRowIndex = 1; currentRowIndex < rowsArray.length; currentRowIndex++) {

        //gets cells of current row  
        var currentRowCells = rowsArray[currentRowIndex].cells;

        // Assume that name is the first cell
        var currentPlayerName = currentRowCells[0].innerText;
        var currentPlayerPhone = currentRowCells[1].innerText;
        var tuple = createCSharpTuple(currentPlayerName, currentPlayerPhone);
        playerArray[currentRowIndex - 1] = tuple;
    }
    return convertTupleArrayToJSON(playerArray);
}

function createCSharpTuple(currentPlayerName, currentPlayerPhone) {
    return '{"Item1":"' + currentPlayerName + '","Item2":"' + currentPlayerPhone + '"}';
}

function convertTupleArrayToJSON(playerArray) {
    var output = '[';
    for (playerIndex = 0; playerIndex < playerArray.length; playerIndex++) {
        var currentPlayer = playerArray[playerIndex];
        output += currentPlayer;
        if (playerIndex + 1 < playerArray.length) {
            output += ',';
        }
    }
    output += ']';
    return output;
}

function getPlayersAndMobileNumbers(table) {
    //gets rows of table
    var rowsArray = table.rows;

    // Player/phone 2d array
    var playerPhoneArray = new Array(rowsArray.length - 1);

    //loops through rows (skipping the header row)   
    for (currentRowIndex = 1; currentRowIndex < rowsArray.length; currentRowIndex++) {

        //gets cells of current row  
        var currentRowCells = rowsArray[currentRowIndex].cells;

        var currentPlayerAndPhone = new Array(currentRowCells.length);

        //loops through each cell in current row
        for (var currentCellIndex = 0; currentCellIndex < currentRowCells.length; currentCellIndex++) {
            currentPlayerAndPhone[currentCellIndex] = currentRowCells[currentCellIndex].innerText;
        }

        playerPhoneArray[currentRowIndex - 1] = currentPlayerAndPhone;
    }
    return playerPhoneArray;
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
            userFriendlyTeams += "    " + currentTeamMember.Item1 + "\n";
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
    setElementTextContent("outCluesHidden", cluesString);
    var userFriendlyClues = getUserFriendlyClues(cluesString);
    setElementTextContent("outClues", userFriendlyClues);
}

function getTeamsInput() {
    // TODO: something more clever for testing here
    return getElementTextContent("outTeams");
}

async function sendImageClueApiRequest(apiMethod, apiParameter) {
    const url = getUrl(apiMethod, apiParameter);
    let fetchData = getApiHeadersAndFetchData();
    let response = await fetch(url, fetchData);
    let data = await response.text();
    var responseString = data;
    console.log(responseString);
    return responseString;
}

function getUrl(apiMethod, apiParameter) {
    //const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const myUrl = 'http://52.6.180.102:44354/imageclueapi/';
    return myUrl + apiMethod + '/' + apiParameter;
}

function getApiHeadersAndFetchData() {
    var ourHeaders = new Headers();
    ourHeaders.append("Access-Control-Allow-Origin", "*");
    ourHeaders.append("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    ourHeaders.append("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
    let fetchData = {
        method: 'GET',
        headers: ourHeaders
    }
    return fetchData;
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