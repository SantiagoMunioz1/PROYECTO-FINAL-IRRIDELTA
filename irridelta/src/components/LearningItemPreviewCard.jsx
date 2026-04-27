import React from "react";
import { RESOURCE_TYPES } from "../services/learningContentService";
import { useSessionStore } from "../store/sessionStore";
import { Lock } from "lucide-react";

function LearningItemPreviewCard({ item, showPublishedDate = true, userProgress = [] }) {
  const user = useSessionStore((state) => state.user);
  const role = useSessionStore((state) => state.role);

  if (!item) {
    return null;
  }

  return (
    <article className="rounded-2xl bg-white p-6 shadow-md">
      <div className="mb-3">
        <h2 className="text-2xl font-bold text-gray-900">{item.titulo}</h2>
      </div>

      {item.descripcion && (
        <p className="mb-5 text-sm leading-6 text-gray-600">{item.descripcion}</p>
      )}

      {item.modulos?.length > 0 && (
        <div className="space-y-4">
          {item.modulos.map((module, moduleIndex) => {
            const isFirstModule = moduleIndex === 0;
            const previousModuleId = !isFirstModule ? item.modulos[moduleIndex - 1]?.id : null;
            const isPreviousCompleted = isFirstModule || userProgress.some(p => p.modulo_id === previousModuleId && p.aprobado);
            const isLocked = role !== 'admin' && !isFirstModule && !isPreviousCompleted;

            return (
              <section
                key={module.id ?? `${item.id}-module-${moduleIndex}`}
                className={`rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 ${
                  isLocked ? "opacity-60 grayscale pointer-events-none select-none" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-green-700">
                      Modulo {moduleIndex + 1}
                      {isLocked && <Lock className="h-3 w-3" />}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-gray-900">
                      {module.titulo}
                    </h3>
                    {module.descripcion && (
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {module.descripcion}
                      </p>
                    )}
                  </div>
                </div>

                {module.recursos?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {module.recursos.map((resource, resourceIndex) => {
                      const isFile = resource.tipo === RESOURCE_TYPES.ARCHIVO;
                      const href = isFile
                        ? resource.archivo_url
                        : resource.youtube_url;
                      const label = isFile
                        ? resource.archivo_nombre ?? "Abrir archivo"
                        : "Ver YouTube";

                      if (!href) {
                        return null;
                      }

                      return (
                        <a
                          key={resource.id ?? `${module.id ?? moduleIndex}-${resourceIndex}`}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-700 shadow-sm"
                        >
                          {label}
                        </a>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {showPublishedDate && item.created_at && (
        <p className="mt-5 text-xs text-gray-400">
          {`Publicado el ${new Date(item.created_at).toLocaleDateString("es-AR")}`}
        </p>
      )}
    </article>
  );
}

export default LearningItemPreviewCard;