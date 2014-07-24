// jukebox.js
// Copyright (c) James Mithen 2014.
// a jukebox 'class' for managing music and sfx

'use strict';
/*global game*/

var juke = game.namespace('juke');

juke.constants = {musicVol: 0.4,
                  sfxVol: 0.8,
                  music: {},
                  sfx: {'laser': 'audio/laser',
                        'beam': 'audio/beam',
                        'hit': 'audio/hit',
                        'collide': 'audio/coll',
                        'thrust': 'audio/thrust'}
                 };

juke.Juke = function () {
    /*global Audio*/
    var test = new Audio(),
        ext,
        playingMusic = false,
        playingName = "",
        muted = false;

    this.music = {};
    this.sfx = {};

    // it doesn't seem that this type of thing is bulletproof, but
    // there doesn't seem to be a better alternative.
    if (test.canPlayType("audio/ogg") !== "") {
        ext = "ogg";
    } else if (test.canPlayType("audio/mp3") !== "") {
        ext = "mp3";
    }

    function loadAudio(nameMap, store, loop, volume) {
        var k, m;
        for (k in nameMap) {
            if (nameMap.hasOwnProperty(k)) {
                m = new Audio(nameMap[k] + "." + ext);
                m.loop = loop;
                m.volume = volume;
                m.load();
                store[k] = m;
            }
        }
    }

    this.loadMusic = function (musicMap) {
        loadAudio(musicMap, this.music, true, juke.constants.musicVol);
    };

    this.loadSfx = function (sfxMap) {
        loadAudio(sfxMap, this.sfx, false, juke.constants.sfxVol);
        // hack for loopable thrust sfx
        this.sfx.thrust.loop = true;
    };

    this.playMusic = function (name) {
        if (!muted && !playingMusic) {
            this.music[name].play();
            playingMusic = true;
            playingName = name;
        }
    };

    this.stopMusic = function () {
        if (playingMusic) {
            this.music[playingName].pause();
            playingMusic = false;
            // just in case
            playingName = "";
        }
    };

    this.playSfx = function (name) {
        if (!muted) {
            this.sfx[name].play();
        }
    };

    this.stopSfx = function (name) {
        this.sfx[name].pause();
        this.sfx[name].currentTime = 0;
    };

    this.mute = function () {
        muted = true;
        this.stopMusic();
    };

    this.unmute = function () {
        muted = false;
        this.playMusic('main');
    };
};

// create jukebox object for in game audio
juke.jukebox = new game.juke.Juke();
juke.jukebox.loadMusic(juke.constants.music);
juke.jukebox.loadSfx(juke.constants.sfx);
