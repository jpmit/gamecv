// objects.js
// Copyright (c) James Mithen 2014.
// Handling and storage of game objects

'use strict';
/*global game*/

var objects = game.namespace('objects');

objects.ship = new game.sprites.ship.Ship([100, 100]);
// lists of game objects
objects.txtSprites = [];
objects.bullets = [];

Array.prototype.remove = function (value) {
    var idx = this.indexOf(value);
    if (idx !== -1) {
        return this.splice(idx, 1);
    }
    return false;
};

// remove a single object from the specified object list
// this uses augmented Array method (remove), see util.js
objects.remove = function (ob, oblist) {
    oblist.remove(ob);
};

// add a single object from the specified object list
objects.add = function (ob, oblist) {
    oblist.push(ob);
};
