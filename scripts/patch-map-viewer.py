from pathlib import Path

ROOT = Path(".rs-map-viewer")

caches = ROOT / "src/mapviewer/Caches.ts"
text = caches.read_text()
text = text.replace(
    'const CACHE_PATH = "/caches/";',
    'const CACHE_PATH = (process.env.PUBLIC_URL || "") + "/caches/";',
)
text = text.replace('        true,\n        signal,', '        false,\n        signal,')
caches.write_text(text)

app = ROOT / "src/mapviewer/MapViewerApp.tsx"
text = app.read_text().replace(
    'const workerPool = RenderDataWorkerPool.create(isWallpaperEngine ? 1 : 4);',
    'const workerPool = RenderDataWorkerPool.create(1);',
)
app.write_text(text)

viewer_file = ROOT / "src/mapviewer/MapViewer.ts"
text = viewer_file.read_text().replace(
    'camera: Camera = new Camera(3242, -26, 3202, -245, 1862);',
    'camera: Camera = new Camera(3231, -26, 3218, -245, 1862);',
)
viewer_file.write_text(text)

# Keep the external spawn injection as a fallback for cache revisions that do not
# provide embedded NPC spawns for this square.
spawn_file = ROOT / "src/mapviewer/data/npc/NpcSpawn.ts"
text = spawn_file.read_text()
old = '''export async function fetchNpcSpawns(url: string): Promise<NpcSpawn[]> {
    const response = await fetch(url);
    return await response.json();
}'''
new = '''export async function fetchNpcSpawns(url: string): Promise<NpcSpawn[]> {
    const response = await fetch(url);
    const spawns: NpcSpawn[] = await response.json();

    if (url === npcSpawnsOsrsUrl) {
        spawns.push({ id: 310, name: "OmniRune Demo A", x: 3230, y: 3218, level: 0 });
        spawns.push({ id: 310, name: "OmniRune Demo B", x: 3231, y: 3218, level: 0 });
        spawns.push({ id: 310, name: "OmniRune Demo C", x: 3232, y: 3218, level: 0 });
    }

    return spawns;
}'''
if old not in text:
    raise SystemExit("NpcSpawn patch point not found")
spawn_file.write_text(text.replace(old, new))

# Current OSRS cache squares can contain their own NPC spawn list. Inject the
# demo after the renderer has selected cache-vs-external spawns so it cannot be
# skipped by the cache-spawn branch.
loader = ROOT / "src/mapviewer/webgl/loader/SdMapDataLoader.ts"
text = loader.read_text()
needle = '''        const npcSpawnGroups = createNpcSpawnGroups(
            npcModelLoader,
            basTypeLoader,
            sceneBuf,
            npcSpawns,
        );'''
replacement = '''        // OmniRune player-model proof: inject into the final spawn list.
        // 3230-3232,3218 are in map square 50,50.
        if (mapX === 50 && mapY === 50 && maxLevel >= 0) {
            npcSpawns.push({ id: 3105, name: "OmniRune Demo A", x: 3230, y: 3218, level: 0 });
            npcSpawns.push({ id: 3105, name: "OmniRune Demo B", x: 3231, y: 3218, level: 0 });
            npcSpawns.push({ id: 3105, name: "OmniRune Demo C", x: 3232, y: 3218, level: 0 });
        }

        const npcSpawnGroups = createNpcSpawnGroups(
            npcModelLoader,
            basTypeLoader,
            sceneBuf,
            npcSpawns,
        );'''
if needle not in text:
    raise SystemExit("SdMapDataLoader final NPC spawn patch point not found")
loader.write_text(text.replace(needle, replacement))

npc_file = ROOT / "src/mapviewer/webgl/npc/Npc.ts"
text = npc_file.read_text()
old_fields = '    serverPathLength: number = 0;\n\n    x: number;'
new_fields = (
    '    serverPathLength: number = 0;\n\n'
    '    omniDemoTick: number = 0;\n'
    '    omniDemoStep: number = 0;\n\n'
    '    x: number;'
)
if old_fields not in text:
    raise SystemExit("Npc field patch point not found")
text = text.replace(old_fields, new_fields)

