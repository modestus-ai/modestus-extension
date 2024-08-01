import ScanButton from "../../components/ScanButton";
import { LoadingResponse, ModerationState } from "../../types/moderate.types";
import { checkContentAndPolicies } from "../../helpers/moderateHelper";
import { useEffect, useState } from "react";

type Props = {
  moderation: ModerationState;
  setModeration: React.Dispatch<React.SetStateAction<ModerationState>>;
};

const ContentScanner = ({ moderation, setModeration }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message: LoadingResponse) => {
      if (message.type === "LOADING_STATUS") {
        setIsLoading(message.isLoading);
      }
    });
  }, []);

  const handleScanPage = async () => {
    const { data, hasError } = checkContentAndPolicies(moderation);
    if (hasError) {
      setModeration((prevState) => ({
        ...prevState,
        ...data,
      }));
      return true;
    }

    setIsLoading(true);
    chrome.runtime.sendMessage({
      type: "UPDATE_MODERATION",
      moderation,
    });
  };

  return (
    <ScanButton
      onClick={handleScanPage}
      isLoading={isLoading}
      isDisabled={!moderation.policies.length}
    />
  );
};

export default ContentScanner;
