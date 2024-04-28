const MACROS = {
	TILE_SIZE: 30,
	COLORS: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'white', 'black'],
	ROOM_MIN_SIZE: 3,
	ROOM_MAX_SIZE: 6,
	HALLWAY_WIDTH: 1
};

const inRange = (x, min, max) => (x >= min && x <= max);


window.addEventListener("DOMContentLoaded", () => {
	if (!localStorage.getItem('seed')) {
		localStorage.setItem('seed', Math.round(Date.now() * Math.random()));
	}
	MACROS.seed = Number(localStorage.getItem('seed'));
	MACROS.numTiles = [Math.floor(window.innerWidth / MACROS.TILE_SIZE), Math.floor(window.innerHeight / MACROS.TILE_SIZE)];
	const main = document.querySelector('main.dispGrid');

	const r = loadMap();
	if (r) {
		const edges = Array.from(document.querySelectorAll('.edgePath'));
		const edge = edges[getRandInRange(edges.length - 1, 0, false)];

		const y = Array.prototype.indexOf.call(main.children, edge.parentNode),
		x = Array.prototype.indexOf.call(main.children[y].children, edge); //this does not work, why?
		
		const player = new Player(x, y);
		player.save();
		return;
	}


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
			colBox.style.width = `${MACROS.TILE_SIZE}px`;
			colBox.style.height = `${MACROS.TILE_SIZE}px`;

			row.appendChild(colBox);
		}

		main.appendChild(row);
	}

	generateMap(); // Call the map generation after grid initialization
});

function generateRooms() {
	const main = document.querySelector('main.dispGrid');

	// idk make one for every 20 tiles
	const numRoomsRaw = (MACROS.numTiles[0] / 20) > 1 ? Math.round((MACROS.numTiles[0] / 10)) : 2;
	const numRooms = getRandInRange(numRoomsRaw, 2, false);
	let rooms = [];

	for (let i = 0; i < numRooms; i++) {
		const roomWidth = getRandInRange(MACROS.ROOM_MAX_SIZE, MACROS.ROOM_MIN_SIZE, false),
			roomHeight = getRandInRange(MACROS.ROOM_MAX_SIZE, MACROS.ROOM_MIN_SIZE, false),
			x = getRandInRange(MACROS.numTiles[0] - roomWidth, 0, false),
			y = getRandInRange(MACROS.numTiles[1] - roomHeight, 0, false);

		rooms.push({ x, y, width: roomWidth, height: roomHeight });

		for (let ry = y; ry < y + roomHeight; ry++) {
			for (let rx = x; rx < x + roomWidth; rx++) {
				main.children[ry].children[rx].classList.add('room');
			}
		}
	}
	return rooms;
}

/** will return the coords of the end of the path */
function drawLineToRoom(x1, y1, x2, y2) {
	let xret = x1, yret = y1;
	const main = document.querySelector('main.dispGrid');
	// Connect horizontally from room1 to room2
	while (x1 !== x2) {
		if (main.children[y1]?.children[x1]) {
			main.children[y1].children[x1].classList.add('path');
			xret = x1;
		}

		x1 += (x2 > x1) ? 1 : -1;  // Increment or decrement to move towards x2
	}

	// Once x1 is aligned with x2, connect vertically
	while (y1 !== y2) {
		if (main.children[y1]?.children[x1]) {
			main.children[y1].children[x1].classList.add('path');
			yret = y1;
		}
		y1 += (y2 > y1) ? 1 : -1;  // Increment or decrement to move towards y2
	}

	return {x: xret, y: yret};
}

function getRandomEdgePoint() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	let x, y;

	// Choose a random edge: 0 = top, 1 = right, 2 = bottom, 3 = left
	const edge = Math.floor(Math.random() * 4);
	console.log(edge);

	switch (edge) {
		case 0: // Top edge
			x = Math.random() * width;
			y = 0;
			break;
		case 1: // Right edge
			x = width;
			y = Math.random() * height;
			break;
		case 2: // Bottom edge
			x = Math.random() * width;
			y = height;
			break;
		case 3: // Left edge
			x = 0;
			y = Math.random() * height;
			break;
	}

	return { x: Math.round(x), y: Math.round(y) };
}


const calculateDistance = (point1, point2) => Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));

function findClosestRoom(edgePoint, rooms) {
    let closestRoom = null;
    let minDistance = Infinity;

    rooms.forEach(room => {
        const roomCenter = {
            x: room.x + room.width / 2,
            y: room.y + room.height / 2
        };

        const distance = calculateDistance(edgePoint, roomCenter);
        if (distance < minDistance) {
            minDistance = distance;
            closestRoom = room;
        }
    });

    return closestRoom;
}




function connectRooms(room1, room2) {
	let x1 = room1.x + Math.floor(room1.width / 2);
	let y1 = room1.y + Math.floor(room1.height / 2);
	let x2 = room2.x + Math.floor(room2.width / 2);
	let y2 = room2.y + Math.floor(room2.height / 2);
	
	drawLineToRoom(x1, y1, x2, y2);
}


const saveMap = () => {
	localStorage.setItem('savedMap', document.querySelector('main.dispGrid').innerHTML);
}

const loadMap = () => {
	const htmlToLoad = localStorage.getItem('savedMap');
	if (htmlToLoad) {
		document.querySelector('main.dispGrid').innerHTML = htmlToLoad;
		return true;
	}
	return false;
}


function reset(player = false) {
	localStorage.clear();
	if (player) player.save();
	window.location.reload();
}


function generateMap() {
	const rooms = generateRooms();
	for (let i = 0; i < rooms.length - 1; i++) {
		connectRooms(rooms[i], rooms[i + 1]);
	}

	if (!localStorage.getItem('outerEdges')) {
		const outerEdges = [];
		const rToEMax = Math.round(Math.random() * rooms.length);

		for (let i = 0; i < getRandInRange(rToEMax > 2 ? rToEMax : 2, 2, false); i++) {
			const {x, y} = getRandomEdgePoint();

			// Find the closest room to this edge point
			const closestRoom = findClosestRoom({x, y}, rooms);

			// Draw a line from the edge point to the center of the closest room
			outerEdges.push(drawLineToRoom(closestRoom.x, closestRoom.y, x, y));
		}

		localStorage.setItem('outerEdges', JSON.stringify(outerEdges));
	}

	const edges = JSON.parse(localStorage.getItem('outerEdges'));
	const main = document.querySelector('main.dispGrid');
	for (const edge of edges) {
		main.children[edge.y].children[edge.x].classList.add('edgePath');
	}

	const edge = edges[getRandInRange(edges.length - 1, 0, false)];
	const player = new Player(edge.x, edge.y, rooms);
	player.save();

	saveMap();
}

function getRandInRange(upper, lower = 0, asFloat = true) {
	const num = Math.random() * (upper - lower) + lower;
	return asFloat ? num : Math.floor(num);
}