// main.js
// Copyright (c) James Mithen 2014.
// Main game logic

'use strict';
/*global game*/
/*jslint browser:true*/

game.namespace('main');

game.main = (function () {
    var then = Date.now(),
        ctx = game.screen.ctx;

    // initialise ships etc
    function setGameStart() {
        game.state.currentState = game.state.STATE_START;
        game.objects.ship.reset([0.9 * game.screen.xmax, 0.1 * game.screen.ymax]);
    }

    // main draw function (called every frame)
    function draw() {
        var i,
            ship = game.objects.ship,
            bullets = game.objects.bullets,
            txtSprites = game.objects.txtSprites;

        // draw background
        game.background.b1.draw(ctx);
        game.background.b2.draw(ctx);
        game.background.b3.draw(ctx);

        if (game.state.currentState === game.state.STATE_START) {
            ctx.fillText("Press any key to start",
                         game.screen.width / 2 - 330,
                         game.screen.height / 2 - 50);
        }

        // the text
        for (i = 0; i !== txtSprites.length; i += 1) {
            txtSprites[i].draw(ctx);
        }

        // ships
        ship.draw(ctx);

        // bullets
        for (i = 0; i !== bullets.length; i += 1) {
            bullets[i].draw(ctx);
        }
    }

    // main update function (called every frame)
    function update(dt) {
        var i,
            ship = game.objects.ship,
            bullets = game.objects.bullets,
            txtSprites = game.objects.txtSprites,
            c = game.text.constants,
            newText;

        if (game.state.currentState !== game.state.STATE_PLAY) {
            return;
        }

        ship.update(dt);

        // bullets
        for (i = 0; i < bullets.length; i += 1) {
            bullets[i].update(dt);
        }

        // text rects
        for (i = 0; i < txtSprites.length; i += 1) {
            txtSprites[i].update(dt);
        }

        // try adding a text rect
        if (Math.random() < dt / c.txtPerSec) {
            // limit the total number of text sprites
            if (txtSprites.length < c.maxNum) {
                newText = game.text.getNew(txtSprites);
                if (newText) {
                    txtSprites.push(newText);
                    game.juke.jukebox.playSfx('beam');
                }
            }
        }

        // move background
        game.background.update(dt);
    }

    // process user input (called every frame)
    function processInput() {
        var i,
            k = game.key,
            state = game.state,
            textEl;

        if (state.currentState === state.STATE_PLAY) {
            game.objects.ship.processInput(k.pressed);
        } else {
            // wait on keydown event
            for (i = 0; i < k.events.length; i += 1) {
                if (k.events[i].down) {
                    // any keydown event will take us from start->play
                    if (state.currentState === state.STATE_START) {
                        state.currentState = state.STATE_PLAY;
                        break;
                    }
                    if (state.currentState === state.STATE_TXT) {
                        // must be return key to go from text to play
                        if (k.events[i].kc === game.key.actions.RET) {
                            state.currentState = state.STATE_PLAY;
                            // hide the text
                            textEl = document.getElementById("text");
                            textEl.scrollTop = 0;
                            textEl.style.display = 'none';
                            break;
                        }
                    }
                }
            }
        }
        // clear events so we don't handle them next frame
        k.events = [];
    }

    // called by window.onload
    function init() {
        var x, mainDraw;

        // configure canvas
        game.screen.setCanvasSize();

        // set game state to start
        setGameStart();

        // requestAnimationFrame
        (function () {
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for (x = 0; x < vendors.length && !window.requestAnimFrame; x += 1) {
                window.requestAnimFrame = window[vendors[x] + 'RequestAnimationFrame'];
            }
        }());

        // we use setInterval for the logic, and requestAnimationFrame
        // for the *drawing only*. If requestAnimationFrame is not
        // supported, the entire game loop is executed by a single
        // setTimeout call (hence why we don't have a setTimeout
        // fallback above).
        if (!window.requestAnimFrame) {
            mainDraw = draw;
        } else {
            mainDraw = function () { return; };
        }

        // logic only (and draw if requestAnimationFrame not supported)
        function main() {
            var now = Date.now(),
                // time elapsed since last tick in s
                dt = (now - then) / 1000;
            processInput();
            update(dt);
            mainDraw();
            then = now;
        }

        // display the div
        document.getElementById("loader").style.display = 'none';
        document.getElementById("topbar").style.display = 'block';
        game.screen.showCanvas();

        window.setInterval(main, 1000 / game.constants.fps);

        function keepDrawing() {
            draw();
            window.requestAnimFrame(keepDrawing);
        }

        if (window.requestAnimFrame) {
            window.requestAnimFrame(keepDrawing);
        }
    }

    function showText(txtSprite) {
        var txtDiv = document.getElementById("text"),
            heading = txtSprite.heading,
            txtString = game.text.constants.txtData[heading];

        game.state.currentState = game.state.STATE_TXT;
        txtDiv.style.display = 'block';
        txtDiv.innerHTML = "<div class=content>" + txtString + "</div>";
    }

    // public API
    return {init: init,
            setGameStart: setGameStart,
            showText: showText
            };
}());
