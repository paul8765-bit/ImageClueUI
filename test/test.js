var assert = require('assert');
const imageclueapi = require('../src/imageclueapi');

describe('Test getting the URL for the request', function () {
    it('should return URL for getteams', function () {
        var url = imageclueapi.getUrl('getteams', 'Paul|Emily');
        var expected = 'https://imageclue.co.uk:44354/imageclueapi/getteams/Paul|Emily';
        assert.equal(url, expected);
    });
    it('should return URL for getclues', function () {
        assert.equal(imageclueapi.getUrl('getclues', '[[%22paul%22,%22roger%22],[%22chris%22,%22steve%22],[%22emily%22,%22hicksy%22]]'),
            'https://imageclue.co.uk:44354/imageclueapi/getclues/[[%22paul%22,%22roger%22],[%22chris%22,%22steve%22],[%22emily%22,%22hicksy%22]]');
    });
});

describe('Test conversion of player input into the C Sharp Tuple format', function () {
    it('Test successful conversion', function () {
        var output = imageclueapi.createCSharpTuple('Paul', '441111');
        assert.equal(output, '{"Item1":"Paul","Item2":"441111"}');
    })
});

describe('Test conversion of the players to a full JSON of players', function () {
    it('Test successful conversion', function () {
        var playerArray = new Array(4);
        playerArray[0] = '{"Item1":"Paul","Item2":"441111"}';
        playerArray[1] = '{"Item1":"Ben","Item2":"442222"}';
        playerArray[2] = '{"Item1":"Chris","Item2":"443333"}';
        playerArray[3] = '{"Item1":"Emily","Item2":"444444"}';
        var output = imageclueapi.convertTupleArrayToJSON(playerArray);
        var expected = '[{"Item1":"Paul","Item2":"441111"},{"Item1":"Ben","Item2":"442222"},{"Item1":"Chris","Item2":"443333"},{"Item1":"Emily","Item2":"444444"}]';
        assert.equal(output, expected);
    })
});
