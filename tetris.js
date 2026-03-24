// RETRO TETRIS - Main Game Engine

class TetrisGame {
    constructor() {
        // Game constants
        this.GRID_WIDTH = 10;
        this.GRID_HEIGHT = 20;
        this.BLOCK_SIZE = 30;
        
        // Game state
        this.grid = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.holdPiece = null;
        this.canHold = true;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.paused = false;
        this.gameStarted = false;
        
        // Timing
        this.dropInterval = 1000; // ms
        this.dropSpeed = 1000;
        this.lastDropTime = 0;
        this.lastFrameTime = 0;
        this.fps = 60;
        
        // Audio
        this.audio = null;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        
        // DOM elements
        this.canvas = null;
        this.ctx = null;
        this.nextCanvas = null;
        this.nextCtx = null;
        this.holdCanvas = null;
        this.holdCtx = null;
        
        // Bind methods
        this.gameLoop = this.gameLoop.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }
    
    init() {
        // Initialize grid
        this.initGrid();
        
        // Get canvas elements
        this.canvas = document.getElementById('game-canvas');
        console.log('Game canvas:', this.canvas, 'width:', this.canvas?.width, 'height:', this.canvas?.height);
        
        if (!this.canvas) {
            console.error('Game canvas not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        console.log('Canvas context:', this.ctx);
        
        this.nextCanvas = document.getElementById('next-canvas');
        this.nextCtx = this.nextCanvas?.getContext('2d');
        this.holdCanvas = document.getElementById('hold-canvas');
        this.holdCtx = this.holdCanvas?.getContext('2d');
        
        // Initialize audio
        this.initAudio();
        
        // Create first pieces
        console.log('Testing getRandomPiece:', typeof getRandomPiece);
        
        if (typeof getRandomPiece !== 'function') {
            console.error('getRandomPiece is not a function! pieces.js may not be loaded.');
            return;
        }
        
        this.nextPiece = getRandomPiece();
        console.log('Next piece created:', this.nextPiece?.name);
        
        this.spawnNewPiece();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update UI
        this.updateUI();
        
        // Start game loop
        requestAnimationFrame(this.gameLoop);
        
        console.log('Retro Tetris initialized!', 'Game started:', this.gameStarted);
        
        // Auto-start game for better UX
        setTimeout(() => {
            console.log('Auto-start timer fired');
            this.startGame();
        }, 500);
    }
    
    initGrid() {
        this.grid = [];
        for (let row = 0; row < this.GRID_HEIGHT; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.GRID_WIDTH; col++) {
                this.grid[row][col] = null;
            }
        }
    }
    
    initAudio() {
        try {
            this.audio = new RetroAudio();
            if (this.audio.isSupported() && this.musicEnabled) {
                this.audio.startMusic();
            }
        } catch (error) {
            console.warn('Audio initialization failed:', error);
            this.audio = null;
        }
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', this.handleKeyDown);
        
        // Game buttons
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('music-toggle').addEventListener('click', () => this.toggleMusic());
        document.getElementById('sfx-toggle').addEventListener('click', () => this.toggleSFX());
        
        // Mobile controls
        const mobileButtons = [
            'left-btn', 'right-btn', 'up-btn', 'down-btn',
            'rotate-btn', 'hold-btn', 'pause-btn'
        ];
        
        mobileButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => this.handleButtonClick(btnId));
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.handleButtonClick(btnId);
                });
            }
        });
        
        // Pause button special handling
        document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    handleKeyDown(event) {
        if (!this.gameStarted || this.gameOver) {
            if (event.code === 'Space' || event.code === 'Enter') {
                this.startGame();
            }
            return;
        }
        
        if (this.paused && event.code !== 'KeyP') {
            return;
        }
        
        switch (event.code) {
            case 'ArrowLeft':
                event.preventDefault();
                this.movePiece(-1, 0);
                break;
                
            case 'ArrowRight':
                event.preventDefault();
                this.movePiece(1, 0);
                break;
                
            case 'ArrowDown':
                event.preventDefault();
                this.movePiece(0, 1);
                break;
                
            case 'ArrowUp':
                event.preventDefault();
                this.rotatePiece();
                break;
                
            case 'Space':
                event.preventDefault();
                this.hardDrop();
                break;
                
            case 'KeyC':
                event.preventDefault();
                this.holdCurrentPiece();
                break;
                
            case 'KeyP':
                event.preventDefault();
                this.togglePause();
                break;
                
            case 'KeyR':
                event.preventDefault();
                this.restartGame();
                break;
        }
    }
    
    handleButtonClick(buttonId) {
        if (!this.gameStarted || this.gameOver || this.paused) return;
        
        switch (buttonId) {
            case 'left-btn':
                this.movePiece(-1, 0);
                break;
                
            case 'right-btn':
                this.movePiece(1, 0);
                break;
                
            case 'down-btn':
                this.movePiece(0, 1);
                break;
                
            case 'up-btn':
                this.rotatePiece();
                break;
                
            case 'rotate-btn':
                this.rotatePiece();
                break;
                
            case 'hold-btn':
                this.holdCurrentPiece();
                break;
        }
    }
    
    startGame() {
        console.log('startGame() called, current state:', {
            gameStarted: this.gameStarted,
            gameOver: this.gameOver,
            paused: this.paused,
            currentPiece: this.currentPiece?.name
        });
        
        if (this.gameStarted && !this.gameOver) {
            console.log('Game already started, returning');
            return;
        }
        
        this.gameStarted = true;
        this.gameOver = false;
        this.paused = false;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropSpeed = 1000;
        
        this.initGrid();
        this.nextPiece = getRandomPiece();
        this.spawnNewPiece();
        this.canHold = true;
        this.lastDropTime = performance.now(); // Reset drop timer
        
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game-over-screen').style.display = 'none';
        document.getElementById('pause-screen').style.display = 'none';
        
        this.updateUI();
        
        if (this.audio && this.audio.isSupported && this.musicEnabled) {
            this.audio.startMusic();
        }
    }
    
    restartGame() {
        this.startGame();
    }
    
    togglePause() {
        if (!this.gameStarted || this.gameOver) return;
        
        this.paused = !this.paused;
        document.getElementById('pause-screen').style.display = this.paused ? 'flex' : 'none';
        
        if (this.paused && this.audio && this.audio.isSupported) {
            this.audio.stopMusic();
        } else if (!this.paused && this.audio && this.audio.isSupported && this.musicEnabled) {
            this.audio.startMusic();
        }
    }
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        const btn = document.getElementById('music-toggle');
        btn.innerHTML = `<i class="fas fa-music"></i> MUSIC: ${this.musicEnabled ? 'ON' : 'OFF'}`;
        
        if (this.audio && this.audio.isSupported) {
            if (this.musicEnabled && !this.paused) {
                this.audio.startMusic();
            } else {
                this.audio.stopMusic();
            }
        }
    }
    
    toggleSFX() {
        this.sfxEnabled = !this.sfxEnabled;
        const btn = document.getElementById('sfx-toggle');
        btn.innerHTML = `<i class="fas fa-volume-up"></i> SFX: ${this.sfxEnabled ? 'ON' : 'OFF'}`;
        
        if (this.audio) {
            this.audio.sfxEnabled = this.sfxEnabled;
        }
    }
    
    spawnNewPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = getRandomPiece();
        this.currentPiece.row = 0;
        this.currentPiece.col = Math.floor(this.GRID_WIDTH / 2) - 1;
        this.canHold = true;
        
        // Check for game over (piece spawns in occupied space)
        if (this.checkCollision(this.currentPiece)) {
            this.gameOver = true;
            this.showGameOver();
            if (this.audio) {
                this.audio.playGameOver();
                this.audio.stopMusic();
            }
        }
        
        this.updateNextPieceDisplay();
    }
    
    movePiece(dx, dy) {
        console.log('movePiece(', dx, dy, ') called - currentPiece:', this.currentPiece?.name, 'gameOver:', this.gameOver, 'paused:', this.paused);
        
        if (!this.currentPiece || this.gameOver || this.paused) {
            console.log('movePiece blocked');
            return;
        }
        
        const testPiece = this.currentPiece.clone();
        testPiece.col += dx;
        testPiece.row += dy;
        
        if (!this.checkCollision(testPiece)) {
            this.currentPiece.col = testPiece.col;
            this.currentPiece.row = testPiece.row;
            
            if (dy > 0 && this.audio) {
                this.audio.playMove();
            }
            
            return true;
        }
        
        // If moving down and collision, lock the piece
        if (dy > 0) {
            this.lockPiece();
            if (this.audio) {
                this.audio.playLock();
            }
        }
        
        return false;
    }
    
    rotatePiece() {
        if (!this.currentPiece || this.gameOver || this.paused) return;
        
        const testPiece = this.currentPiece.clone();
        testPiece.rotate();
        
        // Try wall kicks
        const kicks = [
            [0, 0],   // No kick
            [-1, 0],  // Left kick
            [1, 0],   // Right kick
            [0, -1],  // Up kick
            [0, 1]    // Down kick
        ];
        
        for (const [dx, dy] of kicks) {
            testPiece.col = this.currentPiece.col + dx;
            testPiece.row = this.currentPiece.row + dy;
            
            if (!this.checkCollision(testPiece)) {
                this.currentPiece.col = testPiece.col;
                this.currentPiece.row = testPiece.row;
                this.currentPiece.rotation = testPiece.rotation;
                
                if (this.audio) {
                    this.audio.playRotate();
                }
                
                return true;
            }
        }
        
        return false;
    }
    
    hardDrop() {
        if (!this.currentPiece || this.gameOver || this.paused) return;
        
        let dropDistance = 0;
        const testPiece = this.currentPiece.clone();
        
        while (!this.checkCollision(testPiece)) {
            testPiece.row++;
            dropDistance++;
        }
        
        testPiece.row--; // Move back to last valid position
        
        if (dropDistance > 0) {
            this.currentPiece.row = testPiece.row;
            this.lockPiece();
            
            if (this.audio) {
                this.audio.playDrop();
            }
            
            // Bonus points for hard drop
            this.addScore(dropDistance * 2);
        }
    }
    
    holdCurrentPiece() {
        if (!this.currentPiece || !this.canHold || this.gameOver || this.paused) return;
        
        if (this.holdPiece) {
            const temp = this.currentPiece;
            this.currentPiece = this.holdPiece.clone();
            this.holdPiece = temp.clone();
        } else {
            this.holdPiece = this.currentPiece.clone();
            this.spawnNewPiece();
        }
        
        this.currentPiece.row = 0;
        this.currentPiece.col = Math.floor(this.GRID_WIDTH / 2) - 1;
        this.canHold = false;
        
        this.updateHoldPieceDisplay();
    }
    
    lockPiece() {
        // Add piece to grid
        const positions = this.currentPiece.getPositions();
        for (const pos of positions) {
            if (pos.row >= 0 && pos.row < this.GRID_HEIGHT && 
                pos.col >= 0 && pos.col < this.GRID_WIDTH) {
                this.grid[pos.row][pos.col] = this.currentPiece.color;
            }
        }
        
        // Check for completed lines
        const linesCleared = this.clearLines();
        
        // Update score
        if (linesCleared > 0) {
            this.addScore(this.calculateScore(linesCleared));
            this.lines += linesCleared;
            
            // Update level every 10 lines
            const newLevel = Math.floor(this.lines / 10) + 1;
            if (newLevel > this.level) {
                this.level = newLevel;
                this.dropSpeed = Math.max(100, 1000 - (this.level - 1) * 100);
                
                if (this.audio) {
                    this.audio.playLevelUp();
                }
            }
            
            if (linesCleared === 4 && this.audio) {
                this.audio.playTetris();
            } else if (this.audio) {
                this.audio.playLineClear(linesCleared);
            }
        }
        
        // Spawn new piece
        this.spawnNewPiece();
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let row = this.GRID_HEIGHT - 1; row >= 0; row--) {
            let isLineComplete = true;
            
            for (let col = 0; col < this.GRID_WIDTH; col++) {
                if (!this.grid[row][col]) {
                    isLineComplete = false;
                    break;
                }
            }
            
            if (isLineComplete) {
                // Remove the line
                for (let r = row; r > 0; r--) {
                    this.grid[r] = [...this.grid[r - 1]];
                }
                this.grid[0] = new Array(this.GRID_WIDTH).fill(null);
                
                linesCleared++;
                row++; // Check same row again after shifting
            }
        }
        
        return linesCleared;
    }
    
    calculateScore(linesCleared) {
        const baseScores = [0, 100, 300, 500, 800];
        return baseScores[linesCleared] * this.level;
    }
    
    addScore(points) {
        this.score += points;
        this.updateUI();
    }
    
    checkCollision(piece) {
        const positions = piece.getPositions();
        
        for (const pos of positions) {
            // Check boundaries
            if (pos.col < 0 || pos.col >= this.GRID_WIDTH || pos.row >= this.GRID_HEIGHT) {
                return true;
            }
            
            // Check if position is occupied (only check if row is positive)
            if (pos.row >= 0 && this.grid[pos.row][pos.col]) {
                return true;
            }
        }
        
        return false;
    }
    
    gameLoop(timestamp) {
        // Initialize lastFrameTime if first frame
        if (!this.lastFrameTime) {
            this.lastFrameTime = timestamp;
        }
        
        // Calculate delta time
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        
        // Calculate FPS
        if (deltaTime > 0) {
            this.fps = Math.round(1000 / deltaTime);
        }
        
        // Update FPS display
        document.getElementById('fps-counter').textContent = `${this.fps} FPS`;
        
        // Game logic
        if (this.gameStarted && !this.gameOver && !this.paused) {
            console.log('Game loop active, timestamp:', timestamp, 'lastDropTime:', this.lastDropTime, 'dropSpeed:', this.dropSpeed);
            
            // Auto drop
            if (timestamp - this.lastDropTime > this.dropSpeed) {
                console.log('Auto-drop triggered');
                this.movePiece(0, 1);
                this.lastDropTime = timestamp;
            }
        } else {
            console.log('Game loop inactive - started:', this.gameStarted, 'over:', this.gameOver, 'paused:', this.paused);
        }
        
        // Render
        this.render();
        
        // Continue game loop
        console.log('Requesting next animation frame');
        requestAnimationFrame(this.gameLoop);
    }
    
    render() {
        console.log('render() called - currentPiece:', this.currentPiece?.name, 'at row:', this.currentPiece?.row, 'col:', this.currentPiece?.col);
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid background
        this.drawGrid();
        
        // Draw locked pieces
        this.drawLockedPieces();
        
        // Draw current piece
        if (this.currentPiece && !this.gameOver) {
            // Draw ghost piece (projection)
            const ghostPiece = this.currentPiece.clone();
            while (!this.checkCollision(ghostPiece)) {
                ghostPiece.row++;
            }
            ghostPiece.row--;
            
            const ghostX = ghostPiece.col * this.BLOCK_SIZE;
            const ghostY = ghostPiece.row * this.BLOCK_SIZE;
            drawPiece(this.ctx, ghostPiece, ghostX, ghostY, this.BLOCK_SIZE, true);
            
            // Draw current piece
            const pieceX = this.currentPiece.col * this.BLOCK_SIZE;
            const pieceY = this.currentPiece.row * this.BLOCK_SIZE;
            drawPiece(this.ctx, this.currentPiece, pieceX, pieceY, this.BLOCK_SIZE);
        }
        
        // Draw grid lines
        this.drawGridLines();
    }
    
    drawGrid() {
        this.ctx.fillStyle = 'rgba(0, 10, 20, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid cells
        for (let row = 0; row < this.GRID_HEIGHT; row++) {
            for (let col = 0; col < this.GRID_WIDTH; col++) {
                const x = col * this.BLOCK_SIZE;
                const y = row * this.BLOCK_SIZE;
                
                this.ctx.strokeStyle = 'rgba(0, 100, 200, 0.2)';
                this.ctx.lineWidth = 0.5;
                this.ctx.strokeRect(x, y, this.BLOCK_SIZE, this.BLOCK_SIZE);
            }
        }
    }
    
    drawLockedPieces() {
        for (let row = 0; row < this.GRID_HEIGHT; row++) {
            for (let col = 0; col < this.GRID_WIDTH; col++) {
                if (this.grid[row][col]) {
                    const x = col * this.BLOCK_SIZE;
                    const y = row * this.BLOCK_SIZE;
                    
                    // Draw block
                    this.ctx.fillStyle = this.grid[row][col];
                    this.ctx.fillRect(x, y, this.BLOCK_SIZE, this.BLOCK_SIZE);
                    
                    // Block border
                    this.ctx.strokeStyle = '#ffffff';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(x, y, this.BLOCK_SIZE, this.BLOCK_SIZE);
                    
                    // 3D effect
                    this.ctx.fillStyle = `${this.grid[row][col]}40`;
                    this.ctx.fillRect(x + 2, y + 2, this.BLOCK_SIZE - 4, 2);
                    this.ctx.fillRect(x + 2, y + 2, 2, this.BLOCK_SIZE - 4);
                    
                    this.ctx.fillStyle = '#00000040';
                    this.ctx.fillRect(x + this.BLOCK_SIZE - 4, y + 4, 2, this.BLOCK_SIZE - 6);
                    this.ctx.fillRect(x + 4, y + this.BLOCK_SIZE - 4, this.BLOCK_SIZE - 6, 2);
                }
            }
        }
    }
    
    drawGridLines() {
        this.ctx.strokeStyle = 'rgba(0, 170, 255, 0.3)';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let col = 0; col <= this.GRID_WIDTH; col++) {
            const x = col * this.BLOCK_SIZE;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let row = 0; row <= this.GRID_HEIGHT; row++) {
            const y = row * this.BLOCK_SIZE;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    updateNextPieceDisplay() {
        if (!this.nextPiece || !this.nextCtx) return;
        
        this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        this.nextCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        // Center the piece in the preview
        const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0][0].length * 20) / 2;
        const offsetY = (this.nextCanvas.height - this.nextPiece.shape[0].length * 20) / 2;
        
        drawPiece(this.nextCtx, this.nextPiece, offsetX, offsetY, 20);
    }
    
    updateHoldPieceDisplay() {
        if (!this.holdCtx) return;
        
        this.holdCtx.clearRect(0, 0, this.holdCanvas.width, this.holdCanvas.height);
        this.holdCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.holdCtx.fillRect(0, 0, this.holdCanvas.width, this.holdCanvas.height);
        
        if (this.holdPiece) {
            // Center the piece in the preview
            const offsetX = (this.holdCanvas.width - this.holdPiece.shape[0][0].length * 20) / 2;
            const offsetY = (this.holdCanvas.height - this.holdPiece.shape[0].length * 20) / 2;
            
            drawPiece(this.holdCtx, this.holdPiece, offsetX, offsetY, 20);
        }
    }
    
    updateUI() {
        // Update score display
        document.getElementById('score').textContent = this.score.toString().padStart(6, '0');
        document.getElementById('level').textContent = this.level.toString().padStart(2, '0');
        document.getElementById('lines').textContent = this.lines.toString().padStart(3, '0');
        
        // Update game status
        let status = 'READY';
        if (this.gameStarted) {
            if (this.gameOver) {
                status = 'GAME OVER';
            } else if (this.paused) {
                status = 'PAUSED';
            } else {
                status = 'PLAYING';
            }
        }
        document.getElementById('game-status').textContent = status;
        
        // Update final score if game over
        if (this.gameOver) {
            document.getElementById('final-score').textContent = this.score.toString().padStart(6, '0');
        }
    }
    
    showGameOver() {
        document.getElementById('game-over-screen').style.display = 'flex';
        this.updateUI();
    }
    
    handleResize() {
        // Update canvas sizes if needed
        this.updateNextPieceDisplay();
        this.updateHoldPieceDisplay();
    }
}

// Initialize game when loaded
window.TetrisGame = TetrisGame;