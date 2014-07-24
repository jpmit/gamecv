// sprites.js
// Copyright (c) James Mithen 2014.
// Ship and Bullet 'classes' and logic

'use strict';
/*global game*/

var sprites = game.namespace('sprites');
var ship = game.namespace('sprites.ship');
var bullet = game.namespace('sprites.bullet');

// base 'class' (prototype)
sprites.Sprite = function () {
    // inherited class will need to define rect property if we want to
    // use collideRect function below.
    this.rect = game.rect.Rect();

    this.update = function (dt) {
        return dt;
    };

    this.draw = function (ctx) {
        var x,
            y;
        if (this.rect) {
            x = this.rect.x;
            y = this.rect.y;
        } else {
            x = this.x;
            y = this.y;
        }

        ctx.save();
        if (this.alpha) {
            ctx.globalAlpha = this.alpha;
        }
        if (this.angle) {
            ctx.translate(x + this.hwidth, y + this.hheight);
            ctx.rotate(this.angle);
            ctx.drawImage(this.img, -this.hwidth, -this.hheight);
        } else {
            ctx.drawImage(this.img, x, y);
        }
        ctx.restore();
    };

    // collision with other sprite s
    this.collideRect = function (s) {
        var r1 = this.rect,
            r2 = s.rect;
        if ((r1.x + r1.width > r2.x) && (r1.x < r2.x + r2.width)
                && (r1.y + r1.height > r2.height) && (r1.y < r2.y + r2.height)) {
            return true;
        }
        return false;
    };

    this.collideAllRect = function (sg) {
        var i;
        for (i = 0; i < sg.length; i += 1) {
            if (this.collideRect(sg[i])) {
                return true;
            }
        }
        return false;
    };
};

ship.constants = {
    vmax: 300,  // maximum speed
    // if true, 'thruster' is always on
    permanentThrust: true,
    a: 30,
    aThrust: 300,
    gamma: 0.1,
    rotv: 3,
    noRotate: 0,
    leftRotate: -1,
    rightRotate: 1,
    decaySpeed: 100 / 30,
    health: 100 // initial health
};

bullet.constants = {
    v: 500,
    coolDown: 0.4,
    // path to image
    imgSrc: "images/bullet.png",
    // the actual image
    img: {},
};

// load bullet images
(function () {
    /*global Image*/
    var img = new Image();
    function onloadBullet(img) {
        var w = img.width,
            h = img.height;
        bullet.constants.img = img;
        bullet.constants.width = w;
        bullet.constants.height = h;
        bullet.constants.hwidth = w / 2;
        bullet.constants.hheight = h / 2;
    }
    img.src = bullet.constants.imgSrc;
    img.onload = onloadBullet(img);
}());

bullet.Bullet = function (x, y, angle) {
    var c = bullet.constants;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.img = c.img;
    this.hwidth = c.hwidth;
    this.hheight = c.hwidth;

    this.vx = Math.sin(this.angle) * c.v;
    this.vy = -Math.cos(this.angle) * c.v;

    this.update = function (dt) {
        var s = game.screen,
            txtSprites = game.objects.txtSprites,
            i,
            r,
            ntxt;

        this.x = this.x + this.vx * dt;
        this.y = this.y + this.vy * dt;

        // check if the bullet is outside the arena.  We ignore the
        // (negligible) size of the bullets here.
        if (this.x < s.xmin || this.x > s.xmax
                || this.y < s.ymin || this.y > s.ymax) {
            game.objects.remove(this, game.objects.bullets);
        }

        // check if bullet has hit one of the text sprites.
        ntxt = txtSprites.length;
        for (i = 0; i < ntxt; i += 1) {
            r = txtSprites[i].rect;
            if (this.x > r.x && this.x < r.x + r.width &&
                    this.y > r.y && this.y < r.y + r.height) {
                game.juke.jukebox.stopSfx('thrust');
                game.juke.jukebox.playSfx('hit');
                game.objects.remove(this, game.objects.bullets);
                // send signal to the txtSprite
                txtSprites[i].onhit();
            }
        }
    };
};

bullet.Bullet.prototype = new sprites.Sprite();

