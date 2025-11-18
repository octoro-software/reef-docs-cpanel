// loadEnv.js (final version — CommonJS, ENV_FILE-aware)
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Allow passing ENV_FILE manually
const envFile = process.env.ENV_FILE || ".env";
const envPath = path.resolve(__dirname, envFile);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`✅ Loaded env from ${envFile}`);
} else {
  console.warn(`⚠️ ENV file not found: ${envFile}`);
}
