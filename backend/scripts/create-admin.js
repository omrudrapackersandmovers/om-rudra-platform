import { execSync } from "child_process";

// Native Web Crypto PBKDF2 Hashing (Identical to backend/src/utils/crypto.ts)
function bufferToHex(buffer) {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

async function hashPassword(password) {
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);
  const salt = bufferToHex(saltBytes.buffer);

  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 20000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const hash = bufferToHex(derivedBits);
  return { hash, salt };
}

async function main() {
  const args = process.argv.slice(2);
  const isRemote = args.includes("--remote");
  const filteredArgs = args.filter((a) => a !== "--remote");

  const username = filteredArgs[0] || "admin";
  const password = filteredArgs[1] || "ompackers@2026";

  console.log(`\n========================================`);
  console.log(`🔑 1st Om Packers & Movers — Admin Creator`);
  console.log(`========================================`);
  console.log(`Target: ${isRemote ? "☁️ REMOTE Production D1 Database" : "💻 LOCAL D1 Database"}`);
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);
  console.log(`Generating PBKDF2 hash (20,000 iterations)...`);

  const { hash, salt } = await hashPassword(password);
  console.log(`Generated Salt: ${salt}`);
  console.log(`Generated Hash: ${hash.slice(0, 16)}...`);

  // SQL Statement (Upsert: delete existing username first if any, then insert)
  const sql = `DELETE FROM admins WHERE username = '${username}'; INSERT INTO admins (username, password_hash, salt) VALUES ('${username}', '${hash}', '${salt}');`;

  const flag = isRemote ? "--remote" : "--local";
  const cmd = `npx wrangler d1 execute 1stompackersandmover_db ${flag} -y --command="${sql}"`;

  console.log(`\nExecuting on D1 Database (${flag})...`);
  try {
    const output = execSync(cmd, { stdio: "inherit" });
    console.log(`\n✅ Admin user '${username}' successfully created/updated!`);
    console.log(`You can now log in at http://localhost:5173/login\n`);
  } catch (err) {
    console.error(`\n❌ Failed to execute D1 command:`, err.message);
    process.exit(1);
  }
}

main().catch(console.error);