old_method = '''    updateServerMovement(
        pathfinder: Pathfinder,
        borderSize: number,
        collisionMaps: CollisionMap[],
    ) {
        const size = this.getSize();'''
new_method = '''    updateServerMovement(
        pathfinder: Pathfinder,
        borderSize: number,
        collisionMaps: CollisionMap[],
    ) {
        const size = this.getSize();

        // Deterministic OmniRune demo movement. Queue ONE adjacent tile at a
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
        }'''
if old_method not in text:
    raise SystemExit("Npc movement patch point not found")
npc_file.write_text(text.replace(old_method, new_method))

controls = ROOT / "src/mapviewer/MapViewerControls.tsx"
text = controls.read_text()
state_needle = '''        const [varType, setVarType] = useState<VarType>(VarType.VARBIT);
        const [varId, setVarId] = useState(0);
        const [varValue, setVarValue] = useState(0);'''
state_replacement = '''        const [varType, setVarType] = useState<VarType>(VarType.VARBIT);
        const [varId, setVarId] = useState(0);
        const [varValue, setVarValue] = useState(0);

        const [goToX, setGoToX] = useState(3231);
        const [goToY, setGoToY] = useState(3218);'''
if state_needle not in text:
    raise SystemExit("MapViewerControls state patch point not found")
text = text.replace(state_needle, state_replacement)

schema_needle = '''                Camera: folder(
                    {'''
schema_replacement = '''                "Go to coordinates": folder(
                    {
                        X: {
                            value: goToX,
                            step: 1,
                            onChange: (v: number) => setGoToX(Math.round(v)),
                        },
                        Y: {
                            value: goToY,
                            step: 1,
                            onChange: (v: number) => setGoToY(Math.round(v)),
                        },
                        "GO TO TILE": button(() => {
                            mapViewer.camera.pos[0] = goToX;
                            mapViewer.camera.pos[2] = goToY;
                            mapViewer.camera.updated = true;
                            mapViewer.updateSearchParams();
                        }),
                        "OMNIRUNE DEMO": button(() => {
                            setGoToX(3231);
                            setGoToY(3218);
                            mapViewer.camera.pos[0] = 3231;
                            mapViewer.camera.pos[2] = 3218;
                            mapViewer.camera.updated = true;
                            mapViewer.updateSearchParams();
                        }),
                    },
                    { collapsed: false },
                ),
                Camera: folder(
                    {'''
if schema_needle not in text:
    raise SystemExit("MapViewerControls schema patch point not found")
text = text.replace(schema_needle, schema_replacement)

deps_needle = '''                varType,
                varId,
                varValue,
                pointsControls,'''
deps_replacement = '''                varType,
                varId,
                varValue,
                goToX,
                goToY,
                pointsControls,'''
if deps_needle not in text:
    raise SystemExit("MapViewerControls dependency patch point not found")
text = text.replace(deps_needle, deps_replacement)
controls.write_text(text)

container = ROOT / "src/mapviewer/MapViewerContainer.tsx"
text = container.read_text()
needle = '''        <div className="max-height">
            {loadingBarOverlay}'''
replacement = '''        <div className="max-height">
            <div style={{
                position: "fixed",
                top: "12px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10000,
                padding: "8px 14px",
                border: "1px solid #38bdf8",
                borderRadius: "6px",
                background: "rgba(0, 8, 20, 0.88)",
                color: "#e0f2fe",
                fontFamily: "sans-serif",
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                pointerEvents: "none",
            }}>
                OMNIRUNE PLAYER DEMO — USE COORDS 3231, 3218
            </div>
            {loadingBarOverlay}'''
if needle not in text:
    raise SystemExit("MapViewerContainer banner patch point not found")
container.write_text(text.replace(needle, replacement))

downloader = ROOT / "scripts/download-caches.js"
text = downloader.read_text().replace(
    '        await askQuestion("Downloading ~" + formatBytes(totalBytes) + ". Press enter to continue.");',
    '        console.log("Downloading ~" + formatBytes(totalBytes) + ".");',
)
downloader.write_text(text)

print("Patched rs-map-viewer with smooth tile-by-tile OmniRune movement demo")
