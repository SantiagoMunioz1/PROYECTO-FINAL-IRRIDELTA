import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSessionStore } from "../store/sessionStore";
import { getDefaultPathByRole } from "../utils/authRoles";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updatePassword } = useAuth();
  const session = useSessionStore((state) => state.session);
  const role = useSessionStore((state) => state.role);
  const isLoading = useSessionStore((state) => state.isLoading);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password.length < 6) {
      setError("La nueva contrasena debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contrasenas no coinciden.");
      return;
    }

    try {
      setIsSubmitting(true);
      await updatePassword(password);
      setSuccessMessage("Contrasena actualizada. Redirigiendo...");

      window.setTimeout(() => {
        navigate(getDefaultPathByRole(role), { replace: true });
      }, 1200);
    } catch (authError) {
      setError(authError.message || "No se pudo actualizar la contrasena.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-50 py-16">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-800">
          Recuperar contrasena
        </h2>

        {isLoading && (
          <p className="text-center text-sm text-gray-600">Validando enlace...</p>
        )}

        {!isLoading && !session && (
          <div className="space-y-4 text-center">
            <p className="rounded border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              El enlace de recupero es invalido o ya expiro. Solicita uno nuevo
              desde el login.
            </p>
            <Link className="text-sm font-semibold text-green-700 underline" to="/login">
              Volver al login
            </Link>
          </div>
        )}

        {!isLoading && session && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div
                className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}

            {successMessage && (
              <div
                className="rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
                role="status"
              >
                {successMessage}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nueva contrasena
              </label>
              <input
                type="password"
                placeholder="********"
                className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Repetir contrasena
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
              {isSubmitting ? "Actualizando..." : "Guardar nueva contrasena"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
