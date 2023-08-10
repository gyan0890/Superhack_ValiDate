import useMemoizedAmountLabel from '../../hooks/useMemoizedAmountLabel'

type AmountLabelType = {
  amount: string
  tokenSymbol: string
  decimalsDisplayed?: number
}

function AmountLabel({ amount, tokenSymbol, decimalsDisplayed }: AmountLabelType) {
  const amountLabel = useMemoizedAmountLabel(amount, tokenSymbol, decimalsDisplayed)

  return (
    <>
      <span>{amountLabel}</span>
    </>
  )
}

export default AmountLabel
