import { useState } from "react";

const TextPassword = ({ 
  label, 
  value, 
  onChange, 
  onBlur, 
  placeholder, 
  error, 
  name, 
  disabled = false 
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col mb-4">
      {label && <label className="mb-1">{label}</label>}
      <div className="relative">
        <input
          type={show ? "text" : "password"} // toggle masking
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`border p-2 rounded w-full ${error ? "border-red-500" : "border-gray-300"}`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-2 top-2 text-blue-600 text-sm"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};

export default TextPassword;
