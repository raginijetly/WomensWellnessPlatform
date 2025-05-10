import { FC } from "react";

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
    <label className="cursor-pointer bg-gray-100 rounded-lg p-3 hover:bg-gray-200 transition-colors">
      <input 
        type="checkbox" 
        className="hidden" 
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      <div className="flex items-center">
        <div className="w-5 h-5 border border-gray-300 rounded-md flex items-center justify-center mr-2">
          <div className={`w-3 h-3 bg-purple-500 rounded-sm ${checked ? 'block' : 'hidden'}`}></div>
        </div>
        <span>{condition}</span>
      </div>
    </label>
  );
};

export default HealthConditionCheckbox;
