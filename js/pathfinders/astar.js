async function astar() {
    preparePathfind();
    let dist = Array(width * height).fill(null);
    let cameFrom = {};
    let q = new MinHeap();
    q.push(startPos, euclidDist(startPos, goalPos));
    dist[startPos.toInt()] = 0;

    while (!q.empty()) {
        let cur = q.pop();
        await sleep(10);
        gridElmnts[cur.toInt()].setAttribute('color', 'visited');

        if (cur.equals(goalPos)) {
            break;
        }

        let n = neighborsDiag(cur);
        for (let i = 0; i < n.length; i++) {
            let intPos = n[i].pos.toInt();
            let tentativeDist = n[i].dist + dist[cur.toInt()];
            if (dist[intPos] != null && tentativeDist >= dist[intPos]) {
                continue;
            }
            if (grid[intPos]) {
                continue;
            }
            dist[intPos] = tentativeDist;
            cameFrom[intPos] = cur.toInt();
            q.push(n[i].pos, dist[intPos] + euclidDist(n[i].pos, goalPos));
        }
    }

    if (cameFrom[goalPos.toInt()] == null) {
        endPathfind();
        return;
    }

    await reconstructPath(cameFrom);

    endPathfind();
}