ship.Ship = function (pos) {
    var img, that;

    // load image
    that = this;
    img = new Image();
    img.src = "images/spaceship.png";
    img.onload = function () {
        that.width = img.width;
        that.height = img.height;
        that.hwidth = img.width / 2;
        that.hheight = img.height / 2;
    };
    this.img = img;
    this.keys = game.key.actions;

    this.reset = function (pos, angle) {
        this.health = ship.constants.health;
        this.flasht = 0;
        this.rect = new game.rect.Rect(pos[0], pos[1], this.width, this.height);
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.angle = angle || 0;
        this.rot = ship.constants.noRotate;
        this.thruster = false;
        this.fired = false;
        this.alpha = 1;
        this.tSinceFired = 1000;
        this.playThrust = false;
    };

    // when created, call reset to set initial data.  We should also
    // call reset at the beginning of each round.
    this.reset(pos);

    this.processInput = function (pressed) {
        var a,
            c = ship.constants,
            keys = this.keys;

        if (this.thruster) {
            a = c.aThrust;
        } else {
            a = c.a;
        }

        // accelaration
        if (pressed[keys.UP] || pressed[keys.DOWN]) {
            if (!this.playThrust) {
                this.playThrust = true;
                game.juke.jukebox.playSfx('thrust');
            }
        }
        if (pressed[keys.UP]) {
            this.ay = -Math.cos(this.angle) * a;
            this.ax = Math.sin(this.angle) * a;
        } else if (pressed[keys.DOWN]) {
            this.ay = Math.cos(this.angle) * a;
            this.ax = -Math.sin(this.angle) * a;
        } else {
            if (this.playThrust) {
                game.juke.jukebox.stopSfx('thrust');
                this.playThrust = false;
            }
            this.ay = 0;
            this.ax = 0;
        }

        // rotation
        if (pressed[keys.LEFT]) {
            this.rot = c.leftRotate;
        } else if (pressed[keys.RIGHT]) {
            this.rot = c.rightRotate;
        } else {
            this.rot = c.noRotate;
        }

        // thrusting
        if (c.permanentThrust) {
            this.thruster = true;
        } else {
            if (pressed[keys.THRUST]) {
                this.thruster = true;
            } else {
                this.thruster = false;
            }
        }

        // shooting
        if (pressed[keys.FIRE]) {
            this.fired = true;
        } else {
            this.fired = false;
        }
    };

    this.update = function (dt) {
        var vmax,
            xmin = game.screen.xmin,
            xmax = game.screen.xmax,
            ymin = game.screen.ymin,
            ymax = game.screen.ymax,
            c = ship.constants;

        this.vx = this.vx + this.ax * dt - c.gamma * this.vx * dt;
        this.vy = this.vy + this.ay * dt - c.gamma * this.vy * dt;

        if (this.thruster) {
            vmax = c.vmax;
        } else {
            vmax = c.vmax;
        }

        // cap the speed
        if (this.vx > vmax) {
            this.vx = vmax;
        } else if (this.vx < -vmax) {
            this.vx = -vmax;
        }
        if (this.vy > vmax) {
            this.vy = vmax;
        } else if (this.vy < -vmax) {
            this.vy = -vmax;
        }

        this.rect.x = this.rect.x + this.vx * dt;
        this.rect.y = this.rect.y + this.vy * dt;

        // update angle
        if (this.rot === c.leftRotate) {
            this.angle = this.angle - dt * c.rotv;
        } else if (this.rot === c.rightRotate) {
            this.angle = this.angle + dt * c.rotv;
        }
        // angle should be in (-pi, pi]
        if (this.angle > 2 * Math.PI) {
            this.angle -= 2 * Math.PI;
        } else if (this.angle < 0) {
            this.angle += 2 * Math.PI;
        }

        // create bullet if fired
        this.tSinceFired += dt;
        if (this.fired) {
            if (this.tSinceFired > bullet.constants.coolDown) {
                // play soundeffect
                game.juke.jukebox.playSfx('laser');
                game.objects.add(new bullet.Bullet(this.rect.x + this.hwidth,
                                                   this.rect.y + this.hheight,
                                                   this.angle),
                                 game.objects.bullets);
                this.tSinceFired = 0;
            }
        }

        // check for collision with arena walls: if we make the
        // velocity in the direction of the wall zero, we 'stick' to
        // the wall.  An alternative is reversing the velocity
        // (this.vx = -this.vx, etc.), which will give a 'bounce' off
        // the walls.
        if (this.rect.x < xmin) {
            game.juke.jukebox.playSfx('collide');
            this.rect.x = xmin;
            this.vx = -this.vx;
        } else if (this.rect.x > xmax - this.width) {
            game.juke.jukebox.playSfx('collide');
            this.rect.x = xmax - this.width;
            this.vx = -this.vx;
        }
        if (this.rect.y < ymin) {
            game.juke.jukebox.playSfx('collide');
            this.rect.y = ymin;
            this.vy = -this.vy;
        } else if (this.rect.y > ymax - this.height) {
            game.juke.jukebox.playSfx('collide');
            this.rect.y = ymax - this.height;
            this.vy = -this.vy;
        }
    };
};

ship.Ship.prototype = new sprites.Sprite();
