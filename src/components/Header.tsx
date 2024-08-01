import ModestusLogo from "./ModestusLogo";
import { Image, Link } from "@nextui-org/react";
import { arrowTopRightIcon } from "../assets/icons";

const Header = () => {
  return (
    <div className="h-14 border-b border-b-[#191D26] px-6 py-4">
      <div className="flex items-center justify-between gap-2">
        <ModestusLogo />
        <Link
          href="https://modestus.web.app/play-ground"
          target="_blank"
          className="flex h-fit max-h-6 items-center gap-[5px] rounded-2xl border-[1.5px] border-gray-700 px-3 py-[10px]"
        >
          <span className="text-[8px] font-semibold text-gray-500">
            PLAYGROUND
          </span>
          <Image src={arrowTopRightIcon} alt="arrow top right icon" />
        </Link>
      </div>
    </div>
  );
};

export default Header;
