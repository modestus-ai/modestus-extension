import { Image } from "@nextui-org/react";
import { magicWandIcon } from "../../assets/icons";
import { useLayoutEffect, useState } from "react";

const CurrentUrl = () => {
  const [currentUrl, setCurrentUrl] = useState("");

  useLayoutEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.url) {
          const newUrl = tab.url.split("?");
          setCurrentUrl(newUrl[0]);
        }
      });
    });
  }, []);

  return (
    <div className="flex items-center justify-center gap-2">
      <Image src={magicWandIcon} className="max-w-none flex-1" />
      <div className="max-w-[280px]">
        <div className="line-clamp-1 text-12 text-gray-400">{currentUrl}</div>
      </div>
    </div>
  );
};

export default CurrentUrl;
