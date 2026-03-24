# RETRO TETRIS 🕹️

A classic arcade Tetris game with retro styling, mobile controls, and 8-bit audio.

![Retro Tetris Screenshot](https://img.shields.io/badge/Status-Playable-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🎮 Features

- **Classic Tetris gameplay** with all 7 tetromino pieces
- **Retro arcade aesthetic** with CRT scanlines and glow effects
- **Mobile-friendly controls** with virtual buttons
- **8-bit audio system** with sound effects and background music
- **Complete scoring system** with levels and combos
- **Hold piece feature** for strategic play
- **Responsive design** for desktop and mobile

## 🚀 Quick Start

### Play Online:
Visit the live demo: [GitHub Pages Link](#) *(coming soon)*

### Play Locally:
```bash
# Clone the repository
git clone https://github.com/fandiutomoputra/retro-tetris.git

# Open index.html in your browser
cd retro-tetris
# Double-click index.html
```

## 🎯 Controls

### Keyboard:
- **← →** : Move piece left/right
- **↑** : Rotate piece
- **↓** : Soft drop
- **SPACE** : Hard drop (instant)
- **C** : Hold piece
- **P** : Pause/Resume
- **R** : Restart game

### Mobile/Touch:
- Virtual buttons for all actions
- Touch swipe support
- Hold and rotate buttons

## 📊 Scoring System

| Lines Cleared | Base Points | With Level Bonus |
|---------------|-------------|------------------|
| 1 Line        | 100         | × Level          |
| 2 Lines       | 300         | × Level          |
| 3 Lines       | 500         | × Level          |
| 4 Lines (Tetris) | 800     | × Level          |

**Bonus:**
- Hard drop: +2 points per cell dropped
- Combo: +50 points per consecutive line clear
- Level up every 10 lines cleared

## 🎨 Technical Details

### Built With:
- **HTML5 Canvas** for game rendering
- **JavaScript (ES6)** for game logic
- **CSS3** for retro styling and animations
- **Web Audio API** for 8-bit sound effects

### File Structure:
```
retro-tetris/
├── index.html          # Main game interface
├── style.css           # Retro arcade styling
├── tetris.js           # Core game engine
├── pieces.js           # Tetromino definitions
├── audio.js            # 8-bit audio system
└── README.md           # This file
```

### Features Implemented:
- ✅ 7 Tetromino pieces with proper rotation
- ✅ Wall kick system for rotation
- ✅ Line clearing with visual effects
- ✅ Level progression with speed increase
- ✅ Hold piece functionality
- ✅ Next piece preview
- ✅ Game over detection
- ✅ Mobile touch controls
- ✅ 8-bit sound effects
- ✅ Background music
- ✅ CRT monitor effects
- ✅ Responsive design

## 🎵 Audio System

The game features a custom 8-bit audio system with:
- **Background music**: Simplified Tetris theme
- **Sound effects**: Move, rotate, drop, lock, line clear, game over
- **Volume controls**: Toggle music and SFX independently
- **Web Audio API**: Pure JavaScript implementation

## 📱 Mobile Support

The game is fully playable on mobile devices with:
- Virtual control buttons
- Touch event handling
- Responsive layout
- Mobile-optimized UI

## 🔧 Development

### Prerequisites:
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor for code modifications
- Local web server for development (optional)

### Running Locally:
1. Clone the repository
2. Open `index.html` in a web browser
3. Press START to begin playing

### Building Customizations:
- Modify `style.css` for visual changes
- Edit `pieces.js` to change piece colors or shapes
- Update `audio.js` for custom sound effects
- Adjust game parameters in `tetris.js`

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

## 📄 License

MIT License - see LICENSE file for details.

## 👤 Credits

**Created by Mevi**  
AI Assistant & Developer

---

**Enjoy the classic Tetris experience with a retro twist!** 🕹️🎮

*"Keep those lines clear and aim for a Tetris!"*