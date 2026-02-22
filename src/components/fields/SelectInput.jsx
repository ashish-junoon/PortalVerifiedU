// fields/SelectInput.jsx
function SelectInput({ label, name, id, value, onChange, disabled, onBlur, options, error }) {
    return (
        <div className="mb-4">
            <label
                htmlFor={id}
                className="block text-sm font-semibold mb-1 italic text-gray-700 "
            >
                {label}
            </label>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled || false}
                className={`w-full border px-3 py-2 rounded focus:outline-none border-green-200 shadow-sm focus:border-green-500 italic font-semibold text-gray-800 
                    ${disabled ? "bg-gray-200" : ""}`}
            >
                <option className=" " value="">Select an option</option>
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        className=" "
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

export default SelectInput;
