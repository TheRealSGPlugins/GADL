from pathlib import Path

ROOT = Path(".rs-map-viewer")

spawn_file = ROOT / "src/mapviewer/data/npc/NpcSpawn.ts"
text = spawn_file.read_text()
text = text.replace('id: 310, name: "OmniRune Demo A"', 'id: 3105, name: "OmniRune Demo A"')
text = text.replace('id: 310, name: "OmniRune Demo B"', 'id: 3105, name: "OmniRune Demo B"')
text = text.replace('id: 310, name: "OmniRune Demo C"', 'id: 3105, name: "OmniRune Demo C"')
spawn_file.write_text(text)

npc_file = ROOT / "src/mapviewer/webgl/npc/Npc.ts"
text = npc_file.read_text().replace('this.npcType.id === 310 &&', 'this.npcType.id === 3105 &&')
npc_file.write_text(text)

print("Corrected OmniRune demo to current OSRS Hans NPC id 3105")
