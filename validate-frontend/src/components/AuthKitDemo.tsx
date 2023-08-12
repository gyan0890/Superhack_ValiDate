import { useRouter } from "next/router";
import { useUserData } from "./UserContext";
import ConnectedWalletLabel from "./Wallet/ConnectedWalletLabel";
import SafeInfo from "./Wallet/SafeInfo";
import { useAccountAbstraction } from "./store/accountAbstractionContext";
import { useEffect } from "react";

const AuthKitDemo = () => {
  const { loginWeb3Auth, isAuthenticated, safeSelected, chainId } = useAccountAbstraction();
  const router: any = useRouter();
  const { ownerAddress } = useAccountAbstraction();
  const { allUser } = useUserData();

  useEffect(() => {
    if (isAuthenticated) {
      const userExists = allUser.filter(
        (item: { id: string | undefined }) => item.id === ownerAddress
      );
      userExists.length
        ? router.push("/chat", null, { shallow: true })
        : router.push("/verify", null, { shallow: true });
    }
  }, [isAuthenticated]);

  return (
    <>
      {isAuthenticated ? (
        <div>
          {/* safe Account */}
          <div>
            {/* Safe Info */}
            {safeSelected && (
              <SafeInfo safeAddress={safeSelected} chainId={chainId} />
            )}
          </div>

          {/* owner ID */}
          <div>
            <p>Owner ID</p>
            {/* Owner details */}
            <ConnectedWalletLabel />
          </div>
        </div>
      ) : (
        <div className="mt-6 flex items-center gap-x-6">
          <button
            onClick={loginWeb3Auth}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Connect Wallet
          </button>
        </div>
      )}
    </>
  );
};

export default AuthKitDemo;
