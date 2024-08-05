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
}

export interface LoadingResponse {
  type: "LOADING_STATUS";
  isLoading: boolean;
}

export interface ModerationResponse {
  type: "UPDATE_MODERATION";
  moderation: ModerationState;
}

export interface AutoScanResponse {
  type: "UPDATE_AUTO_SCAN";
  autoScan: boolean;
}

export interface ScanAction {
  action: "START_SCAN";
  moderation: ModerationState;
  querySelector: string;
}

export type MessageTypes = ModerationResponse | AutoScanResponse;
