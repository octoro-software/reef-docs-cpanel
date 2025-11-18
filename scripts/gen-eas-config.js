const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// --- CONFIG ---
const profile = process.argv[2] || "freshDevelopmentInternal";
const envFileMap = {
  development: ".env.dev",
  developmentInternal: ".env.dev",
  freshDevelopmentInternal: ".env.fresh.dev",
  preview: ".env.preview",
  production: ".env.production",
  productionInternal: ".env.production",
};

const baseEasJsonPath = path.resolve(__dirname, "..", "eas.json");
const outputPath = path.resolve(__dirname, "..", "eas.dynamic.json");
const envFile = envFileMap[profile] || ".env";

// --- LOAD BASE EAS.JSON ---
if (!fs.existsSync(baseEasJsonPath)) {
  console.error("❌ eas.json not found.");
  process.exit(1);
}
const baseConfig = JSON.parse(fs.readFileSync(baseEasJsonPath, "utf8"));

// --- LOAD ENV FILE ---
const envPath = path.resolve(__dirname, "..", envFile);
let envVars = {};
if (fs.existsSync(envPath)) {
  envVars = dotenv.parse(fs.readFileSync(envPath));
  console.log(`✅ Loaded env vars from ${envFile}`);
} else {
  console.warn(`⚠️ Env file not found: ${envFile}`);
}

// --- PATCH THE PROFILE ENV ---
if (!baseConfig.build[profile]) {
  console.error(`❌ Profile "${profile}" not found in eas.json`);
  process.exit(1);
}

baseConfig.build[profile].env = {
  ...(baseConfig.build[profile].env || {}),
  ...envVars,
  ENV_FILE: envFile, // Preserve which file was loaded
};

// --- OUTPUT DYNAMIC FILE ---
fs.writeFileSync(outputPath, JSON.stringify(baseConfig, null, 2));
console.log(
  `✅ Wrote updated EAS config to eas.dynamic.json for profile "${profile}"`
);
