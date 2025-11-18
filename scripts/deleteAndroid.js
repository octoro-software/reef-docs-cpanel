/**
 * kill-and-delete-android.js
 *
 * Stops Gradle daemons, kills common Android/Java lockers,
 * then force-deletes the ./android folder (even if previously in use).
 */

const { execSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const androidPath = path.join(__dirname, "android");

function run(cmd) {
  try {
    execSync(cmd, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function log(msg) {
  console.log(`[clean] ${msg}`);
}

function fileExists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function stopGradleDaemons() {
  const gradlew = process.platform === "win32" ? "gradlew.bat" : "gradlew";
  const gradlewPath = path.join(__dirname, "android", gradlew);
  if (fileExists(gradlewPath)) {
    log("Stopping Gradle daemons via gradlew --stop…");
    try {
      const res = spawnSync(gradlewPath, ["--stop"], {
        cwd: path.dirname(gradlewPath),
        stdio: "ignore",
        shell: process.platform === "win32",
      });
      if (res.status === 0) return;
    } catch {}
  }

  // Fallbacks: try plain gradle if available
  log("Attempting to stop Gradle via 'gradle --stop'…");
  run("gradle --stop");
}

function killCommonLockers() {
  log("Killing common lockers (Gradle/Java/ADB/Emulator)…");

  if (process.platform === "win32") {
    // Quietly try to kill specific processes if present
    const killers = [
      'taskkill /F /IM "gradle*.exe" /T',
      'taskkill /F /IM "java.exe" /T',
      'taskkill /F /IM "adb.exe" /T',
      // 'taskkill /F /IM "emulator.exe" /T', // Removed emulator kill
      // 'taskkill /F /IM "qemu-system-x86_64.exe" /T', // Removed emulator kill
      // 'taskkill /F /IM "qemu-system-aarch64.exe" /T', // Removed emulator kill
    ];
    killers.forEach((k) => run(k));

    // Bonus: try killing processes whose window title references Gradle
    run(
      "wmic process where \"Name='java.exe' and CommandLine like '%GradleDaemon%'\" call terminate"
    );
  } else {
    // macOS/Linux
    const killers = [
      "pkill -f GradleDaemon",
      "pkill -f 'java.*Gradle'",
      "pkill -f adb",
      // "pkill -f '[e]mulator'", // Removed emulator kill
      // "pkill -f qemu-system", // Removed emulator kill
    ];
    killers.forEach((k) => run(k));

    // Extra: kill any process with open files under ./android (requires lsof)
    try {
      const lsofCmd = `lsof +D "${androidPath}" -t`;
      const pids = execSync(lsofCmd, { stdio: ["ignore", "pipe", "ignore"] })
        .toString()
        .split(/\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (pids.length) {
        log(
          `Found PIDs with handles in android/: ${pids.join(", ")} — killing…`
        );
        pids.forEach((pid) => run(`kill -9 ${pid}`));
      }
    } catch {
      // lsof may not be installed or no locks found; ignore
    }
  }
}

function forceDeleteAndroid(maxRetries = 5, waitMs = 600) {
  if (!fs.existsSync(androidPath)) {
    log("No android folder to delete — nothing to do.");
    return true;
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    log(`Delete attempt ${attempt}/${maxRetries}…`);

    if (process.platform === "win32") {
      // Standard Windows force delete
      run(`rmdir /s /q "${androidPath}"`);
      // Occasionally some files survive; try attrib reset then delete again
      if (fs.existsSync(androidPath)) {
        run(`attrib -r -s -h "${androidPath}" /S /D`);
        run(`rmdir /s /q "${androidPath}"`);
      }
    } else {
      // Unix
      run(`rm -rf "${androidPath}"`);
    }

    if (!fs.existsSync(androidPath)) {
      log("Deleted android folder (forced).");
      return true;
    }

    // Still there; wait and retry
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, waitMs);
  }

  log("Failed to delete android folder after retries.");
  return false;
}

(function main() {
  log("Starting cleanup…");
  stopGradleDaemons();
  killCommonLockers();
  const ok = forceDeleteAndroid();

  if (!ok) {
    console.error(
      "[clean] Unable to remove the folder. On Windows, make sure no Explorer window is open inside 'android', and close Android Studio/Emulator. On macOS/Linux, ensure no terminals are cd'ed into it."
    );
    process.exitCode = 1;
  } else {
    log("Cleanup complete.");
  }
})();
