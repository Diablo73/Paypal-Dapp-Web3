const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const port = 3001;
const ABI = require("./abi.json");

app.use(cors());
app.use(express.json());


const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType, hexToNumber, numberToHex, fromWei, Units, Unit} = require("@harmony-js/utils");

const hmy = new Harmony(
    "https://api.s0.b.hmny.io/",
    {
        chainType: ChainType.Harmony,
        chainId: ChainID.HmyTestnet,
    },
);


app.listen(port, () => {
	console.log(`Listening for API Calls`);
});

app.get("/", (req, res) => {
	res.send("If you are seeing this message, then it means that the backend NodeJS server is up and running.<br>Please wait for some time while the frontend ReactJS server boots up...")
});

app.get("/api/getContract", async (req, res) => {
	let response = {};
	const params = req.query.params.split(",");
	
	if (params.includes("blockchainGetCode") || params.includes("all")) {
		response.blockchainGetCode = await getBlockchainGetCode();
	}
	if (params.includes("deployedContract") || params.includes("all")) {
		response.deployedContract = getDeployedContract();
	}
	if (params.includes("hmy") || params.includes("all")) {
		response.hmy = hmy.contracts;
	}
	if (params.includes("ABI") || params.includes("all")) {
		response.ABI = ABI;
	}

	res.send({response});
});

app.get("/api/owner", async (req, res) => {
	const response = await getDeployedContract().methods.owner().call();
	res.send({owner: response});
});


app.get("/api/getUserAccountDetails", async (req, res) => {

	const { userAddress } = req.query;
	console.log("userAddress = " + userAddress);

	const deployedContract = getDeployedContract();

	const response_getMyName = await deployedContract.methods.getMyName(userAddress).call();
	// console.log(response_getMyName);

	const response_getBalance = await hmy.blockchain.getBalance({
		address: userAddress
	});
	// console.log(response_getBalance);

	const response_coinlore_ticker = await axios.get("https://api.coinlore.net/api/ticker/?id=48567");
	const response_getTokenPrice = response_coinlore_ticker.data[0];
	// console.log(response_getTokenPrice);
	
	const userTokenBalance = fromWei(hexToNumber(response_getBalance.result), Units.one);
	const userDollarBalance = (userTokenBalance * response_getTokenPrice["price_usd"]).toFixed(2);

	const response_getMyRequests = await deployedContract.methods.getMyRequests(userAddress).call();
	// console.log(response_getMyRequests);
	let userRequests = [];
	for (let i = 0; i < response_getMyRequests.length; i++) {
		const request = {
			payeeAddress: response_getMyRequests[i].payeeAddress,
			payeeUserName: response_getMyRequests[i].payeeUserName,
			amount: response_getMyRequests[i].amount.toString(),
			requestTime: response_getMyRequests[i].requestTime,
			message: response_getMyRequests[i].message,
			payerAddress: response_getMyRequests[i].payerAddress,
		};
		userRequests.push(request);
	}

	const response_getMyHistory = await deployedContract.methods.getMyTxnHistory(userAddress).call();
	// console.log(response_getMyHistory);
	let userTxnHistory = [];
	for (let i = 0; i < response_getMyHistory.length; i++) {
		const txn = {
			action: response_getMyHistory[i].action,
			amount: response_getMyHistory[i].amount.toString(),
			message: response_getMyHistory[i].message,
			myAddress: response_getMyHistory[i].myAddress,
			yourAddress: response_getMyHistory[i].yourAddress,
			yourUserName: response_getMyHistory[i].yourUserName,
			txnTime: response_getMyHistory[i].txnTime
		};
		userTxnHistory.push(txn);
	}

	let jsonResponse = {
		userName: response_getMyName,
		userTokenBalance: userTokenBalance,
		userDollarBalance: userDollarBalance,
		userRequests: userRequests,
		userTxnHistory: userTxnHistory,
		// contractInfo: await getBlockchainGetCode()
	};


	// console.log(JSON.stringify(jsonResponse));
	console.log(jsonResponse);
	return res.status(200).json(jsonResponse);
});


function getBlockchainGetCode() {
	return hmy.blockchain.getCode({
		address: process.env.SMART_CONTRACT_ADDRESS,
		blockNumber: "latest",
	});
}

function getDeployedContract() {
	return hmy.contracts.createContract(
		ABI,
		process.env.SMART_CONTRACT_ADDRESS
	);
}
