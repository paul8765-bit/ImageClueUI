var assert = require('assert');
const imageclueapi = require('../imageclueapi');

describe('Test get players input', function () {
    it('should return names with pipe separators', function () {
        assert.equal(imageclueapi.getPlayersInput('Paul\nEmily'), 'Paul|Emily');
    });
    it('should return input if newline is not present', function () {
        assert.equal(imageclueapi.getPlayersInput('Paul&Emily'), 'Paul&Emily');
    });
    it('longer list of names, including spaces', function () {
        assert.equal(imageclueapi.getPlayersInput('Paul\nEmily\nBen\nWinnie'), 'Paul|Emily|Ben|Winnie');
    });
});

describe('Test getting the URL for the request', function () {
    it('should return URL for getteams', function () {
        var url = imageclueapi.getUrl('getteams', 'Paul|Emily');
        var expected = 'http://35.179.62.132:44354/imageclueapi/getteams/Paul|Emily';
        assert.equal(url, expected);
    });
    it('should return URL for getclues', function () {
        assert.equal(imageclueapi.getUrl('getclues', '[[%22paul%22,%22roger%22],[%22chris%22,%22steve%22],[%22emily%22,%22hicksy%22]]'),
            'http://35.179.62.132:44354/imageclueapi/getclues/[[%22paul%22,%22roger%22],[%22chris%22,%22steve%22],[%22emily%22,%22hicksy%22]]');
    });
});

describe('Test getting user friendly teams', function () {
    it('Test successful response', function () {
        var input = '[["Paul","Joe"],["Chris","Emily"]]';
        var response = imageclueapi.getUserFriendlyTeams(input);
        assert.equal(response, 'Team 1 has 2 members\n    Paul\n    Joe\nTeam 2 has 2 members\n    Chris\n    Emily\n');
    })
});