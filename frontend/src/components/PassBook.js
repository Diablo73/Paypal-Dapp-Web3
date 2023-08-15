import React from "react";
import { Card, Table } from "antd";

const columns = [
	{
		title: "Action",
		dataIndex: "action",
		key: "action",
	},
	{
		title: "TxnTime (IST)",
		dataIndex: "txnTime",
		key: "txnTime",
		render: (time) => {
			if (time === undefined) {
				return "-";
			} else {
				const d = new Date(parseInt(time, 16) * 1000);
				return d.toDateString() + " " + d.toLocaleTimeString();
			}
		},
	},
	{
		title: "UserName",
		dataIndex: "yourUserName",
		key: "yourUserName",
	},
	// {
	// 	title: "Address",
	// 	dataIndex: "yourAddress",
	// 	key: "yourAddress",
	// },
	{
		title: "Message",
		dataIndex: "message",
		key: "message",
	},
	{
		title: "Amount",
		key: "amount",
		render: (_, record) => (
			<div
				style={record.action === "DEBIT" ? { color: "red" } : { color: "green" }}
			>
				{record.action === "DEBIT" ? "-" : "+"}
				{record.amount} ONE
			</div>
		),
	},
];

function PassBook({ userTxnHistory }) {

	return (
		<Card title="PassBook" style={{ width: "100%", minHeight: "480px" }}>
			{userTxnHistory && userTxnHistory.length && (
			<Table
				dataSource={[...userTxnHistory].reverse()}
				columns={columns}
				pagination={{ position: ["bottomCenter"], pageSize: 7 }}
			/>
		)}
		</Card>
	);
}

export default PassBook;