# Unity Source Project (ARKANUHBook)

Project Unity source untuk modul flipbook ARKANUH v4.

Komponen utama:

- Scene: `Assets/Scenes/FlipbookMain.unity`
- Bridge C#: `Assets/Scripts/Bridge/*`
- Runtime visual: `Assets/Scripts/Runtime/*`
- Build pipeline: `Assets/Editor/BuildWebGL.cs`

Build WebGL:

- Development dan Release dijalankan lewat `scripts/unity-build.ps1`
- Output otomatis ke `public/unity`

Kontrak integrasi:

- Menerima command React melalui `ReactBridge.OnReactCommand`
- Mengirim event kembali ke browser via `Assets/Plugins/WebGL/WebBridge.jslib`
