interface ResizerProps {
  onResizeStart: (e: React.MouseEvent) => void;
}

export function Resizer({ onResizeStart }: ResizerProps) {
  return (
    <span
      className="resizer"
      onMouseDown={onResizeStart}
      role="separator"
      aria-orientation="vertical"
      aria-label="Изменить ширину столбца"
    />
  );
}
