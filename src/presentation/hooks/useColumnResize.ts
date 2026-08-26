import {
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import type { RefObject, MouseEvent as ReactMouseEvent } from "react";
import { MIN_COLUMN_WIDTH } from "../../config/constants";

interface DragState {
  index: number;
  startX: number;
  startWidths: number[];
}

export function useColumnResize(
  tableRef: RefObject<HTMLTableElement | null>,
  columnCount: number
) {
  const [widths, setWidths] = useState<number[]>([]);
  const widthsRef = useRef<number[]>([]);
  const dragRef = useRef<DragState | null>(null);

  useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table) return;
    const ths = table.querySelectorAll<HTMLTableCellElement>("thead th");
    if (ths.length === columnCount) {
      const measured = Array.from(ths).map((th) => th.getBoundingClientRect().width);
      widthsRef.current = measured;
      setWidths(measured);
    }
  }, [tableRef, columnCount]);

  const startResize = useCallback(
    (index: number, e: ReactMouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const startWidths = widthsRef.current;
      if (startWidths.length !== columnCount) return;

      dragRef.current = {
        index,
        startX: e.clientX,
        startWidths,
      };

      const onMove = (ev: MouseEvent) => {
        const drag = dragRef.current;
        if (!drag) return;

        const dx = ev.clientX - drag.startX;
        const base = drag.startWidths;
        const current = base[drag.index];
        const desired = Math.max(MIN_COLUMN_WIDTH, current + dx);
        const delta = desired - current;
        const next = base.slice();

        if (delta > 0) {
          const shrinkable = base.map((w, i) =>
            i === drag.index ? 0 : w - MIN_COLUMN_WIDTH
          );
          const available = shrinkable.reduce((a, b) => a + b, 0);
          const take = Math.min(delta, available);

          next[drag.index] = current + take;
          const weightSum = available || 1;
          for (let i = 0; i < next.length; i++) {
            if (i === drag.index) continue;
            next[i] = base[i] - take * (shrinkable[i] / weightSum);
          }
        } else {
          const give = -delta;
          const othersTotal = base.reduce(
            (sum, w, i) => (i === drag.index ? sum : sum + w),
            0
          );
          const weightSum = othersTotal || 1;
          next[drag.index] = desired;
          for (let i = 0; i < next.length; i++) {
            if (i === drag.index) continue;
            next[i] = base[i] + give * (base[i] / weightSum);
          }
        }

        const rounded = next.map((w) => Math.round(w));
        widthsRef.current = rounded;
        setWidths(rounded);
      };

      const onUp = () => {
        dragRef.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        document.body.classList.remove("resizing");
      };

      document.body.classList.add("resizing");
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [columnCount]
  );

  return { widths, startResize };
}
