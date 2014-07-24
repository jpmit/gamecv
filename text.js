// text.js
// Copyright (c) James Mithen 2014.
// Text stuff

'use strict';
/*global game, $*/
/*jslint browser:true*/

var text = game.namespace('text');

text.constants = {
    txtPerSec: 1, // 1 / number of text rects appearing per sec on average
    txtTime: 10,  // time each text rect exists for
    maxNum: 2,    // maximum number of text sprites
    maxVel: 100,  // maximum velocity in pixels per second
    txtPad: 2,    // padding in pixels either side of the text
    fontStr: "20pt Ubuntu Mono"
};

// set text headings
text.constants.headings = (function () {
    var k,
        cvdata = text.cvdata,
        headings = [];

    for (k in cvdata) {
        if (cvdata.hasOwnProperty(k)) {
            headings.push(k);
        }
    }
    return headings;
}());

// set actual text content for each heading
text.constants.txtData = (function () {
    var i,
        cvdata = text.cvdata,
        headings = text.constants.headings,
        nheadings = headings.length,
        head,
        result = {};

    for (i = 0; i < nheadings; i += 1) {
        head = headings[i];
        result[head] = cvdata[head].text;
    }

    return result;
}());

// modified from stackoverflow.com/questions/1134586/
text.constants.txtHeight = (function () {
    var fontStr = game.text.constants.fontStr,
        text = $('<span>Hgp</span>').css({ fontFamily: fontStr }),
        block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>'),
        div = $('<div></div>'),
        body,
        height;

    div.append(text, block);
    body = $('body');
    body.append(div);

    try {
        block.css({ verticalAlign: 'baseline' });
        block.css({ verticalAlign: 'bottom' });
        height = block.offset().top - text.offset().top;
    } finally {
        div.remove();
    }

    return height;
}());

text.constants.numHeadings = text.constants.headings.length;

// return object with properties 'x' and 'y', where ('x', 'y') in in the play canvas
text.getRandomArenaInts = function () {
    var x,
        y;
    x = Math.floor(Math.random() * (game.screen.xmax - game.screen.xmin) + game.screen.xmin);
    y = Math.floor(Math.random() * (game.screen.ymax - game.screen.ymin) + game.screen.ymin);
    return {'x': x,
            'y': y};
};

text.TextSprite = function (heading, x, y) {
    var c = document.createElement("canvas"),
        ctx = c.getContext("2d"),
        con = text.constants,
        padding = con.txtPad,
        height = con.txtHeight + 2 * padding,
        width,
        fontStr = con.fontStr;

    ctx.font = fontStr;
    width = ctx.measureText(heading).width + 2 * padding;

    // attributes
    this.vx = (Math.random() - 0.5) * 2 * con.maxVel;
    this.vy = (Math.random() - 0.5) * 2 * con.maxVel;
    this.alpha = 1;
    this.heading = heading;
    this.isHit = false;
    this.toRemove = false;

    // create image from text
    c.width = width;
    c.height = height;

    // the font style is
    ctx.font = fontStr;

    ctx.fillStyle = "red";
    ctx.fillText(this.heading, padding, height);
    this.img = c;

    this.rect = new game.rect.Rect(x, y, width, height);

    this.setPos = function (pos) {
        this.rect.x = pos.x;
        this.rect.y = pos.y;
    };

    this.update = function (dt) {

        this.rect.x += this.vx * dt;
        this.rect.y += this.vy * dt;

        if (this.toRemove) {
            game.objects.remove(this, game.objects.txtSprites);
            return;
        }

        if (this.isHit) {
            this.alpha = 1;
            game.main.showText(this);
            this.toRemove = true;
            return;
        }
        this.alpha -= dt / text.constants.txtTime;

        // for some unknown reason, at very small alpha values the
        // text can be drawn very brightly (seen in both Firefox and
        // Chrome); therefore, we remove the
        // text if alpha < 0.1.
        if (this.alpha < 0.1) {
            this.alpha = 0.1;
            this.toRemove = true;
            return;
        }
    };

    // called when the text sprite is hit by a bullet
    this.onhit = function () {
        this.isHit = true;
    };
};

text.TextSprite.prototype = new game.sprites.Sprite();

// get a new text
text.getNew = function (current) {
    var r,
        newSprite,
        head,
        pos,
        c = text.constants,
        ship = game.objects.ship,
        maxTries = 10,
        tries = 0;

    // select the text at random
    r = Math.floor(Math.random() * c.numHeadings);
    head = c.headings[r];
    newSprite = new text.TextSprite(head, 0, 0);

    // create a rect at a random position
    pos = text.getRandomArenaInts(newSprite.rect.width,
                                  newSprite.rect.height);
    newSprite.setPos(pos);
    while ((newSprite.collideAllRect(current) || newSprite.collideRect(ship))
            && (tries < maxTries)) {
        pos = text.getRandomArenaInts();
        newSprite.setPos(pos);
    }
    return newSprite;
};
