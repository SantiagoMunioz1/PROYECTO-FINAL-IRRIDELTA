import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import {
  Award,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ExternalLink,
  FileText,
  PlayCircle,
} from "lucide-react";
import YouTubePlayer from "../components/YouTubePlayer";
import {
  fetchLearningItemById,
  RESOURCE_TYPES,
} from "../services/learningContentService";
import {
  fetchUserLearningProgress,
  getCompletedResourceIds,
  isCapacitacionCompleted,
  isModuleUnlocked,
  isResourceUnlocked,
  markResourceAsCompleted,
} from "../services/learningProgressService";
import styles from "./CapacitacionDetalle.module.css";

function getResourceHref(resource) {
  if (resource.tipo === RESOURCE_TYPES.ARCHIVO) {
    return resource.archivo_url;
  }

  if (resource.tipo === RESOURCE_TYPES.YOUTUBE) {
    return resource.youtube_url;
  }

  return null;
}

function getResourceLabel(resource) {
  if (resource.tipo === RESOURCE_TYPES.ARCHIVO) {
    return resource.archivo_nombre || resource.titulo || "Abrir archivo";
  }

  return resource.titulo || "Ver YouTube";
}

function CapacitacionDetalle() {
  const { capacitacionId } = useParams();
  const [capacitacion, setCapacitacion] = useState(null);
  const [progressItems, setProgressItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [error, setError] = useState("");
  const [progressError, setProgressError] = useState("");
  const [savingResourceId, setSavingResourceId] = useState(null);
  const [automaticTrackingResourceIds, setAutomaticTrackingResourceIds] =
    useState(() => new Set());

  useEffect(() => {
    let ignore = false;

    const loadCapacitacion = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchLearningItemById(capacitacionId, {
          onlyPublished: true,
        });

        if (!ignore) {
          setCapacitacion(data);
        }
      } catch (loadError) {
        if (!ignore) {
          console.error("No se pudo cargar la capacitacion", loadError);
          setError("No se pudo cargar la capacitacion solicitada.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadCapacitacion();

    return () => {
      ignore = true;
    };
  }, [capacitacionId]);

  useEffect(() => {
    let ignore = false;

    const loadProgress = async () => {
      setLoadingProgress(true);
      setProgressError("");

      try {
        const data = await fetchUserLearningProgress(capacitacionId);

        if (!ignore) {
          setProgressItems(data);
        }
      } catch (loadError) {
        if (!ignore) {
          console.error("No se pudo cargar el progreso", loadError);
          setProgressError("No se pudo cargar tu progreso.");
        }
      } finally {
        if (!ignore) {
          setLoadingProgress(false);
        }
      }
    };

    loadProgress();

    return () => {
      ignore = true;
    };
  }, [capacitacionId]);

  const modules = capacitacion?.modulos ?? [];
  const certification = capacitacion?.certificacion ?? null;
  const completedResourceIds = getCompletedResourceIds(progressItems);
  const capacitacionCompleted = isCapacitacionCompleted(
    modules,
    completedResourceIds
  );
  const pageTitle = capacitacion
    ? `${capacitacion.titulo} | Capacitaciones | IRRIDELTA`
    : "Detalle de capacitacion | IRRIDELTA";

  const handleTrackingReadyChange = (resourceId, isReady) => {
    setAutomaticTrackingResourceIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (isReady) {
        nextIds.add(resourceId);
      } else {
        nextIds.delete(resourceId);
      }

      return nextIds;
    });
  };

  const handleMarkResourceAsCompleted = async (module, resource) => {
    if (completedResourceIds.has(resource.id) || savingResourceId === resource.id) {
      return;
    }

    setSavingResourceId(resource.id);
    setProgressError("");

    try {
      const savedProgress = await markResourceAsCompleted({
        capacitacionId,
        moduloId: module.id,
        recursoId: resource.id,
      });

      setProgressItems((currentItems) => {
        const existingItem = currentItems.find(
          (item) => item.recurso_id === resource.id
        );

        if (existingItem) {
          return currentItems.map((item) =>
            item.recurso_id === resource.id ? savedProgress : item
          );
        }

        return [...currentItems, savedProgress];
      });
    } catch (saveError) {
      console.error("No se pudo marcar el recurso como visto", saveError);
      setProgressError("No se pudo marcar el recurso como visto.");
    } finally {
      setSavingResourceId(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <section className={styles.page}>
        <div className={styles.inner}>
          <Link to="/capacitaciones" className={styles.backLink}>
            <ChevronLeft size={18} aria-hidden="true" />
            Volver a capacitaciones
          </Link>

          {loading && (
            <div className={styles.feedbackCard}>Cargando capacitacion...</div>
          )}

          {!loading && error && <div className="alert-error">{error}</div>}

          {!loading && !error && !capacitacion && (
            <div className={styles.feedbackCard}>
              No encontramos la capacitacion solicitada.
            </div>
          )}

          {!loading && !error && capacitacion && (
            <>
              <article className={styles.hero}>
                <h1 className={styles.title}>{capacitacion.titulo}</h1>

                {capacitacion.descripcion && (
                  <p className={styles.description}>{capacitacion.descripcion}</p>
                )}

                <div className={styles.metaRow}>
                  <span className={styles.badge}>
                    <BookOpen size={16} aria-hidden="true" />
                    {modules.length === 1 ? "1 modulo" : `${modules.length} modulos`}
                  </span>

                  <span className={styles.badge}>
                    <Award size={16} aria-hidden="true" />
                    {certification ? "Con certificacion" : "Sin certificacion"}
                  </span>

                  {capacitacion.created_at && (
                    <span className={styles.badge}>
                      <CalendarDays size={16} aria-hidden="true" />
                      Publicado el{" "}
                      {new Date(capacitacion.created_at).toLocaleDateString(
                        "es-AR"
                      )}
                    </span>
                  )}

                  {loadingProgress && (
                    <span className={styles.badge}>Cargando progreso...</span>
                  )}
                </div>
              </article>

              {progressError && (
                <div className="alert-error mt-4">{progressError}</div>
              )}

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Modulos</h2>

                {modules.length === 0 && (
                  <p className={styles.emptyText}>
                    Esta capacitacion todavia no tiene modulos publicados.
                  </p>
                )}

                {modules.length > 0 && (
                  <div className={styles.moduleList}>
                    {modules.map((module, moduleIndex) => {
                      const moduleUnlocked = isModuleUnlocked(
                        moduleIndex,
                        modules,
                        completedResourceIds
                      );

                      return (
                        <article
                          key={
                            module.id ?? `${capacitacion.id}-module-${moduleIndex}`
                          }
                          className={styles.moduleCard}
                          style={moduleUnlocked ? undefined : { opacity: 0.65 }}
                        >
                          <p className={styles.moduleEyebrow}>
                            Modulo {moduleIndex + 1}{" "}
                            {!moduleUnlocked && "(bloqueado)"}
                          </p>
                          <h3 className={styles.moduleTitle}>{module.titulo}</h3>

                          {module.descripcion && (
                            <p className={styles.moduleDescription}>
                              {module.descripcion}
                            </p>
                          )}

                          {module.recursos?.length > 0 ? (
                            <div className={styles.resources}>
                              {module.recursos.map((resource, resourceIndex) => {
                                const href = getResourceHref(resource);
                                const isFile =
                                  resource.tipo === RESOURCE_TYPES.ARCHIVO;
                                const resourceUnlocked = isResourceUnlocked(
                                  moduleIndex,
                                  resourceIndex,
                                  modules,
                                  completedResourceIds
                                );
                                const resourceCompleted =
                                  completedResourceIds.has(resource.id);
                                const hasAutomaticTracking =
                                  automaticTrackingResourceIds.has(resource.id);
                                const isYoutube =
                                  resource.tipo === RESOURCE_TYPES.YOUTUBE;

                                if (!href) {
                                  return null;
                                }

                                return (
                                  <div
                                    key={
                                      resource.id ??
                                      `${module.id ?? moduleIndex}-${resourceIndex}`
                                    }
                                    className="flex flex-wrap items-center gap-2"
                                  >
                                    {resourceUnlocked && isYoutube ? (
                                      <div className="w-full">
                                        <YouTubePlayer
                                          youtubeUrl={href}
                                          onComplete={() =>
                                            handleMarkResourceAsCompleted(
                                              module,
                                              resource
                                            )
                                          }
                                          onTrackingReady={(isReady) =>
                                            handleTrackingReadyChange(
                                              resource.id,
                                              isReady
                                            )
                                          }
                                        />
                                        <p className="mt-2 text-sm font-semibold text-gray-700">
                                          {getResourceLabel(resource)}{" "}
                                          {resourceCompleted && "(completado)"}
                                        </p>
                                      </div>
                                    ) : resourceUnlocked ? (
                                      <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${styles.resourceLink} ${
                                          isFile
                                            ? styles.resourceFile
                                            : styles.resourceYoutube
                                        }`}
                                      >
                                        {isFile ? (
                                          <FileText
                                            size={17}
                                            aria-hidden="true"
                                          />
                                        ) : (
                                          <PlayCircle
                                            size={17}
                                            aria-hidden="true"
                                          />
                                        )}
                                        {getResourceLabel(resource)}
                                        {resourceCompleted && "(completado)"}
                                        <ExternalLink
                                          size={15}
                                          aria-hidden="true"
                                        />
                                      </a>
                                    ) : (
                                      <button
                                        type="button"
                                        disabled
                                        className={`${styles.resourceLink} ${
                                          isFile
                                            ? styles.resourceFile
                                            : styles.resourceYoutube
                                        }`}
                                        style={{
                                          cursor: "not-allowed",
                                          opacity: 0.6,
                                        }}
                                      >
                                        {isFile ? (
                                          <FileText
                                            size={17}
                                            aria-hidden="true"
                                          />
                                        ) : (
                                          <PlayCircle
                                            size={17}
                                            aria-hidden="true"
                                          />
                                        )}
                                        {getResourceLabel(resource)} (bloqueado)
                                      </button>
                                    )}

                                    {resourceUnlocked &&
                                      !resourceCompleted &&
                                      (!isYoutube || !hasAutomaticTracking) && (
                                      <button
                                        type="button"
                                        className="btn-primary"
                                        disabled={
                                          savingResourceId === resource.id ||
                                          loadingProgress
                                        }
                                        onClick={() =>
                                          handleMarkResourceAsCompleted(
                                            module,
                                            resource
                                          )
                                        }
                                      >
                                        {savingResourceId === resource.id
                                          ? "Guardando..."
                                          : "Marcar como visto"}
                                      </button>
                                    )}

                                    {resourceCompleted && (
                                      <span className={styles.badge}>
                                        Completado
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className={styles.emptyText}>
                              Este modulo no tiene recursos publicados.
                            </p>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className={styles.section}>
                {certification ? (
                  <div className={styles.certificationBox}>
                    <div>
                      <h2 className={styles.certificationTitle}>
                        Certificacion asociada
                      </h2>
                      <p className={styles.certificationText}>
                        Esta capacitacion tiene un examen final disponible para
                        certificar tus conocimientos.{" "}
                        {!capacitacionCompleted &&
                          "Completa todos los recursos para habilitarlo."}
                      </p>
                    </div>

                    {capacitacionCompleted ? (
                      <Link
                        to={`/certificaciones/${certification.id}`}
                        className={styles.certificationLink}
                      >
                        Ir al examen
                        <ExternalLink size={17} aria-hidden="true" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className={styles.certificationLink}
                        style={{ cursor: "not-allowed", opacity: 0.6 }}
                      >
                        Ir al examen (bloqueado)
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={styles.infoBox}>
                    Esta capacitacion no tiene certificacion asociada por el
                    momento.
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default CapacitacionDetalle;
