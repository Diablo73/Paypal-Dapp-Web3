import React, { useState, useEffect } from "react";
import Web3 from "web3";
import axios from "axios";
var console = require("console-browserify");

let globalVariables = {};
initializeContractualObjects().catch((error) => {
	console.error("ERROR while initializing :", error);
});

async function initializeContractualObjects() {
	const response = await axios.get(window.location.origin + "/api/getContract?params=blockchainGetCode,ABI");
	
	globalVariables.chainUrl = response.data.response.blockchainGetCode.req.url;
	globalVariables.contractAddress = response.data.response.blockchainGetCode.req.payload.params[0];
	globalVariables.web3 = new Web3(globalVariables.chainUrl);
	globalVariables.contract = new globalVariables.web3.eth.Contract(response.data.response.ABI, globalVariables.contractAddress);
}

export async function executeModifyUserNameMethod(myAddress, newUserName) {
	try {
		const data = globalVariables.contract.methods.modifyUserName(newUserName).encodeABI();

		const transactionHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [{
				from: myAddress,
				to: globalVariables.contractAddress,
				data: data,
			}],
		});
		const transactionReceipt = await waitForTransactionReceipt(transactionHash);
		return true;
	} catch (error) {
		console.error("ERROR : ", error);
		return false;
	}
}

export async function executeCreateRequestFunction(payeeAddress, payerAddress, requestAmount, requestMessage) {
	try {
		const data = globalVariables.contract.methods.createRequest(payerAddress, requestAmount, requestMessage).encodeABI();

		const transactionHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [{
				from: payeeAddress,
				to: globalVariables.contractAddress,
				data: data,
			}],
		});
		const transactionReceipt = await waitForTransactionReceipt(transactionHash);
		return true;
	} catch (error) {
		console.error("ERROR : ", error);
		return false;
	}
}

export async function executePayRequestFunction(payerAddress, payAmount) {
	try {
		const data = globalVariables.contract.methods.payRequest(0).encodeABI();

		const transactionHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [{
				from: payerAddress,
				to: globalVariables.contractAddress,
				data: data,
				value: Number(payAmount * 1e18).toString(16),
				gas: "1000000"
			}],
		});
		const transactionReceipt = await waitForTransactionReceipt(transactionHash);
		return true;
	} catch (error) {
		console.error("ERROR : ", error);
		return false;
	}
}

export async function executeRejectRequestFunction(payerAddress) {
	try {
		const data = globalVariables.contract.methods.rejectRequest(0).encodeABI();

		const transactionHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [{
				from: payerAddress,
				to: globalVariables.contractAddress,
				data: data,
			}],
		});
		const transactionReceipt = await waitForTransactionReceipt(transactionHash);
		return true;
	} catch (error) {
		console.error("ERROR : ", error);
		return true;
	}
}

async function waitForTransactionReceipt(txHash, maxAttempts = 60, interval = 1000) {
	let attempt = 0;
	while (attempt < maxAttempts) {
		try {
			const receipt = await globalVariables.web3.eth.getTransactionReceipt(txHash);
			if (receipt) {
				console.log("Transaction Successful : ", attempt, " : ", txHash, " : ", receipt);
				return receipt;
			}
		} catch (Error) {
			console.log("ERROR : ", attempt, " : ", txHash, " : ", Error);
		} finally {
			attempt++;
		}
		await new Promise((resolve) => setTimeout(resolve, interval));
	}
	throw new Error("Transaction not confirmed within the specified time.");
}
