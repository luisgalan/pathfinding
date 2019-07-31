// D Harabor, A Grastien. 2011.
// Online graph pruning for pathfinding on grid maps.
// http://users.cecs.anu.edu.au/~dharabor/data/papers/harabor-grastien-aaai11.pdf


function walkable(pos) {
    if (pos.i < 0 || pos.i >= height) return false;
    if (pos.j < 0 || pos.j >= width) return false;
    if (grid[pos.toInt()]) return false;
    return true;
}

async function jump(node, parent) {
    if (!walkable(node.pos)) {
        return null;
    }

    if (node.pos.equals(goalPos)) return node;

    let delta = Vec.sub(node.pos, parent);
    if (delta.i != 0 && delta.j != 0) {
        // diagonal
        let h = new Vec(0, delta.j);
        let v = new Vec(delta.i, 0);

        if (!walkable(Vec.sub(node.pos, h)) || Vec.sub(node.pos, h).equals(goalPos)) {
            return node;
        }
        if (!walkable(Vec.sub(node.pos, v)) || Vec.sub(node.pos, v).equals(goalPos)) {
            return node;
        }

        let res = await jump(node, Vec.sub(node.pos, h));
        if (res != null) return res;
        res = await jump(node, Vec.sub(node.pos, v));
        if (res != null) return res;
        return await jump({ pos: Vec.add(node.pos, delta), dist: node.dist + Math.SQRT2 }, node.pos);
    } else {
        // horizontal / vertical
        let ortho = new Vec(-delta.j, delta.i);
        let left = Vec.add(node.pos, ortho);
        let right = Vec.sub(node.pos, ortho);

        if ((!walkable(left) && walkable(Vec.add(left, delta))) || left.equals(goalPos) || Vec.add(left, delta).equals(goalPos)) {
            return node;
        }
        if ((!walkable(right) && walkable(Vec.add(right, delta))) || right.equals(goalPos) || Vec.add(right, delta).equals(goalPos)) {
            return node;
        }
        return await jump({ pos: Vec.add(node.pos, delta), dist: node.dist + 1 }, node.pos);
    }
}

async function jpsReconstructPath(cameFrom) {
    let last = goalPos;
    for (let p = cameFrom[goalPos.toInt()]; p != null; p = cameFrom[p]) {
        let cur = Vec.fromInt(p);
        await sleep(20);
        while (!cur.equals(last)) {
            await sleep(20);
            gridElmnts[cur.toInt()].setAttribute('color', 'path');
            let delta = Vec.sub(last, cur);
            delta.i = Math.sign(delta.i);
            delta.j = Math.sign(delta.j);
            cur = Vec.add(cur, delta);
        }

        last = Vec.fromInt(p);
    }
}

async function jps() {
    preparePathfind();
    let dist = Array(width * height).fill(null);
    let cameFrom = {};
    let q = new MinHeap();
    q.push(startPos, euclidDist(startPos, goalPos));
    dist[startPos.toInt()] = 0;


    while (!q.empty()) {
        let cur = q.pop();
        await sleep(10);
        gridElmnts[cur.toInt()].setAttribute('color', 'explored');

        if (cur.equals(goalPos)) {
            break;
        }

        let n = neighborsDiag(cur);
        for (let i = 0; i < n.length; i++) {
            let next = await jump(n[i], cur);
            if (next == null) {
                continue;
            }
            let intPos = next.pos.toInt();
            let tentativeDist = next.dist + dist[cur.toInt()];
            if (dist[intPos] != null && tentativeDist >= dist[intPos]) {
                continue;
            }
            gridElmnts[intPos].setAttribute('color', 'visited');
            dist[intPos] = tentativeDist;
            cameFrom[intPos] = cur.toInt();
            q.push(next.pos, dist[intPos] + euclidDist(next.pos, goalPos));
        }
    }

    if (cameFrom[goalPos.toInt()] == null) {
        endPathfind();
        return;
    }

    await jpsReconstructPath(cameFrom);

    endPathfind();
}
