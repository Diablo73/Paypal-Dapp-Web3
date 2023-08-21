import React, { useState, useEffect } from "react";
import { DollarOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Modal, Input, InputNumber } from "antd";
import * as ContractMethods from "../core/ContractMethods";

function RequestAndPay({ userRequests, getUserAccountDetails, myAddress, myUserName }) {
	const [setUpUserNameModal, setSetUpUserNameModal] = useState(false);
	const [payModal, setPayModal] = useState(false);
	const [confirmLoadingRequest, setConfirmLoadingRequest] = useState(false);
	const [confirmLoadingProceedToPay, setConfirmLoadingProceedToPay] = useState(false);
	const [confirmLoadingReject, setConfirmLoadingReject] = useState(false);
	const [requestModal, setRequestModal] = useState(false);
	const [requestAmount, setRequestAmount] = useState(5);
	const [payerAddress, setPayerAddress] = useState("");
	const [requestMessage, setRequestMessage] = useState("");


	async function initiateCreateRequest() {
		setConfirmLoadingRequest(true);
		const isSuccess = await ContractMethods.executeCreateRequestFunction?.(
			myAddress, payerAddress, requestAmount, requestMessage);
		if (isSuccess) {
			getUserAccountDetails();
			setTimeout(() => {
				setConfirmLoadingRequest(false);
				hideRequestModal(false);
			}, 3000);
		} else {
			setConfirmLoadingRequest(false);
			hideRequestModal(false);
		}
	}

	async function initiatePayRequest() {
		setConfirmLoadingProceedToPay(true);
		const isSuccessTxn = await ContractMethods.executePayRequestFunction?.(myAddress, userRequests[0].amount);
		if (isSuccessTxn) {
			getUserAccountDetails();
			setTimeout(() => {
				setConfirmLoadingProceedToPay(false);
				hidePayModal(false);
			}, 3000);
		} else {
			setConfirmLoadingProceedToPay(false);
			hidePayModal(false);
		}
	}

	async function initiateRejectRequest() {
		setConfirmLoadingReject(true);
		const isSuccess = await ContractMethods.executeRejectRequestFunction?.(myAddress);
		if (isSuccess) {
			getUserAccountDetails();
			setTimeout(() => {
				setConfirmLoadingReject(false);
				hidePayModal(false);
			}, 3000);			
		} else {
			setConfirmLoadingReject(false);
			hidePayModal(false);
		}
	}

	const showSetUpUserNameModal = () => {
		setSetUpUserNameModal(true);
	};
	const hideSetUpUserNameModal = () => {
		setSetUpUserNameModal(false);
	};

	const showPayModal = () => {
		if (myUserName === "..." || myUserName === undefined || myUserName === "") {
			showSetUpUserNameModal();
		} else {
			setPayModal(true);
		}
	};
	const hidePayModal = () => {
		setPayModal(false);
	};

	const showRequestModal = () => {
		if (myUserName === "..." || myUserName === undefined || myUserName === "") {
			showSetUpUserNameModal();
		} else {
			setRequestModal(true);
		}
	};
	const hideRequestModal = () => {
		setRequestModal(false);
	};


	return (
		<>
			<Modal
				title="Set Up a UserName"
				open={setUpUserNameModal}
				onCancel={hideSetUpUserNameModal}
				footer={null}
			>
				<h3>Please set up a UserName</h3>
			</Modal>
			<Modal
				title="Confirm Payment to"
				open={payModal}
				onCancel={hidePayModal}
				cancelText="Cancel"
				footer={[
					<Button key="cancel" onClick={hidePayModal}>
						Cancel
					</Button>,
					<Button
						key="reject"
						type="primary"
						danger="true"
						disabled={(userRequests.length === 0) ? true : false}
						onClick={() => {
							initiateRejectRequest?.();
						}}
						loading={confirmLoadingReject}
					>
						Reject
					</Button>,
					<Button
						key="submit"
						type="primary"
						disabled={(userRequests.length === 0) ? true : false}
						onClick={() => {
							initiatePayRequest?.();
						}}
						loading={confirmLoadingProceedToPay}
					>
						Proceed To Pay
					</Button>,
				  ]}
			>
				{userRequests && userRequests.length > 0 && (
					<>
						<h2>{userRequests[0].payeeUserName}</h2>
						<h3>Value: {userRequests[0].amount} ONE</h3>
						<p>{userRequests[0].message}</p>
						<p>{new Date(parseInt(userRequests[0].requestTime, 16) * 1000).toString()}</p>
					</>
				)}
			</Modal>
			<Modal
				title="Request A Payment"
				open={requestModal}
				onOk={() => {
					initiateCreateRequest?.();
				}}
				onCancel={hideRequestModal}
				okText="Proceed To Request"
				cancelText="Cancel"
				confirmLoading={confirmLoadingRequest}
			>
				<p>Amount (ONE)</p>
				<InputNumber value={requestAmount} onChange={(val)=>setRequestAmount(val)}/>
				<p>From (address)</p>
				<Input placeholder="0x..." value={payerAddress} onChange={(val)=>setPayerAddress(val.target.value)}/>
				<p>Message</p>
				<Input placeholder="Lunch Bill..." value={requestMessage} onChange={(val)=>setRequestMessage(val.target.value)}/>
			</Modal>
			<div className="requestAndPay">
				<div className="quickOption"
					onClick={() => {
						showPayModal();
					}}
				>
					<DollarOutlined style={{ fontSize: "26px" }} />
					Pay
					{userRequests && userRequests.length > 0 && (
						<div className="numReqs">{userRequests.length}</div>
					)}
				</div>
				<div className="quickOption" onClick={() => { showRequestModal(); }}>
					<SwapOutlined style={{ fontSize: "26px" }} />
					Request
				</div>
			</div>
		</>
	);
}

export default RequestAndPay;