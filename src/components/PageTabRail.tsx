type PageTabRailProps = {
  pageIds: string[];
  currentPageId: string;
  maxReachableIndex: number;
  completedPages: string[];
  onSelect: (pageId: string) => void;
};

export function PageTabRail({ pageIds, currentPageId, maxReachableIndex, completedPages, onSelect }: PageTabRailProps) {
  return (
    <aside className="ppt-tab-rail" aria-label="Navigasi halaman cerita">
      {pageIds.map((id, index) => {
        const isCurrent = id === currentPageId;
        const isDone = completedPages.includes(id);
        const isLocked = index > maxReachableIndex;
        return (
          <button
            key={id}
            type="button"
            className={`ppt-tab ${isCurrent ? "is-current" : ""} ${isDone ? "is-done" : ""}`}
            onClick={() => onSelect(id)}
            disabled={isLocked}
            aria-current={isCurrent ? "page" : undefined}
          >
            Hal {id}
          </button>
        );
      })}
    </aside>
  );
}
