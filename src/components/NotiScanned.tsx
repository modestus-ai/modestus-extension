import React, { useEffect, useState } from "react";
import { checkIcon } from "../assets/icons";
import { LoadingResponse } from "../types/moderate.types";
import { SCAN_PAGE_STATUS } from "../constants/moderate";
import { twMerge } from "tailwind-merge";

const NotiScanned = () => {
  const [isScanned, setIsScanned] = useState<boolean>(false);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message: LoadingResponse) => {
      if (message.type === SCAN_PAGE_STATUS.LOADING_STATUS) {
        setIsScanned(message.isScanned);
      }
    });
  }, []);

  useEffect(() => {
    if (isScanned) {
      setTimeout(() => {
        setIsScanned(false);
      }, 1000);
    }
  }, [isScanned]);

  return (
    <div
      className={twMerge(
        "absolute -top-12 left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out",
        isScanned && "top-12",
      )}
    >
      <div className="flex items-center rounded-full bg-[#64D5E4] px-2 py-1">
        <img src={checkIcon} />
        <span className="text-[14px] font-medium text-black">Scanned</span>
      </div>
    </div>
  );
};

export default NotiScanned;
