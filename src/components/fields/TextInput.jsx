function TextInput({
    label,
    name,
    id,
    value,
    onChange,
    maxLength,
    onBlur,
    placeholder,
    disabled,
    error,
    textTransform = "none", // default to no transformation
    type = "text"
}) {
    const transformClass = {
        capitalize: "capitalize",
        uppercase: "uppercase",
        none: "normal-case",
    }[textTransform] || "normal-case";

    return (
        <div className="mb-0">
            <label
                htmlFor={id}
                className="block text-sm font-semibold mb-1 italic text-gray-700 "
            >
                {label}
            </label>
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                autoComplete="off"
                autoCorrect="off"
                disabled={disabled || false}
                maxLength={maxLength || "25"}
                placeholder={placeholder}
                className={`w-full border px-3 py-2 rounded focus:outline-none border-green-200 shadow-sm focus:border-green-500 italic font-semibold text-gray-900  ${transformClass} placeholder:normal-case ${disabled ? "bg-gray-200" : ""}`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
export default TextInput;
