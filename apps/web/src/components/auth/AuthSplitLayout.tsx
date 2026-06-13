import Image from "next/image";
import type { ReactNode } from "react";
import { AuthCloseButton } from "./AuthCloseButton";

type AuthSplitLayoutProps = {
  children: ReactNode;
};

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <main className="relative grid min-h-[100svh] place-items-center bg-neutral-white px-8 py-8 text-neutral-black sm:px-10 lg:px-12">
      <AuthCloseButton />
      <div className="grid w-full max-w-[1340px] items-center gap-16 lg:grid-cols-[1fr_1fr] xl:gap-24">
        <div className="flex min-h-[420px] select-none items-center justify-center overflow-hidden bg-transparent sm:min-h-[560px] lg:min-h-[700px]">
          <Image
            src="/assets/illustrations/auth/student-login.svg"
            alt="Estudiante con cuaderno"
            width={657}
            height={937}
            priority
            draggable={false}
            onDragStart={(event) => event.preventDefault()}
            className="h-auto max-h-[790px] w-full max-w-[690px] select-none object-contain lg:h-full lg:w-auto lg:max-w-full"
          />
        </div>
        <div className="flex items-center justify-center">{children}</div>
      </div>
    </main>
  );
}
