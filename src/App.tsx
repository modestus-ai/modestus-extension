// import RedditScan from "./pages/RedditScan";
import XScan from "./pages/XScan";
import "./App.css";
import Header from "./components/Header";
import SamplePolicies from "./pages/SamplePolicies";
// import ScanButton from "./components/ScanButton";
import { Image } from "@nextui-org/react";
import { magicWandIcon } from "./assets/icons";
import { useState } from "react";
import { SAMPLE_POLICIES } from "./constants/moderate";
import { ModerationState, PolicyItem } from "./types/moderate.types";

function App() {
  const [moderation, setModeration] = useState<ModerationState>({
    policies: SAMPLE_POLICIES,
    results: {},
  });

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
          <XScan policies={moderation.policies} />
          <div className="flex items-center gap-2">
            <Image src={magicWandIcon} />
            <span className="text-12 text-gray-400">https://x.com/</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
