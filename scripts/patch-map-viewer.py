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

spawn_file = ROOT / "src/mapviewer/data/npc/NpcSpawn.ts"
text = spawn_file.read_text()
old = '''export async function fetchNpcSpawns(url: string): Promise<NpcSpawn[]> {
    const response = await fetch(url);
    return await response.json();
}'''
new = '''export async function fetchNpcSpawns(url: string): Promise<NpcSpawn[]> {
    const response = await fetch(url);
    const spawns: NpcSpawn[] = await response.json();

    // Three adjacent human models make the OmniRune movement proof obvious
    // even though Hans already exists naturally at Lumbridge Castle.
    if (url === npcSpawnsOsrsUrl) {
        spawns.push({ id: 310, name: "OmniRune Demo A", x: 3222, y: 3218, level: 0 });
        spawns.push({ id: 310, name: "OmniRune Demo B", x: 3223, y: 3218, level: 0 });
        spawns.push({ id: 310, name: "OmniRune Demo C", x: 3224, y: 3218, level: 0 });
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
        // Their starting X offsets are preserved so they walk as a visible row.
        if (
            this.npcType.id === 310 &&
            this.spawnY === 18 &&
            this.spawnX >= 22 &&
            this.spawnX <= 24
        ) {
            this.omniDemoTick++;
            if (this.pathLength === 0 && this.omniDemoTick >= 18) {
                this.omniDemoTick = 0;
                const offset = this.spawnX - 22;
                const route = [
                    [26 + offset, 18],
                    [26 + offset, 22],
                    [22 + offset, 22],
                    [22 + offset, 18],
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
                OMNIRUNE PLAYER DEMO — 3 TEST MODELS @ 3222–3224, 3218
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

print("Patched rs-map-viewer for unmistakable OmniRune player-model demo")
