---
description: "GLSL shader files. Apply performance optimizations, cross-platform compatibility, and best practices for WebGL/OpenGL shaders."
applyTo: "**/*.glsl"
---

# GLSL Shader Guidelines

Apply these guidelines to all `.glsl` shader files in this project.

## File Organization

```
shaders/
├── materials/          # Reusable material shaders
│   ├── pbr.glsl
│   └── lambert.glsl
├── effects/            # Post-processing and effects
│   ├── bloom.glsl
│   └── gaussian-blur.glsl
├── common/             # Shared utilities
│   ├── lighting.glsl
│   ├── math.glsl
│   └── transform.glsl
├── vertex/             # Vertex shader entry points
│   └── standard.glsl
└── fragment/           # Fragment shader entry points
    └── standard.glsl
```

## Shader Best Practices

### 1. Header Documentation
```glsl
/**
 * Material: PBR Standard
 * Purpose: Physically-based rendering with metallic/roughness workflow
 * Inputs: worldPos, normal, albedo, metallic, roughness
 * Performance: ~45 texture lookups on mid-range GPU
 */
```

### 2. Precision Declaration (ES 2.0)
```glsl
#ifdef GL_ES
precision highp float;
precision mediump vec3;
precision lowp int;
#endif
```

### 3. Cross-Platform Compatibility
```glsl
// Use these for maximum compatibility
#define saturate(x) clamp(x, 0.0, 1.0)
#define PI 3.14159265359
#define TAU 6.28318530718

// Avoid: undefined or non-standard functions
// ✅ Use: mix(), clamp(), smoothstep()
// ❌ Avoid: dithering, atomic operations (unless WebGL 2.0+)
```

### 4. Varyings Initialization
```glsl
// All varyings MUST be initialized in vertex shader
varying vec3 vNormalWorldSpace;
varying vec2 vUv;

void main() {
  vNormalWorldSpace = normalMatrix * normal;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

## Performance Checklist

- [ ] **Texture lookups**: Minimize and consolidate into shared atlases
- [ ] **Math operations**: Move expensive calculations to vertex shader when possible
- [ ] **Branching**: Avoid `if/else` in fragment shader; use `mix()` instead
- [ ] **Loop depth**: Unroll loops or use fixed iteration counts
- [ ] **Precision qualifiers**: Set appropriately for mobile (lowp color, mediump normal)
- [ ] **Vertex count**: Reduce unneeded subdivision
- [ ] **Uniforms**: Use texture atlases instead of many separate textures
- [ ] **Output**: Only compute channels needed (e.g., no unused alpha)

## Common Patterns

### Toon Shading (Cheap Alternative)
```glsl
vec4 toonShade(vec3 normal, vec3 lightDir, vec3 color) {
  float diffuse = dot(normal, lightDir);
  diffuse = smoothstep(0.0, 0.3, diffuse);  // Reduces to 2-3 levels
  return vec4(color * diffuse, 1.0);
}
```

### Normal Mapping
```glsl
vec3 normalMap = texture2D(normalTexture, vUv).rgb;
normalMap = normalMap * 2.0 - 1.0;  // Unpack (-1, 1)
normalMap = normalize(tbn * normalMap);  // Transform to world space
```

### Parallax Mapping (Mobile: Skip This)
```glsl
// ❌ MOBILE: Too expensive (multiple texture lookups, loops)
// ✅ DESKTOP: Use POM (Parallax Occlusion Mapping) sparingly
```

## Testing Checklist

- [ ] Compile without warnings in WebGL 1.0 **and** 2.0
- [ ] Test on mobile devices (precision sensitivity)
- [ ] Profile on low-end GPU (Intel UHD Graphics, Adreno 505)
- [ ] Verify with RenderDoc or similar GPU profiler
- [ ] Check for undefined varyings or uniforms

## Code Review Focuses

1. **Unnecessary calculations in fragment shader** → Move to vertex
2. **Dependent texture lookups** → Reorder for parallelism
3. **Missing precision qualifiers** → Add ES2.0 compatibility
4. **Uninitialized varyings** → Initialize in vertex
5. **Branching in hot paths** → Replace with conditional operators or `mix()`
