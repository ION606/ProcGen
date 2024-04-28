function areTouching(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    return !(rect1.right < rect2.left ||
             rect1.left > rect2.right ||
             rect1.bottom < rect2.top ||
             rect1.top > rect2.bottom);
}

function findTouchingRooms(el) {
    const rooms = document.querySelectorAll('.room');
    const touchingRooms = [];

    rooms.forEach(room => {
        if (el !== room && areTouching(el, room)) {
            touchingRooms.push(room);
        }
    });

    return touchingRooms;
}

function findConnectedRooms(startElement) {
    const rooms = document.querySelectorAll('.room');
    let visited = new Set(); // To keep track of visited rooms
    let toExplore = [startElement]; // Queue for BFS

    visited.add(startElement);

    while (toExplore.length > 0) {
        const currentRoom = toExplore.shift();

        rooms.forEach(room => {
            if (!visited.has(room) && areTouching(currentRoom, room)) {
                visited.add(room);
                toExplore.push(room);
            }
        });
    }

    return Array.from(visited);
}


function isEdgeRoom(room, allRooms) {
    const rect = room.getBoundingClientRect();
    let hasOpenSide = {
        top: true,
        right: true,
        bottom: true,
        left: true
    };

    allRooms.forEach(otherRoom => {
        if (room === otherRoom) return; // Skip self check

        const otherRect = otherRoom.getBoundingClientRect();
        
        if (rect.top === otherRect.bottom && rect.left < otherRect.right && rect.right > otherRect.left) {
            hasOpenSide.top = false; // Other room is directly above
        }
        if (rect.bottom === otherRect.top && rect.left < otherRect.right && rect.right > otherRect.left) {
            hasOpenSide.bottom = false; // Other room is directly below
        }
        if (rect.right === otherRect.left && rect.top < otherRect.bottom && rect.bottom > otherRect.top) {
            hasOpenSide.right = false; // Other room is directly to the right
        }
        if (rect.left === otherRect.right && rect.top < otherRect.bottom && rect.bottom > otherRect.top) {
            hasOpenSide.left = false; // Other room is directly to the left
        }
    });

    const isEdge = hasOpenSide.top || hasOpenSide.right || hasOpenSide.bottom || hasOpenSide.left;
    return {isEdge, isTop: hasOpenSide.top, isRight: hasOpenSide.right, isBottom: hasOpenSide.bottom, isLeft: hasOpenSide.left};
}


function findEdgeRooms(connectedRooms) {
    const edgeRooms = [];
    connectedRooms.forEach(room => {
        const side = isEdgeRoom(room, connectedRooms);
        if (side.isEdge) {
            edgeRooms.push({room, side});
        }
    });
    return edgeRooms;
}


function calculateBoundingRectangle(rooms) {
    let minX = Infinity, maxX = 0, minY = Infinity, maxY = 0;

    rooms.forEach(room => {
        const rect = room.getBoundingClientRect();
        if (rect.left < minX) minX = rect.left;
        if (rect.top < minY) minY = rect.top;
        if (rect.right > maxX) maxX = rect.right;
        if (rect.bottom > maxY) maxY = rect.bottom;
    });

    return {
        left: minX,
        top: minY,
        width: maxX - minX,
        height: maxY - minY
    };
}


function calculateScalingFactor(boundingRect) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const scaleWidth = screenWidth / boundingRect.width;
    const scaleHeight = screenHeight / boundingRect.height;

    // Use the smaller scale factor to ensure the shape fits entirely
    return Math.min(scaleWidth, scaleHeight);
}

/**
 * @param {Array<{room: Element, side: {isEdge: Boolean, isTop: Boolean, isRight: Boolean, isBottom: Boolean, isLeft: Boolean}}} rooms 
 * @returns 
 */
function scaleToFitScreen(rooms, scale, boundingRect) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    container.className = "scaledup";

    rooms.forEach(roomAll => {
        const {side, room} = roomAll;
        const rect = room.getBoundingClientRect();
        const scaledRoom = document.createElement('div');
        container.appendChild(scaledRoom);

        scaledRoom.style.position = 'absolute';
        
        scaledRoom.style.left = `${(rect.left - boundingRect.left) * scale}px`;
        scaledRoom.style.top = `${(rect.top - boundingRect.top) * scale}px`;

        // scale the element in the respective direction
        if ((side.isTop) && (side.isRight || side.isLeft)) {
            const scaledRoomSide = document.createElement('div');
            container.appendChild(scaledRoomSide);
            
            scaledRoomSide.style.height = `${rect.height}px`;
            scaledRoomSide.style.width = `${rect.width * scale}px`;
            scaledRoomSide.style.left = `${(rect.left - boundingRect.left) * scale}px`;
            scaledRoomSide.style.top = `${(rect.top - boundingRect.top) * scale}px`;
            scaledRoomSide.style.position = 'absolute';

            scaledRoom.style.height = `${rect.height * scale}px`;
            scaledRoom.style.width = `${rect.width}px`;
        }
        else if (side.isBottom && (side.isRight || side.isLeft)) {
            const scaledRoomSide = document.createElement('div');
            container.appendChild(scaledRoomSide);
            
            scaledRoomSide.style.height = `${rect.height * scale}px`;
            scaledRoomSide.style.width = `${rect.width}px`;

            scaledRoomSide.dataset.djdhfgkjd = '1';
            scaledRoomSide.style.left = `${(rect.left - boundingRect.left - (rect.width * scale)/2) * scale}px`;
            scaledRoomSide.style.top = `${(rect.top - boundingRect.top) * scale}px`;
            scaledRoomSide.style.position = 'absolute';
            scaledRoomSide.style.backgroundColor = 'lightblue';

            if (side.isRight) scaledRoom.style.left = `${scaledRoom.style.left + (scaledRoom.style.width * 2)}px`;
            if (side.isLeft) scaledRoom.style.left = `${scaledRoom.style.left - (scaledRoom.style.width * 2)}px`;
        }
        else if (side.isTop || side.isBottom) {
            scaledRoom.dataset.isTopOrBottom = '1';
            scaledRoom.style.width = `${rect.width * scale * 2}px`;
            scaledRoom.style.height = `${rect.height}px`;
            scaledRoom.style.left = `${(parseInt(scaledRoom.style.left, 10)) - (parseInt(scaledRoom.style.width, 10)/2)}px`;
        }
        else if (side.isLeft || side.isRight) {
            scaledRoom.style.height = `${rect.height * scale}px`;
            scaledRoom.style.width = `${rect.width}px`;
        }
        
        scaledRoom.style.backgroundColor = 'lightblue'; // For visibility
    });

    saveMap();
    const htmlToAdd = container.outerHTML;
    localStorage.setItem("roomoutline", htmlToAdd);
    window.location.pathname = '/room.html';
}