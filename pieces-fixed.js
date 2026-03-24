// FIXED VERSION: Simplify drawPiece() for debugging

function drawPiece(ctx, piece, x, y, size, isGhost = false) {
    console.log('drawPiece FIXED called:', { 
        piece: piece?.name, 
        x, y, size, 
        isGhost,
        rotation: piece?.rotation
    });
    
    if (!ctx || !piece) {
        console.error('drawPiece: Missing ctx or piece!');
        return;
    }
    
    const shape = piece.shape[piece.rotation];
    
    // SIMPLIFY: Use solid colors for debugging
    const color = isGhost ? 'rgba(255, 255, 255, 0.3)' : piece.color;
    
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                const blockX = x + c * size;
                const blockY = y + r * size;
                
                console.log(`Drawing block at ${blockX},${blockY} color: ${color}`);
                
                // Draw block with SOLID color (no transparency issues)
                ctx.fillStyle = color;
                ctx.fillRect(blockX, blockY, size, size);
                
                // Simple border
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.strokeRect(blockX, blockY, size, size);
                
                console.log('Block drawn successfully');
            }
        }
    }
    
    console.log('drawPiece completed');
}