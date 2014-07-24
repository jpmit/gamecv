// background.js
// Copyright (c) James Mithen 2014.
// Background 'starfield'.

'use strict';
/*global game*/
/*jslint browser:true*/

var background = game.namespace('background');

// adapted from 'Professional HTML5 Mobile Game Development' by Pascal
// Rettig.
background.Starfield = function (width, height, speed, opacity, starsPerArea, clear, color) {
    var stars = document.createElement("canvas"),
        starCtx = stars.getContext("2d"),
        numStars = Math.round(width * height * starsPerArea),
        offset = 0,
        i;
    stars.width = width;
    stars.height = height;

    if (clear) {
        starCtx.fillStyle = "#000";
        starCtx.fillRect(0, 0, stars.width, stars.height);
    }
    starCtx.fillStyle = color;
    starCtx.globalAlpha = opacity;
    for (i = 0; i < numStars; i += 1) {
        starCtx.fillText(Math.random() < 0.5 ? "1" : "0",
                         Math.floor(Math.random() * stars.width),
                         Math.floor(Math.random() * stars.height));
    }

    this.draw = function (ctx) {
        var intOffset = Math.floor(offset),
            remaining = stars.width - intOffset;

        if (intOffset > 0) {
            ctx.drawImage(stars, remaining, 0, intOffset,
                          stars.height, 0, 0, intOffset, stars.height);
        }
        if (remaining > 0) {
            ctx.drawImage(stars, 0, 0, remaining, stars.height,
                          intOffset, 0, remaining, stars.height);
        }
    };

    this.update = function (dt) {
        offset += dt * speed;
        offset = offset % stars.width;
    };
};

background.update = function (dt) {
    background.b1.update(dt);
    background.b2.update(dt);
    background.b3.update(dt);
};

background.create = function (width, height) {
    var b = background;
    b.b1 = new b.Starfield(width, height, 20, 0.2, 0.001, true, "#FFF");
    b.b2 = new b.Starfield(width, height, 50, 0.4, 0.001, false, "#0F0");
    b.b3 = new b.Starfield(width, height, 80, 0.6, 0.0005, false, "#FFF");
};
