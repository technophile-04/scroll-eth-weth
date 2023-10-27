import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import EthToWEth from "~~/components/weth-eth/EthToWEth";
import WEthToEth from "~~/components/weth-eth/WEthToEth";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 space-y-6">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">Scroll 📜</span>
          </h1>
          <EthToWEth />
          <WEthToEth />
        </div>
      </div>
    </>
  );
};

export default Home;
