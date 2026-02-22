import React, { useRef } from 'react';

const DateInput = ({ label, name, id, value, onChange, disabled, onBlur, placeholder, error, min, max }) => {
    const inputRef = useRef(null);

    const handleWrapperClick = () => {
        if (inputRef.current) {
            inputRef.current.showPicker?.(); // For modern browsers
            inputRef.current.focus();         // Fallback
        }
    };

    //helper function
    const get18YearsAgo = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return date.toISOString().split('T')[0];
};

    return (
        <div className="flex flex-col" onClick={handleWrapperClick}>
            <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700 ">
                {label}
            </label>
            <input
                ref={inputRef}
                type="date"
                name={name}
                id={id}
                value={value}
                max={max}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled || false}
                placeholder={placeholder}
                min={min}
                className={`w-full border px-3 py-2 rounded focus:outline-none border-green-200 shadow-sm focus:border-green-500 italic font-semibold text-gray-800  ${disabled ? "bg-gray-200" : ""}`}
            />
            {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
        </div>
    );
};

export default DateInput;
