const elements = ['fire', 'water', 'ice'];
const belts = ['none', 'white', 'yellow', 'orange', 'green', 'blue', 'red', 'purple', 'brown', 'black'];
const cardColors = ['#FF0000', '#90D5FF', '#FFD700', '#008000', '#FFA500', '#CC8899', '#FF9CCE'];
const elementImages = {
    fire: 'https://static.wikia.nocookie.net/officialclubpenguinonline/images/f/f2/CJ_fire_icon.png/revision/latest?cb=20191006193940',
    water: 'https://static.wikia.nocookie.net/officialclubpenguinonline/images/6/64/CJ_water_icon.png/revision/latest/scale-to-width-down/1000?cb=20191006194411',
    ice: 'https://static.wikia.nocookie.net/officialclubpenguinonline/images/5/51/CJ_snow_icon.png/revision/latest?cb=20191006194358',
    back: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj0ByzAfm5BjDJOc1YHpblqHbwk7dAvw6ksQ&s'
};
const beltImages = {
    'none': '',
    'white': 'https://static.wikia.nocookie.net/club-penguin-rewritten/images/f/f0/White_Ninja_Belt.png/revision/latest?cb=20170407214239',
    'yellow': 'https://static.wikia.nocookie.net/officialclubpenguinonline/images/f/f0/Yellow_Ninja_Belt_icon-0.png/revision/latest/scale-to-width-down/1000?cb=20190103093151',
    'orange': 'https://static.wikia.nocookie.net/officialclubpenguinonline/images/c/c4/Orange_Ninja_Belt_icon-0.png/revision/latest/scale-to-width-down/1000?cb=20190103093814',
    'green': 'https://static.wikia.nocookie.net/officialclubpenguinonline/images/b/b0/Green_Ninja_Belt_icon-0.png/revision/latest/scale-to-width-down/1000?cb=20190103094325',
    'blue': 'https://static.wikia.nocookie.net/officialclubpenguinonline/images/c/c2/Blue_Ninja_Belt_icon-0.png/revision/latest/scale-to-width-down/1000?cb=20190103094951',
    'red': 'https://static.wikia.nocookie.net/officialclubpenguinonline/images/3/3d/Red_Ninja_Belt_icon-0.png/revision/latest/scale-to-width-down/1000?cb=20190103095524',
    'purple': 'https://static.wikia.nocookie.net/officialclubpenguinonline/images/f/f0/Purple_Ninja_Belt_icon-0.png/revision/latest/scale-to-width-down/1000?cb=20190103100148',
    'brown': 'https://static.wikia.nocookie.net/officialclubpenguinonline/images/c/c0/Brown_Ninja_Belt_icon-0.png/revision/latest/scale-to-width-down/1000?cb=20190103100444',
    'black': 'https://static.wikia.nocookie.net/officialclubpenguinonline/images/3/38/Black_Ninja_Belt_icon-0.png/revision/latest/scale-to-width-down/1000?cb=20190103100720'
};
const cardBackgrounds = [
    'https://static.wikia.nocookie.net/clubpenguin/images/9/9a/Yarr_card_image.png',
    'https://static.wikia.nocookie.net/clubpenguin/images/9/93/Quest_for_the_Golden_Puffle_card_image.png',
    'https://static.wikia.nocookie.net/clubpenguin/images/3/36/Cloud_Wave_card_image.png',
    'https://static.wikia.nocookie.net/clubpenguin/images/5/53/Box_Dimension_card_image.png',
    'https://static.wikia.nocookie.net/clubpenguin/images/c/c6/Haunted_House_card_image.png',
    'https://static.wikia.nocookie.net/clubpenguin/images/d/dd/Spy_Phone_card_image.png',
    'https://static.wikia.nocookie.net/clubpenguin/images/e/e8/Elite_Agent_card_image.png',
    'https://static.wikia.nocookie.net/clubpenguin/images/0/05/Puffle_Rescue-_Underwater_card_image.png',
    'https://static.wikia.nocookie.net/clubpenguin/images/e/e3/Puffle_Rescue_card_image.png',
    'https://static.wikia.nocookie.net/clubpenguin/images/c/c0/System_Defender_card_image.png',
    'https://static.wikia.nocookie.net/clubpenguin/images/4/43/Coins_for_Change_Goal%21_card_image.png',
    'https://static.wikia.nocookie.net/clubpenguin/images/7/7b/Mobile_Fire_Power_Card_1_card_image.png'
];
let deck, playerHand, enemyHand, playerScore, enemyScore, timer, timerInterval;
let belt = belts[0];


