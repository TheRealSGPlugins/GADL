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

# Inject exactly ONE OmniRune test character after the viewer has chosen its
# modern cache NPC list versus the external JSON spawn list. This avoids the
# duplicate copies caused by injecting in both places.
loader = ROOT / "src/mapviewer/webgl/loader/SdMapDataLoader.ts"
text = loader.read_text()
needle = '''        const npcSpawnGroups = createNpcSpawnGroups(
            npcModelLoader,
            basTypeLoader,
            sceneBuf,
            npcSpawns,
        );'''
replacement = '''        // OmniRune player-model proof: exactly one custom character.
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

# Do NOT patch Npc.updateServerMovement. The OmniRune character uses the same
# collision-aware movement/pathfinding implementation as normal viewer NPCs.

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
                OMNIRUNE PLAYER — EXACTLY ONE TEST CHARACTER @ 3231, 3218
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

print("Patched rs-map-viewer with exactly one OmniRune test character")
