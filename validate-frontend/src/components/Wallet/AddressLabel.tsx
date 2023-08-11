import useMemoizedAddressLabel from "../../hooks/useMemoizedAddressLabel";
import { useAccountAbstraction } from "../store/accountAbstractionContext";

type AddressLabelProps = {
  address: string;
  isTransactionAddress?: boolean;
  showBlockExplorerLink?: boolean;
  showCopyIntoClipboardButton?: boolean;
};

const AddressLabel = ({
  address,
  isTransactionAddress,
  showBlockExplorerLink,
  showCopyIntoClipboardButton = true,
}: AddressLabelProps) => {
  const { chain } = useAccountAbstraction();

  const addressLabel = useMemoizedAddressLabel(address);

  const blockExplorerLink = `${chain?.blockExplorerUrl}/${
    isTransactionAddress ? "tx" : "address"
  }/${address}`;

  return (
    <div>
      <span className="text-sm font-semibold leading-6 text-gray-900">{addressLabel}</span>

      {/* {showBlockExplorerLink && blockExplorerLink && (
        <a href={blockExplorerLink} target="_blank" rel="noopener">
          Explorer
        </a>
      )} */}
    </div>
  );
};

export default AddressLabel;
