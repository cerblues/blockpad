const BlockpadAPI = require("../services/api");
const components = require("../ui/components");

class BlockpadAutomation {
  constructor(bearerToken, accountIndex, screen) {
    this.api = new BlockpadAPI(bearerToken);
    this.accountIndex = accountIndex;
    this.screen = screen;
    this.minTiceBalance = 10;
    this.initializeUI();
  }

  initializeUI() {
    this.bannerBox = components.createBanner(this.screen, this.accountIndex);
    this.logBox = components.createLogBox(this.screen);
    this.statsBox = components.createStatsBox(this.screen);
    this.summaryBox = components.createSummaryBox(this.screen);
    this.screen.render();
  }

  async log(message, color = "white") {
    try {
      const timestamp = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      this.logBox.log(`{${color}-fg}[${timestamp}] ${message}{/${color}-fg}`);
      this.screen.render();
    } catch (error) {}
  }

  async displayUserStats() {
    const user = await this.api.getUserInfo();
    if (user && !user.error) {
      try {
        this.statsBox.setContent(components.formatStatsContent(user));
        this.summaryBox.setContent(components.formatSummaryContent(user));
        this.screen.render();
      } catch (error) {
        this.log(`Failed to update stats: ${error.message}`, "red");
      }
    } else {
      this.log(
        `Failed to get user info: ${user?.error || "Unknown error"}`,
        "red"
      );
    }
  }

  getSwapAmount(token, balance) {
    if (token === "tICE" || token === "BPAD") {
      const minAmount = 0.00001;
      const maxAmount = Math.min(10, parseFloat(balance));
      if (maxAmount <= minAmount) return 0;
      return Number(
        (Math.random() * (maxAmount - minAmount) + minAmount).toFixed(6)
      );
    } else {
      const minAmount = 0.00001;
      const maxAmount = Math.min(100, parseFloat(balance));
      if (maxAmount <= minAmount) return 0;
      return Number(
        (Math.random() * (maxAmount - minAmount) + minAmount).toFixed(6)
      );
    }
  }

  async checkAndSwapToTice() {
    const user = await this.api.getUserInfo();
    if (!user || user.error) {
      this.log(
        `Failed to get user info: ${user?.error || "Unknown error"}`,
        "red"
      );
      return false;
    }

    if (parseFloat(user.tICEBalance) < this.minTiceBalance) {
      this.log(
        "tICE balance is low. Converting other tokens to tICE...",
        "yellow"
      );

      const bpadBalance = parseFloat(user.BPADBalance);
      if (bpadBalance > 0) {
        this.log(`Converting ${bpadBalance} BPAD to tICE`, "yellow");
        const result = await this.api.executeSwap("BPAD", "tICE", bpadBalance);
        if (!result.success) {
          this.log(`Failed to convert BPAD: ${result.error}`, "red");
        }
      }

      const usdtBalance = parseFloat(user.USDTBalance);
      if (usdtBalance > 0) {
        this.log(`Converting ${usdtBalance} USDT to tICE`, "yellow");
        const result = await this.api.executeSwap("USDT", "tICE", usdtBalance);
        if (!result.success) {
          this.log(`Failed to convert USDT: ${result.error}`, "red");
        }
      }

      return true;
    }
    return false;
  }

  async performRandomTask() {
    const tasks = [
      this.performTaskSwaps.bind(this),
      this.performLiquidityTask.bind(this),
      this.performStakingTask.bind(this),
    ];
    const task = tasks[Math.floor(Math.random() * tasks.length)];
    await task();
    await this.displayUserStats();
  }

  async performTaskSwaps() {
    this.log("Performing Swap Task", "magenta");

    try {
      if (await this.checkAndSwapToTice()) {
        this.log("Completed emergency tICE conversion", "green");
        return;
      }

      const user = await this.api.getUserInfo();
      if (!user || user.error) {
        this.log(
          `Failed to get user info: ${user?.error || "Unknown error"}`,
          "red"
        );
        return;
      }

      const swapPairs = [
        ["tICE", "BPAD"],
        ["tICE", "USDT"],
        ["BPAD", "tICE"],
        ["BPAD", "USDT"],
        ["USDT", "tICE"],
        ["USDT", "BPAD"],
      ];

      for (const [fromToken, toToken] of swapPairs) {
        const balanceKey = `${fromToken}Balance`;
        const balance = parseFloat(user[balanceKey]);
        if (balance > 0) {
          const amount = this.getSwapAmount(fromToken, balance);
          if (amount > 0) {
            const result = await this.api.executeSwap(
              fromToken,
              toToken,
              amount
            );
            if (result.success) {
              this.log(
                `Swap successful: ${amount} ${fromToken} to ${toToken}`,
                "green"
              );
            } else {
              this.log(`Swap failed: ${result.error}`, "red");
            }
            await this.displayUserStats();
          }
        }
      }
    } catch (error) {
      this.log(`Error in swap task: ${error.message}`, "red");
    }
  }

  async performLiquidityTask() {
    this.log("Performing Liquidity Task", "magenta");

    try {
      await this.checkAndSwapToTice();

      const user = await this.api.getUserInfo();
      if (!user || user.error) {
        this.log(
          `Failed to get user info: ${user?.error || "Unknown error"}`,
          "red"
        );
        return;
      }

      if (parseFloat(user.tICEBalance) >= 10) {
        this.log("Adding liquidity...", "yellow");
        const addResult = await this.api.addLiquidity(10);

        if (addResult.success) {
          this.log("Liquidity added successfully!", "green");
          await new Promise((resolve) => setTimeout(resolve, 2000));

          this.log("Removing liquidity...", "yellow");
          const removeResult = await this.api.removeLiquidity(10);

          if (removeResult.success) {
            this.log("Liquidity removed successfully!", "green");
          } else {
            this.log(
              `Failed to remove liquidity: ${removeResult.error}`,
              "red"
            );
          }
        } else {
          this.log(`Failed to add liquidity: ${addResult.error}`, "red");
        }
      } else {
        this.log("Insufficient balance for liquidity task", "yellow");
      }
    } catch (error) {
      this.log(`Error in liquidity task: ${error.message}`, "red");
    }
  }

  async performStakingTask() {
    this.log("Performing Staking Task", "magenta");

    try {
      await this.checkAndSwapToTice();

      const user = await this.api.getUserInfo();
      if (!user || user.error) {
        this.log(
          `Failed to get user info: ${user?.error || "Unknown error"}`,
          "red"
        );
        return;
      }

      if (parseFloat(user.tICEBalance) >= 1) {
        this.log("Staking 1 tICE...", "yellow");
        const stakeResult = await this.api.stake(1);

        if (stakeResult.success) {
          this.log("Staking successful!", "green");
          await new Promise((resolve) => setTimeout(resolve, 2000));

          this.log("Unstaking 1 tICE...", "yellow");
          const unstakeResult = await this.api.unstake(1);

          if (unstakeResult.success) {
            this.log("Unstaking successful!", "green");
          } else {
            this.log(`Failed to unstake: ${unstakeResult.error}`, "red");
          }
        } else {
          this.log(`Failed to stake: ${stakeResult.error}`, "red");
        }
      } else {
        this.log("Insufficient balance for staking task", "yellow");
      }
    } catch (error) {
      this.log(`Error in staking task: ${error.message}`, "red");
    }
  }
}

module.exports = BlockpadAutomation;
