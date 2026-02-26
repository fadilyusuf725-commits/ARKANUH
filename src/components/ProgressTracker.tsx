type ProgressTrackerProps = {
  completedPages: string[];
  currentPageId?: string;
  totalPages: number;
};

export function ProgressTracker({ completedPages, currentPageId, totalPages }: ProgressTrackerProps) {
  const completedSet = new Set(completedPages);
  const progressPercentage = Math.round((completedPages.length / totalPages) * 100);

  return (
    <section className="card progress-card">
      <div className="progress-top-row">
        <p className="eyebrow">Progres Belajar</p>
        <strong>{progressPercentage}%</strong>
      </div>
      <div className="progress-dots" aria-label={`Progres ${progressPercentage}%`}>
        {Array.from({ length: totalPages }, (_, index) => {
          const pageId = String(index + 1);
          const isCompleted = completedSet.has(pageId);
          const isCurrent = currentPageId === pageId;
          const className = [
            "progress-dot",
            isCompleted ? "is-complete" : "",
            isCurrent ? "is-current" : ""
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <span key={pageId} className={className}>
              {pageId}
            </span>
          );
        })}
      </div>
    </section>
  );
}
