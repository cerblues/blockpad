const fs = require("fs").promises;

async function readTokensFromFile() {
  try {
    console.log("Reading tokens from data.txt...");
    const data = await fs.readFile("data.txt", "utf8");
    const tokens = data
      .split("\n")
      .map((token) => token.trim())
      .filter((token) => token && !token.startsWith("#"));
    console.log(`Found ${tokens.length} valid tokens`);
    return tokens;
  } catch (error) {
    console.error("Error reading data.txt:", error);
    throw error;
  }
}

async function initializeDataFile() {
  try {
    console.log("Checking data.txt...");
    await fs.access("data.txt");
    console.log("data.txt exists");
  } catch {
    console.log("Creating data.txt...");
    await fs.writeFile(
      "data.txt",
      "# Add your bearer tokens here, one per line\n",
      "utf8"
    );
    console.log(
      "Created data.txt file. Please add your bearer tokens and restart the program."
    );
    process.exit(0);
  }
}

module.exports = {
  readTokensFromFile,
  initializeDataFile,
};
