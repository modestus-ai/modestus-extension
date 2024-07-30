import { Input } from "@nextui-org/react";
import { twMerge } from "tailwind-merge";
import { PolicyItem } from "../../types/moderate.types";
import { useCallback } from "react";
import { ERROR_MESSAGES } from "../../constants/moderate";
import { CloseFilledIcon } from "../../components/Icons/CloseIcon";
import { CheckFilledIcon } from "../../components/Icons/CheckIcon";

type Props = {
  policies: PolicyItem[];
  handleUpdatePolicies: (newPolicies: PolicyItem[]) => void;
};

const SamplePolicies = ({ policies, handleUpdatePolicies }: Props) => {
  // const onAddPolicySample = (policiesSample: PolicyItem[]) => {
  //   const existingPolicyLabels = new Set(
  //     Object.values(POLICIES_SAMPLE).flatMap((policyGroup) =>
  //       policyGroup.map((policy: PolicyItem) => policy.label),
  //     ),
  //   );

  //   const newPolicies = policies.filter(
  //     (policy) => !existingPolicyLabels.has(policy.label),
  //   );

  //   const updatedPolicies = [
  //     ...policiesSample.filter((policy) =>
  //       existingPolicyLabels.has(policy.label),
  //     ),
  //     ...newPolicies,
  //   ];

  //   handleUpdatePolicies(updatedPolicies);
  // };

  const updatePolicy = (policy: any, changes: any) => ({
    ...policy,
    ...changes,
  });

  const onPolicyChange = useCallback(
    (key: string, value: string | boolean, policyIdx: number) => {
      const newPolicies = policies.map((policy: PolicyItem, index) => {
        let errorMsg = "";
        if (index === policyIdx && policy.errorMsg) {
          if (!policy.newLabel) {
            errorMsg = ERROR_MESSAGES.policy_name;
          } else if (!policy.newValue) {
            errorMsg = ERROR_MESSAGES.policy_description;
          } else if (policy.isEdit) {
            errorMsg = ERROR_MESSAGES.policy_not_saved;
          } else {
            errorMsg = "";
          }
        }
        return index === policyIdx
          ? updatePolicy(policy, {
              isEdit: true,
              isFocus: false,
              errorMsg,
              [key]: value,
            })
          : policy;
      });
      handleUpdatePolicies(newPolicies);
    },
    [policies, handleUpdatePolicies],
  );

  const onSavePolicy = (policyIdx: number) => {
    const newPolicies = policies.map((policy: PolicyItem, index) =>
      index === policyIdx
        ? updatePolicy(policy, {
            isEdit: false,
            isFocus: false,
            errorMsg: "",
            label: policy.newLabel,
            value: policy.newValue,
          })
        : policy,
    );
    handleUpdatePolicies(newPolicies);
  };

  const onResetPolicy = (policyIdx: number) => {
    const newPolicies = policies.map((policy: PolicyItem, index) => {
      return index === policyIdx
        ? updatePolicy(policy, {
            isEdit: false,
            errorMsg: "",
            newLabel: policy.label,
            newValue: policy.value,
          })
        : policy;
    });
    handleUpdatePolicies(newPolicies);
  };

  const onAddNewPolicy = () => {
    const newPolicy = {
      label: "",
      value: "",
      newLabel: "",
      newValue: "",
      isEdit: false,
      isFocus: true,
      errorMsg: "",
    };
    handleUpdatePolicies([...policies, newPolicy]);
  };

  const onDeletePolicy = (policyIdx: number) => {
    const newPolicies = policies.filter((_, index) => index !== policyIdx);
    handleUpdatePolicies(newPolicies);
  };

  return (
    <div className="flex-1 space-y-6">
      <div>
        <h6 className="text-10 font-medium text-gray-400">SAMPLE POLICIES</h6>
      </div>
      <div className="space-y-3">
        {policies.map((policy, index) => (
          <div
            key={index}
            className={twMerge(
              "space-y-2 rounded-xl bg-divider p-4",
              policy.errorMsg &&
                "border-error-500 transition-all duration-300 ease-linear",
            )}
          >
            <div className="flex items-center justify-between">
              <Input
                classNames={{
                  inputWrapper:
                    "!bg-transparent pl-0 min-h-5 h-5 group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0",
                  input: "placeholder:text-gray-400 !text-white text-[12px]",
                }}
                placeholder="Policy name"
                value={policy.newLabel}
                onValueChange={(value) =>
                  onPolicyChange("newLabel", value, index)
                }
                autoFocus={policy.isFocus}
                onKeyUp={(e) => e.key === "Enter" && onSavePolicy(index)}
              />
              <div className="flex items-center gap-1">
                <div
                  className="hover:effect-scale cursor-pointer p-1"
                  onClick={() => {
                    if (!policy.isEdit) {
                      return onDeletePolicy(index);
                    }
                    onResetPolicy(index);
                  }}
                >
                  <CloseFilledIcon />
                </div>
                <div
                  className={twMerge(
                    "hover:effect-scale cursor-pointer p-1",
                    !policy.isEdit && "hidden",
                  )}
                  onClick={() => onSavePolicy(index)}
                >
                  <CheckFilledIcon />
                </div>
              </div>
            </div>
            <Input
              classNames={{
                inputWrapper:
                  "!bg-transparent pl-0 min-h-4 h-4 group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0",
                input: "placeholder:text-gray-400 !text-gray-400 text-[12px]",
              }}
              placeholder="Add description..."
              value={policy.newValue}
              onValueChange={(value) =>
                onPolicyChange("newValue", value, index)
              }
              onKeyUp={(e) => e.key === "Enter" && onSavePolicy(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SamplePolicies;
