// src/utils/updateEnv.js
const fs = require("fs");
const path = require("path");

function updateEnvVariable(key, value) {
  const envPath = path.resolve(__dirname, "../../.env");

  let envContent = fs.existsSync(envPath)
    ? fs.readFileSync(envPath, "utf-8")
    : "";

  const keyRegex = new RegExp(`^${key}=.*`, "m");

  if (envContent.match(keyRegex)) {
    // Si existe, lo reemplaza
    envContent = envContent.replace(keyRegex, `${key}=${value}`);
  } else {
    // Si no existe, lo agrega
    envContent += `\n${key}=${value}`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log(`✅ .env actualizado: ${key}=${value}`);
}

module.exports = updateEnvVariable;
