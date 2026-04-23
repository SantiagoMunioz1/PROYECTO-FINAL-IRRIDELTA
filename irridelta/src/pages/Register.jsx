import React, { useEffect, useState } from "react";
import { AlertCircle, BadgeCheck, UserRoundPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSessionStore } from "../store/sessionStore";
import { getDefaultPathByRole, getUserRole } from "../utils/authRoles";

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

function getRegisterErrorFeedback(type, message) {
  if (type === "full_name") {
    return {
      title: "Nombre incompleto",
      description:
        "Ingresa tu nombre completo para completar el registro de manera correcta.",
    };
  }

  if (type === "phone") {
    return {
      title: "Número de celular inválido",
      description:
        "Revisa tu número de celular e intenta nuevamente. Debe contener al menos 8 dígitos.",
    };
  }

  if (type === "password_length") {
    return {
      title: "La contraseña es demasiado corta",
      description:
        "Tu contraseña debe tener al menos 6 caracteres para poder crear la cuenta.",
    };
  }

  if (type === "password_mismatch") {
    return {
      title: "Las contraseñas no coinciden",
      description:
        "Revisa ambos campos y asegúrate de ingresar exactamente la misma contraseña.",
    };
  }

  if (type === "already_registered") {
    return {
      title: "Esta cuenta ya existe",
      description:
        "Ya hay un usuario registrado con ese email. Inicia sesión o utiliza la opción de recupero de contraseña.",
    };
  }

  return {
    title: "No pudimos completar el registro",
    description:
      message ||
      "Ocurrió un problema al crear tu cuenta. Intenta nuevamente en unos instantes.",
  };
}

function Register() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorFeedback, setErrorFeedback] = useState(null);
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const user = useSessionStore((state) => state.user);
  const role = useSessionStore((state) => state.role);
  const isLoading = useSessionStore((state) => state.isLoading);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate(getDefaultPathByRole(role), { replace: true });
    }
  }, [isLoading, navigate, role, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorFeedback(null);

    if (fullName.trim().length < 3) {
      setErrorFeedback(getRegisterErrorFeedback("full_name"));
      return;
    }

    const digitsOnlyPhone = phone.replace(/\D/g, "");
    if (digitsOnlyPhone.length < 8) {
      setErrorFeedback(getRegisterErrorFeedback("phone"));
      return;
    }

    if (password.length < 6) {
      setErrorFeedback(getRegisterErrorFeedback("password_length"));
      return;
    }

    if (password !== confirmPassword) {
      setErrorFeedback(getRegisterErrorFeedback("password_mismatch"));
      return;
    }

    try {
      setIsSubmitting(true);

      const authData = await signUp({
        email,
        password,
        metadata: {
          full_name: fullName.trim(),
          phone: phone.trim(),
        },
      });

      if (!authData.session) {
        setPendingConfirmationEmail(email.trim());
        return;
      }

      const authenticatedUser = authData.user ?? authData.session?.user ?? null;
      const authenticatedRole = getUserRole(authenticatedUser);

      navigate(getDefaultPathByRole(authenticatedRole), {
        replace: true,
        state: {
          welcomeModal: {
            title: "Usuario creado con éxito",
            description:
              "Tu cuenta ya está lista. Bienvenido a Irridelta, vamos a acompañarte en cada proyecto.",
          },
        },
      });
    } catch (authError) {
      const rawMessage = String(authError?.message || "").toLowerCase();
      if (rawMessage.includes("already registered")) {
        setErrorFeedback(getRegisterErrorFeedback("already_registered"));
      } else {
        setErrorFeedback(
          getRegisterErrorFeedback("generic", authError?.message)
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pendingConfirmationEmail) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-16">
        <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-green-700 to-green-500 px-8 py-10 text-white">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
              <BadgeCheck className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold">
              Revisa tu correo
            </h2>
            <p className="mt-3 text-center text-sm text-green-50 sm:text-base">
              Enviamos un enlace de confirmación a{" "}
              <span className="font-semibold">
                {maskEmail(pendingConfirmationEmail)}
              </span>{" "}
              para activar tu cuenta.
            </p>
          </div>

          <div className="px-8 py-8">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm leading-6 text-gray-600">
              <p>
                Una vez confirmada tu cuenta, podrás iniciar sesión con tu email
                y contraseña.
              </p>
              <p className="mt-3">
                Si no encuentras el mensaje, revisa tu carpeta de spam o correo
                no deseado.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="flex-1 rounded-xl bg-green-600 px-6 py-3 text-center text-sm font-semibold text-white transition duration-200 hover:bg-green-700"
              >
                Ir al login
              </Link>

              <button
                type="button"
                onClick={() => {
                  setPendingConfirmationEmail("");
                  setErrorFeedback(null);
                }}
                className="flex-1 rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition duration-200 hover:bg-gray-100"
              >
                Usar otro correo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-50 py-16">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
            <UserRoundPlus className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Crear cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Completa tus datos para registrarte en Irridelta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errorFeedback && (
            <div
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-900 shadow-sm"
              role="alert"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-red-100 p-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold">{errorFeedback.title}</p>
                  <p className="mt-1 text-sm leading-6 text-red-800">
                    {errorFeedback.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre completo
            </label>
            <input
              type="text"
              placeholder="Nombre y apellido"
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de celular
            </label>
            <input
              type="tel"
              placeholder="Ej. 11 2345 6789"
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Repetir contraseña
            </label>
            <input
              type="password"
              placeholder="********"
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition duration-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link className="font-semibold text-green-700 underline" to="/login">
              Iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
