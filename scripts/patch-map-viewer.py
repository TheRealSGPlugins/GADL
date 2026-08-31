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

# Fallback spawn for cache revisions that do not embed NPC spawns in this square.
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
        spawns.push({ id: 3105, name: "OmniRune Player", x: 3231, y: 3218, level: 0 });
    }

    return spawns;
}'''
if old not in text:
    raise SystemExit("NpcSpawn patch point not found")
spawn_file.write_text(text.replace(old, new))

# Current OSRS cache squares can contain their own NPC spawn list. Inject ONE
# OmniRune character after cache-vs-external selection so it always reaches the
# renderer. It then uses the viewer's ORIGINAL NPC movement/pathfinding code —
# no custom path queue — so walls, fences and NPC collision are respected.
loader = ROOT / "src/mapviewer/webgl/loader/SdMapDataLoader.ts"
text = loader.read_text()
needle = '''        const npcSpawnGroups = createNpcSpawnGroups(
            npcModelLoader,
            basTypeLoader,
            sceneBuf,
            npcSpawns,
        );'''
replacement = '''        // OmniRune player-model proof: one custom character in map square 50,50.
        if (mapX === 50 && mapY === 50 && maxLevel >= 0) {
            npcSpawns.push({ id: 3105, name: "OmniRune Player", x: 3231, y: 3218, level: 0 });
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

# Do NOT patch Npc.updateServerMovement. The single OmniRune character should
# use the exact same collision-aware pathfinder and serverPath movement as every
# normal NPC in the viewer.

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
                        "OMNIRUNE PLAYER": button(() => {
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
                OMNIRUNE PLAYER — ONE COLLISION-AWARE TEST CHARACTER @ 3231, 3218
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

print("Patched rs-map-viewer with one collision-aware OmniRune character")
