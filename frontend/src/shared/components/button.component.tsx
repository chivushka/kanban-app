import * as React from 'react';
import Loader from './loader.component';

type ButtonVariant = 'sakura' | 'white' | 'transparent';

type ButtonProps = {
  id?: string;
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  extraButtonStyles?: string;
  icon?: React.ReactNode;
  variant?: ButtonVariant;
};

const Button: React.FC<ButtonProps> = ({
  id,
  text,
  type = 'button',
  onClick,
  loading,
  disabled,
  extraButtonStyles = '',
  icon,
  variant = 'sakura',
}) => {
  const isDisabled = Boolean(loading ?? disabled);

  const handleClick = (): void => {
    if (isDisabled) return;
    onClick?.();
  };

  const variantStyles: Record<ButtonVariant, string> = {
    sakura: `
      bg-sakura text-black border
      hover:bg-black hover:text-l_sakura hover:border-l_sakura
      focus:outline-none
    `,
    white: `
      bg-white text-black border border-black
      hover:bg-black hover:text-white hover:border-white
      focus:outline-none
    `,
    transparent: `
      bg-transparent text-sakura hover:text-l_sakura
      focus:outline-none 
    `,
  };

  return (
    <button
      id={id}
      data-testid={id}
      type={type}
      disabled={isDisabled}
      onClick={handleClick}
      className={`
        px-4 py-2 text-sm font-poppins rounded-lg
        disabled:bg-gray disabled:text-white disabled:cursor-not-allowed 
        disabled:hover:border-gray disabled:border-gray
        flex justify-center items-center whitespace-nowrap select-none 
        ${variantStyles[variant]}
        ${extraButtonStyles}
      `}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          {icon && (
            <span className={`flex items-center ${text ? 'mr-1' : ''}`}>
              {icon}
            </span>
          )}
          <span>{text}</span>
        </>
      )}
    </button>
  );
};

export default Button;
