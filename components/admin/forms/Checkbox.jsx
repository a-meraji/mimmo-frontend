export default function Checkbox({ 
  label, 
  name, 
  checked, 
  onChange, 
  disabled = false,
  error,
  ...props 
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="w-5 h-5 rounded border-gray-300 text-primary
                   focus:ring-2 focus:ring-primary/50
                   disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        />
        {label && (
          <span className="text-sm font-medium text-gray-700 select-none">
            {label}
          </span>
        )}
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

