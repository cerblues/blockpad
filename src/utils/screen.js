const blessed = require("blessed");

async function createScreen() {
  try {
    const screen = blessed.screen({
      smartCSR: true,
      title: "Blockpad Task Automation",
      fullUnicode: true,
      debug: true,
      dockBorders: true,
      ignoreLocked: ["C-c"],
    });

    screen.enableMouse();
    screen.enableInput();

    screen.key(["escape", "q", "C-c"], () => {
      screen.destroy();
      process.exit(0);
    });

    screen.key(["right", "down"], async () => {
      await screen.emit("next_account");
    });

    screen.key(["left", "up"], async () => {
      await screen.emit("previous_account");
    });

    return screen;
  } catch (error) {
    throw error;
  }
}

function destroyScreen(screen) {
  if (screen) {
    screen.destroy();
  }
}

module.exports = {
  createScreen,
  destroyScreen,
};
