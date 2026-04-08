// ============================================
// DUSAR GAME - COMPLETE LOGIC
// ============================================

class DUSARGame {
    constructor() {
        // Game state
        this.players = [];
        this.gameMode = 'ai'; // 'ai' or 'local'
        this.deck = [];
        this.hands = [[], [], [], []];
        this.currentTrick = [];
        this.tricksWon = [0, 0]; // Team 1, Team 2
        this.teamScores = [0, 0];
        
        // Bidding
        this.bids = [null, null, null, null];
        this.currentBidder = 0;
        this.highestBid = 0;
        this.highestBidder = -1;
        this.passedPlayers = new Set();
        
        // Trump
        this.trumpSuit = null;
        this.trumpRevealed = false;
        this.mustFollowSuit = true;
        
        // Play state
        this.leadSuit = null;
        this.currentPlayer = 0;
        this.trickHistory = [];
        this.hand = 0;
        
        // DOM
        this.initDOM();
        this.bindEvents();
    }
    
    initDOM() {
        this.els = {
            app: document.getElementById('gameApp'),
            homeScreen: document.getElementById('homeScreen'),
            rulesScreen: document.getElementById('rulesScreen'),
            setupScreen: document.getElementById('setupScreen'),
            gameScreen: document.getElementById('gameScreen'),
            playerHand: document.getElementById('playerHand'),
            playArea: document.getElementById('playArea'),
            gameOverlay: document.getElementById('gameOverlay'),
            biddingModal: document.getElementById('biddingModal'),
            trumpModal: document.getElementById('trumpModal'),
            revealTrumpModal: document.getElementById('revealTrumpModal'),
            handOverModal: document.getElementById('handOverModal'),
            gameOverModal: document.getElementById('gameOverModal'),
            menuPopup: document.getElementById('menuPopup'),
            trumpDisplay: document.getElementById('trumpDisplay'),
            bidDisplay: document.getElementById('bidDisplay'),
            team1Score: document.getElementById('team1Score'),
            team2Score: document.getElementById('team2Score'),
        };
    }
    
