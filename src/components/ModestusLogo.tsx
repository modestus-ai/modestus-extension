import { Image } from "@nextui-org/react";
import { modestusLogo } from "../assets/icons";

const ModestusLogo = () => {
  return (
    <div
      className="flex cursor-pointer items-center gap-[10px]"
      // onClick={() => router.push("/")}
    >
      <Image
        src={modestusLogo}
        alt="modestus logo"
        className="max-w-none rounded-none"
      />
      <span className="text-20 font-medium text-[#E9FBFB]">Modestus</span>
    </div>
  );
};

export default ModestusLogo;
