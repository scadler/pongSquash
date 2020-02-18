//creating canvas & getting context
const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

//draw functions 
function drawRect(x, y, w, h, color){
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}
function drawCircle(x, y, r, color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}
function drawText(text,x, y, color){
    context.fillStyle = color;
    context.font = "75px arial";
    context.fillText(text, x, y);
}
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=23){
        drawRect(net.x, net.y + i , net.width, net.height, net.color);
    }
}
function collision(ball, paddle){
    paddle.top = paddle.y;
    paddle.bottom = paddle.y + paddle.height;
    paddle.left = paddle.x;
    paddle.right = paddle.x + paddle.width;
    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;
    return ball.right > paddle.left && ball.top < paddle.bottom && ball.left < paddle.right && ball.bottom > paddle.top;
}
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = 7;
    ball.velocityX = -ball.velocityX
}
function movePaddle(event){
    let rect = canvas.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.height/2;
}
//defining constants
const user = {
    x : 0,
    y : (canvas.height/2)-50,
    width : 15,
    height : 150,
    color : "White",
    score : 0,
}
const comp = {
    x :  canvas.width - 15,
    y : (canvas.height/2)-50,
    width : 15,
    height : 150,
    color : "White",
    score : 0,
}
const net = {
    x : canvas.width/2 - 2/2,
    y : 0,
    width : 3,
    height : 15,
    color : "White",
}
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 15,
    speed : 7,
    velocityX : 7,
    velocityY : 7,
    color : "White",
}
const framesPerSecond = 50;
//calling functions
function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    if( ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        //ball has hit top or bottom
        ball.velocityY = - ball.velocityY;
    }
    //computerLevel is difficult, higher=harder, 
    let computerLevel = 0.08
    comp.y += (ball.y - (comp.y + comp.height/2)) * computerLevel
    // this is saying if (ball.x < canvas.width/2 (on the right side)){ paddle = user} else {paddle = comp}
    let paddle = (ball.x < canvas.width/2) ? user : comp;
    if( collision(ball,paddle) ){
        //need to find point of impact so rebound angle can be calculated
        let collidePoint = (ball.y - (paddle.y + paddle.height/2));
        collidePoint = collidePoint / (paddle.height/2);
        let angleRadian = (Math.PI/4) * collidePoint;
        //the ball moves right after hitting user paddle, left after comp
        let direction = (ball.x < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRadian)
        ball.velocityY = direction * ball.speed * Math.sin(angleRadian)
        //the ball moves faster every rebound
        ball.speed += 0.2;
    }
    if(ball.x - ball.radius < 0){
        comp.score++;
        resetBall();
    }else if(ball.x + ball.radius > canvas.width){
        user.score++;
        resetBall();
    }
}
function render(){
drawRect(0, 0, canvas.width, canvas.height, "black");
drawText(user.score, canvas.width/4, canvas.height/5, "White");
drawText(comp.score, 3*canvas.width/4, canvas.height/5, "White");
drawNet();
//user & comp paddles
drawRect(user.x, user.y, user.width, user.height, user.color);
drawRect(comp.x, comp.y, comp.width, comp.height, comp.color);
//ball
drawCircle(ball.x, ball.y, ball.radius, ball.color)
}
function game(){
    render();
    update();
}
setInterval(game, 1000/framesPerSecond);
canvas.addEventListener("mousemove", movePaddle);