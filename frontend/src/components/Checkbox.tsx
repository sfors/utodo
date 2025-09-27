import * as RCheckbox from "@radix-ui/react-checkbox";
import {Check} from "lucide-react";

interface CheckboxProps {
  id?: string;
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = ({label, id, checked, onCheckedChange}: CheckboxProps) => {
  return (
    <div className="flex items-center">
      <RCheckbox.Root
        className="cursor-pointer bg-black/30 hover:bg-black/50 w-6 h-6 rounded-sm flex items-center justify-center"
        checked={checked}
        onCheckedChange={onCheckedChange}
        id={id}>
        <RCheckbox.Indicator className="text-white">
          <Check size={18}/>
        </RCheckbox.Indicator>
      </RCheckbox.Root>
      {label && (
        <label
          className="pl-2 leading-none text-white"
          htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;