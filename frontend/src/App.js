import logo from "./resources/logo.svg";
import demoPicture from "./resources/paypal_demo.jpg";
import "./App.css";
import { useState, useEffect } from "react";
import { Layout, Button } from "antd";
import CurrentBalance from "./components/CurrentBalance";
import RequestAndPay from "./components/RequestAndPay";
import AccountDetails from "./components/AccountDetails";
import PassBook from "./components/PassBook";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import axios from "axios";

const { Header, Content } = Layout;

function App() {
	const { address, isConnected } = useAccount();
	const { disconnect } = useDisconnect();
	const { connect } = useConnect({
		connector: new MetaMaskConnector(),
	});

	const [contractInfo, setContractInfo] = useState(null);
	const [userName, setUserName] = useState("...");
	const [userTokenBalanceElement, setUserTokenBalanceElement] = useState("...");
	const [userDollarBalanceElement, setUserDollarBalanceElement] = useState("...");
	const [userTxnHistory, setUserTxnHistory] = useState(null);
	const [userRequests, setUserRequests] = useState({ "1": [0], "0": [] });

	function disconnectAndSetNull() {
		disconnect();
		setContractInfo(null);
		setUserName("...");
		setUserTokenBalanceElement("...");
		setUserDollarBalanceElement("...");
		setUserTxnHistory(null);
		setUserRequests({ "1": [0], "0": [] });
	}

	async function getUserAccountDetails() {
		const res = await axios.get(`http://localhost:3001/api/getUserAccountDetails`, {
			params: { userAddress: address },
		});
		const response = res.data;
		console.log(response);

		setContractInfo(response.contractInfo);
		if (response.userName[1]) {
			setUserName(response.userName[0]);
		}
		setUserTokenBalanceElement(String(response.userTokenBalance));
		setUserDollarBalanceElement(String(response.userDollarBalance));
		setUserTxnHistory(response.userTxnHistory);
		setUserRequests(response.userRequests);
		return true;
	}

	useEffect(() => {
		if (!isConnected) return;
		getUserAccountDetails();
	}, [isConnected]);

	return (
		<div className="App">
			<Layout>
				<Header className="header">
					<div className="headerLeft">
						<img src={logo} alt="logo" className="logo" />
						{isConnected && (
							<>
								<div className="menuOption" style={{ borderBottom: "1.5px solid black" }}>
									Wallet
								</div>
								{/* <div className="menuOption">Activity</div>
								<div className="menuOption">{`Send & Request`}</div>
								<div className="menuOption">Summary</div>
								<div className="menuOption">Help</div> */}
							</>
						)}
					</div>
					{isConnected ? (
						<Button type={"primary"} onClick={disconnectAndSetNull}>
							Disconnect Wallet
						</Button>
					) : (
						<Button type={"primary"} onClick={()=>{
							connect();
						}}>
							Connect Wallet
						</Button>
					)}
				</Header>
				<Content className="content">
					{isConnected ? (
						<>
							<div className="firstColumn">
								<CurrentBalance 
									userDollarBalance={userDollarBalanceElement} 
									userTokenBalance={userTokenBalanceElement}
								/>
								<RequestAndPay userRequests={userRequests}
									getUserAccountDetails={getUserAccountDetails} myAddress={address}
									myUserName={userName} />
								<AccountDetails
									address={address}
									userNameFromContract={userName}
									setUserNameFromContract={setUserName}
									userDollarBalance={userDollarBalanceElement}
								/>
							</div>
							<div className="secondColumn">
								<PassBook userTxnHistory={userTxnHistory} />
							</div>
						</>
					) : (
						<div>
							<div style={{display: "block", textAlign: "center", fontSize: "26px"}}>Please Login</div>
							<div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
								<img src={demoPicture} alt="paypal_demo" width="75%" style={{border: "1px dashed #000"}}/>
							</div>
						</div>
					)}
				</Content>
			</Layout>
		</div>
	);
}

export default App;
