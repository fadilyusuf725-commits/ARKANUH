# Meshy Prompt Pack - ARKANUH

Gunakan semua prompt dengan gaya visual konsisten supaya 10 halaman terasa satu buku.

## Global style prompt (pakai di semua model)

`stylized low-poly children's storybook diorama, clean topology, mobile-friendly, PBR textures, soft rounded shapes, bright sky-blue palette, warm sunlight, no realistic gore, no text on model, no logo, centered pivot at base, scale around 1.5m width, game-ready for Unity WebGL, optimized mesh under 25k triangles`

## Prompt per template utama

### 1) Ark (kapal Nabi Nuh)
`Noah's ark pop-up diorama, stylized wooden ark with rounded hull, simple mast and cloth sails, friendly proportions for grade-2 children, tiny deck details, gentle ocean base, bright blue and warm brown tones, cinematic but lightweight, game-ready Unity`

### 2) Rain (hujan dan awan)
`storm cloud pop-up diorama for children, layered clouds, rain streaks and small lightning accents, dramatic but not scary, soft cartoon geometry, blue-gray weather tones with clear readability, optimized for mobile WebGL`

### 3) Mountain (gunung dan daratan)
`mountain landing pop-up diorama, stylized mountain with snow cap, small green hills and trees, calm post-flood mood, bright clean atmosphere, low-poly cartoon look, optimized UV and texture atlas for Unity`

### 4) Wave (gelombang banjir)
`big wave pop-up diorama, curved stylized wave layers, foam shapes, sense of motion frozen in storybook style, child-friendly, vibrant ocean blues, low-poly but detailed silhouette, mobile performant`

### 5) Light (cahaya hikmah)
`divine light pop-up diorama, glowing orb with layered rays and soft floating particles, hopeful and peaceful feeling, stylized cartoon rendering, bright gold and sky-blue accents, clean geometry for Unity WebGL`

## Prompt halaman 1 sampai 10 (siap pakai)

1. `Noah preaching scene pop-up diorama, ark in background, warm morning light, hopeful mood, child-friendly stylized low-poly, clean PBR, Unity WebGL ready`
2. `people rejecting message scene pop-up diorama, storm clouds gathering, emotional contrast but still kid-safe, stylized low-poly, Unity-ready`
3. `steadfast faith scene pop-up diorama, central light beam and calm character silhouette, motivational mood, storybook style, optimized mesh`
4. `command to build ark scene, construction phase pop-up with wooden beams and tools, bright educational style, low-poly PBR, mobile ready`
5. `ark preparation scene pop-up, organized supplies and teamwork feeling, clean composition, rounded cartoon forms, Unity WebGL optimized`
6. `great flood arrival scene pop-up, rising water and dramatic waves, readable silhouette from distance, child-safe stylized look`
7. `boarding the ark scene pop-up, pairs of animals approaching ark ramp, playful and neat composition, low-poly mobile-friendly`
8. `believers safe inside ark scene pop-up, warm interior light and calm sea outside, peaceful storybook atmosphere, optimized assets`
9. `flood receding scene pop-up, ark near mountain, clear sky returning, thankful mood, stylized low-poly for children`
10. `final wisdom scene pop-up, ark and soft radiant light, symbolic closure, educational and hopeful mood, bright sky-blue palette`

## Export setting rekomendasi di Meshy

- Format: `FBX` (paling praktis untuk Unity)
- Texture: `1024` (naik ke `2048` hanya jika benar-benar perlu)
- Target poly: `8k-25k tris` per model
- Pivot: di dasar model (bottom center)
- Scale: meter

## Checklist impor ke Unity

1. Simpan file ke `unity/ARKANUHBook/Assets/Models/Meshy/`.
2. Drag model ke scene, cek skala dan orientasi.
3. Buat prefab untuk tiap template: `ark`, `rain`, `mountain`, `wave`, `light`.
4. Assign prefab ke `BookVisualBuilder` pada object `ReactBridge`.
5. Build ulang: `npm run unity:build:release`.
