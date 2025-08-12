import React, { useState } from 'react';

interface NotificationToggleProps {
  id: string;
  label: string;
  description?: string;
  initialValue?: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export const NotificationToggle: React.FC<NotificationToggleProps> = ({
  id,
  label,
  description,
  initialValue = false,
  onChange,
  disabled = false
}) => {
  const [isEnabled, setIsEnabled] = useState(initialValue);

  const handleToggle = () => {
    if (disabled) return;

    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
      <div className="flex-1 min-w-0">
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={isEnabled}
        aria-labelledby={`${id}-label`}
        onClick={handleToggle}
        disabled={disabled}
        className={`
          relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2
          min-w-[44px] min-h-[44px] flex items-center justify-center
          ${isEnabled 
            ? 'bg-indigo-600 hover:bg-indigo-700' 
            : 'bg-gray-200 hover:bg-gray-300'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span className="sr-only">{label}</span>
        <div className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out
          ${isEnabled ? 'bg-indigo-600' : 'bg-gray-200'}
        `}>
          <span
            aria-hidden="true"
            className={`
              pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 
              transition duration-200 ease-in-out translate-y-0.5
              ${isEnabled ? 'translate-x-5' : 'translate-x-0.5'}
            `}
          />
        </div>
      </button>
    </div>
  );
};