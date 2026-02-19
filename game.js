// goblinsfruits - Phaser.js Game

let player, cursors, score = 0, scoreText, gameOver = false;
let goblins, foods;

function preload() {
    // Load pixel-art sprites
    this.load.image('player', 'assets/player.png');
    this.load.image('goblin', 'assets/goblin.png');
    this.load.image('banana', 'assets/banana.png');
    this.load.image('apple', 'assets/apple.png');
    this.load.image('pineapple', 'assets/pineapple.png');
}

function create() {
    // Background
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // Create groups
    goblins = this.physics.add.group();
    foods = this.physics.add.group();

    // Create player
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);
    player.setScale(2); // pixel-art vibe

    // Create goblins
    for (let i = 0; i < 5; i++) {
        let x = Phaser.Math.Between(50, 750);
        let y = Phaser.Math.Between(50, 550);
        let goblin = goblins.create(x, y, 'goblin');
        goblin.setScale(2);
        goblin.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
        goblin.setBounce(1);
        goblin.setCollideWorldBounds(true);
    }

    // Create food items
    const foodTypes = ['banana', 'apple', 'pineapple'];
    for (let i = 0; i < 10; i++) {
        let x = Phaser.Math.Between(50, 750);
        let y = Phaser.Math.Between(50, 550);
        let type = Phaser.Math.RND.pick(foodTypes);
        let food = foods.create(x, y, type);
        food.setScale(2);
    }

    // WASD controls
    cursors = this.input.keyboard.addKeys('W,S,A,D');

    // Score
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: 'monospace'
    });

    // Collisions
    this.physics.add.overlap(player, foods, collectFood, null, this);
    this.physics.add.overlap(player, goblins, hitGoblin, null, this);
}

function update() {
    if (gameOver) return;

    // Player movement (WASD)
    let speed = 200;
    if (cursors.A.isDown) {
        player.setVelocityX(-speed);
    } else if (cursors.D.isDown) {
        player.setVelocityX(speed);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.W.isDown) {
        player.setVelocityY(-speed);
    } else if (cursors.S.isDown) {
        player.setVelocityY(speed);
    } else {
        player.setVelocityY(0);
    }

    // Randomize goblin movement occasionally
    goblins.children.entries.forEach(goblin => {
        if (Math.random() < 0.01) {
            goblin.setVelocity(
                Phaser.Math.Between(-150, 150),
                Phaser.Math.Between(-150, 150)
            );
        }
    });
}

function collectFood(player, food) {
    food.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);

    if (foods.countActive(true) === 0) {
        // All food collected
        this.add.text(400, 300, 'YOU WIN!', {
            fontSize: '64px',
            fill: '#00ff00',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        gameOver = true;
    }
}

function hitGoblin(player, goblin) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
    this.add.text(400, 300, 'GAME OVER', {
        fontSize: '64px',
        fill: '#ff0000',
        fontFamily: 'monospace'
    }).setOrigin(0.5);
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: { preload, create, update }
};

// Initialize game
const game = new Phaser.Game(config);