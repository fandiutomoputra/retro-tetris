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
        '#00ffff', // Cyan (bright)
        'I'
    ),
    
    J: new Tetromino(
        [
            [[1,0,0], [1,1,1], [0,0,0]], // 0°
            [[0,1,1], [0,1,0], [0,1,0]], // 90°
            [[0,0,0], [1,1,1], [0,0,1]], // 180°
            [[0,1,0], [0,1,0], [1,1,0]]  // 270°
        ],
        '#0088ff', // Bright Blue
        'J'
    ),
    
    L: new Tetromino(
        [
            [[0,0,1], [1,1,1], [0,0,0]], // 0°
            [[0,1,0], [0,1,0], [0,1,1]], // 90°
            [[0,0,0], [1,1,1], [1,0,0]], // 180°
            [[1,1,0], [0,1,0], [0,1,0]]  // 270°
        ],
        '#ff6600', // Bright Orange
        'L'
    ),
    
    O: new Tetromino(
        [
            [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]], // 0°
            [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]], // 90°
            [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]], // 180°
            [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]]  // 270°
        ],
        '#ffff00', // Yellow (already bright)
        'O'
    ),
    
    S: new Tetromino(
        [
            [[0,1,1], [1,1,0], [0,0,0]], // 0°
            [[0,1,0], [0,1,1], [0,0,1]], // 90°
            [[0,0,0], [0,1,1], [1,1,0]], // 180°
            [[1,0,0], [1,1,0], [0,1,0]]  // 270°
        ],
        '#00ff88', // Bright Green
        'S'
    ),
    
    T: new Tetromino(
        [
            [[0,1,0], [1,1,1], [0,0,0]], // 0°
            [[0,1,0], [0,1,1], [0,1,0]], // 90°
            [[0,0,0], [1,1,1], [0,1,0]], // 180°
            [[0,1,0], [1,1,0], [0,1,0]]  // 270°
        ],
        '#cc44ff', // Bright Purple
        'T'
    ),
    
    Z: new Tetromino(
        [
            [[1,1,0], [0,1,1], [0,0,0]], // 0°
            [[0,0,1], [0,1,1], [0,1,0]], // 90°
            [[0,0,0], [1,1,0], [0,1,1]], // 180°
            [[0,1,0], [1,1,0], [1,0,0]]  // 270°
        ],
        '#ff4444', // Bright Red
        'Z'
    )
};

// Piece colors for rendering - BRIGHT VERSION
const PIECE_COLORS = {
    'I': '#00ffff', // Cyan (bright)
    'J': '#0088ff', // Bright Blue  
    'L': '#ff6600', // Bright Orange
    'O': '#ffff00', // Yellow (bright)
    'S': '#00ff88', // Bright Green
    'T': '#cc44ff', // Bright Purple
    'Z': '#ff4444'  // Bright Red
};

// Helper functions
function getRandomPiece() {
    const pieces = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    const pieceName = pieces[Math.floor(Math.random() * pieces.length)];
    return TETROMINOS[pieceName].clone();
}

// Helper function to convert hex to rgba
function hexToRGBA(hex, alpha = 1) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawPiece(ctx, piece, x, y, size, isGhost = false) {
    if (!ctx || !piece) return;
    
    const shape = piece.shape[piece.rotation];
    const color = isGhost ? hexToRGBA(piece.color, 0.3) : piece.color;
    
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                const blockX = x + c * size;
                const blockY = y + r * size;
                
                // Draw block with solid color
                ctx.fillStyle = color;
                ctx.fillRect(blockX, blockY, size, size);
                
                // Block border
                ctx.strokeStyle = isGhost ? 'rgba(255, 255, 255, 0.5)' : '#ffffff';
                ctx.lineWidth = 1;
                ctx.strokeRect(blockX, blockY, size, size);
                
                // Simple 3D effect (only for non-ghost)
                if (!isGhost) {
                    // Highlight
                    ctx.fillStyle = hexToRGBA(piece.color, 0.4);
                    ctx.fillRect(blockX + 1, blockY + 1, size - 2, 2);
                    ctx.fillRect(blockX + 1, blockY + 1, 2, size - 2);
                    
                    // Shadow
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
                    ctx.fillRect(blockX + size - 2, blockY + 2, 1, size - 4);
                    ctx.fillRect(blockX + 2, blockY + size - 2, size - 4, 1);
                }
            }
        }
    }
}

// Export for use in tetris.js
window.TETROMINOS = TETROMINOS;
window.PIECE_COLORS = PIECE_COLORS;
window.getRandomPiece = getRandomPiece;
window.drawPiece = drawPiece;
window.Tetromino = Tetromino;