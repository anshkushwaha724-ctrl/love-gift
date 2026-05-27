function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        if (screenId === 'memory') initMemoryGame();
        if (screenId === 'hearts') initHeartsGame();
        if (screenId === 'scratch') initScratchCard();
        if (screenId === 'escape') resetEscapeGame();
    }
}

function updateCountdown() {
    const startDate = new Date('2024-09-26').getTime();
    const now = new Date().getTime();
    const diff = now - startDate;
    document.getElementById('days').textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
    document.getElementById('hours').textContent = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    document.getElementById('minutes').textContent = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById('seconds').textContent = Math.floor((diff % (1000 * 60)) / 1000);
}

setInterval(updateCountdown, 1000);
updateCountdown();

const memorySymbols = ['❤️', '💕', '💖', '💗', '💝', '💞', '💘', '💓'];
let memoryCards = [];
let flipped = [];
let matched = 0;

function initMemoryGame() {
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    memoryCards = [...memorySymbols, ...memorySymbols].sort(() => Math.random() - 0.5);
    flipped = [];
    matched = 0;
    memoryCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.textContent = '?';
        card.onclick = () => flipCard(index, card);
        grid.appendChild(card);
    });
}

function flipCard(index, element) {
    if (flipped.length < 2 && !flipped.includes(index)) {
        flipped.push(index);
        element.textContent = memoryCards[index];
        if (flipped.length === 2) {
            setTimeout(() => {
                if (memoryCards[flipped[0]] === memoryCards[flipped[1]]) {
                    matched += 2;
                    flipped = [];
                    if (matched === memoryCards.length) {
                        setTimeout(() => {
                            alert('You won! 🎉');
                            showScreen('games');
                        }, 500);
                    }
                } else {
                    const cards = document.querySelectorAll('.memory-card');
                    cards[flipped[0]].textContent = '?';
                    cards[flipped[1]].textContent = '?';
                    flipped = [];
                }
            }, 600);
        }
    }
}

let escapeClicks = 0;
function moveButton() {
    escapeClicks++;
    document.getElementById('escapeCount').textContent = `Clicks: ${escapeClicks}`;
    if (escapeClicks > 5) {
        const btn = document.getElementById('escapeBtn');
        btn.style.position = 'fixed';
        btn.style.left = Math.random() * 80 + '%';
        btn.style.top = Math.random() * 80 + '%';
    }
}

function resetEscapeGame() {
    escapeClicks = 0;
    document.getElementById('escapeCount').textContent = 'Clicks: 0';
    document.getElementById('escapeBtn').style.position = 'static';
}

let heartScore = 0;
let hearts = [];
function initHeartsGame() {
    const canvas = document.getElementById('heartsCanvas');
    const ctx = canvas.getContext('2d');
    heartScore = 0;
    hearts = [];
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    document.getElementById('heartScore').textContent = 'Score: 0';
    canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        hearts.forEach((heart, index) => {
            if (Math.hypot(heart.x - x, heart.y - y) < 20) {
                hearts.splice(index, 1);
                heartScore++;
                document.getElementById('heartScore').textContent = `Score: ${heartScore}`;
            }
        });
    };
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (Math.random() < 0.05) hearts.push({x: Math.random() * canvas.width, y: -20, vy: Math.random() * 2 + 1});
        hearts.forEach((heart, index) => {
            heart.y += heart.vy;
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('💖', heart.x, heart.y);
            if (heart.y > canvas.height) hearts.splice(index, 1);
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function initScratchCard() {
    const canvas = document.getElementById('scratchCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 200;
    ctx.fillStyle = 'rgba(255, 105, 180, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch me! 👇', canvas.width / 2, canvas.height / 2);
    let isDrawing = false;
    let scratchedPixels = 0;
    function scratch(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.clearRect(x - 20, y - 20, 40, 40);
        scratchedPixels += 800;
        if (scratchedPixels > canvas.width * canvas.height * 0.3) {
            document.getElementById('scratchMessage').classList.add('revealed');
        }
    }
    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);
}

function celebrateLove() {
    confetti({particleCount: 100, spread: 70, origin: {y: 0.6}});
}

window.addEventListener('load', () => {
    showScreen('welcome');
    updateCountdown();
});