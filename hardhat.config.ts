import { task } from "hardhat/config";

import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import "@nomiclabs/hardhat-etherscan";


const ROPSTEN_PRIVATE_KEY = "fc588fb87e0711c7363158c559584ab9319406faeb9e4ea1eeee69ad72e9f8c1";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default {
  solidity: "0.8.9",
  networks: {
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/z0zfeejhEgS6CtJvabLzhZaVChQAkk-B`,
      accounts: [`0x${ROPSTEN_PRIVATE_KEY}`]
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "AWXE1YD748KNU1AF17XC4JYQT4IK12QHMW"
  }

};