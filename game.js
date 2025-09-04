const needleContainer = document.getElementById("needleContainer");
const needle = document.getElementById("needle");
const targetArea = document.getElementById("targetArea");
const toggleButton = document.getElementById("toggleButton");
const nextRoundButton = document.getElementById("nextRoundButton");
const newGameButton = document.getElementById("newGameButton");
const cluesElement = document.getElementById("clues");
const scoreElement = document.getElementById("score");
const totalScoreElement = document.getElementById("totalScore");

let isDragging = false;
let targetAngle = 0;
let isTargetVisible = true;
let totalScore = 0;
let canMoveNeedle = false;
let clues = [];

const teamSetup = document.getElementById('teamSetup');
const teamCount = document.getElementById('teamCount');
const teamNames = document.getElementById('teamNames');
const startGameButton = document.getElementById('startGame');
const gameContainer = document.querySelector('.game-container');

let teams = [];

teamCount.addEventListener('change', updateTeamInputs);
document.getElementById('decTeams').addEventListener('click', () => {
    teamCount.value = Math.max(parseInt(teamCount.min), parseInt(teamCount.value || 1) - 1);
    updateTeamInputs();
});
document.getElementById('incTeams').addEventListener('click', () => {
    teamCount.value = Math.min(parseInt(teamCount.max), parseInt(teamCount.value || 1) + 1);
    updateTeamInputs();
});

