const blessed = require("blessed");

function getBannerContent(accountIndex) {
  return `{center}{bold}Blockpad BOT{/bold}{/center}
{center}Codeberg: https://codeberg.org/Galkurta | Telegram: https://t.me/galkurtarchive{/center}
{center}Running Account ${accountIndex + 1}{/center}`;
}

function createBanner(screen, accountIndex) {
  return blessed.box({
    parent: screen,
    top: 0,
    left: "center",
    width: "100%",
    height: 4,
    align: "center",
    valign: "middle",
    content: getBannerContent(accountIndex),
    label: "About",
    tags: true,
    border: {
      type: "line",
    },
    style: {
      fg: "cyan",
      border: {
        fg: "blue",
      },
    },
  });
}

function createLogBox(screen) {
  return blessed.log({
    parent: screen,
    top: 4,
    left: 0,
    width: "100%",
    height: "50%",
    label: "Logs",
    tags: true,
    border: {
      type: "line",
    },
    style: {
      fg: "white",
      border: {
        fg: "cyan",
      },
    },
    scrollable: true,
    scrollbar: {
      ch: " ",
      track: {
        bg: "cyan",
      },
      style: {
        inverse: true,
      },
    },
    mouse: true,
    keys: true,
    padding: 1,
  });
}

function createStatsBox(screen) {
  return blessed.box({
    parent: screen,
    top: "54%",
    left: 0,
    width: "50%",
    height: "46%",
    label: "User Statistics",
    content: "Loading...",
    tags: true,
    border: {
      type: "line",
    },
    style: {
      fg: "white",
      border: {
        fg: "cyan",
      },
    },
    mouse: true,
    padding: 1,
  });
}

function createSummaryBox(screen) {
  return blessed.box({
    parent: screen,
    top: "54%",
    left: "50%",
    width: "50%",
    height: "46%",
    label: "Account Summary",
    tags: true,
    border: {
      type: "line",
    },
    style: {
      fg: "white",
      border: {
        fg: "cyan",
      },
    },
    padding: 1,
  });
}

function formatTimeLeft(nextClaimTime) {
  if (!nextClaimTime) return "Ready to claim";

  const now = new Date();
  const timeDiff = nextClaimTime - now;

  if (timeDiff <= 0) return "Ready to claim";

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
}

function formatStatsContent(user) {
  return `
{cyan-fg}Username:{/cyan-fg}     ${user.username}
{cyan-fg}tICE Balance:{/cyan-fg} ${user.tICEBalance}
{cyan-fg}BPAD Balance:{/cyan-fg} ${user.BPADBalance}
{cyan-fg}USDT Balance:{/cyan-fg} ${user.USDTBalance}
{cyan-fg}XP Balance:{/cyan-fg}   ${user.xpBalance}
`;
}

function formatSummaryContent(user) {
  const nextClaim = user.lastFaucetClaim
    ? new Date(new Date(user.lastFaucetClaim).getTime() + 24 * 60 * 60 * 1000)
    : null;

  return `
{yellow-fg}Account Summary{/yellow-fg}

Next Faucet Claim: {green-fg}${formatTimeLeft(nextClaim)}{/green-fg}
Total Balance Value: {cyan-fg}$${calculateTotalValue(user).toFixed(2)}{/cyan-fg}

{magenta-fg}Task Status:{/magenta-fg}
• Swap Task    : ${
    Math.random() > 0.5
      ? "{green-fg}Available{/green-fg}"
      : "{red-fg}Cooldown{/red-fg}"
  }
• Liquidity    : ${
    Math.random() > 0.5
      ? "{green-fg}Available{/green-fg}"
      : "{red-fg}Cooldown{/red-fg}"
  }
• Staking      : ${
    Math.random() > 0.5
      ? "{green-fg}Available{/green-fg}"
      : "{red-fg}Cooldown{/red-fg}"
  }

{cyan-fg}Navigation:{/cyan-fg}
← → Arrow Keys: Switch Account
ESC/Q: Exit Program
`;
}

function calculateTotalValue(user) {
  const prices = {
    tICE: 1.5,
    BPAD: 0.8,
    USDT: 1.0,
  };

  return (
    parseFloat(user.tICEBalance) * prices.tICE +
    parseFloat(user.BPADBalance) * prices.BPAD +
    parseFloat(user.USDTBalance) * prices.USDT
  );
}

module.exports = {
  createBanner,
  createLogBox,
  createStatsBox,
  createSummaryBox,
  formatStatsContent,
  formatSummaryContent,
};
