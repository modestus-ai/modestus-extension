import { useEffect, useState } from "react";
import { LoadingResponse } from "../types/moderate.types";
import { SCAN_PAGE_STATUS } from "../constants/moderate";
import { twMerge } from "tailwind-merge";

const NotiScanError = () => {
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message: LoadingResponse) => {
      if (message.type === SCAN_PAGE_STATUS.LOADING_STATUS) {
        setIsError(message.isError ? true : false);
      }
    });
  }, []);

  useEffect(() => {
    if (isError) {
      setTimeout(() => {
        setIsError(false);
      }, 1000);
    }
  }, [isError]);

  return (
    <div
      className={twMerge(
        "absolute -top-12 left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out",
        isError && "top-12",
      )}
    >
      <div className="flex items-center rounded-full bg-red-400 px-2 py-1">
        <span className="text-[14px] font-medium text-black">Scan error!</span>
      </div>
    </div>
  );
};

export default NotiScanError;
