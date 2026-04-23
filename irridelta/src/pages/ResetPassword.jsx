import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  RefreshCcw,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSessionStore } from "../store/sessionStore";

function getResetPasswordErrorFeedback(type, message) {
  if (type === "min_length") {
    return {
      title: "La contraseña es demasiado corta",
      description:
        "Tu nueva contraseña debe tener al menos 6 caracteres para poder continuar.",
    };
  }

  if (type === "mismatch") {
    return {
      title: "Las contraseñas no coinciden",
      description:
        "Revisa ambos campos y asegúrate de ingresar exactamente la misma contraseña en los dos.",
    };
  }

  return {
    title: "No pudimos actualizar la contraseña",
    description:
      message ||
      "Ocurrió un problema al actualizar tu contraseña. Intenta nuevamente en unos instantes.",
  };
}

function getLinkIssueFeedback(errorCode, description) {
  if (errorCode === "otp_expired") {
    return {
      title: "El enlace expiró",
      description:
        "Por seguridad, el enlace de recuperación ya venció. Solicita uno nuevo para continuar.",
    };
  }

  if (errorCode === "access_denied") {
    return {
      title: "No pudimos validar el enlace",
      description:
        description ||
        "El enlace no es válido o ya fue utilizado anteriormente. Solicita uno nuevo para continuar.",
    };
  }

  return {
    title: "Este enlace ya no es válido",
    description:
      description ||
      "El enlace de recuperación no corresponde a una solicitud activa o ya no puede utilizarse.",
  };
}

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorFeedback, setErrorFeedback] = useState(null);
  const [successState, setSuccessState] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updatePassword } = useAuth();
  const session = useSessionStore((state) => state.session);
  const isLoading = useSessionStore((state) => state.isLoading);
  const location = useLocation();
  const navigate = useNavigate();

  const linkIssue = useMemo(() => {
    const hashParams = new URLSearchParams(location.hash.replace(/^#/, ""));
    const searchParams = new URLSearchParams(location.search);
    const errorCode =
      hashParams.get("error_code") ||
      hashParams.get("error") ||
      searchParams.get("error_code") ||
      searchParams.get("error");
    const description =
      hashParams.get("error_description") ||
      searchParams.get("error_description") ||
      "";

    if (!errorCode) {
      return null;
    }

    return getLinkIssueFeedback(errorCode, description.replace(/\+/g, " "));
  }, [location.hash, location.search]);

  useEffect(() => {
    if (!successState) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      navigate("/login", { replace: true });
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [navigate, successState]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorFeedback(null);

    if (password.length < 6) {
      setErrorFeedback(getResetPasswordErrorFeedback("min_length"));
      return;
    }

    if (password !== confirmPassword) {
      setErrorFeedback(getResetPasswordErrorFeedback("mismatch"));
      return;
    }

    try {
      setIsSubmitting(true);
      await updatePassword(password);
      setSuccessState(true);
    } catch (authError) {
      setErrorFeedback(
        getResetPasswordErrorFeedback("generic", authError.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (linkIssue || (!isLoading && !session)) {
    const issueFeedback =
      linkIssue ||
      getLinkIssueFeedback(
        "access_denied",
        "El enlace no es válido o la sesión temporal ya no está disponible."
      );

    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-16 lg:px-8">
        <div className="w-full max-w-4xl overflow-hidden rounded-[2.25rem] bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-12 text-white sm:px-10 lg:px-14 lg:py-14">
            <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-white/15">
              <AlertTriangle className="h-9 w-9" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold sm:text-4xl">
              {issueFeedback.title}
            </h2>
            <p className="mt-4 text-center text-base text-orange-50 sm:text-lg">
              {issueFeedback.description}
            </p>
          </div>

          <div className="px-8 py-8 sm:px-10 lg:px-14 lg:py-10">
            <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6 text-base leading-7 text-slate-700 sm:p-7">
              <p>
                Por seguridad, los enlaces para restablecer la contraseña tienen
                una validez limitada y solo pueden utilizarse dentro del flujo de
                recuperación correspondiente.
              </p>
              <p className="mt-3">
                Te recomendamos solicitar un nuevo enlace y utilizar siempre el
                correo más reciente que hayas recibido.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/olvide-contraseña"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-4 text-base font-semibold text-white transition duration-200 hover:bg-green-700"
              >
                <RefreshCcw className="h-4 w-4" />
                Solicitar nuevo enlace
              </Link>

              <Link
                to="/login"
                className="flex-1 rounded-2xl border border-slate-300 px-6 py-4 text-center text-base font-semibold text-slate-700 transition duration-200 hover:bg-slate-100"
              >
                Volver al login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (successState) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-16 lg:px-8">
        <div className="w-full max-w-3xl overflow-hidden rounded-[2.25rem] bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-green-700 to-green-500 px-8 py-12 text-white sm:px-10 lg:px-14 lg:py-14">
            <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-white/15">
              <BadgeCheck className="h-9 w-9" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold sm:text-4xl">
              Contraseña actualizada
            </h2>
            <p className="mt-4 text-center text-base text-green-50 sm:text-lg">
              Tu nueva contraseña ya quedó guardada correctamente.
            </p>
          </div>

          <div className="px-8 py-8 sm:px-10 lg:px-14 lg:py-10">
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-base leading-7 text-gray-600 sm:p-7">
              <p>
                En unos segundos te redirigiremos al login para que vuelvas a
                ingresar con tus nuevas credenciales.
              </p>
            </div>

            <div className="mt-8">
              <Link
                to="/login"
                className="block rounded-2xl bg-green-600 px-6 py-4 text-center text-base font-semibold text-white transition duration-200 hover:bg-green-700"
              >
                Ir al login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasMinLength = password.length >= 6;
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-16 lg:px-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2.25rem] bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-8 py-12 text-white sm:px-10 lg:px-14 lg:py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-300 sm:text-base">
            Seguridad de acceso
          </p>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Crear nueva contraseña
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            Elige una contraseña nueva para proteger tu cuenta y continuar con el
            acceso.
          </p>
        </div>

        <div className="grid gap-8 px-8 py-8 sm:px-10 lg:grid-cols-[1.35fr_0.9fr] lg:px-14 lg:py-12">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorFeedback && (
                <div
                  className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900 shadow-sm"
                  role="alert"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-red-100 p-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        {errorFeedback.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-red-800">
                        {errorFeedback.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-base font-medium text-gray-700">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="mt-2 block w-full rounded-2xl border border-gray-300 px-4 py-4 text-base shadow-sm focus:border-green-500 focus:ring-green-500"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700">
                  Repetir contraseña
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="mt-2 block w-full rounded-2xl border border-gray-300 px-4 py-4 text-base shadow-sm focus:border-green-500 focus:ring-green-500"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-green-600 py-4 text-base font-semibold text-white transition duration-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
              >
                {isSubmitting ? "Actualizando..." : "Guardar nueva contraseña"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 lg:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-base">
              Requisitos
            </h3>

            <div className="mt-6 space-y-5 text-base leading-7 text-slate-600">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className={`mt-0.5 h-5 w-5 ${hasMinLength ? "text-green-600" : "text-slate-300"}`}
                />
                <p>Debe contener al menos 6 caracteres.</p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  className={`mt-0.5 h-5 w-5 ${passwordsMatch ? "text-green-600" : "text-slate-300"}`}
                />
                <p>Ambos campos deben coincidir exactamente.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