function updateTeamInputs() {
    const count = parseInt(teamCount.value);
    teamNames.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Nome squadra ${i + 1}`;
        input.className = 'team-name-input';
        teamNames.appendChild(input);
    }
}

let currentTeamIndex = 0;

function updateScoreDisplay() {
    const chips = teams.map((team, index) => {
        const cls = index === currentTeamIndex ? 'current-team' : '';
        return `<div class="${cls}">${team.name}: ${team.score}</div>`;
    }).join('');
    totalScoreElement.innerHTML = chips;
}

startGameButton.addEventListener('click', () => {
    loadClues();
    setRandomClues();
    teams = Array.from(teamNames.children).map(input => ({
        name: input.value || input.placeholder,
        score: 0
    }));
    teamSetup.style.display = 'none';
    gameContainer.style.display = 'block';
    updateScoreDisplay();
});

// Initialize with 2 teams
updateTeamInputs();

// Hide game container initially
gameContainer.style.display = 'none';

function setTargetArea() {
    targetAngle = Math.random() * 180 - 90;
    const gradient = `conic-gradient(
    from -90deg at 50% 100%,
    #a4b0be 0deg ${targetAngle - 22.5 + 90}deg,
    #ff6b6b ${targetAngle - 22.5 + 90}deg ${targetAngle - 13.5 + 90
        }deg,
    #feca57 ${targetAngle - 13.5 + 90}deg ${targetAngle - 4.5 + 90
        }deg,
    var(--cool-blue-500) ${targetAngle - 4.5 + 90}deg ${targetAngle + 4.5 + 90
        }deg,
    #feca57 ${targetAngle + 4.5 + 90}deg ${targetAngle + 13.5 + 90
        }deg,
    #ff6b6b ${targetAngle + 13.5 + 90}deg ${targetAngle + 22.5 + 90
        }deg,
    #a4b0be ${targetAngle + 22.5 + 90}deg 180deg
)`;
    targetArea.style.background = gradient;
}

function loadClues() {
    active = getActivePacks();
    packs.forEach(pack => {
        if(active.includes(pack.id)){
            Array.prototype.push.apply(clues, pack.clues);
        }
    });
}

function setRandomClues() {
    const randomIndex = Math.floor(Math.random() * clues.length);
    const [left, right] = clues[randomIndex];
    document.getElementById("leftClue").textContent = left;
    document.getElementById("rightClue").textContent = right;
}

function calculateScore(angle) {
    const diff = Math.abs(angle - targetAngle);
    if (diff <= 4.5) {
        triggerConfetti();
        return 5
    };
    if (diff <= 13.5) return 3;
    if (diff <= 22.5) return 1;
    return 0;
}

function handleStart(e) {
    if (!canMoveNeedle) return;
    isDragging = true;
    e.preventDefault(); // Prevent default touch behavior
}

function triggerConfetti() {
    confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#48c7fb', '#87ddff', '#2b2e4c', '#ffffff'],
        ticks: 200,
        shapes: ['square', 'circle'],
        gravity: 0.85,
        scalar: 1.1
    });
}

function handleMove(e) {
    if (!isDragging || !canMoveNeedle) return;
    e.preventDefault(); // Prevent default touch behavior
    const rect = needleContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.bottom;

    let clientX, clientY;
    if (e.type === "touchmove") {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const angle =
        (Math.atan2(clientX - centerX, centerY - clientY) * 180) / Math.PI;
    const clampedAngle = Math.max(-90, Math.min(90, angle));
    needle.style.transform = `rotate(${clampedAngle}deg)`;
}

function handleEnd() {
    isDragging = false;
}

function hideNeedle() {
    needle.style.display = "none";
}

function showNeedle() {
    needle.style.display = "block";
}

// Mouse events
needleContainer.addEventListener("mousedown", handleStart);
document.addEventListener("mousemove", handleMove);
document.addEventListener("mouseup", handleEnd);

// Touch events
needleContainer.addEventListener("touchstart", handleStart);
document.addEventListener("touchmove", handleMove);
document.addEventListener("touchend", handleEnd);

toggleButton.addEventListener("click", () => {
    isTargetVisible = !isTargetVisible;
    targetArea.style.display = isTargetVisible ? "block" : "none";
    if (!isTargetVisible) {
        toggleButton.textContent = "Mostra";
        scoreElement.textContent = "";
        showNeedle();
        canMoveNeedle = true; // Allow needle movement when target is hidden
    } else {
        toggleButton.style.display = "none";
        const needleAngle =
            parseFloat(
                needle.style.transform.replace("rotate(", "").replace("deg)", "")
            ) || 0;
        const score = calculateScore(needleAngle);
        totalScore += score;
        scoreElement.textContent = `Score: ${score} punti`;
        totalScoreElement.textContent = `Punteggio: ${totalScore}`;
        canMoveNeedle = false; // Disable needle movement when target is revealed
    }
    if (isTargetVisible) {
        const needleAngle = parseFloat(needle.style.transform.replace("rotate(", "").replace("deg)", "")) || 0;
        const score = calculateScore(needleAngle);
        teams[currentTeamIndex].score += score;
        scoreElement.textContent = `${teams[currentTeamIndex].name} ha ottenuto: ${score} punti`;
        updateScoreDisplay();
        if (score === 5) {
            triggerConfetti();
        }
    }
});

nextRoundButton.addEventListener("click", () => {
    setTargetArea();
    setRandomClues();
    isTargetVisible = true;
    targetArea.style.display = "block";
    toggleButton.textContent = "Hide Target";
    toggleButton.style.display = "inline-block";
    needle.style.transform = "rotate(0deg)";
    scoreElement.textContent = "";
    hideNeedle();
    canMoveNeedle = false; // Re-enable needle movement for the next round
    currentTeamIndex = (currentTeamIndex + 1) % teams.length;
    updateScoreDisplay();
});

newGameButton.addEventListener("click", () => {
    teams.forEach(team => team.score = 0);
    currentTeamIndex = 0;
    totalScore = 0;
    setTargetArea();
    setRandomClues();
    isTargetVisible = true;
    targetArea.style.display = "block";
    toggleButton.textContent = "Nascondi";
    toggleButton.style.display = "inline-block";
    needle.style.transform = "rotate(0deg)";
    scoreElement.textContent = "";
    totalScoreElement.textContent = "Punteggio: 0";
    hideNeedle();
    updateScoreDisplay();
});

// Initialize the game
//clues will be loaded on start
setTargetArea();
// ALSO ON START
// setRandomClues();
hideNeedle();