function createDeck() {
    const deck = [];
    const usedCombinations = new Set();

    for (let j = 0; j < 4; j++) {
        for (let element of elements) {
            for (let i = 3; i <= 12; i++) {
                let card;
                do {
                    const color = getRandomColor();
                    card = { element, value: i, color };
                    const cardString = `${element}-${i}-${color}`;

                    if (!usedCombinations.has(cardString)) {
                        deck.push(card);
                        usedCombinations.add(cardString);
                        break;
                    }
                } while (true);
            }
        }
    }

    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}


function getRandomColor() {
    return cardColors[Math.floor(Math.random() * 7)];
}

function startGame() {
    document.getElementById('result').innerHTML = '';
    document.querySelector('.floating-belt').classList.remove('visible');
    deck = createDeck();
    playerHand = deck.slice(0, 5);
    enemyHand = deck.slice(5, 10);
    playerScore = 0;
    enemyScore = 0;
    updateScores();
    renderHands();
    startRound();
}

function renderHands() {
    renderPlayerHand();
    renderEnemyHand();
}

function renderPlayerHand() {
    const handElement = document.getElementById('player-hand');
    handElement.innerHTML = '';
    for (let card of playerHand) {
        const cardElement = createCardElement(card, true);
        handElement.appendChild(cardElement);
    }
}

function renderEnemyHand() {
    const handElement = document.getElementById('enemy-hand');
    handElement.innerHTML = '';
    for (let i = 0; i < enemyHand.length; i++) {
        const cardElement = createCardElement({ element: 'back', value: '?', color: '#808080' }, false);
        handElement.appendChild(cardElement);
    }
}

function createCardElement(card, isPlayable) {
    const cardElement = document.createElement('div');
    cardElement.className = `card ${card.value > 10 ? 'power-card' : ''}`;
    //cardElement.style.backgroundColor = card.color;

    if (isPlayable) {
        cardElement.onclick = () => playCard(card);
    }

    const contentElement = document.createElement('div');
    contentElement.className = 'card-content';

    if (card.element === 'back') {
        contentElement.style.backgroundImage = `url('${elementImages.back}')`;
    } else {
        contentElement.style.backgroundImage = `url('${getRandomBackground()}')`;
        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';
        cardHeader.style.backgroundColor = card.color;

        const elementIcon = document.createElement('div');
        elementIcon.className = 'card-element';
        elementIcon.style.backgroundImage = `url('${elementImages[card.element]}')`;
        cardHeader.appendChild(elementIcon);

        const valueElement = document.createElement('div');
        valueElement.className = 'card-value';
        const textElement = document.createElement('div');
        textElement.id = 'card-text';
        textElement.textContent = card.value;

        valueElement.appendChild(textElement);
        cardHeader.appendChild(valueElement);

        contentElement.appendChild(cardHeader);
    }

    cardElement.appendChild(contentElement);
    return cardElement;
}

function startRound() {
    timer = 30;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timer--;
        updateTimerDisplay();
        if (timer <= 0) {
            clearInterval(timerInterval);
            autoPlayCard();
        }
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById('timer').textContent = `Time left: ${timer}s`;
}

function autoPlayCard() {
    if (playerHand.length > 0) {
        const randomIndex = Math.floor(Math.random() * playerHand.length);
        playCard(playerHand[randomIndex]);
    }
}

