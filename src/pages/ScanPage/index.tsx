import { useEffect, useState } from "react";
import { ModerationState, PolicyItem } from "../../types/moderate.types";
import { SAMPLE_POLICIES } from "../../constants/moderate";
import Header from "../../components/Header";
import SamplePolicies from "./SamplePolicies";
import ContentScanner from "./ContentScanner";
import CurrentUrl from "./CurrentUrl";

const ScanPage = () => {
  const [moderation, setModeration] = useState<ModerationState>({
    policies: SAMPLE_POLICIES,
  });

  useEffect(() => {
    chrome.storage.local.get("moderation", (res) => {
      if (res["moderation"]) {
        setModeration(res["moderation"]);
      }
    });
  }, []);

  const handleUpdatePolicies = (newPolicies: PolicyItem[]) => {
    setModeration((prevState) => ({
      ...prevState,
      policies: newPolicies,
    }));
  };

  return (
    <div className="flex min-h-[518px] w-[360px] flex-col">
      <Header />
      <div className="flex h-full flex-1 flex-col justify-between gap-6 p-6">
        <SamplePolicies
          policies={moderation.policies}
          handleUpdatePolicies={handleUpdatePolicies}
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <ContentScanner
            moderation={moderation}
            setModeration={setModeration}
          />
          <CurrentUrl />
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
