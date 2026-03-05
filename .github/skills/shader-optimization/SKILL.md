---
name: shader-optimization
description: "Use when optimizing, debugging, or writing custom GLSL shaders for performance. Includes techniques for reducing complexity, improving precision, profile bottlenecks, and writing cross-platform shader code."
---

# Shader Optimization Skill

Advanced techniques for writing, debugging, and optimizing GLSL shaders for 3D graphics pipelines.

## Common Optimization Patterns

### 1. Precision Qualifiers (Mobile)
```glsl
// Mobile: Use lowp for color, mediump for most calculations
// Desktop: Use highp or default (automatically high)
precision mediump float;
varying mediump vec3 vNormal;
```

### 2. Avoid Complex Math in Fragment Shader
```glsl
// ❌ BAD: Expensive calculations per fragment
vec3 result = normalize(vNormal) * lightDir;

// ✅ GOOD: Pre-compute in vertex shader
varying vec3 vNormalNormalized;
void main() {
  vNormalNormalized = normalize(normal);
}
```

### 3. Texture Lookups Optimization
```glsl
// ❌ BAD: Dependent texture lookups (causes stalls)
vec3 color = texture2D(map1, uv).rgb;
vec3 normal = texture2D(map2, color.xy).rgb;  // Depends on map1 result

// ✅ GOOD: Independent lookups (parallelizable)
vec3 color = texture2D(map1, uv).rgb;
vec3 normal = texture2D(map2, uv).rgb;
```

### 4. Branching Costs
```glsl
// ❌ BAD: Dynamic branching (causes execution bubbles on GPU)
if (lightIntensity > 0.5) {
  // Complex lighting calculation
}

// ✅ GOOD: Smooth step or mix (vectorized)
float intensity = smoothstep(0.3, 0.7, lightIntensity);
vec3 result = mix(darkResult, brightResult, intensity);
```

### 5. Loop Unrolling
```glsl
// ❌ BAD: Dynamic loops (hard to optimize)
vec3 result = vec3(0);
for(int i = 0; i < lightCount; i++) {
  result += calculateLight(i);
}

// ✅ GOOD: Fixed loops or unrolled
#define MAX_LIGHTS 4
vec3 result = vec3(0);
for(int i = 0; i < MAX_LIGHTS; i++) {
  result += calculateLight(i);
}
```

## Debugging Shaders

### Visualize Intermediate Values
```glsl
// Output normal as color for debugging
gl_FragColor = vec4(normalize(vNormal) * 0.5 + 0.5, 1.0);

// Output UV coordinates
gl_FragColor = vec4(vUv, 0.0, 1.0);

// Output depth
gl_FragColor = vec4(vec3(gl_FragCoord.z), 1.0);
```

### Common Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| Black output | Division by zero, wrong matrix | Use safe_divide, check matrix math |
| Flickering | Undefined varyings | Initialize all varyings in vertex |
| Seams/artifacts | UV wrapping issues | Use `fract()` or texture addressing modes |
| Performance drop | Too many texture lookups | Consolidate into atlases, use fewer samples |

## Cross-Platform Shader Code

### WebGL 1.0 (ES 2.0) vs WebGL 2.0
```glsl
// WebGL 1.0: No layout, must use varyings
varying vec3 vNormal;

// WebGL 2.0: Can use in/out and layout
in vec3 vNormal;
layout(location = 0) out vec4 outColor;
```

### Mobile Precision Handling
```glsl
#ifdef GL_ES
precision highp float;
#else
// Desktop default is already high
#endif
```

## Shader Validation Tools

- **Khronos Shader Validator**: Validate against GLSL spec
- **Three.js Shader Debugger**: Browser DevTools integration
- **RenderDoc/Nsight**: GPU frame capture and analysis
- **Angle**: Test WebGL on different backends

## Performance Profiling Checklist

- [ ] Profile on target device (mobile is stricter)
- [ ] Check draw call count and batch size
- [ ] Monitor texture bandwidth utilization
- [ ] Verify ALU (arithmetic logic unit) efficiency
- [ ] Test on low-end GPUs (4 year old device minimum)
- [ ] Use GPU timers for bottleneck identification

## References

- [Khronos GLSL Spec](https://registry.khronos.org/OpenGL/specs/gl/GLSLangSpec.4.60.pdf)
- [WebGL Best Practices](https://www.khronos.org/webgl/wiki/WebGL_Best_Practices)
- [Mobile GPU Optimization](https://developer.samsung.com/game/gpu-optimization)
