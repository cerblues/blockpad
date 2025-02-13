const { createScreen, destroyScreen } = require("./src/utils/screen");
const { readTokensFromFile, initializeDataFile } = require("./src/utils/files");
const BlockpadAutomation = require("./src/tasks/automation");

let screen;
let bot;
let tokens = [];
let currentAccountIndex = 0;

async function switchAccount(newIndex) {
  try {
    if (screen) {
      screen.removeAllListeners("next_account");
      screen.removeAllListeners("previous_account");
      destroyScreen(screen);
    }

    currentAccountIndex = newIndex;
    screen = await createScreen();

    setupScreenEvents();

    bot = new BlockpadAutomation(
      tokens[currentAccountIndex],
      currentAccountIndex,
      screen
    );
    await bot.displayUserStats();
    bot.log(`Switched to account ${currentAccountIndex + 1}`, "cyan");
  } catch (error) {
    if (bot) {
      bot.log(`Error switching accounts: ${error.message}`, "red");
    }
  }
}

function setupScreenEvents() {
  screen.removeAllListeners("next_account");
  screen.removeAllListeners("previous_account");

  screen.on("next_account", async () => {
    const nextIndex = (currentAccountIndex + 1) % tokens.length;
    await switchAccount(nextIndex);
  });

  screen.on("previous_account", async () => {
    const prevIndex = (currentAccountIndex - 1 + tokens.length) % tokens.length;
    await switchAccount(prevIndex);
  });
}

async function runTasks() {
  while (true) {
    try {
      const user = await bot.api.getUserInfo();
      if (user) {
        const lastClaim = user.lastFaucetClaim;

        if (!lastClaim) {
          bot.log(
            "No previous faucet claim found. Attempting to claim...",
            "yellow"
          );
          let retryCount = 0;
          while (retryCount < 5) {
            const result = await bot.api.claimFaucet();
            if (result.success) break;
            retryCount++;
            if (retryCount < 5) {
              bot.log(
                `Retrying faucet claim in 1 minute... (Attempt ${retryCount}/6)`,
                "yellow"
              );
              await new Promise((resolve) => setTimeout(resolve, 60000));
            }
          }
        } else {
          const lastClaimDate = new Date(lastClaim);
          const nextClaim = new Date(
            lastClaimDate.getTime() + 24 * 60 * 60 * 1000
          );
          const now = new Date();

          if (now >= nextClaim) {
            let retryCount = 0;
            while (retryCount < 5) {
              const result = await bot.api.claimFaucet();
              if (result.success) break;
              retryCount++;
              if (retryCount < 5) {
                bot.log(
                  `Retrying faucet claim in 1 minute... (Attempt ${retryCount}/6)`,
                  "yellow"
                );
                await new Promise((resolve) => setTimeout(resolve, 60000));
              }
            }
          }
        }

        await bot.performRandomTask();

        await new Promise((resolve) => setTimeout(resolve, 5000));
        screen.emit("next_account");
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      bot.log(`Error in task loop: ${error.message}`, "red");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

async function main() {
  try {
    tokens = await readTokensFromFile();
    if (tokens.length === 0) {
      throw new Error("No tokens found in data.txt");
    }

    screen = await createScreen();
    setupScreenEvents();

    bot = new BlockpadAutomation(
      tokens[currentAccountIndex],
      currentAccountIndex,
      screen
    );
    bot.log("Initializing Blockpad Task Automation...", "cyan");
    await bot.displayUserStats();

    await runTasks();
  } catch (error) {
    if (bot) {
      bot.log(`Fatal error: ${error.message}`, "red");
    }
    if (screen) {
      destroyScreen(screen);
    }
    process.exit(1);
  }
}

process.on("unhandledRejection", async (error) => {
  if (bot) {
    bot.log(`Unhandled Promise Rejection: ${error.message}`, "red");
  }
  if (screen) destroyScreen(screen);
  process.exit(1);
});

process.on("uncaughtException", async (error) => {
  if (bot) {
    bot.log(`Uncaught Exception: ${error.message}`, "red");
  }
  if (screen) destroyScreen(screen);
  process.exit(1);
});

process.on("exit", (code) => {
  if (screen) {
    destroyScreen(screen);
  }
});

initializeDataFile()
  .then(main)
  .catch((error) => {
    if (bot) {
      bot.log(`Fatal error: ${error.message}`, "red");
    }
    if (screen) {
      destroyScreen(screen);
    }
    process.exit(1);
  });
