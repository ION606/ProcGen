class Player {
    constructor(startx, starty) {
        this.mainEl = document.querySelector('main.dispGrid');
        this.x = startx;
        this.y = starty;

        this.mainEl.children[this.y].children[this.x].classList.add("player");
        this.setupEventListeners();
    }

    save() {
        const {...object} = this;
		delete object['x'];
		delete object['y'];
		localStorage.setItem('player', JSON.stringify(object));
    }

    moveTo(newX, newY) {
        const square = this.mainEl.children[newY]?.children[newX];
        if (square?.classList?.contains('room') && !square?.classList?.contains('visited')) {
            const roomTiles = findConnectedRooms(square);
            roomTiles.map(r => r.classList.add('visited'));

            const edgeTiles = findEdgeRooms(roomTiles);

            // recreate outer box
            const boundingRect = calculateBoundingRectangle(edgeTiles.map(r => r.room));
            const scale = calculateScalingFactor(boundingRect);
            scaleToFitScreen(edgeTiles, scale, boundingRect);
            
            // for now, just move through it
            this.mainEl.children[this.y].children[this.x].classList.remove('player');
            square.classList.add('player');

            this.x = newX;
            this.y = newY;
        }
        else if (square?.classList?.contains('edgePath')) reset(this);
        else if (square?.classList?.contains('path')) {
            this.mainEl.children[this.y].children[this.x].classList.remove('player');
            square.classList.add('player');
            this.x = newX;
            this.y = newY;
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'w') this.moveTo(this.x, this.y - 1);
            else if (e.key === 'a') this.moveTo(this.x - 1, this.y);
            else if (e.key === 's') this.moveTo(this.x, this.y + 1);
            else if (e.key === 'd') this.moveTo(this.x + 1, this.y);
        });
    }
}
