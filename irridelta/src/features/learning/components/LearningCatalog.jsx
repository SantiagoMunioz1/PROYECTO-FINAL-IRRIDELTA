import React, { useEffect, useState } from "react";
import { fetchLearningItems } from "../services/learningContentService";
import LearningItemPreviewCard from "./LearningItemPreviewCard";
import styles from "./LearningCatalog.module.css";

function LearningCatalog({ type, title, emptyMessage, onlyPublished = false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
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
        }
      }
    };

    loadItems();

    return () => {
      ignore = true;
    };
  }, [onlyPublished, type]);

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
          <div className={styles.grid}>
            {items.map((item) => (
              <LearningItemPreviewCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default LearningCatalog;
