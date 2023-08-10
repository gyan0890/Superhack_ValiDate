import AddressLabel from "./AddressLabel";
import { useAccountAbstraction } from "../store/accountAbstractionContext";

// TODO: rename this to connected owner?
function ConnectedWalletLabel() {
  const { isAuthenticated, ownerAddress, logoutWeb3Auth } = useAccountAbstraction();

  if (!isAuthenticated) {
    // TODO: ADD NO CONNECTED WALLET LABEL
    return null;
  }

  return (
    <div>
      <div>
        {ownerAddress && (
          <AddressLabel address={ownerAddress} showBlockExplorerLink />
        )}
      </div>

      {/* logout button */}
      <button onClick={logoutWeb3Auth}>Logout</button>
    </div>
  );
}

export default ConnectedWalletLabel;
