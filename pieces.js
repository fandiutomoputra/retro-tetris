// RETRO TETRIS - Tetromino Pieces
// Classic 7 Tetromino shapes with arcade colors

class Tetromino {
    constructor(shape, color, name) {
        this.shape = shape;
        this.color = color;
        this.name = name;
        this.row = 0;
        this.col = 3; // Start in middle
        this.rotation = 0;
    }
    
    getPositions() {
        const shape = this.shape[this.rotation];
        const positions = [];
        
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c]) {
                    positions.push({
                        row: this.row + r,
                        col: this.col + c
                    });
                }
            }
        }
        
        return positions;
    }
    
    rotate() {
        this.rotation = (this.rotation + 1) % this.shape.length;
    }
    
    rotateBack() {
        this.rotation = (this.rotation - 1 + this.shape.length) % this.shape.length;
    }
    
    moveLeft() {
        this.col--;
    }
    
    moveRight() {
        this.col++;
    }
    
    moveDown() {
        this.row++;
    }
    
    moveUp() {
        this.row--;
    }
    
    clone() {
        const clone = new Tetromino(this.shape, this.color, this.name);
        clone.row = this.row;
        clone.col = this.col;
        clone.rotation = this.rotation;
        return clone;
    }
}

// Tetromino Definitions
const TETROMINOS = {
    I: new Tetromino(
        [
            [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], // 0°
            [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]], // 90°
            [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]], // 180°
            [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]]  // 270°
        ],
        '#00ffff', // Cyan
        'I'
    ),
    
    J: new Tetromino(
        [
            [[1,0,0], [1,1,1], [0,0,0]], // 0°
            [[0,1,1], [0,1,0], [0,1,0]], // 90°
            [[0,0,0], [1,1,1], [0,0,1]], // 180°
            [[0,1,0], [0,1,0], [1,1,0]]  // 270°
        ],
        '#0000ff', // Blue
        'J'
    ),
    
    L: new Tetromino(
        [
            [[0,0,1], [1,1,1], [0,0,0]], // 0°
            [[0,1,0], [0,1,0], [0,1,1]], // 90°
            [[0,0,0], [1,1,1], [1,0,0]], // 180°
            [[1,1,0], [0,1,0], [0,1,0]]  // 270°
        ],
        '#ff8800', // Orange
        'L'
    ),
    
    O: new Tetromino(
        [
            [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]], // 0°
            [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]], // 90°
            [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]], // 180°
            [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]]  // 270°
        ],
        '#ffff00', // Yellow
        'O'
    ),
    
    S: new Tetromino(
        [
            [[0,1,1], [1,1,0], [0,0,0]], // 0°
            [[0,1,0], [0,1,1], [0,0,1]], // 90°
            [[0,0,0], [0,1,1], [1,1,0]], // 180°
            [[1,0,0], [1,1,0], [0,1,0]]  // 270°
        ],
        '#00ff00', // Green
        'S'
    ),
    
    T: new Tetromino(
        [
            [[0,1,0], [1,1,1], [0,0,0]], // 0°
            [[0,1,0], [0,1,1], [0,1,0]], // 90°
            [[0,0,0], [1,1,1], [0,1,0]], // 180°
            [[0,1,0], [1,1,0], [0,1,0]]  // 270°
        ],
        '#aa00ff', // Purple
        'T'
    ),
    
    Z: new Tetromino(
        [
            [[1,1,0], [0,1,1], [0,0,0]], // 0°
            [[0,0,1], [0,1,1], [0,1,0]], // 90°
            [[0,0,0], [1,1,0], [0,1,1]], // 180°
            [[0,1,0], [1,1,0], [1,0,0]]  // 270°
        ],
        '#ff0000', // Red
        'Z'
    )
};

// Piece colors for rendering
const PIECE_COLORS = {
    'I': '#00ffff', // Cyan
    'J': '#0000ff', // Blue  
    'L': '#ff8800', // Orange
    'O': '#ffff00', // Yellow
    'S': '#00ff00', // Green
    'T': '#aa00ff', // Purple
    'Z': '#ff0000'  // Red
};

// Helper functions
function getRandomPiece() {
    const pieces = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    const pieceName = pieces[Math.floor(Math.random() * pieces.length)];
    return TETROMINOS[pieceName].clone();
}

function drawPiece(ctx, piece, x, y, size, isGhost = false) {
    console.log('drawPiece called:', { 
        piece: piece?.name, 
        x, y, size, 
        isGhost,
        ctxType: ctx?.constructor?.name 
    });
    
    if (!ctx || !piece) {
        console.error('drawPiece: Missing ctx or piece!', { ctx, piece });
        return;
    }
    
    const shape = piece.shape[piece.rotation];
    const color = isGhost ? `${piece.color}80` : piece.color; // 80 = 50% opacity
    
    console.log('Drawing shape:', shape, 'color:', color);
    
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                const blockX = x + c * size;
                const blockY = y + r * size;
                
                console.log('Drawing block at:', blockX, blockY, 'size:', size);
                
                // Draw block with retro style
                ctx.fillStyle = color;
                ctx.fillRect(blockX, blockY, size, size);
                
                // Block border
                ctx.strokeStyle = isGhost ? '#ffffff80' : '#ffffff';
                ctx.lineWidth = 1;
                ctx.strokeRect(blockX, blockY, size, size);
                
                // Inner highlight for 3D effect
                if (!isGhost) {
                    ctx.fillStyle = `${piece.color}40`;
                    ctx.fillRect(blockX + 2, blockY + 2, size - 4, 2);
                    ctx.fillRect(blockX + 2, blockY + 2, 2, size - 4);
                    
                    // Shadow
                    ctx.fillStyle = '#00000040';
                    ctx.fillRect(blockX + size - 4, blockY + 4, 2, size - 6);
                    ctx.fillRect(blockX + 4, blockY + size - 4, size - 6, 2);
                }
            }
        }
    }
    
    console.log('drawPiece completed');
}

// Export for use in tetris.js
window.TETROMINOS = TETROMINOS;
window.PIECE_COLORS = PIECE_COLORS;
window.getRandomPiece = getRandomPiece;
window.drawPiece = drawPiece;
window.Tetromino = Tetromino;