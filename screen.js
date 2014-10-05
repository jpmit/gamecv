// screen.js
// Copyright (c) James Mithen 2014.
// Handle canvas resizing etc

'use strict';
/*global game*/
/*jslint browser:true*/

game.namespace('screen');

// the main context used by the game for drawing
game.screen.canvas = document.getElementById("game");
game.screen.ctx = game.screen.canvas.getContext('2d');
// canvas co-ords of the top left (xmin, ymin) and bottom right (xmax,
// ymax) points of the canvas corresponding to the play area.
game.screen.xmin = game.constants.wallWidth;
game.screen.ymin = game.constants.wallWidth;
// xmax and ymax can change as the user resizes the window!
game.screen.xmax = null;
game.screen.ymax = null;

game.screen.setCanvasSize = function () {
    var c = game.screen.canvas,
        ww = game.constants.wallWidth;

    c.width = window.innerWidth;
    c.height = 0.9 * window.innerHeight;
    game.screen.width = c.width;
    game.screen.height = c.height;

    game.screen.ctx = c.getContext('2d');

    game.screen.xmax = c.width - ww;
    game.screen.ymax = c.height - ww;

    // reset canvas details
    game.screen.ctx.fillStyle = '#FFF';
    game.screen.ctx.strokeStyle = '#FFF';
    game.screen.ctx.font = "20px Monospace";

    // re-create the background
    game.background.create(c.width, c.height);

    // set game state to start (will reset ship positions)
    game.main.setGameStart();

    // hide the text
    document.getElementById("text").style.display = 'none';
};

// called by game once loading complete
game.screen.showCanvas = function () {
    game.screen.canvas.style.display = 'block';
};

window.onresize = game.screen.setCanvasSize;
