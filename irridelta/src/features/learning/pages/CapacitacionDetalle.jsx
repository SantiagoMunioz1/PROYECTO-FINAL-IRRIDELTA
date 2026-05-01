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
import {
  fetchLearningItemById,
  RESOURCE_TYPES,
} from "../services/learningContentService";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const modules = capacitacion?.modulos ?? [];
  const certification = capacitacion?.certificacion ?? null;
  const pageTitle = capacitacion
    ? `${capacitacion.titulo} | Capacitaciones | IRRIDELTA`
    : "Detalle de capacitacion | IRRIDELTA";

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
                </div>
              </article>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Modulos</h2>

                {modules.length === 0 && (
                  <p className={styles.emptyText}>
                    Esta capacitacion todavia no tiene modulos publicados.
                  </p>
                )}

                {modules.length > 0 && (
                  <div className={styles.moduleList}>
                    {modules.map((module, moduleIndex) => (
                      <article
                        key={module.id ?? `${capacitacion.id}-module-${moduleIndex}`}
                        className={styles.moduleCard}
                      >
                        <p className={styles.moduleEyebrow}>
                          Modulo {moduleIndex + 1}
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

                              if (!href) {
                                return null;
                              }

                              return (
                                <a
                                  key={
                                    resource.id ??
                                    `${module.id ?? moduleIndex}-${resourceIndex}`
                                  }
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
                                    <FileText size={17} aria-hidden="true" />
                                  ) : (
                                    <PlayCircle size={17} aria-hidden="true" />
                                  )}
                                  {getResourceLabel(resource)}
                                  <ExternalLink size={15} aria-hidden="true" />
                                </a>
                              );
                            })}
                          </div>
                        ) : (
                          <p className={styles.emptyText}>
                            Este modulo no tiene recursos publicados.
                          </p>
                        )}
                      </article>
                    ))}
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
                        certificar tus conocimientos.
                      </p>
                    </div>

                    <Link
                      to={`/certificaciones/${certification.id}`}
                      className={styles.certificationLink}
                    >
                      Ir al examen
                      <ExternalLink size={17} aria-hidden="true" />
                    </Link>
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
