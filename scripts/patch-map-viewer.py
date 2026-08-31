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

# Start directly over the OmniRune test area instead of the upstream default.
viewer_file = ROOT / "src/mapviewer/MapViewer.ts"
text = viewer_file.read_text().replace(
    'camera: Camera = new Camera(3242, -26, 3202, -245, 1862);',
    'camera: Camera = new Camera(3231, -26, 3218, -245, 1862);',
)
viewer_file.write_text(text)

spawn_file = ROOT / "src/mapviewer/data/npc/NpcSpawn.ts"
text = spawn_file.read_text()
old = '''export async function fetchNpcSpawns(url: string): Promise<NpcSpawn[]> {
    const response = await fetch(url);
    return await response.json();
}'''
new = '''export async function fetchNpcSpawns(url: string): Promise<NpcSpawn[]> {
    const response = await fetch(url);
    const spawns: NpcSpawn[] = await response.json();

    // Three adjacent human models on a clear tile east of Lumbridge Castle.
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

        // Deterministic walking loop for the three injected OmniRune models.
        // World 3230-3232,3218 maps to local X 30-32, Y 18 in square 50,50.
        if (
            this.npcType.id === 310 &&
            this.spawnY === 18 &&
            this.spawnX >= 30 &&
            this.spawnX <= 32
        ) {
            this.omniDemoTick++;
            if (this.pathLength === 0 && this.omniDemoTick >= 18) {
                this.omniDemoTick = 0;
                const offset = this.spawnX - 30;
                const route = [
                    [34 + offset, 18],
                    [34 + offset, 22],
                    [30 + offset, 22],
                    [30 + offset, 18],
                ];
                const target = route[this.omniDemoStep % route.length];
                this.omniDemoStep++;
                this.queuePath(target[0], target[1], MovementType.WALK);
            }
            return;
        }'''
if old_method not in text:
    raise SystemExit("Npc movement patch point not found")
npc_file.write_text(text.replace(old_method, new_method))

# Add direct RuneScape X/Y coordinate navigation to the existing Leva controls.
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

print("Patched rs-map-viewer with coordinate jump and OmniRune movement demo")
