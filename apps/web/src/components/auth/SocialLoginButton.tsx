import type { ButtonHTMLAttributes } from "react";

type SocialLoginButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function SocialLoginButton({ children, ...props }: SocialLoginButtonProps) {
  return (
    <button
      type="button"
      className="flex h-[78px] w-full items-center justify-center gap-5 rounded-full border border-neutral-lightGray bg-neutral-white px-8 text-[20px] font-bold text-neutral-black transition-colors duration-base hover:bg-neutral-offWhite focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-neutral-white"
      {...props}
    >
      <span className="text-[34px] font-extrabold leading-none text-neutral-black" aria-hidden="true">
        G
      </span>
      <span>{children}</span>
    </button>
  );
}
