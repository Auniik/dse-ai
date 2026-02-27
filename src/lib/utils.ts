import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getVersion(): string {
  const packageJsonPath = path.join(__dirname, '../../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.version;
}

export function getConfigPath(): string {
  const homeDir = process.env.HOME || process.env.USERPROFILE || '';
  return path.join(homeDir, '.dse-ai');
}

export function ensureConfigDir(): void {
  const configPath = getConfigPath();
  if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
  }
}

export function saveConfig(key: string, value: any): void {
  ensureConfigDir();
  const configFile = path.join(getConfigPath(), `${key}.json`);
  fs.writeFileSync(configFile, JSON.stringify(value, null, 2));
}

export function loadConfig(key: string): any {
  const configFile = path.join(getConfigPath(), `${key}.json`);
  if (fs.existsSync(configFile)) {
    return JSON.parse(fs.readFileSync(configFile, 'utf-8'));
  }
  return null;
}

export function getApiBaseUrl(): string {
  const config = loadConfig('config');
  return config?.baseUrl || process.env.DSE_API_URL || 'http://localhost:8991';
}
