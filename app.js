const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
const background = new Sprite({
    position:{
        x: 0,
        y: 0,
    },
    imageSrc: './img/background.png'
});

const shop = new Sprite({
    position:{
        x: 590,
        y: 225,
    },
    imageSrc: './img/shop.png',
    scale: 2,
    framesMax: 6,
});

const player = new Fighter({
    position: {
        x: 0,
        y: 0,
    },
    velocity:{
        x: 0,
        y: 10,
    },
    offset: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/Sprites/Idle.png',
    scale: 3,
    framesMax: 10,
    offset:{
        x: 90,
        y: 90,
    },
    sprites: {
        idle: {
            imageSrc: './img/Sprites/Idle.png',
            framesMax: 10
        },
        run: {
            imageSrc: './img/Sprites/Run.png',
            framesMax: 10
        },
        jump: {
            imageSrc: './img/Sprites/Jump.png',
            framesMax: 3
        },
        fall: {
            imageSrc: './img/Sprites/JumpFallInbetween.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/Sprites/Attack.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/Sprites/Fall.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/Sprites/Death.png',
            framesMax: 10
        }
    },
    attackBox: {
        offset: {
        x: 100,
        y: 50
        },
        width: 160,
        height: 50
    }
});
// player.draw();

const enemy = new Fighter({
    position: {
        x: 900,
        y: 100,
    },
    velocity:{
        x: 0,
        y: 0,
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0,
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.3,
    offset: {
        x: 215,
        y: 147
    },
    sprites: {
        idle: {
        imageSrc: './img/kenji/Idle.png',
        framesMax: 4
        },
        run: {
        imageSrc: './img/kenji/Run.png',
        framesMax: 8
        },
        jump: {
        imageSrc: './img/kenji/Jump.png',
        framesMax: 2
        },
        fall: {
        imageSrc: './img/kenji/Fall.png',
        framesMax: 2
        },
        attack1: {
        imageSrc: './img/kenji/Attack1.png',
        framesMax: 4
        },
        takeHit: {
        imageSrc: './img/kenji/Take hit.png',
        framesMax: 3
        },
        death: {
        imageSrc: './img/kenji/Death.png',
        framesMax: 7
        }
    },
    attackBox: {
        offset: {
        x: -215,
        y: 50
        },
        width: 170,
        height: 50
    }
});
// enemy.draw();

// console.log(player);

const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    // ArrowUp:{
    //     pressed: false
    // }
}

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update();
    enemy.update();
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement
    if(keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('run');
    }
    else if(keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run');
    }
    else{
        player.switchSprite('idle')
    }

    // player jump
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // enenmy movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run')
    }
    else {
        enemy.switchSprite('idle')
    }
    
    // enenmy jump
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    //detect for collision enemy gets hit
    if(rectangularCollision({ 
        rectangle1: player,
        rectangle2: enemy
    })  && 
        player.isAttacking && player.framesCurrent === 2
    ){
        enemy.takeHit();
        player.isAttacking = false;
        gsap.to('#enemyHealth', {width: enemy.health + '%'});
        // console.log('player smash!');
        // enemy.health -= 20;
        // document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

      // if player misses
    if (player.isAttacking && player.framesCurrent === 2) {
        player.isAttacking = false;
    }

     //detect for collision player gets hit
    if(rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    })  && 
        enemy.isAttacking && enemy.framesCurrent === 2
    ){
        player.takeHit();
        enemy.isAttacking = false;
        // console.log('enemy smash!');
        gsap.to('#playerHealth', {width: player.health + '%'});
        // player.health -= 20;
        // document.querySelector('#playerHealth').style.width = player.health + '%';
    }

    // if player misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
      }

    //base game over on health
    if(enemy.health <= 0 || player.health <= 0){
        winner({player, enemy, timerId});
    }
}

function backgroundShop(){
    window.requestAnimationFrame(backgroundShop);
    background.update();
    shop.update();
}
backgroundShop();

window.addEventListener('keydown', (event) => {
    if(!player.dead){
       switch(event.key) {
        case 'a' : 
            keys.a.pressed = true; 
            player.lastKey = 'a'; 
            break;
        case 'd' : 
            keys.d.pressed = true; 
            player.lastKey = 'd'; 
            break;
        case 'w' : 
            if (player.velocity.y === 0) {
                player.velocity.y = -15; 
            } 
            break;
        case ' ' : 
            player.attack();
            break;
        case 's' : 
            player.attack();
            break;
       } 
    }
        
    if(!enemy.dead){
        switch(event.key) {
            case 'ArrowLeft' : 
                keys.ArrowLeft.pressed = true; 
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowRight' : 
                keys.ArrowRight.pressed = true; 
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowUp' : 
                if (enemy.velocity.y === 0) {
                    enemy.velocity.y = -15; 
                } 
                console.log('นอกสุกชด',enemy.velocity.y);
                break;         
            case 'ArrowDown' : 
                enemy.attack();
            break;
        }
    }
})

window.addEventListener('keyup', (event) => {
    //player keys
    switch(event.key) {
        case 'a' : keys.a.pressed = false; break;
        case 'd' : keys.d.pressed = false; break;
        // case 'w' : keys.w.pressed = false; break;
    }

     //enemy keys
    switch(event.key) {
        case 'ArrowLeft' : keys.ArrowLeft.pressed = false; break;
        case 'ArrowRight' : keys.ArrowRight.pressed = false; break;
        // case 'ArrowUp' : keys.ArrowUp.pressed = false; break;
    }
    // console.log(event.key);
})

const game = {
    started: false,
}

// const button = document.querySelector('#ResetButton');
// button.addEventListener('click', function() {
//     location.reload();
// });

document.querySelector('#ResetButton').addEventListener('click', function() {
    location.reload();
});

document.querySelector('#beginButton').addEventListener('click', () => {
    document.querySelector('#beginButton').style.display = 'none'
    document.querySelector('#tutorial').style.display = 'flex'
  });
 
document.querySelector('#startButton').addEventListener('click', () => {
    document.querySelector('#tutorial').style.display = 'none'
    game.started = true;
    animate();
    decreaseTimer();
});