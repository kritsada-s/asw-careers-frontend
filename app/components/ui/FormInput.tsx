import { FormField } from "@/lib/form";
import { ApplicationFormData } from "@/lib/form";

interface FormInputProps {
  label: string;
  name: keyof ApplicationFormData;  // This ensures name is a valid form field
  value: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  updateField: (field: keyof ApplicationFormData, value: any) => void;
  markFieldTouched: (field: keyof ApplicationFormData) => void;
  isFieldTouched: (field: keyof ApplicationFormData) => boolean;
}

const CustomFormInput: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  type = 'text',
  required = false,
  disabled = false,
  updateField,
  markFieldTouched,
  isFieldTouched
}: FormInputProps) => {
  const hasError = required && isFieldTouched(name) && !value;

  return (
    <div className="space-y-1">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <input
        id={name}
        type={type}
        value={value || ''}
        onChange={(e) => updateField(name, e.target.value)}
        onBlur={() => markFieldTouched(name)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-md 
          ${hasError 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-colors
        `}
      />
      
      {hasError && (
        <p className="text-red-500 text-sm mt-1">
          {label} is required
        </p>
      )}
    </div>
  );
}

export default CustomFormInput
