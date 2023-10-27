import { useState } from "react";
import { Address, Balance, InputBase } from "../scaffold-eth";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { parseEther } from "viem";
import { scroll } from "viem/chains";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { ArrowsRightLeftIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

// REGEX for number inputs (only allow numbers and a single decimal point)
export const NUMBER_REGEX = /^\.?\d+\.?\d*$/;
const WETH_CONTRACT_ADDRESS = "0x5300000000000000000000000000000000000004";

const EthToWEth = () => {
  const [sendValue, setSendValue] = useState("");
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { openConnectModal } = useConnectModal();
  const { writeAsync: depositETH, isLoading } = useScaffoldContractWrite({
    contractName: "WETH",
    functionName: "deposit",
    value: NUMBER_REGEX.test(sendValue) ? parseEther(sendValue) : undefined,
  });

  return (
    <div className="bg-base-300 p-6 rounded-xl space-y-4 max-w-md m-auto">
      <div className="space-y-3">
        <div className="flex flex-col items-center space-y-5">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm font-bold text-center">ETH-WETH</span>
            <Address address={WETH_CONTRACT_ADDRESS} />
          </div>
          <div className="flex space-x-4">
            <div>
              <span className="text-sm font-bold pl-3">Your ETH Balance:</span>
              <Balance address={connectedAddress} />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <InputBase
            placeholder="Amount to deposit"
            value={sendValue}
            onChange={value => setSendValue(value)}
            error={Boolean(sendValue) && !NUMBER_REGEX.test(sendValue)}
          />
          {isConnected && connectedChain && connectedChain.id === scroll.id ? (
            <button
              className="h-10 btn btn-accent btn-sm px-2 rounded-full"
              onClick={() => depositETH()}
              disabled={isLoading || !NUMBER_REGEX.test(sendValue)}
            >
              {!isLoading ? (
                <BanknotesIcon className="h-6 w-6" />
              ) : (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              <span>Send</span>
            </button>
          ) : connectedChain ? (
            <button
              className="h-10 btn btn-accent btn-sm px-2 rounded-full"
              type="button"
              onClick={() => switchNetwork?.(scroll.id)}
            >
              <ArrowsRightLeftIcon className="h-6 w-4 ml-2 sm:ml-0" />
              <span className="whitespace-nowrap">Switch to Scroll</span>
            </button>
          ) : (
            <button
              onClick={openConnectModal}
              disabled={isConnecting}
              className="h-10 btn btn-accent btn-sm px-2 rounded-full"
            >
              {isConnecting && <span className="loading loading-spinner loading-sm"></span>}
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EthToWEth;
