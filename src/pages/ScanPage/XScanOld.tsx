import ScanButton from "../../components/ScanButton";
import { checkContentAndPolicies } from "../../helpers/moderateHelper";
import useContentScanner from "../../hooks/useContentScanner";
import { ModerationState } from "../../types/moderate.types";
import { v4 as uuidv4 } from "uuid";

type Props = {
  moderation: ModerationState;
  setModeration: React.Dispatch<React.SetStateAction<ModerationState>>;
};

const XScanOld = ({ moderation, setModeration }: Props) => {
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

    await scanPage(uuidv4(), moderation);
  };

  return (
    <ScanButton
      onClick={handleScanPage}
      isLoading={isLoading}
      isDisabled={!moderation.policies.length}
    />
  );
};

export default XScanOld;
