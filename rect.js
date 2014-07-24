// rect.js
// Copyright (c) James Mithen 2014.

'use strict';
/*global game*/

game.namespace('rect');

game.rect.Rect = function (x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
};
