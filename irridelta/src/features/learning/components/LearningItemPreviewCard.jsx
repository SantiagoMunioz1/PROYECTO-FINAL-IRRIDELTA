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

const STATUS_LABELS = {
  pendiente: "Pendiente",
  "en-progreso": "En progreso",
  completado: "Completado",
};

function LearningItemPreviewCard({ item, progress, showPublishedDate = true }) {
  if (!item) {
    return null;
  }

  const moduleCount = item.modulos?.length ?? 0;
  const hasCertification = Boolean(item.certificacion);
  const progressData = progress ?? {
    completedModules: 0,
    totalModules: moduleCount,
    progressPercentage: 0,
    status: "pendiente",
  };
  const isCompleted = progressData.status === "completado";
  const detailLabel =
    progressData.status === "completado"
      ? "Revisar capacitacion"
      : progressData.status === "en-progreso"
        ? "Continuar"
        : "Comenzar";

  return (
    <article
      className={`${styles.card} ${isCompleted ? styles.cardCompleted : ""}`}
    >
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

      <div className={styles.progressBlock}>
        <div className={styles.progressHeader}>
          <span>
            {progressData.completedModules}/{progressData.totalModules} modulos
            completados
          </span>
          <span className={`${styles.statusBadge} ${styles[progressData.status]}`}>
            {STATUS_LABELS[progressData.status]}
          </span>
        </div>
        <div
          className={styles.progressTrack}
          aria-label={`Progreso ${progressData.progressPercentage}%`}
        >
          <span
            className={styles.progressBar}
            style={{ width: `${progressData.progressPercentage}%` }}
          />
        </div>
      </div>

      <footer className={styles.footer}>
        <Link to={`/capacitaciones/${item.id}`} className={styles.detailLink}>
          {detailLabel}
          <ChevronRight size={18} aria-hidden="true" />
        </Link>
      </footer>
    </article>
  );
}

export default LearningItemPreviewCard;
