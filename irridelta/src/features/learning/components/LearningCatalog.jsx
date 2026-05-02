import React, { useEffect, useState } from "react";
import { fetchLearningItems } from "../services/learningContentService";
import {
  fetchUserLearningProgress,
  getCompletedResourceIds,
} from "../services/learningProgressService";
import LearningItemPreviewCard from "./LearningItemPreviewCard";
import styles from "./LearningCatalog.module.css";

const FILTERS = {
  ALL: "todos",
  PENDING: "pendiente",
  IN_PROGRESS: "en-progreso",
  COMPLETED: "completado",
};

function getModuleResources(module) {
  return module?.recursos ?? [];
}

function getItemProgress(item, progressItems = []) {
  const modules = item?.modulos ?? [];
  const completedResourceIds = getCompletedResourceIds(progressItems);
  const completedModules = modules.filter((module) => {
    const resources = getModuleResources(module);

    return (
      resources.length > 0 &&
      resources.every((resource) => completedResourceIds.has(resource.id))
    );
  }).length;
  const totalModules = modules.length;
  const progressPercentage =
    totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  const status =
    totalModules === 0 || completedModules === 0
      ? "pendiente"
      : completedModules === totalModules
      ? "completado"
      : "en-progreso";

  return {
    completedModules,
    totalModules,
    progressPercentage,
    status,
  };
}

function LearningCatalog({ type, title, emptyMessage, onlyPublished = false }) {
  const [items, setItems] = useState([]);
  const [progressByItemId, setProgressByItemId] = useState({});
  const [activeFilter, setActiveFilter] = useState(FILTERS.ALL);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadItems = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchLearningItems(type, { onlyPublished });

        if (!ignore) {
          setItems(data);
        }

        if (data.length > 0) {
          setLoadingProgress(true);

          const progressEntries = await Promise.all(
            data.map(async (item) => {
              const progress = await fetchUserLearningProgress(item.id);

              return [item.id, progress];
            })
          );

          if (!ignore) {
            setProgressByItemId(Object.fromEntries(progressEntries));
          }
        } else if (!ignore) {
          setProgressByItemId({});
        }
      } catch (loadError) {
        if (!ignore) {
          console.error("No se pudo cargar el contenido formativo", loadError);
          setError(
            "No se pudo cargar el contenido. Revisa que las tablas esten creadas en Supabase."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
          setLoadingProgress(false);
        }
      }
    };

    loadItems();

    return () => {
      ignore = true;
    };
  }, [onlyPublished, type]);

  const itemsWithProgress = items.map((item) => ({
    item,
    progress: getItemProgress(item, progressByItemId[item.id] ?? []),
  }));
  const filteredItems = itemsWithProgress.filter(({ progress }) => {
    if (activeFilter === FILTERS.ALL) {
      return true;
    }

    return progress.status === activeFilter;
  });

  return (
    <section className={styles.catalog}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
        </header>

        {loading && (
          <div className={styles.feedbackCard}>
            Cargando contenido...
          </div>
        )}

        {!loading && error && (
          <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className={styles.feedbackCard}>{emptyMessage}</div>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            <div className={styles.filters} aria-label="Filtrar capacitaciones">
              <button
                type="button"
                className={`${styles.filterButton} ${
                  activeFilter === FILTERS.ALL ? styles.filterButtonActive : ""
                }`}
                onClick={() => setActiveFilter(FILTERS.ALL)}
              >
                Todos
              </button>
              <button
                type="button"
                className={`${styles.filterButton} ${
                  activeFilter === FILTERS.PENDING
                    ? styles.filterButtonActive
                    : ""
                }`}
                onClick={() => setActiveFilter(FILTERS.PENDING)}
              >
                Pendientes
              </button>
              <button
                type="button"
                className={`${styles.filterButton} ${
                  activeFilter === FILTERS.IN_PROGRESS
                    ? styles.filterButtonActive
                    : ""
                }`}
                onClick={() => setActiveFilter(FILTERS.IN_PROGRESS)}
              >
                En progreso
              </button>
              <button
                type="button"
                className={`${styles.filterButton} ${
                  activeFilter === FILTERS.COMPLETED
                    ? styles.filterButtonActive
                    : ""
                }`}
                onClick={() => setActiveFilter(FILTERS.COMPLETED)}
              >
                Completados
              </button>
            </div>

            {loadingProgress && (
              <p className={styles.progressLoading}>Actualizando progreso...</p>
            )}

            {filteredItems.length === 0 ? (
              <div className={styles.feedbackCard}>
                No hay capacitaciones para este filtro.
              </div>
            ) : (
              <div className={styles.grid}>
                {filteredItems.map(({ item, progress }) => (
                  <LearningItemPreviewCard
                    key={item.id}
                    item={item}
                    progress={progress}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default LearningCatalog;
