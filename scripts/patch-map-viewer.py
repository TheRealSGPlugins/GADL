from pathlib import Path

ROOT = Path(".rs-map-viewer")
CUSTOM_NPC_ID = 65000
BASE_NPC_ID = 3105

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

# Give the OmniRune test actor its own synthetic NPC id so it can have a
# separate model cache entry and visual treatment while still borrowing the
# proven human rig + animations from Hans (3105).
loader = ROOT / "src/mapviewer/webgl/loader/SdMapDataLoader.ts"
text = loader.read_text()
spawn_needle = '''        const npcSpawnGroups = createNpcSpawnGroups(
            npcModelLoader,
            basTypeLoader,
            sceneBuf,
            npcSpawns,
        );'''
spawn_replacement = f'''        // Exactly one OmniRune-controlled test actor. Synthetic id keeps its
        // appearance separate from every real NPC definition in the cache.
        if (mapX === 50 && mapY === 50 && maxLevel >= 0) {{
            npcSpawns.push({{ id: {CUSTOM_NPC_ID}, name: "OmniRune Player", x: 3231, y: 3218, level: 0 }});
        }}

        const npcSpawnGroups = createNpcSpawnGroups(
            npcModelLoader,
            basTypeLoader,
            sceneBuf,
            npcSpawns,
        );'''
if spawn_needle not in text:
    raise SystemExit("SdMapDataLoader final NPC spawn patch point not found")
text = text.replace(spawn_needle, spawn_replacement)

npc_type_needle = '''    for (const spawns of groupedSpawns.values()) {
        const npcType = npcModelLoader.npcTypeLoader.load(spawns[0].id);

        const idleSeqId = npcType.getIdleSeqId(basTypeLoader);'''
npc_type_replacement = f'''    for (const spawns of groupedSpawns.values()) {{
        let npcType = npcModelLoader.npcTypeLoader.load(spawns[0].id);

        if (spawns[0].id === {CUSTOM_NPC_ID}) {{
            const baseNpcType = npcModelLoader.npcTypeLoader.load({BASE_NPC_ID});
            npcType = Object.assign(
                Object.create(Object.getPrototypeOf(baseNpcType)),
                baseNpcType,
                {{
                    name: "OmniRune Player",
                    widthScale: 136,
                    heightScale: 136,
                }},
            );
        }}

        const idleSeqId = npcType.getIdleSeqId(basTypeLoader);'''
if npc_type_needle not in text:
    raise SystemExit("SdMapDataLoader NPC type patch point not found")
text = text.replace(npc_type_needle, npc_type_replacement)
loader.write_text(text)

# Build a visibly custom blue/white model for only the OmniRune actor. We use
# the existing human mesh/rig as geometry, but recolor the merged model before
# lighting and cache it under its own key so normal Hans NPCs stay untouched.
npc_model_loader = ROOT / "src/rs/config/npctype/NpcModelLoader.ts"
text = npc_model_loader.read_text()
cache_needle = '''        let model = this.modelCache.get(npcType.id);
        if (!model) {'''
cache_replacement = f'''        const isOmniRunePlayer = npcType.name === "OmniRune Player";
        const modelCacheKey = isOmniRunePlayer ? -{CUSTOM_NPC_ID} : npcType.id;

        let model = this.modelCache.get(modelCacheKey);
        if (!model) {{'''
if cache_needle not in text:
    raise SystemExit("NpcModelLoader model-cache patch point not found")
text = text.replace(cache_needle, cache_replacement)

light_needle = '''            model = merged.light(
                this.textureLoader,
                npcType.ambient + 64,
                npcType.contrast * 5 + 850,
                -30,
                -50,
                -30,
            );

            this.modelCache.set(npcType.id, model);'''
light_replacement = '''            if (isOmniRunePlayer) {
                // Deliberately stylized electric-blue/white palette so the
                // controlled actor cannot be mistaken for a world NPC.
                for (let i = 0; i < merged.faceColors.length; i++) {
                    const originalLightness = merged.faceColors[i] & 0x7f;
                    const lightness = Math.max(28, Math.min(112, originalLightness));
                    if (i % 4 === 0) {
                        merged.faceColors[i] = Math.max(84, lightness);
                    } else {
                        merged.faceColors[i] = (40 << 10) | (7 << 7) | lightness;
                    }
                }
            }

            model = merged.light(
                this.textureLoader,
                npcType.ambient + 64,
                npcType.contrast * 5 + 850,
                -30,
                -50,
                -30,
            );

            this.modelCache.set(modelCacheKey, model);'''
if light_needle not in text:
    raise SystemExit("NpcModelLoader lighting patch point not found")
text = text.replace(light_needle, light_replacement)
npc_model_loader.write_text(text)

# Runtime NPC objects are created on the main thread from the synthetic id too,
# so resolve that id back to the same human movement definition there. This
# keeps size, walkability and collision behavior identical to the proven test.
webgl_square = ROOT / "src/mapviewer/webgl/WebGLMapSquare.ts"
text = webgl_square.read_text()
runtime_needle = '''        const npcs: Npc[] = [];
        for (const npc of mapData.npcs) {
            const npcType = npcTypeLoader.load(npc.id);

            npcs.push('''
runtime_replacement = f'''        const npcs: Npc[] = [];
        for (const npc of mapData.npcs) {{
            let npcType = npcTypeLoader.load(npc.id);
            if (npc.id === {CUSTOM_NPC_ID}) {{
                const baseNpcType = npcTypeLoader.load({BASE_NPC_ID});
                npcType = Object.assign(
                    Object.create(Object.getPrototypeOf(baseNpcType)),
                    baseNpcType,
                    {{
                        name: "OmniRune Player",
                        widthScale: 136,
                        heightScale: 136,
                    }},
                );
            }}

            npcs.push('''
if runtime_needle not in text:
    raise SystemExit("WebGLMapSquare runtime NPC patch point not found")
text = text.replace(runtime_needle, runtime_replacement)
webgl_square.write_text(text)

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
                OMNIRUNE PLAYER — CUSTOM BLUE/WHITE ACTOR @ 3231, 3218
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

print("Patched rs-map-viewer with one custom blue/white OmniRune actor")
