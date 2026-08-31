from pathlib import Path

npc_file = Path('.rs-map-viewer/src/mapviewer/webgl/npc/Npc.ts')
text = npc_file.read_text()

old = '''        // Deterministic OmniRune demo movement. Queue ONE adjacent tile at a
        // time so updateMovement interpolates across it using the normal walk
        // animation instead of snapping several tiles to a distant waypoint.
        if (
            this.npcType.id === 3105 &&
            this.spawnY === 18 &&
            this.spawnX >= 30 &&
            this.spawnX <= 32
        ) {
            this.omniDemoTick++;
            if (this.pathLength === 0 && this.omniDemoTick >= 6) {
                this.omniDemoTick = 0;

                // 16-tile clockwise rectangle: 4 east, 4 north, 4 west, 4 south.
                const phase = this.omniDemoStep % 16;
                let dir = 4; // east
                if (phase >= 4 && phase < 8) {
                    dir = 1; // north
                } else if (phase >= 8 && phase < 12) {
                    dir = 3; // west
                } else if (phase >= 12) {
                    dir = 6; // south
                }

                this.omniDemoStep++;
                this.queuePathDir(dir, MovementType.WALK);
            }
            return;
        }

        const collisionMap = collisionMaps[this.level];

        if (this.canWalk() && Math.random() < 0.1) {'''

new = '''        const isOmniDemo =
            this.npcType.id === 3105 &&
            this.spawnY === 18 &&
            this.spawnX >= 30 &&
            this.spawnX <= 32;

        const collisionMap = collisionMaps[this.level];

        // Feed the demo through the exact same serverPath -> one-tile queue
        // pipeline used by the viewer's normal wandering NPCs.
        if (isOmniDemo && this.serverPathLength === 0 && this.pathLength === 0) {
            this.omniDemoTick++;
            if (this.omniDemoTick >= 6) {
                this.omniDemoTick = 0;

                const phase = this.omniDemoStep % 16;
                let dx = 1;
                let dy = 0;
                if (phase >= 4 && phase < 8) {
                    dx = 0;
                    dy = 1;
                } else if (phase >= 8 && phase < 12) {
                    dx = -1;
                    dy = 0;
                } else if (phase >= 12) {
                    dx = 0;
                    dy = -1;
                }

                const currX = this.pathX[0];
                const currY = this.pathY[0];
                this.serverPathX[0] = currX + dx;
                this.serverPathY[0] = currY + dy;
                this.serverPathMovementType[0] = MovementType.WALK;
                this.serverPathLength = 1;
                this.omniDemoStep++;
            }
        }

        if (!isOmniDemo && this.canWalk() && Math.random() < 0.1) {'''

if old not in text:
    raise SystemExit('OmniRune direct movement block not found')

npc_file.write_text(text.replace(old, new))
print('OmniRune demo now uses the native NPC serverPath movement pipeline')
