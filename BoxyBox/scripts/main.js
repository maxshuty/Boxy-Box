var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

var mainState = {
    preload: function () {
        game.stage.backgroundColor = '#71c5cf';

        game.load.image('boxy', 'assets/boxySprite.png');
        game.load.image('pipe', 'assets/pipe.png');
    },

    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.boxy = this.game.add.sprite(200, 350, 'boxy');
        this.boxy.anchor.setTo(0.5);
        this.boxy.scale.setTo(0.9);

        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(20, 'pipe');

        game.physics.arcade.enable(this.boxy);
        this.boxy.body.gravity.y = 1000;

        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;
        this.labelScore = game.add.text(50, 20, "0", { font: "45px Arial", fill: "#ffffff" });
        var spaceKey = this.game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        spaceKey.onUp.add(this.fall, this);
    },

    update: function () {
        if (this.boxy.inWorld == false) {
            this.restartGame();
        }

        game.physics.arcade.overlap(this.boxy, this.pipes, this.restartGame, null, this);
    },

    jump: function () {
        this.boxy.body.velocity.y = -350;
        this.boxy.angle = 75;
    },

    fall: function() {
        this.boxy.angle = 250;
    },

    restartGame: function () {
        game.state.start('main');
    },

    addOnePipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();

        pipe.reset(x, y);
        pipe.body.velocity.x = -200;

        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function () {
        this.score += 1;
        this.labelScore.text = this.score;

        var hole = Math.floor(Math.random() * 5) + 1;
        for (var i = 0; i < 8; i++) {
            if (i != hole && i != hole + 1) {
                this.addOnePipe(400, i * 60 + 10);
            }
        }
    }
};

game.state.add('main', mainState);
game.state.start('main');