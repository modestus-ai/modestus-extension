export interface PolicyItem {
  label: string;
  value: string;
  newLabel: string;
  newValue: string;
  isEdit: boolean;
  isFocus: boolean;
  errorMsg: string;
}

export interface ModerationState {
  policies: PolicyItem[];
  results: {
    [key: string]: {
      reasoning: string;
      result: number;
    };
  };
}
