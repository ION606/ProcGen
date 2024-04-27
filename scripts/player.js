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
        if (square?.classList?.contains('room')) {
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
