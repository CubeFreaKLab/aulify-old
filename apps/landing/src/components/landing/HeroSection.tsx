import { appLinks } from "../../lib/appLinks";

export function HeroSection() {
  return (
    <section id="inicio" className="px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:px-10 lg:pb-20 lg:pt-14 xl:px-12">
      <div className="mx-auto grid w-full max-w-[1480px] items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 xl:gap-12">
        <div className="min-w-0 max-w-[700px] lg:pt-2">
          <h1 className="m-0 text-[3rem] font-extrabold leading-[0.95] tracking-normal text-neutral-black sm:text-[5rem] lg:text-[4.9rem] xl:text-[5.85rem] 2xl:text-[6.2rem]">
            <span className="block xl:whitespace-nowrap">El aula digital,</span>
            <span className="block xl:whitespace-nowrap">más simple e</span>
            <span className="block text-brand-green">interactiva.</span>
          </h1>

          <p className="mt-7 max-w-[620px] text-lg font-medium leading-8 text-neutral-darkGray lg:text-xl lg:leading-9">
            Aulify ayuda a profesores y estudiantes a organizar clases, escribir notas, asignar tareas y crear actividades
            interactivas en un solo lugar.
          </p>

          <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <a
              className="inline-flex min-h-[60px] w-full items-center justify-center rounded-[16px] border border-brand-green bg-brand-green px-8 text-base font-semibold text-neutral-white shadow-card transition-colors duration-base hover:bg-neutral-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green sm:w-auto"
              href={appLinks.register}
            >
              Crear cuenta
            </a>
            <a
              className="inline-flex min-h-[60px] w-full items-center justify-center gap-3 rounded-[16px] border border-neutral-black bg-neutral-white px-6 text-base font-semibold text-neutral-black shadow-soft transition-colors duration-base hover:border-brand-green hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green sm:w-auto"
              href="#como-funciona"
            >
              <svg className="size-7" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <circle cx="14" cy="14" r="11.25" stroke="currentColor" strokeWidth="2.25" />
                <path d="M11.5 9.75L19 14L11.5 18.25V9.75Z" stroke="currentColor" strokeWidth="2.25" strokeLinejoin="round" />
              </svg>
              Ver cómo funciona
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full min-w-0 max-w-full justify-self-center sm:max-w-[760px] lg:max-w-none lg:justify-self-end">
          <img
            className="h-auto w-full select-none lg:w-[112%] lg:max-w-none lg:-translate-x-[5%] xl:w-[116%]"
            src="/assets/illustrations/home/hero-classroom.svg"
            alt="Profesor y estudiantes usando Aulify en clase"
            width="1706"
            height="922"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
