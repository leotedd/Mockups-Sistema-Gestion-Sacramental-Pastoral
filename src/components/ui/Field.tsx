import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";
import { AlertCircle } from "lucide-react";

interface BaseProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
}

function Wrapper({
  label,
  required,
  error,
  hint,
  className = "",
  children,
}: BaseProps & { children: ReactNode }) {
  return (
    <div className={`field ${error ? "field--error" : ""} ${className}`}>
      <label className="field__label">
        {label}
        {required && <span className="req">*</span>}
      </label>
      {children}
      {hint && !error && <span className="small muted">{hint}</span>}
      {error && (
        <span className="field__error">
          <AlertCircle size={12} /> {error}
        </span>
      )}
    </div>
  );
}

export function TextField({
  label,
  required,
  error,
  hint,
  className,
  ...rest
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrapper label={label} required={required} error={error} hint={hint} className={className}>
      <input className="input" {...rest} />
    </Wrapper>
  );
}

export function SelectField({
  label,
  required,
  error,
  hint,
  className,
  children,
  ...rest
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrapper label={label} required={required} error={error} hint={hint} className={className}>
      <select className="select" {...rest}>
        {children}
      </select>
    </Wrapper>
  );
}

export function TextAreaField({
  label,
  required,
  error,
  hint,
  className,
  ...rest
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrapper label={label} required={required} error={error} hint={hint} className={className}>
      <textarea className="textarea" {...rest} />
    </Wrapper>
  );
}
