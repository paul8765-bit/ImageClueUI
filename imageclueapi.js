try {
    exports.getUrl = getUrl;
    exports.createCSharpTuple = createCSharpTuple;
    exports.convertTupleArrayToJSON = convertTupleArrayToJSON;
}
catch (err) {
    // Expect this to throw an exception in browser, but the code works in Mocha
}

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
    var teamID = await sendImageClueApiRequest("getteams", players);

    // Store this teamsID in a hidden field so we can submit it to the API later
    setElementTextContent("outTeams", teamID);

    // Display the teams in a clear format
    var userFriendlyTeams = await sendImageClueApiRequest("getteamsdetails", teamID);
    setElementMultiLineContent("outTeamsUserFriendly", userFriendlyTeams);
}

async function btnSendSMS() {
    var teamsID = getElementTextContent("outTeams");
    var cluesID = getElementTextContent("outCluesHidden");
    var smsSendResult = await sendImageClueApiRequest("sendsms", teamsID + '/' + cluesID);
    if (smsSendResult === 'true') {
        setElementTextContent("outSendSMSStatus", 'Successfully sent SMS messages!');
    }
    else {
        console.log(smsSendResult);
        setElementTextContent("outSendSMSStatus", smsSendResult);
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

function getElementTextContent(elementId) {
    return document.getElementById(elementId).textContent;
}

function setElementMultiLineContent(elementId, text) {
    text = text.replace(/"/g, "");
    text = text.replace(/\\n/g, "&#013;");
    document.getElementById(elementId).innerHTML = text;
}

function setElementTextContent(elementId, text) {
    document.getElementById(elementId).textContent = text;
    document.getElementById(elementId).hidden = false;
}

async function btnClues() {
    // Now do the clues request
    var teams = getTeamsInput();
    var cluesID = await sendImageClueApiRequest("getclues", teams);
    setElementTextContent("outCluesHidden", cluesID);
    var userFriendlyClues = await sendImageClueApiRequest("getcluesdetails", cluesID);
    setElementMultiLineContent("outClues", userFriendlyClues);
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
    var myUrl;
    var environment = getURLParam();
    // If we're in UAT, access the UAT API
    if (environment != null && (environment === 'uat' || environment === 'UAT')) {
        myUrl = 'https://34.193.188.174:44354/imageclueapi/'
    }
    else {
        myUrl = 'https://imageclue.co.uk:44354/imageclueapi/';
    }
    return myUrl + apiMethod + '/' + apiParameter;
}

function getURLParam() {
    try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        var environment = urlParams.get("env");
        if (environment != null && environment != '') {
            return environment;
        }
        // Default is no env
        return null;
    }
    catch (err) {
        // Default is no env
        return null;
    }
    
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