    bindEvents() {
        // Home screen
        document.getElementById('playAiBtnHome').addEventListener('click', () => this.startSetup('ai'));
        document.getElementById('playLocalBtnHome').addEventListener('click', () => this.startSetup('local'));
        document.getElementById('rulesBtnHome').addEventListener('click', () => this.showScreen('rulesScreen'));
        
        // Setup
        document.getElementById('backFromSetup').addEventListener('click', () => this.showScreen('homeScreen'));
        document.getElementById('startGameBtn').addEventListener('click', () => this.startNewGame());
        
        // Rules
        document.getElementById('backFromRules').addEventListener('click', () => this.showScreen('homeScreen'));
        
        // Game
        document.getElementById('menuBtn').addEventListener('click', () => this.toggleMenu());
        document.getElementById('quitGameBtn').addEventListener('click', () => this.quitGame());
        document.getElementById('rulesBtn').addEventListener('click', () => this.showRulesFromGame());
        document.getElementById('closeMenuBtn').addEventListener('click', () => this.toggleMenu());
        
        // Bidding
        document.querySelectorAll('.bid-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bid = parseInt(e.target.dataset.bid);
                this.placeBid(this.currentPlayer, bid);
            });
        });
        
        document.getElementById('passBtn').addEventListener('click', () => this.passBid());
        
        // Trump selection
        document.querySelectorAll('.trump-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const suit = e.target.dataset.suit;
                this.selectTrump(suit);
            });
        });
        
        // Trump reveal
        document.getElementById('revealBtn').addEventListener('click', () => this.revealTrump());
        document.getElementById('skipRevealBtn').addEventListener('click', () => this.skipRevealTrump());
        
        // Hand/Game over
        document.getElementById('nextHandBtn').addEventListener('click', () => this.startNextHand());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.startNewGame());
        document.getElementById('homeBtn').addEventListener('click', () => this.goHome());
    }
    
    // ============================================
    // SCREEN MANAGEMENT
    // ============================================
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }
    
    toggleMenu() {
        this.els.menuPopup.classList.toggle('active');
    }
    
    // ============================================
    // SETUP & INITIALIZATION
    // ============================================
    
    startSetup(mode) {
        this.gameMode = mode;
        this.setupPlayers(mode);
        this.showScreen('setupScreen');
    }
    
    setupPlayers(mode) {
        const form = document.getElementById('playerSetupForm');
        form.innerHTML = '';
        
        if (mode === 'ai') {
            // Player 0 vs AI
            form.innerHTML = `
                <div class="player-input-group">
                    <label>Your Name</label>
                    <input type="text" id="player0Input" value="You" maxlength="15">
                </div>
                <div class="player-input-group">
                    <label>Difficulty</label>
                    <select id="difficultySelect">
                        <option value="easy">Easy</option>
                        <option value="normal" selected>Normal</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
            `;
        } else {
            // 4 players local
            form.innerHTML = `
                <div class="player-input-group">
                    <label>Player 1 (Bottom - You)</label>
                    <input type="text" placeholder="Player 1" value="Player 1" maxlength="15">
                </div>
                <div class="player-input-group">
                    <label>Player 2 (Right)</label>
                    <input type="text" placeholder="Player 2" value="Player 2" maxlength="15">
                </div>
                <div class="player-input-group">
                    <label>Player 3 (Top - Partner)</label>
                    <input type="text" placeholder="Player 3" value="Player 3" maxlength="15">
                </div>
                <div class="player-input-group">
                    <label>Player 4 (Left)</label>
                    <input type="text" placeholder="Player 4" value="Player 4" maxlength="15">
                </div>
            `;
        }
        
        // Enable start button
        setTimeout(() => {
            document.getElementById('startGameBtn').disabled = false;
        }, 100);
    }
    
    startNewGame() {
        const mode = this.gameMode;
        const names = [];
        
        if (mode === 'ai') {
            const playerName = document.getElementById('player0Input')?.value || 'You';
            const difficulty = document.getElementById('difficultySelect')?.value || 'normal';
            names[0] = playerName;
            names[1] = 'Bot ' + ['Umer', 'Ahmed', 'Ali'][Math.floor(Math.random()*3)];
            names[2] = 'Bot ' + ['Fatima', 'Hira', 'Sara'][Math.floor(Math.random()*3)];
            names[3] = 'Bot ' + ['Hassan', 'Karim', 'Jamal'][Math.floor(Math.random()*3)];
            this.difficulty = difficulty;
        } else {
            const inputs = document.querySelectorAll('.player-input-group input');
            inputs.forEach((inp, i) => {
                names[i] = inp.value || `Player ${i+1}`;
            });
        }
        
        this.players = names.map((name, i) => ({
            id: i,
            name,
            hand: [],
            bid: null,
            passed: false
        }));
        
        this.hand = 0;
        this.teamScores = [0, 0];
        this.updateScores();
        this.startHand();
    }
    
    startHand() {
        this.dealCards();
        this.setupBidding();
        this.showScreen('gameScreen');
    }
    
    startNextHand() {
        this.hand++;
        this.hands = [[], [], [], []];
        this.currentTrick = [];
        this.tricksWon = [0, 0];
        this.bids = [null, null, null, null];
        this.currentBidder = (this.currentBidder + 1) % 4;
        this.passedPlayers.clear();
        this.trumpSuit = null;
        this.trumpRevealed = false;
        
        this.hideAllModals();
        this.startHand();
    }
    
    // ============================================
    // CARD DEALING
    // ============================================
    
    dealCards() {
        this.deck = this.createDeck();
        this.shuffleDeck();
        
        // Deal 13 cards to each player
        for (let i = 0; i < 52; i++) {
            this.hands[i % 4].push(this.deck[i]);
        }
        
        // Sort hands for display
        this.hands.forEach(hand => hand.sort((a, b) => this.cardValue(a) - this.cardValue(b)));
        
        this.renderAllCards();
    }
    
    createDeck() {
        const deck = [];
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
        
        for (let suit of suits) {
            for (let value of values) {
                deck.push(value + suit);
            }
        }
        return deck;
    }
    
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    
    // ============================================
    // BIDDING PHASE
    // ============================================
    
    setupBidding() {
        this.currentBidder = this.currentPlayer = 0;
        this.bids = [null, null, null, null];
        this.passedPlayers.clear();
        this.highestBid = 0;
        this.highestBidder = -1;
        
        this.proceedBidding();
    }
    
    proceedBidding() {
        if (this.passedPlayers.size === 3) {
            // Only one player left - they're the bidder
            if (this.highestBidder === -1) {
                this.currentBidder = [...Array(4).keys()].find(i => !this.passedPlayers.has(i));
            }
            this.showTrumpSelection();
            return;
        }
        
        if (this.passedPlayers.has(this.currentBidder)) {
            this.currentBidder = (this.currentBidder + 1) % 4;
            this.proceedBidding();
            return;
        }
        
        if (this.currentBidder === 0) {
            // Player's turn
            this.showBiddingModal();
        } else {
            // Bot's turn
            setTimeout(() => this.botBid(), 800);
        }
    }
    
    showBiddingModal() {
        this.hideAllModals();
        this.els.gameOverlay.classList.add('active');
        this.els.biddingModal.classList.add('active');
    }
    
    placeBid(player, bid) {
        this.bids[player] = bid;
        this.highestBid = bid;
        this.highestBidder = player;
        
        this.currentBidder = (this.currentBidder + 1) % 4;
        this.hideAllModals();
        this.proceedBidding();
    }
    
    passBid() {
        this.passedPlayers.add(this.currentBidder);
        this.currentBidder = (this.currentBidder + 1) % 4;
        this.hideAllModals();
        this.proceedBidding();
    }
    
    botBid() {
        const hand = this.hands[this.currentBidder];
        const handStrength = this.evaluateHand(hand);
        
        let bid = null;
        
        if (this.difficulty === 'easy') {
            bid = Math.random() > 0.6 ? null : Math.floor(Math.random() * 5) + 9;
        } else if (this.difficulty === 'normal') {
            bid = handStrength > 0.6 ? Math.floor(handStrength * 4 + 9) : null;
        } else {
            bid = handStrength > 0.5 ? Math.floor(handStrength * 4.5 + 8) : null;
        }
        
        if (bid && bid > this.highestBid) {
            this.placeBid(this.currentBidder, bid);
        } else {
            this.passBid();
        }
    }
    
    evaluateHand(hand) {
        let strength = 0;
        const faceCards = hand.filter(c => ['A','K','Q','J'].includes(c[0])).length;
        const tens = hand.filter(c => c.includes('10')).length;
        
        strength = (faceCards * 0.1 + tens * 0.05) / 13;
        return Math.min(strength, 1);
    }
    
    showTrumpSelection() {
        this.hideAllModals();
        this.els.gameOverlay.classList.add('active');
        this.els.trumpModal.classList.add('active');
        
        if (this.highestBidder !== 0) {
            // Bot selects trump
            setTimeout(() => {
                const bestSuit = this.selectBestTrump(this.hands[this.highestBidder]);
                this.selectTrump(bestSuit);
            }, 800);
        }
    }
    
    selectBestTrump(hand) {
        const suitCounts = { '♠': 0, '♥': 0, '♦': 0, '♣': 0 };
        hand.forEach(card => {
            const suit = card[card.length - 1];
            suitCounts[suit]++;
        });
        
        return Object.entries(suitCounts).sort((a, b) => b[1] - a[1])[0][0];
    }
    
    selectTrump(suit) {
        this.trumpSuit = suit;
        this.hideAllModals();
        this.renderTrumpDisplay();
        this.updateBidDisplay();
        this.startPlay();
    }
    
    // ============================================
    // PLAY PHASE
    // ============================================
    
    startPlay() {
        this.currentPlayer = this.highestBidder;
        this.currentTrick = [];
        this.leadSuit = null;
        this.mustFollowSuit = true;
        
        this.renderAllCards();
        this.nextPlayerTurn();
    }
    
    nextPlayerTurn() {
        if (this.currentTrick.length === 4) {
            setTimeout(() => this.resolveTrick(), 600);
            return;
        }
        
        if (this.currentPlayer === 0) {
            this.allowPlayerPlay();
        } else {
            setTimeout(() => this.botPlay(), 700);
        }
    }
    
    allowPlayerPlay() {
        const hand = this.hands[0];
        const playerCards = document.querySelectorAll('#playerHand .card');
        
        playerCards.forEach((cardEl, idx) => {
            cardEl.classList.remove('card-ghost');
            cardEl.style.cursor = 'pointer';
            
            const card = hand[idx];
            const canPlay = this.canPlayCard(0, card);
            
            if (!canPlay) {
                cardEl.classList.add('card-ghost');
                cardEl.style.cursor = 'not-allowed';
            }
            
            cardEl.onclick = () => {
                if (canPlay) {
                    this.playCard(0, idx);
                }
            };
        });
    }
    
    canPlayCard(player, card) {
        const hand = this.hands[player];
        
        // First card - can play anything
        if (!this.leadSuit) return true;
        
        const cardSuit = card[card.length - 1];
        
        // Must follow suit if possible
        if (hand.some(c => c[c.length - 1] === this.leadSuit)) {
            return cardSuit === this.leadSuit;
        }
        
        // Can play any card if don't have suit
        return true;
    }
    
    playCard(player, cardIdx) {
        const card = this.hands[player].splice(cardIdx, 1)[0];
        const suit = card[card.length - 1];
        
        if (!this.leadSuit) {
            this.leadSuit = suit;
        }
        
        this.currentTrick.push({ player, card, suit });
        
        this.addCardToTable(card, player);
        this.renderAllCards();
        
        this.currentPlayer = (this.currentPlayer + 1) % 4;
        this.nextPlayerTurn();
    }
    
    botPlay() {
        const player = this.currentPlayer;
        const hand = this.hands[player];
        
        let cardIdx = 0;
        
        // Find valid cards
        const validIndices = hand
            .map((card, idx) => ({ idx, card, valid: this.canPlayCard(player, card) }))
            .filter(o => o.valid);
        
        if (validIndices.length > 0) {
            // Smart bot play
            const winningCard = this.findWinningCard(player, validIndices);
            cardIdx = winningCard ? winningCard.idx : validIndices[0].idx;
        }
        
        this.playCard(player, cardIdx);
    }
    
    findWinningCard(player, validCards) {
        // Try to win the trick with lowest card
        for (let option of validCards) {
            if (this.wouldWinTrick(option.card)) {
                return option;
            }
        }
        return null;
    }
    
    wouldWinTrick(card) {
        const cardSuit = card[card.length - 1];
        const isTrump = cardSuit === this.trumpSuit;
        
        for (let trick of this.currentTrick) {
            const trickSuit = trick.suit;
            const isTrickTrump = trickSuit === this.trumpSuit;
            
            if (isTrickTrump && !isTrump) return false;
            if (isTrump && !isTrickTrump) return true;
            if (trickSuit !== this.leadSuit) continue;
            
            if (this.compareCards(card, trick.card) > 0) return true;
        }
        return true;
    }
    
    addCardToTable(card, player) {
        const el = document.createElement('div');
        el.className = `card suit-${this.getSuitClass(card[card.length - 1])}`;
        el.innerHTML = `
            <div class="card-value">${card.slice(0, -1)}</div>
            <div class="card-suit">${card[card.length - 1]}</div>
        `;
        this.els.playArea.appendChild(el);
    }
    
    resolveTrick() {
        let winner = this.currentTrick[0].player;
        let highestCard = this.currentTrick[0].card;
        
        for (let i = 1; i < this.currentTrick.length; i++) {
            const trick = this.currentTrick[i];
            if (this.compareCards(trick.card, highestCard) > 0) {
                highestCard = trick.card;
                winner = trick.player;
            }
        }
        
        // Award trick to team
        const team = winner % 2;
        this.tricksWon[team]++;
        
        // Clear table
        this.els.playArea.innerHTML = '';
        this.currentTrick = [];
        this.leadSuit = null;
        this.currentPlayer = winner;
        
        // Continue or end hand
        if (this.hands[0].length === 0) {
            this.endHand();
        } else {
            this.nextPlayerTurn();
        }
    }
    
    compareCards(cardA, cardB) {
        const suitA = cardA[cardA.length - 1];
        const suitB = cardB[cardB.length - 1];
        
        const rankA = this.getCardRank(cardA);
        const rankB = this.getCardRank(cardB);
        
        // Trump beats non-trump
        if (suitA === this.trumpSuit && suitB !== this.trumpSuit) return 1;
        if (suitA !== this.trumpSuit && suitB === this.trumpSuit) return -1;
        
        // Same suit - highest rank wins
        if (suitA === suitB) return rankA - rankB;
        
        // Different suits - first card's suit (led suit) wins
        return -1;
    }
    
    getCardRank(card) {
        const value = card.slice(0, -1);
        const suit = card[card.length - 1];
        
        const ranks = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10 };
        let rank = ranks[value] || parseInt(value);
        
        // 2 of trump is highest
        if (value === '2' && suit === this.trumpSuit) {
            rank = 15;
        }
        
        return rank;
    }
    
    endHand() {
        const bidderTeam = this.highestBidder % 2;
        const bidderTricksNeeded = this.highestBid;
        const bidderTricksWon = this.tricksWon[bidderTeam];
        
        let team1Gain = 0;
        let team2Gain = 0;
        
        if (bidderTricksWon >= bidderTricksNeeded) {
            // Bidder succeeded
            if (bidderTeam === 0) {
                team1Gain = bidderTricksWon;
            } else {
                team2Gain = bidderTricksWon;
            }
        } else {
            // Bidder failed - other team gets double
            const otherTeam = 1 - bidderTeam;
            if (otherTeam === 0) {
                team1Gain = this.tricksWon[otherTeam] * 2;
            } else {
                team2Gain = this.tricksWon[otherTeam] * 2;
            }
        }
        
        this.teamScores[0] += team1Gain;
        this.teamScores[1] += team2Gain;
        this.updateScores();
        
        // Show hand over
        this.showHandOver(bidderTeam, bidderTricksNeeded, bidderTricksWon, team1Gain, team2Gain);
    }
    
    showHandOver(bidderTeam, needed, won, gain1, gain2) {
        const stats = document.getElementById('handOverStats');
        const bidderName = this.players[this.highestBidder].name;
        const status = won >= needed ? '✓ Success' : '✗ Failed';
        
        stats.innerHTML = `
            <div style="margin: 20px 0; font-size: 1.1rem;">
                <p><strong>${bidderName}</strong> bid ${needed}</p>
                <p>Took ${won} tricks - ${status}</p>
                <hr style="margin: 15px 0; border: 1px solid rgba(0,0,0,0.2);">
                <p>Team 1: +${gain1} pts → ${this.teamScores[0]} total</p>
                <p>Team 2: +${gain2} pts → ${this.teamScores[1]} total</p>
            </div>
        `;
        
        this.hideAllModals();
        this.els.gameOverlay.classList.add('active');
        this.els.handOverModal.classList.add('active');
        
        // Check if game over
        if (this.teamScores[0] >= 100 || this.teamScores[1] >= 100) {
            setTimeout(() => this.endGame(), 2000);
        }
    }
    
    endGame() {
        const winner = this.teamScores[0] > this.teamScores[1] ? 'Team 1' : 'Team 2';
        const scores = document.getElementById('finalScores');
        
        scores.innerHTML = `
            <div style="margin: 20px 0; font-size: 1.2rem;">
                <h2 style="color: #FF6B6B; margin: 20px 0;">${winner} Wins!</h2>
                <p>Team 1: <strong>${this.teamScores[0]}</strong> points</p>
                <p>Team 2: <strong>${this.teamScores[1]}</strong> points</p>
            </div>
        `;
        
        this.hideAllModals();
        this.els.gameOverlay.classList.add('active');
        this.els.gameOverModal.classList.add('active');
    }
    
    // ============================================
    // RENDERING
    // ============================================
    
    renderAllCards() {
        // Player's hand
        const playerHand = document.getElementById('playerHand');
        playerHand.innerHTML = '';
        
        this.hands[0].forEach((card, idx) => {
            const el = this.createCardElement(card);
            playerHand.appendChild(el);
        });
        
        // Opponent cards (face down)
        [1, 2, 3].forEach(p => {
            const container = document.getElementById(`player${p}Cards`);
            container.innerHTML = '';
            for (let i = 0; i < this.hands[p].length; i++) {
                const el = document.createElement('div');
                el.className = 'card card-back';
                container.appendChild(el);
            }
        });
        
        // Update player names
        this.players.forEach((p, i) => {
            const el = document.getElementById(`player${i}Name`);
            if (el) el.textContent = p.name;
        });
    }
    
    createCardElement(card) {
        const el = document.createElement('div');
        const suit = card[card.length - 1];
        const value = card.slice(0, -1);
        
        el.className = `card suit-${this.getSuitClass(suit)}`;
        el.innerHTML = `
            <div class="card-value">${value}</div>
            <div class="card-suit">${suit}</div>
        `;
        
        return el;
    }
    
    getSuitClass(suit) {
        switch(suit) {
            case '♠': return 'spade';
            case '♥': return 'heart';
            case '♦': return 'diamond';
            case '♣': return 'club';
        }
    }
    
    renderTrumpDisplay() {
        this.els.trumpDisplay.textContent = this.trumpSuit;
        this.els.trumpDisplay.style.color = this.trumpSuit === '♥' || this.trumpSuit === '♦' ? '#FF6B6B' : '#2D3436';
    }
    
    updateBidDisplay() {
        const bidderName = this.players[this.highestBidder].name;
        this.els.bidDisplay.innerHTML = `${bidderName} bid ${this.highestBid}`;
    }
    
    updateScores() {
        this.els.team1Score.textContent = this.teamScores[0];
        this.els.team2Score.textContent = this.teamScores[1];
    }
    
    cardValue(card) {
        const ranks = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10 };
        return ranks[card.slice(0, -1)] || parseInt(card.slice(0, -1));
    }
    
    // ============================================
    // UTILITIES
    // ============================================
    
    hideAllModals() {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        this.els.gameOverlay.classList.remove('active');
    }
    
    quitGame() {
        this.toggleMenu();
        this.goHome();
    }
    
    showRulesFromGame() {
        this.toggleMenu();
        this.showScreen('rulesScreen');
    }
    
    goHome() {
        this.showScreen('homeScreen');
        this.hideAllModals();
    }
    
    revealTrump() {
        this.trumpRevealed = true;
        this.renderTrumpDisplay();
        this.hideAllModals();
        this.nextPlayerTurn();
    }
    
    skipRevealTrump() {
        this.hideAllModals();
        this.nextPlayerTurn();
    }
}

// ============================================
// INITIALIZE GAME
// ============================================

let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new DUSARGame();
    
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
});
