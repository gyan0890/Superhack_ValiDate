import { useCallback, useState } from 'react'
import { providers, utils } from 'ethers'

import AddressLabel from './AddressLabel'
import AmountLabel from './AmountLabel'
import getSafeInfo from '../../pages/api/getSafeInfo'
import useApi from '../../hooks/useApi'
import usePolling from '../../hooks/usePolling'
import { useAccountAbstraction } from '../store/accountAbstractionContext'

type SafeInfoProps = {
  safeAddress: string
  chainId: string
}

// TODO: ADD USDC LABEL
// TODO: ADD CHAIN LABEL

function SafeInfo({ safeAddress, chainId }: SafeInfoProps) {
  const { web3Provider, chain, safeBalance } = useAccountAbstraction()

  const [isDeployed, setIsDeployed] = useState<boolean>(false)
  const [isDeployLoading, setIsDeployLoading] = useState<boolean>(true)

  // detect if the safe is deployed with polling
  const detectSafeIsDeployed = useCallback(async () => {
    const isDeployed = await isContractAddress(safeAddress, web3Provider)

    setIsDeployed(isDeployed)
    setIsDeployLoading(false)
  }, [web3Provider, safeAddress])

  usePolling(detectSafeIsDeployed)

  // safe info from Safe transaction service (used to know the threshold & owners of the Safe if its deployed)
  const fetchInfo = useCallback(
    (signal: AbortSignal) => getSafeInfo(safeAddress, chainId, { signal }),
    [safeAddress, chainId]
  )

  const { data: safeInfo, isLoading: isGetSafeInfoLoading } = useApi(fetchInfo)

  const owners = safeInfo?.owners.length || 1
  const threshold = safeInfo?.threshold || 1
  const isLoading = isDeployLoading || isGetSafeInfoLoading

  return (
    <div>
      <div style={{ position: 'relative' }}>
        {/* Safe Logo */}
        {/* {isLoading ? (
          <p>Loding......</p>
        ) : (
          <img
            src={safeLogoDark}
            alt="connected Safe account logo"
            height="50px"
          />
        )} */}

        {/* Threshold & owners label */}
        {isDeployed && (
          <div>
            <p>
              {threshold}/{owners}
            </p>
          </div>
        )}
      </div>

      <div>
        {/* Safe address label */}
        <p className='flex'>
          <span className='pr-2'>Safe ID</span>
          <AddressLabel address={safeAddress} showBlockExplorerLink />
        </p>

        {isLoading && <p>Loding.....</p>}

        {/* {!isDeployed && !isDeployLoading && (
          <div>
            <p>
              Creation pending
            </p>
          </div>
        )} */}

        {/* {!isLoading && (
          <div>
            <p>
              <AmountLabel
                amount={utils.formatEther(safeBalance || '0')}
                tokenSymbol={chain?.token || ''}
              />
            </p>
          </div>
        )} */}
      </div>
    </div>
  )
}

export default SafeInfo


// TODO: create a util for this?
const isContractAddress = async (
  address: string,
  provider?: providers.Web3Provider
): Promise<boolean> => {
  try {
    const code = await provider?.getCode(address)

    return code !== '0x'
  } catch (error) {
    return false
  }
}
