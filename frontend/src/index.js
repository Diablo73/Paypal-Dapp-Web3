import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { configureChains } from "@wagmi/core";
import { WagmiConfig, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { harmonyOne } from "@wagmi/chains";

const { provider, webSocketProvider } = configureChains(
	[harmonyOne],
	[publicProvider()]
);

const client = createClient({
	autoConnect: true,
	provider,
	webSocketProvider,
});


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<WagmiConfig client={client}>
			<App />
		</WagmiConfig>
	</React.StrictMode>
);
