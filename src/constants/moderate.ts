import { ModerationState } from "../types/moderate.types";

export const POSITIVE_MODERATION_ARRAY = ["joy"];
// , "Surprise"];
export const NEGATIVE_MODERATION_ARRAY = ["unsafe"];
// , "Sadness", "Fear", "Disgust"];

const createSamplePoliciesItem = (label: string, value: string) => ({
  label,
  value,
  newLabel: label,
  newValue: value,
  isEdit: false,
  isFocus: false,
  errorMsg: "",
});

export const SAMPLE_POLICIES = [
  createSamplePoliciesItem(
    "Scam",
    "Indicates frustration, irritation, of rage.",
  ),
  createSamplePoliciesItem(
    "Spam",
    "Indicates frustration, irritation, of rage.",
  ),
  createSamplePoliciesItem(
    "Toxicity",
    "A rude, disrespectful, or unreasonable comment that is likely to make people leave a discussion",
  ),
];

export const ERROR_MESSAGES = {
  policy_name: "Policy name cannot be empty.",
  policy_description: "Policy description cannot be empty.",
  policy_not_saved: "Policy has not been saved.",
};

export const URLS_SCAN: any = {
  "x.com": '[data-testid="tweetText"]',
  "reddit.com": '[slot="comment"]',
};

export const SCAN_PAGE_STATUS = {
  LOADING_STATUS: "LOADING_STATUS",
  UPDATE_MODERATION: "UPDATE_MODERATION",
  START_SCAN: "START_SCAN",
};
