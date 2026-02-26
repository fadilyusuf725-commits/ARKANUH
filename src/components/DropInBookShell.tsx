import { PropsWithChildren, useEffect, useState } from "react";

export function DropInBookShell({ children }: PropsWithChildren) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return <div className={`book-drop-shell ${entered ? "is-entered" : ""}`}>{children}</div>;
}
