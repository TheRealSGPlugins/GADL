from pathlib import Path

ROOT = Path(".rs-map-viewer")

# Keep the JSON fallback demo entries on the current Hans definition.
spawn_file = ROOT / "src/mapviewer/data/npc/NpcSpawn.ts"
text = spawn_file.read_text()
text = text.replace('id: 310, name: "OmniRune Demo A"', 'id: 3105, name: "OmniRune Demo A"')
text = text.replace('id: 310, name: "OmniRune Demo B"', 'id: 3105, name: "OmniRune Demo B"')
text = text.replace('id: 310, name: "OmniRune Demo C"', 'id: 3105, name: "OmniRune Demo C"')
spawn_file.write_text(text)

# Current OSRS maps can contain NPC spawns inside the cache itself. When that
# happens SdMapDataLoader deliberately uses those cache spawns instead of the
# external npcSpawns array, so adding demo entries only in NpcSpawn.ts never
# reaches the renderer. Inject the proof models after that selection instead.
loader_file = ROOT / "src/mapviewer/webgl/loader/SdMapDataLoader.ts"
text = loader_file.read_text()
needle = '''        const npcSpawnGroups = createNpcSpawnGroups(
            npcModelLoader,
            basTypeLoader,
            sceneBuf,
            npcSpawns,
        );'''
replacement = '''        // OmniRune player-model proof. Inject AFTER cache-vs-JSON spawn selection
        // so this works on modern OSRS caches that embed their own NPC spawns.
        if (loadNpcs && mapX === 50 && mapY === 50 && maxLevel >= 0) {
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
    raise SystemExit("SdMapDataLoader NPC injection point not found")
loader_file.write_text(text.replace(needle, replacement))

# Make only the three local demo copies follow the deterministic square route.
npc_file = ROOT / "src/mapviewer/webgl/npc/Npc.ts"
text = npc_file.read_text().replace('this.npcType.id === 310 &&', 'this.npcType.id === 3105 &&')
npc_file.write_text(text)

print("Injected OmniRune demo after modern OSRS cache NPC spawn selection")
