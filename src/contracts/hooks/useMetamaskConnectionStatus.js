import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

const useMetamaskConnectionStatus = () => {


    const supportedChainIds = [1, 56, 43114, 137, 4];
    const { active, chainId, account } = useWeb3React();

    const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
    const [showWrongNetworkPrompt, setShowWrongNetworkPrompt] = useState(false);

    useEffect(() => {
        if (active) {
            if (!isMetamaskConnected) setIsMetamaskConnected(true);
            if (
                chainId &&
                !supportedChainIds.includes(chainId)
            ) {
                // WRONG NETWORK
                setShowWrongNetworkPrompt(true);
            } else {
                if (showWrongNetworkPrompt) setShowWrongNetworkPrompt(false);
            }
        } else {
            // NOT CONNECTED
            if (showWrongNetworkPrompt) setShowWrongNetworkPrompt(false);
            // Show metamask connection prompt only if logged in
        }
    }, [
        active,
        account,
        chainId,

        isMetamaskConnected,
        showWrongNetworkPrompt,
    ]);

    return {
        isMetamaskConnected,
        showWrongNetworkPrompt,
        setIsMetamaskConnected,
        setShowWrongNetworkPrompt,
    };
};

export default useMetamaskConnectionStatus;