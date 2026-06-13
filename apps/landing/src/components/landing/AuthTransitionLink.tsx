"use client";

import { useEffect, useRef, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";

type AuthTransitionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
};

export function AuthTransitionLink({ children, href, onClick, ...props }: AuthTransitionLinkProps) {
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    setIsLoading(true);
    timerRef.current = window.setTimeout(() => {
      window.location.assign(href);
    }, 450);
  }

  return (
    <>
      <a href={href} onClick={handleClick} {...props}>
        {children}
      </a>
      {isLoading ? (
        <div
          aria-busy="true"
          aria-live="polite"
          className="fixed inset-0 z-50 grid place-items-center bg-neutral-white"
        >
          <div className="h-12 w-12 animate-spin rounded-full border-[4px] border-neutral-black border-t-transparent" />
        </div>
      ) : null}
    </>
  );
}
