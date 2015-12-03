var mongoose = require("mongoose");
var arena = require("../models/arena");
var async = require('async');
var assert = require("assert");

mongoose.connect('mongodb://localhost/test_ghe_game');
var getTestDataForArena = function(callback){
    var tiles = [

        [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        [ 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
        [ 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [ 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        [ 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        [ 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        [ 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0]

    ];
    var retValues = [];
    for(var i in tiles ){
        for( var j in tiles[i]){
            retValues.push({x: j/1000000000, y: i/1000000000, type: tiles[i][j]});
        }
    }
    callback(retValues);
}
describe("Arena", function(){


    beforeEach(function(done){
        getTestDataForArena(function(tails){
            async.each(tails, function(tail, callback){
                arena.addLocation(tail.x, tail.y, 0, 0, tail.type, callback)
            }, function(){
                done();
            });
        });


    });

    afterEach(function(done){
        arena.locationModel.remove({}, function() {
            console.log('removed');
            done();
        });
    });

    describe('findInSquare()', function() {
        it("Should find 4 tiles in square from 0-0 to 1-1", function (done) {
            arena.findInSquare(0, 0, 1/1000000000, 1/1000000000, function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    console.log(result);
                    assert.equal(4, result.length);

                }
                done();
            })

        });
    });
    describe('findInSquare()', function() {
        it("Should find 6 tiles in square from 1-1 to 2-3", function (done) {
            arena.findInSquare(1/1000000000, 1/1000000000, 2/1000000000, 3/1000000000, function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    console.log(result);
                    assert.equal(6, result.length);

                }
                done();
            })

        });
    });
    describe('findInSquare()', function() {
        it("Should find 11 tiles in square from 0-10 to 10-10", function (done) {
            arena.findInSquare(0, 10/1000000000, 10/1000000000, 10/1000000000, function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    console.log(result);
                    assert.equal(11, result.length);

                }
                done();
            })

        });
    })



});