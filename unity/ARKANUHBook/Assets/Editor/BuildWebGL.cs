using System;
using System.IO;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;

namespace Arkanuh.UnityBridgeEditor
{
    public static class BuildWebGL
    {
        public static void BuildDevelopment()
        {
            BuildInternal(true);
        }

        public static void BuildRelease()
        {
            BuildInternal(false);
        }

        public static void BuildFromCommandLine()
        {
            var args = Environment.GetCommandLineArgs();
            var mode = GetArg(args, "-buildMode", "release");

            switch (mode.ToLowerInvariant())
            {
                case "dev":
                case "development":
                    BuildDevelopment();
                    break;
                case "all":
                    BuildDevelopment();
                    BuildRelease();
                    break;
                default:
                    BuildRelease();
                    break;
            }
        }

        private static void BuildInternal(bool development)
        {
            ProjectBootstrap.EnsureProjectSetup();
            ModelImportPipeline.RebuildPageModelRegistry();

            if (EditorUserBuildSettings.activeBuildTarget != BuildTarget.WebGL)
            {
                EditorUserBuildSettings.SwitchActiveBuildTarget(BuildTargetGroup.WebGL, BuildTarget.WebGL);
            }

            var outputPath = GetOutputPath();
            if (!Directory.Exists(outputPath))
            {
                Directory.CreateDirectory(outputPath);
            }

            var options = BuildOptions.None;
            if (development)
            {
                options |= BuildOptions.Development;
            }

            var buildPlayerOptions = new BuildPlayerOptions
            {
                scenes = new[] { ProjectBootstrap.ScenePath },
                locationPathName = outputPath,
                target = BuildTarget.WebGL,
                options = options
            };

            var report = BuildPipeline.BuildPlayer(buildPlayerOptions);
            if (report.summary.result != BuildResult.Succeeded)
            {
                throw new Exception($"Build WebGL gagal ({report.summary.result}).");
            }

            Debug.Log($"Build WebGL {(development ? "Development" : "Release")} selesai: {outputPath}");
        }

        private static string GetOutputPath()
        {
            var projectPath = Path.GetFullPath(Path.Combine(Application.dataPath, ".."));
            var repoRoot = Path.GetFullPath(Path.Combine(projectPath, "..", ".."));
            return Path.Combine(repoRoot, "public", "unity");
        }

        private static string GetArg(string[] args, string key, string fallback)
        {
            for (var index = 0; index < args.Length - 1; index += 1)
            {
                if (string.Equals(args[index], key, StringComparison.OrdinalIgnoreCase))
                {
                    return args[index + 1];
                }
            }
            return fallback;
        }

    }
}
