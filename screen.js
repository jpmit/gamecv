// screen.js
// Copyright (c) James Mithen 2014.
// Handle canvas resizing etc

'use strict';
/*global game*/
/*jslint browser:true*/

var screen = game.namespace('screen');

// the main context used by the game for drawing
screen.canvas = document.getElementById("game");
screen.ctx = screen.canvas.getContext('2d');
// canvas co-ords of the top left (xmin, ymin) and bottom right (xmax,
// ymax) points of the canvas corresponding to the play area.
screen.xmin = game.constants.wallWidth;
screen.ymin = game.constants.wallWidth;
// xmax and ymax can change as the user resizes the window!
screen.xmax = null;
screen.ymax = null;

screen.setCanvasSize = function () {
    var c = screen.canvas,
        ww = game.constants.wallWidth;

    c.width = window.innerWidth;
    c.height = 0.9 * window.innerHeight;
    screen.width = c.width;
    screen.height = c.height;

    screen.ctx = c.getContext('2d');

    screen.xmax = c.width - ww;
    screen.ymax = c.height - ww;

    // reset canvas details
    screen.ctx.fillStyle = '#FFF';
    screen.ctx.strokeStyle = '#FFF';
    screen.ctx.font = "20px Monospace";

    // re-create the background
    game.background.create(c.width, c.height);

    // set game state to start (will reset ship positions)
    game.main.setGameStart();

    // hide the text
    document.getElementById("text").style.display = 'none';
};

// called by game once loading complete
screen.showCanvas = function () {
    screen.canvas.style.display = 'block';
};

window.onresize = screen.setCanvasSize;
