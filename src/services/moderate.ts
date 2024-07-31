import { ENDPOINTS } from "../configs/apiEndpoints";
import { convertPoliciesArrayToObject } from "../helpers/moderateHelper";
import { PolicyItem } from "../types/moderate.types";
import { v4 as uuidv4 } from "uuid";

const API_KEY = "e9c3185e-d0d8-49ba-a3da-9d2b4947c15a";

export const postModerate = async ({
  content,
  policies,
}: {
  content: string;
  policies: PolicyItem[];
}) => {
  const response = await fetch(ENDPOINTS.moderate, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "moev-api-key": API_KEY,
    },
    body: JSON.stringify({
      request_id: uuidv4(),
      content,
      metrics: convertPoliciesArrayToObject(policies),
    }),
  });

  if (response.ok) {
    const data = await response.json();
    return data.result;
  } else {
    console.error("Error submitting moderation:", response.status);
    return null;
  }
};
