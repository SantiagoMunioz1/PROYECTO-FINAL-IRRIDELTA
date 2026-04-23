import React, { useState } from "react";
import { AlertCircle, ArrowLeft, MailCheck, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function maskEmail(email) {
  const [localPart, domain = ""] = email.split("@");

  if (!localPart || !domain) {
    return email;
  }

  if (localPart.length <= 2) {
    return `${localPart[0] || ""}***@${domain}`;
  }

  return `${localPart.slice(0, 2)}***${localPart.slice(-1)}@${domain}`;
}

function getForgotPasswordErrorFeedback(message) {
  if (String(message || "").trim() === "") {
    return {
      title: "No pudimos enviar el enlace",
      description:
        "Ocurrió un problema al iniciar el recupero de contraseña. Intenta nuevamente en unos instantes.",
    };
  }

  return {
    title: "No pudimos enviar el enlace",
    description: message,
  };
}

function ForgotPassword() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email ?? "");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [errorFeedback, setErrorFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorFeedback(null);

    if (!email.trim()) {
      setErrorFeedback({
        title: "Ingresa tu email",
        description:
          "Necesitamos tu email para enviarte el enlace de recuperación.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPassword(email.trim());
      setSubmittedEmail(email.trim());
    } catch (authError) {
      setErrorFeedback(getForgotPasswordErrorFeedback(authError.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedEmail) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-16 lg:px-8">
        <div className="w-full max-w-4xl overflow-hidden rounded-[2.25rem] bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-green-700 to-green-500 px-8 py-12 text-white sm:px-10 lg:px-14 lg:py-14">
            <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-white/15">
              <MailCheck className="h-9 w-9" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold sm:text-4xl">
              Revisa tu correo
            </h2>
            <p className="mt-4 text-center text-base text-green-50 sm:text-lg">
              Si existe una cuenta asociada a{" "}
              <span className="font-semibold">{maskEmail(submittedEmail)}</span>,
              ya enviamos un enlace para restablecer la contraseña.
            </p>
          </div>

          <div className="px-8 py-8 sm:px-10 lg:px-14 lg:py-10">
            <div className="grid gap-4 rounded-3xl border border-gray-200 bg-gray-50 p-6 text-base leading-7 text-gray-600 sm:p-7">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-green-600" />
                <p>
                  Por seguridad, no confirmamos si el email pertenece o no a una
                  cuenta registrada.
                </p>
              </div>
              <p>
                El enlace puede tardar unos minutos en llegar. Si no lo ves,
                revisa tu carpeta de spam o correo no deseado.
              </p>
              <p>
                Usa siempre el correo más reciente que hayas recibido para evitar
                problemas con enlaces anteriores.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="flex-1 rounded-2xl bg-green-600 px-6 py-4 text-center text-base font-semibold text-white transition duration-200 hover:bg-green-700"
              >
                Ir al login
              </Link>

              <button
                type="button"
                onClick={() => {
                  setSubmittedEmail("");
                  setErrorFeedback(null);
                }}
                className="flex-1 rounded-2xl border border-gray-300 px-6 py-4 text-base font-semibold text-gray-700 transition duration-200 hover:bg-gray-100"
              >
                Enviar a otro correo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-16 lg:px-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2.25rem] bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-8 py-12 text-white sm:px-10 lg:px-14 lg:py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-300 sm:text-base">
            Recuperación de acceso
          </p>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            ¿Olvidaste tu contraseña?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            Ingresa tu email y te enviaremos un enlace seguro para crear una nueva
            contraseña.
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
                  Email
                </label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="mt-2 block w-full rounded-2xl border border-gray-300 px-4 py-4 text-base shadow-sm focus:border-green-500 focus:ring-green-500"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-green-600 py-4 text-base font-semibold text-white transition duration-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
              >
                {isSubmitting ? "Enviando enlace..." : "Enviar enlace de recuperación"}
              </button>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-base font-semibold text-slate-700 underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al login
              </Link>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 lg:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-base">
              Qué sucederá
            </h3>
            <ol className="mt-6 space-y-5 text-base leading-7 text-slate-600">
              <li>1. Te enviaremos un enlace de recuperación a tu correo.</li>
              <li>2. Abrirás ese enlace para definir una nueva contraseña.</li>
              <li>3. Te recomendamos usar el correo más reciente recibido.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
