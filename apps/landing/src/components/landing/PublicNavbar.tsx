const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Producto", href: "#producto" },
  { label: "Notas", href: "#notas" },
  { label: "Cómo funciona", href: "#como-funciona" }
];

export function PublicNavbar() {
  return (
    <header className="px-5 pt-5 sm:px-8 sm:pt-7 lg:px-10 xl:px-12">
      <nav
        className="mx-auto grid w-full max-w-[1480px] grid-cols-1 items-center gap-4 sm:grid-cols-[auto_1fr] lg:grid-cols-[1fr_auto_1fr] lg:gap-6"
        aria-label="Navegación principal"
      >
        <a className="flex shrink-0 items-center justify-self-center select-none sm:justify-self-start" href="#inicio" aria-label="Aulify inicio">
          <img
            className="h-11 w-auto select-none sm:h-12 lg:h-[52px]"
            src="/assets/logos/aulify-logo.svg"
            alt="Aulify"
            width="866"
            height="288"
            draggable={false}
          />
        </a>

        <div className="order-3 grid w-full min-w-0 grid-cols-2 items-center gap-1 rounded-[16px] border border-neutral-lightGray bg-neutral-white p-1 text-center text-sm font-semibold text-neutral-black sm:col-span-2 sm:flex sm:w-auto sm:justify-center sm:justify-self-center sm:overflow-x-auto lg:order-none lg:col-span-1 lg:col-start-2 lg:row-start-1">
          {navLinks.map((link) => (
            <a
              className="shrink-0 rounded-[12px] px-4 py-2.5 transition-colors duration-base hover:bg-neutral-offWhite hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="order-2 flex w-full min-w-0 items-center justify-center gap-2 sm:col-start-2 sm:row-start-1 sm:w-auto sm:justify-self-end sm:gap-3 lg:order-none lg:col-start-3">
          <a
            className="min-w-0 flex-1 rounded-[14px] border border-neutral-black bg-neutral-white px-4 py-2.5 text-center text-sm font-semibold text-neutral-black shadow-soft transition-colors duration-base hover:border-brand-green hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green sm:flex-none sm:px-5 sm:py-3"
            href="https://app.aulify.org/auth/login"
          >
            Iniciar sesión
          </a>
          <a
            className="min-w-0 flex-1 rounded-[14px] border border-brand-green bg-brand-green px-4 py-2.5 text-center text-sm font-semibold text-neutral-white shadow-card transition-colors duration-base hover:bg-neutral-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green sm:flex-none sm:px-5 sm:py-3"
            href="https://app.aulify.org/auth/register"
          >
            Crear cuenta
          </a>
        </div>
      </nav>
    </header>
  );
}
