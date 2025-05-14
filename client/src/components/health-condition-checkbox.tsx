import { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface HealthConditionCheckboxProps {
  condition: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const HealthConditionCheckbox: FC<HealthConditionCheckboxProps> = ({
  condition,
  checked,
  onCheckedChange,
}) => {
  return (
    <div className="flex items-center space-x-3 mb-2 border rounded-md p-2.5 sm:p-3 cursor-pointer transition-colors 
      hover:bg-gray-50">
      <div className="flex-none flex items-center">
        <Checkbox
          id={`condition-${condition}`}
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
      </div>
      <Label
        htmlFor={`condition-${condition}`}
        className="text-xs sm:text-sm font-medium leading-normal flex items-center min-h-[2rem] cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {condition}
      </Label>
    </div>
  );
};

export default HealthConditionCheckbox;