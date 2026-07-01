import { ReactNode, ButtonHTMLAttributes } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'accent' | 'ghost';
  fullWidth?: boolean;
}

export function PrimaryButton({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled = false,
  ...props
}: PrimaryButtonProps) {
  const baseClasses = "px-6 py-3 rounded-[50px] font-medium transition-all duration-250 min-h-[48px] cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: disabled
      ? "bg-[#20A83E]/40 text-white/70 cursor-not-allowed shadow-none"
      : "bg-[#20A83E] text-white hover:bg-[#146B27] active:bg-[#0f5220] shadow-md hover:shadow-lg focus:ring-[#20A83E]",
    accent: disabled
      ? "bg-[#146B27]/40 text-white/70 cursor-not-allowed shadow-none"
      : "bg-[#146B27] text-white hover:bg-[#0f5220] active:bg-[#0a3d18] shadow-md hover:shadow-lg focus:ring-[#146B27]",
    ghost: disabled
      ? "bg-transparent border-2 border-[#20A83E]/40 text-[#20A83E]/40 cursor-not-allowed"
      : "bg-transparent border-2 border-[#20A83E] text-[#20A83E] hover:bg-[#20A83E]/5 active:bg-[#20A83E]/10 focus:ring-[#20A83E]"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
