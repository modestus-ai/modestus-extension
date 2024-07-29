// @ts-nocheck
import { useEffect, useState } from "react";
import "./App.css";
import { TinyColor } from "@ctrl/tinycolor";
import axios from "axios";
import { getChunks, newUUID } from "./utils/common";
import {
  NEGATIVE_MODERATION_ARRAY,
  POSITIVE_MODERATION_ARRAY,
} from "./constants/moderate";
import { Button } from "@nextui-org/react";
import { twMerge } from "tailwind-merge";
import RedditScan from "./pages/RedditScan";

function App() {
  return (
    <div className="w-[300px] h-[400px] flex items-center justify-center border border-aqua">
     <RedditScan />
    </div>
  );
}

export default App;
