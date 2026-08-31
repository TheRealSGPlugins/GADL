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

    // OmniRune player-model proof of concept. Hans supplies a human OSRS
    // model and normal player-like idle/walk animation for the first test.
    if (url === npcSpawnsOsrsUrl) {
        spawns.push({ id: 310, name: "OmniRune Player", x: 3222, y: 3218, level: 0 });
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

        // Deterministic walking loop for the injected OmniRune human model.
        // World 3222,3218 is local 22,18 inside map-square 50,50.
        if (this.npcType.id === 310 && this.spawnX === 22 && this.spawnY === 18) {
            this.omniDemoTick++;
            if (this.pathLength === 0 && this.omniDemoTick >= 18) {
                this.omniDemoTick = 0;
                const route = [
                    [26, 18],
                    [26, 22],
                    [22, 22],
                    [22, 18],
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

downloader = ROOT / "scripts/download-caches.js"
text = downloader.read_text().replace(
    '        await askQuestion("Downloading ~" + formatBytes(totalBytes) + ". Press enter to continue.");',
    '        console.log("Downloading ~" + formatBytes(totalBytes) + ".");',
)
downloader.write_text(text)

print("Patched rs-map-viewer for OmniRune player-model demo")
