import React from 'react';
import { Button } from '@nextui-org/react';
import { twMerge } from "tailwind-merge";

interface ScanButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  scanBtnClassName?: string
}

const ScanButton: React.FC<ScanButtonProps> = ({ onClick, isLoading = false, scanBtnClassName }) => {
  return (
    <Button
      className={twMerge("h-12 rounded-full bg-aqua px-7 text-16 font-medium text-gray-950 shadow-1 transition-all duration-500 ease-linear", scanBtnClassName)}
      onClick={onClick}
      isLoading={isLoading}
    >
      Scan Page
    </Button>
  );
};

export default ScanButton;