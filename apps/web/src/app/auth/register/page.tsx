"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { AuthDivider } from "../../../components/auth/AuthDivider";
import { AuthInput } from "../../../components/auth/AuthInput";
import { AuthRoleSelector, type AuthRole } from "../../../components/auth/AuthRoleSelector";
import { AuthSplitLayout } from "../../../components/auth/AuthSplitLayout";
import { SocialLoginButton } from "../../../components/auth/SocialLoginButton";
import { getDashboardPathForSession, getMockSession, setMockSession } from "../../../lib/mockAuth";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<AuthRole>("teacher");
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [shakeKeys, setShakeKeys] = useState({
    fullName: 0,
    email: 0,
    password: 0,
    confirmPassword: 0
  });

  useEffect(() => {
    const session = getMockSession();

    if (session) {
      router.replace(getDashboardPathForSession(session));
    }
  }, [router]);

  function validateFullName(value: string) {
    return value.trim() ? "" : "Ingresa tu nombre completo.";
  }

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Ingresa un correo electrónico válido.";
  }

  function validatePassword(value: string) {
    return value.length >= 8 ? "" : "La contraseña debe tener al menos 8 caracteres.";
  }

  function validateConfirmPassword(value: string, passwordValue = password) {
    return value && value === passwordValue ? "" : "Las contraseñas no coinciden.";
  }

  function validateForm() {
    return {
      fullName: validateFullName(fullName),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword)
    };
  }

  function updateField(field: "fullName" | "email" | "password" | "confirmPassword", value: string) {
    if (field === "fullName") {
      setFullName(value);
    }

    if (field === "email") {
      setEmail(value);
    }

    if (field === "password") {
      setPassword(value);
    }

    if (field === "confirmPassword") {
      setConfirmPassword(value);
    }

    if (hasSubmitted || touched[field]) {
      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };

        if (field === "fullName") {
          nextErrors.fullName = validateFullName(value);
        }

        if (field === "email") {
          nextErrors.email = validateEmail(value);
        }

        if (field === "password") {
          nextErrors.password = validatePassword(value);
          nextErrors.confirmPassword = validateConfirmPassword(confirmPassword, value);
        }

        if (field === "confirmPassword") {
          nextErrors.confirmPassword = validateConfirmPassword(value);
        }

        return nextErrors;
      });
    }
  }

  function validateFieldOnBlur(field: "fullName" | "email" | "password" | "confirmPassword") {
    const nextErrors = validateForm();
    const fieldError = nextErrors[field];

    setTouched((currentTouched) => ({ ...currentTouched, [field]: true }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: fieldError }));

    if (fieldError) {
      setShakeKeys((currentKeys) => ({ ...currentKeys, [field]: currentKeys[field] + 1 }));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);

    const nextErrors = validateForm();

    setErrors(nextErrors);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true
    });
    setShakeKeys((currentKeys) => ({
      fullName: nextErrors.fullName ? currentKeys.fullName + 1 : currentKeys.fullName,
      email: nextErrors.email ? currentKeys.email + 1 : currentKeys.email,
      password: nextErrors.password ? currentKeys.password + 1 : currentKeys.password,
      confirmPassword: nextErrors.confirmPassword ? currentKeys.confirmPassword + 1 : currentKeys.confirmPassword
    }));

    if (nextErrors.fullName || nextErrors.email || nextErrors.password || nextErrors.confirmPassword) {
      return;
    }

    const session = setMockSession({
      email,
      name: fullName,
      role
    });

    router.push(getDashboardPathForSession(session));
  }

  return (
    <AuthSplitLayout>
      <div className="w-full max-w-[520px]">
        <div className="mb-9 text-center">
          <h1 className="m-0 text-[48px] font-extrabold leading-[1.03] text-neutral-black sm:text-[60px] xl:text-[70px]">
            Crea tu cuenta
            <br />
            en Aulify
          </h1>
          <p className="mt-7 text-[20px] font-medium leading-normal text-neutral-black">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/auth/login" className="text-brand-green underline decoration-brand-green underline-offset-4">
              Iniciar sesión
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <AuthInput
            label="Nombre completo"
            type="text"
            required
            autoComplete="name"
            value={fullName}
            error={errors.fullName}
            shakeKey={shakeKeys.fullName}
            onBlur={() => validateFieldOnBlur("fullName")}
            onChange={(event) => updateField("fullName", event.target.value)}
          />
          <AuthInput
            label="Correo electrónico"
            type="email"
            required
            autoComplete="email"
            value={email}
            error={errors.email}
            shakeKey={shakeKeys.email}
            onBlur={() => validateFieldOnBlur("email")}
            onChange={(event) => updateField("email", event.target.value)}
          />
          <AuthInput
            label="Contraseña"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            error={errors.password}
            shakeKey={shakeKeys.password}
            onBlur={() => validateFieldOnBlur("password")}
            onChange={(event) => updateField("password", event.target.value)}
          />
          <AuthInput
            label="Confirmar contraseña"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            error={errors.confirmPassword}
            shakeKey={shakeKeys.confirmPassword}
            onBlur={() => validateFieldOnBlur("confirmPassword")}
            onChange={(event) => updateField("confirmPassword", event.target.value)}
          />

          <AuthRoleSelector value={role} onChange={setRole} />

          <button
            type="submit"
            className="mt-4 h-[78px] w-full rounded-full bg-brand-green px-8 text-[24px] font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
          >
            Crear cuenta
          </button>

          <div className="my-4">
            <AuthDivider />
          </div>

          <SocialLoginButton>Continuar con Google</SocialLoginButton>

          <p className="mt-7 text-[16px] font-medium leading-[1.65] text-neutral-darkGray">
            Al crear una cuenta, aceptas nuestros{" "}
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
