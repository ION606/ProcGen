const MACROS = {
    TILE_SIZE: 80,
    COLORS: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'white',' black'],
}

class Coordinates {
    /**
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(x, y) {this.x = x; this.y = y;}
}

const getRandInRange = (boundUpper, boundLower = 0, asFloat = true) => {
    const ogNum = (Math.random() * (boundUpper - boundLower)) + boundLower;
    return (asFloat) ? ogNum : Math.floor(ogNum);
}

const inRange = (x, min, max) => (x >= min && x <= max);


window.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem('seed')) localStorage.setItem('seed', Math.round(Date.now() * Math.random()));
    MACROS.seed = Number(localStorage.getItem('seed'));
    
    MACROS.numTiles = [Math.floor((window.innerWidth) / MACROS.TILE_SIZE),Math.floor((window.innerHeight) / MACROS.TILE_SIZE)];
    
    // create the grid
    for (let i = 0; i < MACROS.numTiles[1]; i++) {
        const row = document.createElement('div');
        row.className = 'gridRow';
        row.style.columnCount = MACROS.numTiles[0];

        for (let j = 0; j < MACROS.numTiles[0]; j++) {
            // const bkcol = MACROS.COLORS[getRandInRange(MACROS.COLORS.length, 0, false)];
            const colBox = document.createElement('div');
            colBox.className = "colBox";
            // colBox.innerText = bkcol;
            colBox.style.backgroundColor = 'black';
            colBox.style.width = `${MACROS.TILE_SIZE}px`;
            colBox.style.height = `${MACROS.TILE_SIZE}px`;

            row.appendChild(colBox);
        }

        document.getElementsByTagName('main')[0].appendChild(row);
    }

    // setInterval(() => {
    //     const x = genRandInRange(0, window.screenX),
    //     y = genRandInRange(0, window.screenY);

    //     console.log(x, y)
    // }, 1000)
});


/**
 * RANDOM, NOT OPTIMIZED
 * @param {[Number, Number]} startCoords 
 * @param {[Number, Number]} endCoords 
 */
function makePath(startCoords, endCoords) {
    const main = document.getElementsByTagName('main')[0];
    const w = main.children.length,
    h = main.children[0].children.length;
    
    let [x, y] = startCoords;
    let [ex, ey] = endCoords;

    while (x != ex && y != ey) {
        const dir = Math.floor(Math.random() * 4);
        if (dir == 0 && y - 1 >= 0) y -= 1;
        else if (dir == 1 && y + 1 < MACROS.numTiles[1]) y += 1;
        else if (dir == 2 && x - 1 >= 0) x -= 1;
        else if (dir == 3 && x + 1 < MACROS.numTiles[0]) x += 1;

        const currentTile = main.children[y].children[x];
        currentTile.style.backgroundColor = 'white';
    }
}


function putTrees() {
    const main = document.getElementsByTagName('main')[0];

    const numTreesOnScreen = Math.round(getRandInRange(MACROS.numTiles[1])/1.5);
    for (let i = 0; i < numTreesOnScreen; i++) {
        const [x, y] = Math.floor(MACROS.numTiles * Math.random())
        const currentTile = main.children[y].children[x];
        currentTile.style.backgroundColor = 'white';
    }
}