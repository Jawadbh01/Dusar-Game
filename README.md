DUSAR - Pakistani Card Game
Digital Edition
A vibrant, modern implementation of the classic Pakistani card game DUSAR with AI opponents, local multiplayer, offline support, and an installable PWA.
📋 Table of Contents
Game Rules
Features
Installation
How to Play
File Structure
Configuration
Troubleshooting
🎮 Game Rules
Objective
Win more points than the opposing team by bidding on and winning tricks.
Setup
Players: 4 players in 2 fixed partnerships (diagonal)
Cards: Standard 52-card deck
Deal: 13 cards per player
Bidding Phase
Players bid how many tricks they'll win (9-13) or "52 Salam" (all tricks)
Highest bidder gets to choose Trump suit
Minimum bid is 9 tricks
Trump Suit (Rang/Color)
Chosen by highest bidder
Most powerful suit - beats all others
Cards in trump suit: 2 (highest) > A > K > Q > J > 10 > 9 > 8 > 7 > 6 > 5 > 4 > 3
Special Rule: 2 of Trump = Super card (beats even Ace)
Card Rankings
Ace is highest in non-trump suits
Rankings: A > K > Q > J > 10 > 9 > 8 > 7 > 6 > 5 > 4 > 3 > 2
Exception: 2 of Trump beats Ace
Trick Taking Rules
First player can play any card
Other players must follow suit if possible
If no cards of suit, play any card (including Trump)
Highest card of led suit wins (unless Trump played)
Highest Trump wins if multiple Trumps played
Scoring
Bidder Succeeds: Team gets points equal to tricks won
Example: Bid 9, take 9 tricks = 9 points
Bidder Fails: Opposing team gets DOUBLE the tricks they won
Example: Bid 9, take 6 tricks; Opponents take 7 = Opponents get 14 points
52 Salam (All Tricks):
Success = 52 points
Failure = Opponents get 26 points (cards × 2)
Winning the Game
First team to reach 100 points wins!
✨ Features
Game Modes
AI Mode: Play against 3 intelligent bots with difficulty levels (Easy, Normal, Hard)
Local Friends: 4 players on the same device
Offline Play: Works completely offline after first load
Online Ready: Architecture supports multiplayer (Firebase-ready)
User Interface
Vibrant Modern Design: Bold colors, smooth animations
Mobile-First Responsive: Plays perfectly on phones, tablets, and desktops
Installable PWA: Install as native app on any device
Touch-Friendly: Optimized for touch gestures and mobile screens
Game Features
Smart AI with difficulty scaling
Smooth card animations
Real-time scoring
Hand summary after each round
Sound-ready (extensible for audio effects)
Session persistence
Technical
Pure vanilla JavaScript (no frameworks required)
Zero external dependencies
Service Worker for offline support
Progressive Web App (PWA) compatible
Works on all modern browsers
📱 Installation
Web Browser (Online)
Visit your deployment URL (e.g., https://yourdomain.com/dusar)
Click "Install" button in your browser
Or: Settings → Install App
Desktop/Mobile (Offline)
Open the game once online
Service Worker automatically caches all assets
Works offline immediately after first load
No internet needed after installation
Local Development
# Clone/copy files to your directory
cd dusar-game

# Start a local server (Python 3)
python -m http.server 8000

# Or Node.js
npx http-server

# Visit http://localhost:8000
GitHub Pages Deployment
Push all files to GitHub repository
Go to Settings → Pages
Select "Deploy from a branch"
Choose main branch → save
Visit your_username.github.io/dusar-game
Deployment Checklist
✅ All files present (index.html, style.css, app.js, manifest.json, sw.js)
✅ manifest.json properly linked in HTML
✅ Service worker properly registered
✅ Start URL points to index.html
✅ Test on real device (PWA installation)
🎯 How to Play
Starting a Game
Select Game Mode
"Play vs AI" for single-player against bots
"Play with Friends" for 4 players on same device
Configure Players
Enter your name and difficulty (for AI mode)
Or enter all 4 player names (for local mode)
Click "Start Game"
Bidding Phase
Your Turn: Click bid amount (9-13) or "52 Salam"
Higher bid = more risk but more reward
"Pass" to skip your turn
Bot Bidding: Bots automatically bid based on hand strength
Trump Selection: Highest bidder (or you) selects trump suit
Spades ♠, Hearts ♥, Diamonds ♦, Clubs ♣
Playing Tricks
Your Cards: Bottom of screen (sorted by suit)
Click a Card: Select which card to play
Must follow suit if you have it
Otherwise play any card
Invalid cards are greyed out
Center Table: Shows all 4 played cards
Trump card indicator (top-right)
Current bid info (bottom-left)
Auto Play: Bots play automatically
Hand Summary
See tricks won by each team
Points awarded to bidder or opponents
Running score displayed
Click "Next Hand" to continue
Game Over
First team to 100 points wins
Final scores displayed
Play again or go home
📁 File Structure
dusar-game/
├── index.html          # Main HTML structure
├── style.css           # Vibrant styling & animations
├── app.js              # Complete game logic & AI
├── manifest.json       # PWA configuration
├── sw.js              # Service Worker (offline support)
└── README.md          # This file
Key Files Explained
index.html
Screen layouts (Home, Rules, Setup, Game)
Modal dialogs (Bidding, Trump, Game Over)
Semantic HTML structure
Meta tags for PWA
style.css
CSS Grid & Flexbox layouts
Vibrant color scheme (primary: #FF6B6B)
Smooth animations & transitions
Responsive breakpoints
Card styling with suits
app.js
DUSARGame class - main game engine
Card deck creation & shuffling
Bidding logic with bot AI
Trick taking & scoring
DOM manipulation & rendering
400+ lines of organized code
manifest.json
App name, description, icons
Display mode: standalone
Start URL & scope
Theme colors
sw.js
Asset caching strategy
Offline fallback
Cache updates
⚙️ Configuration
Customize Colors
Edit :root variables in style.css:
:root {
    --primary: #FF6B6B;      /* Main action color */
    --secondary: #4ECDC4;    /* Secondary color */
    --accent: #FFE66D;       /* Accent color */
    --dark: #2D3436;         /* Text color */
}
Adjust AI Difficulty
In app.js, modify evaluateHand() method:
evaluateHand(hand) {
    let strength = 0;
    const faceCards = hand.filter(c => ['A','K','Q','J'].includes(c[0])).length;
    const tens = hand.filter(c => c.includes('10')).length;
    
    // Tweak these multipliers for different difficulty
    strength = (faceCards * 0.15 + tens * 0.08) / 13;
    return Math.min(strength, 1);
}
Change App Name/Description
Edit manifest.json:
{
    "name": "Your Game Name",
    "short_name": "Shortname",
    "description": "Your description"
}
Modify Card Styling
In style.css, change .card class:
.card {
    width: 50px;           /* Card width */
    height: 72px;          /* Card height */
    border-radius: 6px;    /* Corner radius */
    font-size: 0.7rem;     /* Text size */
}
🐛 Troubleshooting
PWA Not Installing
Issue: "Install" button doesn't appear
Solution:
Ensure HTTPS (or localhost for dev)
Check manifest.json is accessible
Verify service worker registered (check browser console)
Try different browser
Game Not Loading
Issue: Blank screen or "Cannot find module"
Solution:
Check all files in same directory
Verify file paths are correct
Check browser console for errors
Clear cache (Ctrl+Shift+Delete)
Cards Not Showing
Issue: Card area is empty
Solution:
Check CSS file is loaded (Style tab in DevTools)
Verify cards CSS has proper display properties
Ensure playerHand div exists in HTML
AI Not Playing
Issue: Game hangs when bot's turn
Solution:
Check botPlay() method in app.js
Verify canPlayCard() returns valid cards
Check console for JavaScript errors
Offline Not Working
Issue: Offline mode doesn't load
Solution:
Service worker must be registered: check Application tab
Clear cache and reload once online
Check sw.js for syntax errors
Verify ASSETS_TO_CACHE includes all files
Scoring Issues
Issue: Points calculated wrong
Solution:
Check endHand() method in app.js
Verify bid comparison logic
Test with simple bid (bid 9, take 9)
Keyboard/Mobile Issues
Issue: Cards won't click on mobile
Solution:
Ensure touch events work (they should by default)
Check CSS cursor properties
Test pointer-events are enabled
Verify card click handlers in JavaScript
🚀 Advanced Customization
Adding Multiplayer (Firebase)
Install Firebase SDK
Add real-time player synchronization
Modify DUSARGame class to handle network play
Add user authentication
Adding Sound Effects
Use Web Audio API (already in original code)
Create playSound() function
Call on key events (card play, bid, win)
Changing Difficulty Levels
Modify botPlay() method in app.js:
botPlay() {
    const hand = this.hands[this.currentPlayer];
    let strategy;
    
    if (this.difficulty === 'easy') {
        // Random play
        strategy = Math.floor(Math.random() * hand.length);
    } else if (this.difficulty === 'normal') {
        // Balanced play
        strategy = this.findOptimalCard(hand);
    } else {
        // Aggressive play
        strategy = this.findBestWinningCard(hand);
    }
    
    this.playCard(this.currentPlayer, strategy);
}
📝 Code Comments & Best Practices
The code is organized into clear sections:
// ============================================
// SECTION NAME
// ============================================

// Each method has clear purpose
methodName() {
    // Descriptive variable names
    // Comments for complex logic
    // Proper error handling
}
Key Classes & Methods
DUSARGame - Main game controller
dealCards() - Shuffle and deal 13 cards
setupBidding() - Initialize bidding phase
placeBid() - Player/bot places bid
selectTrump() - Trump suit selection
playCard() - Play card to trick
resolveTrick() - Determine trick winner
endHand() - Calculate points
renderAllCards() - Update UI
🤝 Contributing
To improve DUSAR:
Bug Fixes: Report in console with steps to reproduce
Features: Suggest in comments
Code Quality: Keep functions under 50 lines
Comments: Explain the "why" not just "what"
📄 License
Free to use, modify, and distribute. Enjoy! 🎴
🎓 Learning Resources
This game demonstrates:
Vanilla JavaScript: Classes, DOM manipulation, event handling
Game Logic: Bidding system, trick-taking, scoring
Web Technologies: Service Workers, PWA, responsive design
AI: Bot decision making, hand evaluation
CSS: Modern layouts, animations, mobile-first design
🙋 FAQ
Q: Can I play online with friends?
A: Current version is local-only or AI. Online multiplayer requires Firebase integration (future version).
Q: How do I change player names?
A: During setup, edit the player name fields before clicking "Start Game".
Q: What's the highest possible score?
A: If you win 52 Salam (all 13 tricks × 4 hands), you can reach 100 points in ~2 hands.
Q: Can I undo a move?
A: Not in current version - moves are final once cards hit the table (realistic).
Q: How does the AI decide what to bid?
A: It evaluates hand strength (face cards + tens) and bids accordingly based on difficulty.
Q: Can I play on multiple devices?
A: Each device has independent game state. Online sync would require database (future).
Q: Why do cards have borders?
A: For clarity - helps cards stand out on mobile screens.
Q: Can I customize the rules?
A: Yes! Modify scoring in endHand() and card rankings in getCardRank().
📞 Support
For issues or questions:
Check Troubleshooting section
Review console errors (F12)
Test on different browser
Check file structure is correct
Last Updated: April 2026
Version: 1.0
Status: Production Ready ✅
Enjoy playing DUSAR! 🎴♠️♥️♦️♣️
