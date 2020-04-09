var assert = require('assert');
const imageclueapi = require('../imageclueapi');

describe('Test getting the URL for the request', function () {
    it('should return URL for getteams', function () {
        var url = imageclueapi.getUrl('getteams', 'Paul|Emily');
        var expected = 'http://52.6.180.102:44354/imageclueapi/getteams/Paul|Emily';
        assert.equal(url, expected);
    });
    it('should return URL for getclues', function () {
        assert.equal(imageclueapi.getUrl('getclues', '[[%22paul%22,%22roger%22],[%22chris%22,%22steve%22],[%22emily%22,%22hicksy%22]]'),
            'http://52.6.180.102:44354/imageclueapi/getclues/[[%22paul%22,%22roger%22],[%22chris%22,%22steve%22],[%22emily%22,%22hicksy%22]]');
    });
});

describe('Test getting user friendly teams', function () {
    it('Test successful response', function () {
        var input = '[["Paul","Joe"],["Chris","Emily"]]';
        var response = imageclueapi.getUserFriendlyTeams(input);
        assert.equal(response, 'Team 1 has 2 members\n    Paul\n    Joe\nTeam 2 has 2 members\n    Chris\n    Emily\n');
    })
});

describe('Test converting an array to a pipe-separated string', function () {
    it('Test successful conversion', function () {
        var input = new Array(4);
        input[0] = 'Paul';
        input[1] = 'Chris';
        input[2] = 'Joe';
        input[3] = 'Emily';
        var response = imageclueapi.convertArrayToPipeSeparatedString(input);
        assert.equal(response, 'Paul|Chris|Joe|Emily');
    })
});