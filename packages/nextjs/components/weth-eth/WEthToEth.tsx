import { useState } from "react";
import { Address, InputBase } from "../scaffold-eth";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { formatEther, parseEther } from "viem";
import { scroll } from "viem/chains";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { ArrowsRightLeftIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

// REGEX for number inputs (only allow numbers and a single decimal point)
export const NUMBER_REGEX = /^\.?\d+\.?\d*$/;
const WETH_CONTRACT_ADDRESS = "0x5300000000000000000000000000000000000004";

const WEthToEth = () => {
  const [sendValue, setSendValue] = useState("");
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { openConnectModal } = useConnectModal();
  const { writeAsync: depositETH, isLoading } = useScaffoldContractWrite({
    contractName: "WETH",
    functionName: "withdraw",
    args: [NUMBER_REGEX.test(sendValue) ? parseEther(sendValue) : undefined],
  });

  const { data: wethBalance, isLoading: isLoadingBalance } = useScaffoldContractRead({
    contractName: "WETH",
    functionName: "balanceOf",
    args: [connectedAddress],
    watch: true,
  });

  return (
    <div className="bg-base-300 p-6 rounded-xl space-y-4 max-w-md m-auto">
      <div className="space-y-3">
        <div className="flex flex-col items-center space-y-5">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm font-bold text-center">WETH-ETH</span>
            <Address address={WETH_CONTRACT_ADDRESS} />
          </div>
          <div className="flex space-x-4">
            <div>
              <span className="text-sm font-bold pl-3">Your WETH Balance:</span>

              <div className="w-full flex items-center justify-center">
                {isLoadingBalance ? (
                  <div
                    className={`border-2 border-gray-400 rounded-md px-2 flex flex-col items-center max-w-fit cursor-pointer`}
                  >
                    <div className="text-warning">Error</div>
                  </div>
                ) : (
                  <span>{wethBalance ? formatEther(wethBalance) : 0} WETH</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <InputBase placeholder="Amount to Withdraw" value={sendValue} onChange={value => setSendValue(value)} />
          {isConnected && connectedChain && connectedChain.id === scroll.id ? (
            <button
              className="h-10 btn btn-accent btn-sm px-2 rounded-full"
              onClick={() => depositETH()}
              disabled={isLoading}
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

export default WEthToEth;
