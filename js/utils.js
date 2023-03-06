function rectangularCollision({rectangle1, rectangle2}){
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && 
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && 
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

let hasAudioPlayed = false;

function winner({player, enemy, timerId}){
    const audio = new Audio('/sound/Winner.mp3');
    const tie = new Audio('/sound/Tie.mp3');
    clearTimeout(timerId);
    document.querySelector('#DisplayResult').style.display = 'flex';
    document.querySelector('#Reset').style.display = 'flex';
    if(player.health === enemy.health){
        document.querySelector('#DisplayResult').innerHTML = 'Tie';
        tie.play();
    }
    else if(player.health > enemy.health && !hasAudioPlayed){
        document.querySelector('#DisplayResult').innerHTML = 'Player 1 Winner';
        audio.play();
        hasAudioPlayed = true;
    }
    else if(player.health < enemy.health && !hasAudioPlayed){
        document.querySelector('#DisplayResult').innerHTML = 'Player 2 Winner';
        audio.play();
        hasAudioPlayed = true;
    }
    
}

let timer = 60;
let timerId;
function decreaseTimer(){
    if(timer > 0){
        timerId = setTimeout(decreaseTimer, 1000)
        timer -- ;
        document.querySelector('#timer').innerHTML = timer;
    }
    if(timer == 0){
        winner({player, enemy, timerId});
    }
}
