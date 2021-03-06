// game.js
// Copyright (c) James Mithen 2014.
// Main game object and a couple of modules.

'use strict';
/*jslint browser:true */

var game = {};

// from the book 'Javascript Design Patterns' by Stefanov
game.namespace = function (ns_string) {
    var parts = ns_string.split('.'),
        parent = game,
        i;

    // strip redundant leading global
    if (parts[0] === "game") {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i += 1) {
        // create a property if it doesn't exist
        if (parent[parts[i]] === undefined) {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

// game constants (these should not modified during game)
game.namespace('constants');
game.constants = {
    // frames per second for the logic (and the rendering if
    // RequestAnimationFrame is not supported)
    fps: 40,
    wallWidth: 5, // in pixels
};

// global game state that can be accessed by one and all
game.namespace('state');
// named constants for the possible states we can be in
game.state = {
    STATE_START: 'start', // press any key to start
    STATE_PLAY: 'play',   // can actually shoot things
    STATE_TXT: 'txt',     // reading a text page
    currentState: 'start',
    // text rects contain the actual CV info
    textRects : []
};
