import ConnectedWalletLabel from './Wallet/ConnectedWalletLabel'
import SafeInfo from './Wallet/SafeInfo'
import { useAccountAbstraction } from './store/accountAbstractionContext'

const AuthKitDemo = () => {
  const { loginWeb3Auth, isAuthenticated, safeSelected, chainId } = useAccountAbstraction()

  return (
    <>
      {/* Auth Demo */}
      <p>Interactive demo</p>

      {isAuthenticated ? (
        <div>
          {/* safe Account */}
          <div>
            {/* Safe Info */}
            {safeSelected && <SafeInfo safeAddress={safeSelected} chainId={chainId} />}
          </div>

          {/* owner ID */}
          <div>
            <p>Owner ID</p>
            {/* Owner details */}
            <ConnectedWalletLabel />
          </div>
        </div>
      ) : (
        <div>
          <p>Create a safe using the Auth Kit</p>

          <button onClick={loginWeb3Auth}>Connect</button>
        </div>
      )}
    </>
  )
}

export default AuthKitDemo
