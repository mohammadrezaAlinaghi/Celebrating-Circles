// Windows
const wStart = document.getElementById('start-window'),
    wWin = document.getElementById('win-window'),
    wLost = document.getElementById('lost-window');
// Buttons
const btnStart = document.getElementById('start-btn'),
    btnNext = document.getElementById('next-btn'),
    btnRestart = document.getElementById('restart-btn');
// Topbar Status
const nLevel = document.getElementById('n-level'),
    nBals = document.getElementById('n-bals'),
    nKills = document.getElementById('n-kills');
// Sound Effects
const sStretching = new Audio('../sounds/Stretching.mp3'),
    sBalloon = new Audio('../sounds/balloon.mp3');
sStretching.loop = true;
// Game Parameters
let round = 1,
    killBalls = 0,
    bal = [],
    playing = false;
// Playing Game Function
function startGame(restart = true) {
    if (restart) {
        round = 1;
    } else {
        round++;
    }
    killBalls = 0;
    bal = [];
    bal.push(new Ball());
    wStart.style.display = 'none';
    wWin.style.display = 'none';
    wLost.style.display = 'none';
    playing = true;
}
btnStart.addEventListener('click', startGame);
btnRestart.addEventListener('click', startGame);
btnNext.addEventListener('click', function() { startGame(false) });

// Canvas Objects
const canvas = document.getElementById('canvas'),
    c = canvas.getContext('2d');
let wx = window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth,
    wy = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
canvas.width = wx;
canvas.height = wy;

c.strockeWidth = 5;
let grav = 0.99;
// Mouse Follower
let mouseX = 0,
    mouseY = 0;
addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
// colorMaker
function randomColor() {
    return ("rgba(" +
        Math.round(Math.random() * 250) + "," +
        Math.round(Math.random() * 250) + "," +
        Math.round(Math.random() * 250) + "," +
        (Math.ceil(Math.random() * 5) / 10 + 0.5) + ")"
    );
}
// Ball Maker
function Ball() {
    this.color = randomColor();
    this.radius = Math.random() * 20 + 14;
    this.startradius = this.radius;
    this.x = this.radius;
    this.y = Math.random() * (wy - this.radius);
    this.dy = Math.random() * 2;
    this.dx = Math.round((Math.random() - 0.5) * 10);
    this.vel = Math.random() / 5;
    this.mouseHover = 0;
    this.update = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        c.fillStyle = this.color;
        c.fill();
    };
}

function setTopbar() {
    nLevel.innerHTML = round;
    nBals.innerHTML = bal.length + '/20';
    nKills.innerHTML = killBalls + '/' + (round * 5 - round);
}

function checkLost() {
    if (bal.length > 20) {
        playing = false;
        wLost.style.display = 'block';
    }
}

function checkWin() {
    if (killBalls >= round * 5 - round) {
        playing = false;
        wWin.style.display = 'block';
    }
}

function checkMouseHover(i) {
    if (mouseX > bal[i].x - 20 &&
        mouseX < bal[i].x + 20 &&
        mouseY > bal[i].y - 50 &&
        mouseY < bal[i].y + 50 &&
        bal[i].radius < 70) {
        bal[i].radius += 5;
        bal[i].mouseHover++;
        sStretching.play();
        if (bal[i].mouseHover >= round * 30) {
            bal.splice(i, 1);
            killBalls++;
            sStretching.pause();
            sBalloon.play();
        }
    } else {
        if (bal[i].radius > bal[i].startradius) {
            bal[i].radius += -5;
        }
        sStretching.pause();

    }
}

function animate() {
    if (wx != window.innerWidth || wy != window.innerHeight) {
        wx = window.innerWidth;
        wy = window.innerHeight;
        canvas.width = wx;
        canvas.height = wy;
    }
    requestAnimationFrame(animate);
    c.clearRect(0, 0, wx, wy);
    if (!playing) { return; }
    setTopbar();
    checkLost();
    checkWin();
    for (let i = 0; i < bal.length; i++) {
        bal[i].update();
        bal[i].y += bal[i].dy;
        bal[i].x += bal[i].dx;
        if (bal[i].y + bal[i].radius >= wy) {
            bal[i].dy = -bal[i].dy * grav;
        } else {
            bal[i].dy += bal[i].vel;
        }
        if (bal[i].x + bal[i].radius > wx || bal[i].x - bal[i].radius < 0) {
            bal[i].dx = -bal[i].dx;
        }
        checkMouseHover(i);
    }
}
animate();

setInterval(function() {
    bal.push(new Ball());
}, 4000 / round + 500);