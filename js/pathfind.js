function preparePathfind() {
    clearColors();
    setMode('pathfind')
}

function endPathfind() {
    setMode('done');
}

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

function walkable(pos) {
    if (pos.i < 0 || pos.i >= height) return false;
    if (pos.j < 0 || pos.j >= width) return false;
    if (grid[pos.toInt()]) return false;
    return true;
}

function neighbors(pos) {
    const deltas = [new Vec(-1, 0), new Vec(0, 1), new Vec(1, 0), new Vec(0, -1)];
    let out = [];
    for (let i = 0; i < deltas.length; i++) {
        if (!walkable(Vec.add(pos, deltas[i]))) continue;
        out.push(Vec.add(pos, deltas[i]));
    }
    return out;
}

function neighborsDiag(pos) {
    let out = [];
    const sqrt2 = Math.sqrt(2);
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) continue;
            if (!walkable(new Vec(pos.i + i, pos.j + j))) continue;

            let dist = 1;
            if (Math.abs(i) + Math.abs(j) == 2) {
                dist = sqrt2;
            } else {
                dist = 1;
            }

            out.push({ pos: new Vec(pos.i + i, pos.j + j), dist: dist });
        }
    }
    return out;
}

function euclidDist(a, b) {
    let di = a.i - b.i;
    let dj = a.j - b.j;
    return Math.sqrt(di * di + dj * dj);
}

async function reconstructPath(cameFrom) {
    for (let p = cameFrom[goalPos.toInt()]; p != null; p = cameFrom[p]) {
        await sleep(20);
        gridElmnts[p].setAttribute('color', 'path');
    }
}
