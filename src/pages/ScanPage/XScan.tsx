import ScanButton from "../../components/ScanButton";
import { checkContentAndPolicies } from "../../helpers/moderateHelper";
import useContentScanner from "../../hooks/useContentScanner";
import { ModerationState } from "../../types/moderate.types";

type Props = {
  moderation: ModerationState;
  setModeration: React.Dispatch<React.SetStateAction<ModerationState>>;
};

const XScan = ({ moderation, setModeration }: Props) => {
  const { scanPage, isLoading } = useContentScanner(
    '[data-testid="tweetText"]',
  );

  const handleScanPage = async () => {
    const { data, hasError } = checkContentAndPolicies(moderation);
    if (hasError) {
      setModeration((prevState: ModerationState) => ({
        ...prevState,
        ...data,
      }));
      return true;
    }

    await scanPage(moderation);
  };

  return (
    <ScanButton
      onClick={handleScanPage}
      isLoading={isLoading}
      isDisabled={!moderation.policies.length}
    />
  );
};

export default XScan;
