import { existsSync } from "fs";
import path from "path";

let cachedProjectRoot: string | null = null;

function hasProjectMarkers(directory: string): boolean {
  return existsSync(path.join(directory, "package.json")) && existsSync(path.join(directory, "public"));
}

function searchProjectRoot(startDirectory: string): string | null {
  let current = path.resolve(startDirectory);

  for (let depth = 0; depth < 10; depth += 1) {
    if (hasProjectMarkers(current)) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  return null;
}

export function getProjectRoot(): string {
  if (cachedProjectRoot) {
    return cachedProjectRoot;
  }

  const configuredRoot = process.env.APP_ROOT_DIR?.trim();
  if (configuredRoot && hasProjectMarkers(configuredRoot)) {
    cachedProjectRoot = configuredRoot;
    return cachedProjectRoot;
  }

  const discovered = searchProjectRoot(process.cwd());
  cachedProjectRoot = discovered ?? process.cwd();
  return cachedProjectRoot;
}

export function getPublicDir(...segments: string[]): string {
  return path.join(getProjectRoot(), "public", ...segments);
}

export function getSrcDir(...segments: string[]): string {
  return path.join(getProjectRoot(), "src", ...segments);
}