function getRandomBackground() {
    return cardBackgrounds[Math.floor(Math.random() * cardBackgrounds.length)];
}

function updateBeltImage(color) {
    const beltElement = document.querySelector('.floating-belt');
    if (beltElement && beltImages[color]) {
        beltElement.style.backgroundImage = `url('${beltImages[color]}')`;
    } else {
        console.error(`Belt color '${color}' not found or belt element missing`);
    }
}

function endGame(winner) {
    const restartBtn = document.createElement('BUTTON');
    const restartElement = document.createElement('div');

    restartElement.id = 'restart';
    if (winner == "You") {
        document.getElementById('result').innerHTML = `${winner} win! Your belt level is ${belts[belts.indexOf(belt) + 1]}!`;
        belt = belts[(belts.indexOf(belt) + 1) % 10];
        updateBeltImage(belt);
        document.querySelector('.floating-belt').classList.add('visible');
    }
    else {
        document.getElementById('result').innerHTML = `${winner} wins!`;
    }

    restartBtn.id = 'restartButton';
    restartBtn.textContent = 'Play Again!';
    restartBtn.addEventListener("click", startGame);

    clearInterval(timerInterval);
    document.getElementById('player-hand').innerHTML = '';
    document.getElementById('enemy-hand').innerHTML = '';
    document.getElementById('timer').textContent = 'Game Over!';

    restartElement.appendChild(restartBtn);

    const resultDiv = document.getElementById('result');
    resultDiv.appendChild(document.createElement('br'));
    resultDiv.appendChild(restartElement);
}

function playCard(playerCard) {
    clearInterval(timerInterval);
    const enemyCard = enemyHand[Math.floor(Math.random() * enemyHand.length)];

    const playerSlot = document.getElementById('player-slot');
    const enemySlot = document.getElementById('enemy-slot');

    const playerCardElement = createCardElement(playerCard, false);
    const enemyCardElement = createCardElement(enemyCard, false);

    // Add the expanded class
    playerCardElement.classList.add('card-expanded');
    enemyCardElement.classList.add('card-expanded');

    playerSlot.innerHTML = '';
    playerSlot.appendChild(playerCardElement);
    enemySlot.innerHTML = '';
    enemySlot.appendChild(enemyCardElement);

    const result = determineWinner(playerCard, enemyCard);
    document.getElementById('result').textContent = result;

    if (result === 'Player wins this round!') playerScore++;
    else if (result === 'Enemy wins this round!') enemyScore++;

    updateScores();

    if (playerScore === 3) {
        endGame('You');
        return;
    } else if (enemyScore === 3) {
        endGame('Enemy');
        return;
    }

    playerHand = playerHand.filter(card => card !== playerCard);
    enemyHand = enemyHand.filter(card => card !== enemyCard);

    if (playerHand.length < 5) {
        playerHand.push(...deck.splice(0, 5 - playerHand.length));
    }
    if (enemyHand.length < 5) {
        enemyHand.push(...deck.splice(0, 5 - enemyHand.length));
    }

    setTimeout(() => {
        playerSlot.innerHTML = '';
        enemySlot.innerHTML = '';
        document.getElementById('result').textContent = '';
        renderHands();
        startRound();
    }, 3500);
}

function determineWinner(playerCard, enemyCard) {
    if (playerCard.element === enemyCard.element) {
        return playerCard.value > enemyCard.value ? 'Player wins this round!' :
            playerCard.value < enemyCard.value ? 'Enemy wins this round!' : 'Draw!';
    }
    if (
        (playerCard.element === 'fire' && enemyCard.element === 'ice') ||
        (playerCard.element === 'ice' && enemyCard.element === 'water') ||
        (playerCard.element === 'water' && enemyCard.element === 'fire')
    ) {
        return 'Player wins this round!';
    }
    return 'Enemy wins this round!';
}

function updateScores() {
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('enemy-score').textContent = enemyScore;
}



startGame();