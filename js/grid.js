function gridClick(elmnt, pos, drawmode) {
    grid[pos] = drawmode;
    elmnt.setAttribute('status', (grid[pos]) ? 'wall' : 'blank');
}

function clearColors() {
    for (let i = 0; i < gridElmnts.length; i++) {
        gridElmnts[i].setAttribute('color', 'blank');
    }
}

function setMode(value) {
    mode = value;
    for (let i = 0; i < gridElmnts.length; i++) {
        gridElmnts[i].setAttribute('mode', value);
    }
}

const width = 32;
const height = 15;
const startPos = new Vec(height / 2, 2);
const goalPos = new Vec(height / 2, width - 3);

let grid = [];
let gridElmnts = [];
let drawmode = false;
let gridElmnt = document.getElementsByClassName('grid-container')[0];
let mode = 'edit';


document.body.style.setProperty('--grid-width', width);
setMode(mode);
for (let i = 0; i < width * height; i++) {
    let elmnt = document.createElement('div')
    elmnt.className = 'grid-item';
    elmnt.setAttribute('color', 'blank');
    elmnt.setAttribute('mode', 'edit');
    gridElmnt.appendChild(elmnt);
    gridElmnts.push(elmnt);

    if (i == startPos.toInt()) {
        elmnt.setAttribute('status', 'start');
        continue;
    } else if (i == goalPos.toInt()) {
        elmnt.setAttribute('status', 'goal');
        continue;
    }

    elmnt.setAttribute('status', 'blank');
    elmnt.addEventListener('mousedown', () => {
        if (mode != 'edit') return;
        drawmode = !grid[i];
        gridClick(elmnt, i, drawmode);
    });
    elmnt.addEventListener('mouseenter', (event) => {
        if (mode != 'edit') return;
        if (event.buttons == 1) {
            gridClick(elmnt, i, drawmode);
        }
    });
    grid.push(false);
}

