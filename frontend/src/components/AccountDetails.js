import React, { useState, useEffect } from "react";
import { Button, Card, Input, Modal } from "antd";
import { CryptoLogos } from "@web3uikit/core";
import * as ContractMethods from "../core/ContractMethods";

function AccountDetails({ address, userNameFromContract, setUserNameFromContract, userDollarBalance }) {

	const [userNameModal, setUserNameModal] = useState(false);
	const [newUserName, setNewUserName] = useState("");

	async function modifyUserName(address, newUserName) {
		const isSuccess = await ContractMethods.executeModifyUserNameMethod?.(address, newUserName);
		if (isSuccess) {
			hideUserNameModal();
			setUserNameFromContract(newUserName);
		}
	}

	const showUserNameModal = () => {
		setUserNameModal(true);
	};

	const hideUserNameModal = () => {
		setUserNameModal(false);
	};

	return (
		<>
			<Modal
				title="Set UserName"
				open={userNameModal}
				onOk={() => {
					modifyUserName?.(address, newUserName);
				}}
				onCancel={hideUserNameModal}
				okText="Confirm"
				cancelText="Cancel"
			>
				<p>Enter a new UserName</p>
				<Input placeholder="..." value={newUserName} onChange={(val)=>setNewUserName(val.target.value)}/>
			</Modal>
			<Card title="Account Details" style={{ width: "100%" }}>
				<div className="accountDetailRow">
					<CryptoLogos chain="harmony" size="48px"/>
					<div>
						<div className="accountDetailHead"> {userNameFromContract} </div>
						<div className="accountDetailBody"> {address} </div>
					</div>
				</div>
				<div className="accountOptions">
					<div className="extraOption" onClick={showUserNameModal}>Set Username</div>
					{/* <div className="extraOption">Switch Accounts</div> */}
				</div>
			</Card>
		</>
	);
}

export default AccountDetails;