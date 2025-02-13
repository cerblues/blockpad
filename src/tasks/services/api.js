const axios = require("axios");

class BlockpadAPI {
  constructor(bearerToken) {
    this.baseUrl = "https://api2.blockpad.fun/api";
    this.headers = {
      Accept: "application/json, text/plain, */*",
      Authorization: `Bearer ${bearerToken.trim()}`,
      "Content-Type": "application/json",
      Origin: "https://testnet.blockpad.fun",
      Referer: "https://testnet.blockpad.fun/",
    };
  }

  async getUserInfo() {
    try {
      const response = await axios.get(`${this.baseUrl}/auth/me`, {
        headers: this.headers,
      });
      return response.data.user;
    } catch (error) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async claimFaucet() {
    try {
      const response = await axios.post(
        `${this.baseUrl}/faucet/claim`,
        {},
        { headers: this.headers }
      );
      if (response.data.error) {
        return { success: false, error: response.data.error };
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async executeSwap(fromToken, toToken, amount) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/swap/execute`,
        {
          fromToken,
          toToken,
          amount,
        },
        { headers: this.headers }
      );
      return { success: response.status === 200 };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async addLiquidity(tICEAmount) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/liquidity/add`,
        { tICEAmount },
        { headers: this.headers }
      );
      return { success: response.status === 200 };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async removeLiquidity(tICEAmount) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/liquidity/remove`,
        { tICEAmount },
        { headers: this.headers }
      );
      return { success: response.status === 200 };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async stake(amount) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/staking/stake`,
        { token: "tICE", amount },
        { headers: this.headers }
      );
      return { success: response.status === 200 };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async unstake(amount) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/staking/unstake`,
        { token: "tICE", amount },
        { headers: this.headers }
      );
      return { success: response.status === 200 };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }
}

module.exports = BlockpadAPI;
