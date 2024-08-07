import { useLayoutEffect, useState } from "react";
import { modestusLogo } from "../../assets/icons";

const OnlySupportModal = () => {
  const [isUrlSupport, setIsUrlSupport] = useState<boolean>(true);

  useLayoutEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      tabs.forEach((tab) => {
        if (!tab.url?.includes("x.com")) {
          setIsUrlSupport(false);
        }
      });
    });
  }, []);

  return !isUrlSupport ? (
    <div className="fixed inset-0 z-10 bg-[#12131A52] backdrop-blur">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-gray-800 bg-gray-950 px-6 py-10">
          <img src={modestusLogo} className="h-7 w-10" />
          <div className="space-y-2">
            <h5 className="text-center text-14 font-medium text-white">
              Welcome to Modestus
            </h5>
            <p className="max-w-[205px] text-center text-12 text-gray-400">
              The current version of Modestus supports scanning only on{" "}
              <span className="text-white">x.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default OnlySupportModal;
