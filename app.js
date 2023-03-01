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
});
player.draw();

const enemy = new Fighter({
    position: {
        x: 400,
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
});
enemy.draw();

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
    ArrowUp:{
        pressed: false
    }
}

decreaseTimer();

function winner({player, enemy, timerId}){
    clearTimeout(timerId);
    document.querySelector('#DisplayResult').style.display = 'flex';
    document.querySelector('#Reset').style.display = 'flex';
    if(player.health === enemy.health){
        document.querySelector('#DisplayResult').innerHTML = 'Tie';
    }
    else if(player.health > enemy.health){
        document.querySelector('#DisplayResult').innerHTML = 'Player 1 Winner';
    }
    else if(player.health < enemy.health){
        document.querySelector('#DisplayResult').innerHTML = 'Player 2 Winner';
    }
}

const button = document.querySelector('#ResetButton');
button.addEventListener('click', function() {
  location.reload();
});

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update()
    player.update();
    enemy.update();
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement
    if(keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
    }
    else if(keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
    }

    // enenmy movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
    }

    //detect for collision
    if(rectangularCollision({
        rectangle1: player,
        rectangle2: enemy,
    }) && player.isAttacking
    ){
        player.isAttacking = false;
        // console.log('player smash!');
        enemy.health -= 20;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }
    if(rectangularCollision({
        rectangle1: enemy,
        rectangle2: player,
    }) && enemy.isAttacking
    ){
        enemy.isAttacking = false;
        // console.log('enemy smash!');
        player.health -= 20;
        document.querySelector('#playerHealth').style.width = player.health + '%';
    }

    //base game over on health
    if(enemy.health <= 0 || player.health <= 0){
        winner({player, enemy, timerId})
    }
}
animate();

window.addEventListener('keydown', (event) => {
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
            player.velocity.y = -20; 
            break;
        case 's' : 
            player.attack();
            break;

        case 'ArrowLeft' : 
            keys.ArrowLeft.pressed = true; 
            enemy.lastKey = 'ArrowLeft'
            break;
        case 'ArrowRight' : 
            keys.ArrowRight.pressed = true; 
            enemy.lastKey = 'ArrowRight'
            break;
        case 'ArrowUp' : 
            enemy.velocity.y = -20; 
            break;
        case 'ArrowDown' : 
            enemy.attack();
        break;
    }
    // console.log(event.key);
})

window.addEventListener('keyup', (event) => {
    //player keys
    switch(event.key) {
        case 'a' : keys.a.pressed = false; break;
        case 'd' : keys.d.pressed = false; break;
        case 'w' : keys.w.pressed = false; break;
    }

     //enemy keys
    switch(event.key) {
        case 'ArrowLeft' : keys.ArrowLeft.pressed = false; break;
        case 'ArrowRight' : keys.ArrowRight.pressed = false; break;
        case 'ArrowUp' : keys.ArrowUp.pressed = false; break;
    }
    // console.log(event.key);
})

