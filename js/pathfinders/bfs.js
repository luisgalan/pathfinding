async function bfs() {
    preparePathfind();
    let visited = Array(width * height).fill(false);
    let cameFrom = {};
    let q = new Queue();
    q.push(startPos);
    visited[startPos.toInt()] = true;
    while (!q.empty()) {
        let cur = q.pop();
        await sleep(10);
        gridElmnts[cur.toInt()].setAttribute('color', 'visited');

        if (cur.equals(goalPos)) {
            break;
        }

        let n = neighbors(cur);
        for (let i = 0; i < n.length; i++) {
            if (visited[n[i].toInt()]) continue;
            if (grid[n[i].toInt()]) continue;
            visited[n[i].toInt()] = true;
            cameFrom[n[i].toInt()] = cur.toInt();
            q.push(n[i]);
        }
    }

    if (cameFrom[goalPos.toInt()] == null) {
        endPathfind();
        return;
    }

    await reconstructPath(cameFrom);

    endPathfind();
}
