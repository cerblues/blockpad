# Blockpad Task Automation

A Node.js CLI application that automates various tasks on Blockpad testnet platform using blessed for the terminal user interface.

## Features

- Automatic task execution (Swap, Liquidity, Staking)
- Multi-account support
- Faucet claim timer and auto-claim
- Real-time balance tracking
- Beautiful terminal UI
- Secure token management

## Prerequisites

- Node.js 16.x or higher
- npm (Node Package Manager)
- A registered account on Blockpad Testnet

## Installation

1. Clone the repository:

```bash
git clone https://codeberg.org/Galkurta/Blockpad-BOT.git
cd Blockpad-BOT
```

2. Install dependencies:

```bash
npm install
```

3. Edit`data.txt` file and add your bearer tokens:

```txt
your_bearer_token_1
your_bearer_token_2
```

## Getting Started

1. Register an account on [Blockpad Testnet](https://testnet.blockpad.fun/register?ref=QHLJYT)

2. Get your bearer token:

   - Login to your account
   - Open browser developer tools (F12)
   - Go to Network tab
   - Make any action on the website
   - Look for requests to api2.blockpad.fun
   - Find the 'Authorization' header with 'Bearer' token

3. Add your token to data.txt

4. Run the application:

```bash
npm start
```

## Usage

### Features

- **Auto Swap**: Automatically performs token swaps between tICE, BPAD, and USDT
- **Auto Liquidity**: Manages liquidity pool participation
- **Auto Staking**: Handles staking and unstaking of tokens
- **Faucet Timer**: Shows countdown for next available faucet claim
- **Balance Tracking**: Real-time monitoring of all token balances
- **Task Status**: Visual indicators for available tasks

## Configuration

Default settings can be modified in the source code:

- Minimum tICE balance for emergency swap: 10 tICE
- Swap amounts: 0.00001 - 10 for tICE/BPAD, 0.00001 - 100 for USDT
- Task intervals: 5 seconds between tasks
- Faucet claim retries: 5 attempts with 1-minute intervals

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Disclaimer

This bot is for educational purposes only. Use at your own risk. The developers are not responsible for any financial losses incurred while using this bot.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Support

If you found this project helpful, consider supporting the developer:

- EVM `0xff1E5771295400E93136d56a95a92Ec7a387bfd8`
