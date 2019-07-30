async function dijkstra() {
    preparePathfind();
    let dist = Array(width * height).fill(null);
    let cameFrom = {};
    let q = new MinHeap();
    q.push(startPos, 0);
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
            let intPos = n[i].pos.toInt();
            if (dist[intPos] != null) {
                continue;
            }
            if (grid[intPos]) {
                continue;
            }
            gridElmnts[intPos].setAttribute('color', 'visited');
            dist[intPos] = n[i].dist + dist[cur.toInt()];
            cameFrom[intPos] = cur.toInt();
            q.push(n[i].pos, dist[intPos]);
        }
    }

    if (cameFrom[goalPos.toInt()] == null) {
        endPathfind();
        return;
    }

    await reconstructPath(cameFrom);

    endPathfind();
}
