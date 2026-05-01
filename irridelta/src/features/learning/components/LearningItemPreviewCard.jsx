import React from "react";
import { Award, BookOpen, CalendarDays, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./LearningItemPreviewCard.module.css";

function getShortDescription(description) {
  if (!description) {
    return "Capacitacion disponible para clientes de IRRIDELTA.";
  }

  const normalizedDescription = description.trim();

  if (normalizedDescription.length <= 180) {
    return normalizedDescription;
  }

  return `${normalizedDescription.slice(0, 177).trim()}...`;
}

function LearningItemPreviewCard({ item, showPublishedDate = true }) {
  if (!item) {
    return null;
  }

  const moduleCount = item.modulos?.length ?? 0;
  const hasCertification = Boolean(item.certificacion);

  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <h2 className={styles.title}>{item.titulo}</h2>
        <p className={styles.description}>{getShortDescription(item.descripcion)}</p>
      </div>

      <div className={styles.metaList}>
        <span className={styles.metaItem}>
          <BookOpen className={styles.metaIcon} aria-hidden="true" />
          {moduleCount === 1 ? "1 modulo" : `${moduleCount} modulos`}
        </span>
        <span className={styles.metaItem}>
          <Award className={styles.metaIcon} aria-hidden="true" />
          {hasCertification ? "Con certificacion" : "Sin certificacion"}
        </span>
        {showPublishedDate && item.created_at && (
          <span className={styles.metaItem}>
            <CalendarDays className={styles.metaIcon} aria-hidden="true" />
            {new Date(item.created_at).toLocaleDateString("es-AR")}
          </span>
        )}
      </div>

      <footer className={styles.footer}>
        <Link to={`/capacitaciones/${item.id}`} className={styles.detailLink}>
          Ver capacitacion
          <ChevronRight size={18} aria-hidden="true" />
        </Link>
      </footer>
    </article>
  );
}

export default LearningItemPreviewCard;
