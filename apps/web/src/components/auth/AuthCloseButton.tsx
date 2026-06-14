const landingBaseUrl = (process.env.NEXT_PUBLIC_LANDING_URL || "http://127.0.0.1:5174").replace(/\/$/, "");

export function AuthCloseButton() {
  return (
    <a
      href={landingBaseUrl}
      aria-label="Volver al inicio"
      className="absolute right-8 top-8 z-20 flex h-16 w-16 items-center justify-center transition-opacity duration-base hover:opacity-80 focus:outline-none active:opacity-100 sm:right-10 sm:top-10 lg:right-12 lg:top-12"
    >
      <img
        src="/assets/illustrations/auth/auth-close.svg"
        alt=""
        aria-hidden="true"
        className="h-12 w-12 select-none"
        draggable={false}
      />
    </a>
  );
}
