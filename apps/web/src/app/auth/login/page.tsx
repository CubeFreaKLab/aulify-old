"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { AuthDivider } from "../../../components/auth/AuthDivider";
import { AuthInput } from "../../../components/auth/AuthInput";
import { AuthSplitLayout } from "../../../components/auth/AuthSplitLayout";
import { SocialLoginButton } from "../../../components/auth/SocialLoginButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [shakeKeys, setShakeKeys] = useState({ email: 0, password: 0 });

  function validateEmail(value: string) {
    if (!value.trim()) {
      return "El correo electrónico es obligatorio.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Ingresa un correo electrónico válido.";
    }

    return "";
  }

  function validatePassword(value: string) {
    if (!value) {
      return "La contraseña es obligatoria.";
    }

    if (value.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }

    return "";
  }

  function updateEmail(value: string) {
    setEmail(value);

    if (hasSubmitted || touched.email) {
      setErrors((currentErrors) => ({ ...currentErrors, email: validateEmail(value) }));
    }
  }

  function updatePassword(value: string) {
    setPassword(value);

    if (hasSubmitted || touched.password) {
      setErrors((currentErrors) => ({ ...currentErrors, password: validatePassword(value) }));
    }
  }

  function validateEmailOnBlur() {
    const emailError = validateEmail(email);
    setTouched((currentTouched) => ({ ...currentTouched, email: true }));
    setErrors((currentErrors) => ({ ...currentErrors, email: emailError }));

    if (emailError) {
      setShakeKeys((currentKeys) => ({ ...currentKeys, email: currentKeys.email + 1 }));
    }
  }

  function validatePasswordOnBlur() {
    const passwordError = validatePassword(password);
    setTouched((currentTouched) => ({ ...currentTouched, password: true }));
    setErrors((currentErrors) => ({ ...currentErrors, password: passwordError }));

    if (passwordError) {
      setShakeKeys((currentKeys) => ({ ...currentKeys, password: currentKeys.password + 1 }));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);

    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password)
    };

    setErrors(nextErrors);
    setTouched({ email: true, password: true });
    setShakeKeys((currentKeys) => ({
      email: nextErrors.email ? currentKeys.email + 1 : currentKeys.email,
      password: nextErrors.password ? currentKeys.password + 1 : currentKeys.password
    }));

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    router.push("/teacher/dashboard");
  }

  return (
    <AuthSplitLayout>
      <div className="w-full max-w-[520px]">
        <div className="mb-9 text-center">
          <h1 className="m-0 text-[48px] font-extrabold leading-[1.03] text-neutral-black sm:text-[60px] xl:text-[70px]">
            Inicia sesión
            <br />
            en Aulify
          </h1>
          <p className="mt-7 text-[20px] font-medium leading-normal text-neutral-black">
            ¿No tienes una cuenta?{" "}
            <Link href="/auth/register" className="text-brand-green underline decoration-brand-green underline-offset-4">
              Crear cuenta
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <AuthInput
            label="Correo electrónico"
            type="email"
            required
            autoComplete="email"
            value={email}
            error={errors.email}
            shakeKey={shakeKeys.email}
            onBlur={validateEmailOnBlur}
            onChange={(event) => updateEmail(event.target.value)}
          />
          <AuthInput
            label="Contraseña"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            error={errors.password}
            shakeKey={shakeKeys.password}
            onBlur={validatePasswordOnBlur}
            onChange={(event) => updatePassword(event.target.value)}
          />

          <Link href="#" className="mt-2 w-fit text-[20px] font-medium text-brand-green">
            ¿Olvidaste tu contraseña?
          </Link>

          <button
            type="submit"
            className="mt-6 h-[78px] w-full rounded-full bg-brand-green px-8 text-[24px] font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
          >
            Iniciar sesión
          </button>

          <div className="my-5">
            <AuthDivider />
          </div>

          <SocialLoginButton>Continuar con Google</SocialLoginButton>

          <p className="mt-8 text-[16px] font-medium leading-[1.65] text-neutral-darkGray">
            Al iniciar sesión, aceptas nuestros{" "}
            <Link href="#" className="text-brand-green">
              Términos de uso
            </Link>{" "}
            y nuestra{" "}
            <Link href="#" className="text-brand-green">
              Política de privacidad.
            </Link>
          </p>
        </form>
      </div>
    </AuthSplitLayout>
  );
}
