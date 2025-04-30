import { createContext, useContext, useCallback } from 'react';
import { cn } from '../lib/ui/utils/cn';

interface FormContextValue {
  errors: Record<string, string>;
}

const FormContext = createContext<FormContextValue>({ errors: {} });

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  errors?: Record<string, string>;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function Form({
  children,
  className,
  errors = {},
  onSubmit,
  ...props
}: FormProps) {
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmit?.(e);
    },
    [onSubmit]
  );

  return (
    <FormContext.Provider value={{ errors }}>
      <form
        className={cn('space-y-4', className)}
        onSubmit={handleSubmit}
        {...props}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

interface FormFieldProps {
  name: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  name,
  label,
  children,
  className,
}: FormFieldProps) {
  const { errors } = useContext(FormContext);
  const error = errors[name];

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}