document.addEventListener('DOMContentLoaded', () => {
    const challengeText = document.getElementById('challengeText');
    const yesButton = document.getElementById('yesButton');
    const container = document.querySelector('.container');

    // Create puzzle container
    const puzzleContainer = document.createElement('div');
    puzzleContainer.className = 'puzzle-container';
    document.body.appendChild(puzzleContainer);

    // Create puzzle grid
    const puzzleGrid = document.createElement('div');
    puzzleGrid.className = 'puzzle-grid';
    puzzleContainer.appendChild(puzzleGrid);

    // Create celebration text
    const celebrationText = document.createElement('div');
    celebrationText.className = 'celebration-text';
    puzzleContainer.appendChild(celebrationText);

    // Create restart button
    const restartButton = document.createElement('button');
    restartButton.className = 'restart-button';
    restartButton.textContent = 'Start Over';
    puzzleContainer.appendChild(restartButton);

    // Local image URL
    const sampleImage = 'IMG_3824.JPG';

    let pieces = [];
    let isGameComplete = false;
    let emptyIndex = 8; // The empty space starts at the bottom right

    function createPuzzle() {
        puzzleGrid.innerHTML = '';
        pieces = [];
        
        // Create 9 pieces
        for (let i = 0; i < 9; i++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            if (i !== emptyIndex) {
                piece.style.backgroundImage = `url(${sampleImage})`;
                // Calculate the correct background position for each piece
                const col = i % 3;
                const row = Math.floor(i / 3);
                piece.style.backgroundPosition = `${-col * 100}% ${-row * 100}%`;
            }
            piece.dataset.index = i;
            piece.addEventListener('click', () => movePiece(piece));
            puzzleGrid.appendChild(piece);
            pieces.push(piece);
        }

        // Shuffle pieces
        shufflePieces();
    }

    function shufflePieces() {
        // Perform random moves to shuffle the puzzle
        const moves = 100; // Number of random moves to perform
        for (let i = 0; i < moves; i++) {
            const possibleMoves = getPossibleMoves();
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            swapPieces(emptyIndex, randomMove);
            emptyIndex = randomMove;
        }
    }

    function getPossibleMoves() {
        const row = Math.floor(emptyIndex / 3);
        const col = emptyIndex % 3;
        const moves = [];

        // Check all four directions
        if (row > 0) moves.push(emptyIndex - 3); // Up
        if (row < 2) moves.push(emptyIndex + 3); // Down
        if (col > 0) moves.push(emptyIndex - 1); // Left
        if (col < 2) moves.push(emptyIndex + 1); // Right

        return moves;
    }

    function movePiece(piece) {
        if (isGameComplete) return;

        const pieceIndex = parseInt(piece.dataset.index);
        if (isAdjacent(emptyIndex, pieceIndex)) {
            swapPieces(emptyIndex, pieceIndex);
            emptyIndex = pieceIndex;
            checkWin();
        }
    }

    function swapPieces(index1, index2) {
        const piece1 = pieces[index1];
        const piece2 = pieces[index2];

        const tempImage = piece1.style.backgroundImage;
        const tempPosition = piece1.style.backgroundPosition;

        piece1.style.backgroundImage = piece2.style.backgroundImage;
        piece1.style.backgroundPosition = piece2.style.backgroundPosition;

        piece2.style.backgroundImage = tempImage;
        piece2.style.backgroundPosition = tempPosition;
    }

    function isAdjacent(index1, index2) {
        const row1 = Math.floor(index1 / 3);
        const col1 = index1 % 3;
        const row2 = Math.floor(index2 / 3);
        const col2 = index2 % 3;

        return (Math.abs(row1 - row2) === 1 && col1 === col2) ||
               (Math.abs(col1 - col2) === 1 && row1 === row2);
    }

    function checkWin() {
        const isCorrect = pieces.every((piece, index) => {
            if (index === emptyIndex) return true;
            const col = index % 3;
            const row = Math.floor(index / 3);
            const correctPosition = `${-col * 100}% ${-row * 100}%`;
            return piece.style.backgroundPosition === correctPosition;
        });

        if (isCorrect) {
            isGameComplete = true;
            celebrate();
        }
    }

    function celebrate() {
        // Create celebration audio
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
        audio.play();

        // Create confetti container
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        document.body.appendChild(confettiContainer);

        // Create confetti
        for (let i = 0; i < 100; i++) {
            createConfetti(confettiContainer);
        }

        // Update celebration text with animations
        celebrationText.innerHTML = `
            <div class="celebration-message">Well Done!!!</div>
            <div class="birthday-message">Happy Birthday Winnie!</div>
            <div class="prize-message">You can now claim your prize</div>
        `;
        celebrationText.style.opacity = '1';

        // Remove confetti after 5 seconds
        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    }

    function createConfetti(container) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.opacity = Math.random();
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        container.appendChild(confetti);

        const animation = confetti.animate([
            { transform: 'translate3d(0,0,0) rotate(0deg)', opacity: 1 },
            { transform: `translate3d(${Math.random() * 100 - 50}px,${window.innerHeight}px,0) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(.37,0,.63,1)'
        });

        animation.onfinish = () => confetti.remove();
    }

    function getRandomColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#ffd93d', '#ff8c42', '#ff2e63'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    yesButton.addEventListener('click', () => {
        container.style.display = 'none';
        puzzleContainer.style.display = 'block';
        createPuzzle();
    });

    restartButton.addEventListener('click', () => {
        puzzleContainer.style.display = 'none';
        container.style.display = 'block';
        isGameComplete = false;
        celebrationText.style.opacity = '0';
        emptyIndex = 8;
    });
}); 