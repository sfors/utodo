import React from "react";

interface ButtonProps {
  onClick?: () => void;
  onFocus?: () => void;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

const Checkbox = ({onClick, onFocus, fullWidth, children}: ButtonProps) => {
  return (
    <button className={`rounded-sm cursor-pointer hover:bg-black/20 transition-colors${fullWidth ? " w-full" : ""}`}
            onClick={onClick}
            onFocus={onFocus}>
      {children}
    </button>
  );
};

export default Checkbox;