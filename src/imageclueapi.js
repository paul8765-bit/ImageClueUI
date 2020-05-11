try {
    exports.getUrl = getUrl;
    exports.createCSharpTuple = createCSharpTuple;
    exports.convertTupleArrayToJSON = convertTupleArrayToJSON;
}
catch (err) {
    // Expect this to throw an exception in browser, but the code works in Mocha
}

function btnAddRows() {
    const table = document.getElementById("tbl_Players");
    const row = table.insertRow(table.rows.length);

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);

    // Add some text to the new cells:
    cell1.innerHTML = '<div name="tbl_editable_name_fields" contenteditable="">player</div>';
    cell2.innerHTML = '<div name="tbl_editable_phone_fields" contenteditable="">44</div>';
}

async function btnPlayersClick() {
    const players = getPlayersAndPhones(document.getElementById("tbl_Players"));
    const teamID = await sendImageClueApiRequest("getteams", players);

    // Store this teamsID in a hidden field so we can submit it to the API later
    setElementTextContent("outTeams", teamID);

    // Display the teams in a clear format
    const userFriendlyTeams = await sendImageClueApiRequest("getteamsdetails", teamID);
    setElementMultiLineContent("outTeamsUserFriendly", userFriendlyTeams);
}

async function btnSendSMS() {
    const teamsID = getElementTextContent("outTeams");
    const cluesID = getElementTextContent("outCluesHidden");
    const smsSendResult = await sendImageClueApiRequest("sendsms", teamsID + '/' + cluesID);
    if (smsSendResult === 'true') {
        setElementTextContent("outSendSMSStatus", 'Successfully sent SMS messages!');
    }
    else {
        console.log(smsSendResult);
        setElementTextContent("outSendSMSStatus", smsSendResult);
    }
}

function getPlayersAndPhones(table) {
    // Player 1d array
    const playerArray = new Array(table.rows.length - 1);

    //loops through rows (skipping the header row)   
	table.rows.forEach((currentRow, index) => {
		// Skip the headers on the first row
		if (index >= 1) {
			// Assume that name is the first cell
			playerArray[currentRowIndex - 1] = createCSharpTuple(currentRow.cells[0].innerText, currentRow.cells[1].innerText);
		}
	});

    return convertTupleArrayToJSON(playerArray);
}

function createCSharpTuple(currentPlayerName, currentPlayerPhone) {
    return '{"Item1":"' + currentPlayerName + '","Item2":"' + currentPlayerPhone + '"}';
}

function convertTupleArrayToJSON(playerArray) {
    let output = '[';
	playerArray.forEach((currentPlayer, playerIndex) => {
		output += currentPlayer;
        if (playerIndex + 1 < playerArray.length) {
            output += ',';
        }
	});
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
    const teams = getTeamsInput();
    const cluesID = await sendImageClueApiRequest("getclues", teams);
    setElementTextContent("outCluesHidden", cluesID);
    const userFriendlyClues = await sendImageClueApiRequest("getcluesdetails", cluesID);
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
    const responseString = data;
    console.log(responseString);
    return responseString;
}

function getUrl(apiMethod, apiParameter) {
    let myUrl;
    const environment = getURLParam();
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
        const environment = urlParams.get("env");
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
    const ourHeaders = new Headers();
    ourHeaders.append("Access-Control-Allow-Origin", "*");
    ourHeaders.append("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    ourHeaders.append("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
    let fetchData = {
        method: 'GET',
        headers: ourHeaders
    }
    return fetchData;
}