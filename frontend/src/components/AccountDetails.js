import React from "react";
import { Card } from "antd";
import { CryptoLogos } from "@web3uikit/core";


function AccountDetails({ address, userName, userDollarBalance }) {

	return (
		<Card title="Account Details" style={{ width: "100%" }}>
			<div className="accountDetailRow">
				<CryptoLogos chain="harmony" size="48px"/>
				<div>
					<div className="accountDetailHead"> {userName} </div>
					<div className="accountDetailBody"> {address} </div>
				</div>
			</div>
			{/* <div className="balanceOptions">
				<div className="extraOption">Set Username</div>
				<div className="extraOption">Switch Accounts</div>
			</div> */}
		</Card>
	);
}

export default AccountDetails;