// RETRO TETRIS - 8-bit Audio System

class RetroAudio {
    constructor() {
        this.audioContext = null;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.musicOscillator = null;
        this.musicGain = null;
        this.isPlayingMusic = false;
        
        this.init();
    }
    
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Audio system initialized');
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
            this.audioContext = null;
        }
    }
    
    // Sound Effects
    playMove() {
        if (!this.sfxEnabled || !this.audioContext) return;
        this.playBeep(200, 0.05, 'sine');
    }
    
    playRotate() {
        if (!this.sfxEnabled || !this.audioContext) return;
        this.playBeep(300, 0.1, 'sine');
    }
    
    playDrop() {
        if (!this.sfxEnabled || !this.audioContext) return;
        this.playBeep(150, 0.15, 'sawtooth');
    }
    
    playLock() {
        if (!this.sfxEnabled || !this.audioContext) return;
        this.playBeep(100, 0.2, 'square');
    }
    
    playLineClear(lines) {
        if (!this.sfxEnabled || !this.audioContext) return;
        
        const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const duration = 0.1;
        
        for (let i = 0; i < Math.min(lines, 4); i++) {
            setTimeout(() => {
                this.playBeep(frequencies[i], duration, 'sine');
            }, i * 100);
        }
    }
    
    playTetris() {
        if (!this.sfxEnabled || !this.audioContext) return;
        
        // Tetris theme snippet
        const notes = [
            { freq: 659.25, duration: 0.15 }, // E5
            { freq: 493.88, duration: 0.15 }, // B4
            { freq: 523.25, duration: 0.15 }, // C5
            { freq: 587.33, duration: 0.15 }, // D5
            { freq: 523.25, duration: 0.15 }, // C5
            { freq: 493.88, duration: 0.15 }, // B4
            { freq: 440.00, duration: 0.15 }, // A4
        ];
        
        notes.forEach((note, index) => {
            setTimeout(() => {
                this.playBeep(note.freq, note.duration, 'square');
            }, index * 150);
        });
    }
    
    playGameOver() {
        if (!this.sfxEnabled || !this.audioContext) return;
        
        const notes = [
            { freq: 220, duration: 0.2 },
            { freq: 196, duration: 0.2 },
            { freq: 174.61, duration: 0.2 },
            { freq: 164.81, duration: 0.5 }
        ];
        
        notes.forEach((note, index) => {
            setTimeout(() => {
                this.playBeep(note.freq, note.duration, 'sawtooth');
            }, index * 200);
        });
    }
    
    playLevelUp() {
        if (!this.sfxEnabled || !this.audioContext) return;
        
        const notes = [
            { freq: 523.25, duration: 0.1 }, // C5
            { freq: 659.25, duration: 0.1 }, // E5
            { freq: 783.99, duration: 0.1 }, // G5
            { freq: 1046.50, duration: 0.2 }  // C6
        ];
        
        notes.forEach((note, index) => {
            setTimeout(() => {
                this.playBeep(note.freq, note.duration, 'sine');
            }, index * 100);
        });
    }
    
    // Background Music (simplified Tetris theme)
    toggleMusic() {
        if (!this.audioContext) return;
        
        this.musicEnabled = !this.musicEnabled;
        
        if (this.musicEnabled && !this.isPlayingMusic) {
            this.startMusic();
        } else if (!this.musicEnabled && this.isPlayingMusic) {
            this.stopMusic();
        }
        
        return this.musicEnabled;
    }
    
    startMusic() {
        if (!this.audioContext || this.isPlayingMusic) return;
        
        this.isPlayingMusic = true;
        this.musicOscillator = this.audioContext.createOscillator();
        this.musicGain = this.audioContext.createGain();
        
        this.musicOscillator.type = 'square';
        this.musicOscillator.frequency.setValueAtTime(329.63, this.audioContext.currentTime); // E4
        
        this.musicGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        
        this.musicOscillator.connect(this.musicGain);
        this.musicGain.connect(this.audioContext.destination);
        
        this.musicOscillator.start();
        
        // Simple arpeggio pattern
        const playPattern = () => {
            if (!this.isPlayingMusic) return;
            
            const notes = [329.63, 392.00, 493.88, 392.00]; // E4, G4, B4, G4
            let time = this.audioContext.currentTime;
            
            notes.forEach((freq, index) => {
                this.musicOscillator.frequency.setValueAtTime(freq, time + index * 0.3);
            });
            
            setTimeout(playPattern, 1200);
        };
        
        playPattern();
    }
    
    stopMusic() {
        if (!this.isPlayingMusic) return;
        
        this.isPlayingMusic = false;
        if (this.musicOscillator) {
            this.musicOscillator.stop();
            this.musicOscillator = null;
        }
        if (this.musicGain) {
            this.musicGain = null;
        }
    }
    
    toggleSFX() {
        this.sfxEnabled = !this.sfxEnabled;
        return this.sfxEnabled;
    }
    
    // Helper function to play a beep
    playBeep(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Audio playback error:', error);
        }
    }
    
    // Check if audio is supported
    isSupported() {
        return !!this.audioContext;
    }
}

// Export for use in tetris.js
window.RetroAudio = RetroAudio;