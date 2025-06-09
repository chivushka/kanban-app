import * as React from 'react';

const inputWrapper = 'flex flex-col w-full';
const inputBaseStyles =
  'w-full p-2.5 text-sm font-normal text-white bg-graphite rounded-xl shadow-custom outline-none placeholder-gray autofill:shadow-[inset_0_0_0px_1000px_rgb(255,221,226)]';
const inputErrorStyles = 'border border-error focus:border-error';
const inputNormalStyles = 'border border-l_sakura focus:border-white';
const inputDisabledStyles = 'cursor-not-allowed bg-l_gray';
const errorTextStyles = 'text-error text-sm mt-2 text-left';
const labelStyles = 'mb-1 text-sm text-gray-700';

type InputProps = {
  id?: string;
  label?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  name?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  extraInputStyles?: string;
  extraWrapperStyles?: string;
};

const Input: React.FC<InputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  name,
  disabled = false,
  error,
  required = false,
  extraInputStyles = '',
  extraWrapperStyles = '',
}) => {
  const inputClassNames = [
    inputBaseStyles,
    error ? inputErrorStyles : inputNormalStyles,
    disabled ? inputDisabledStyles : '',
    extraInputStyles,
  ].join(' ');

  return (
    <div className={`${inputWrapper} ${extraWrapperStyles}`}>
      {label && (
        <label htmlFor={id} className={labelStyles}>
          {label}
        </label>
      )}
      <input
        id={id}
        data-testid={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClassNames}
        required={required}
      />
      {error && <span className={errorTextStyles}>{error}</span>}
    </div>
  );
};

export default Input;
