import React, { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToVerticalAxis,
  restrictToHorizontalAxis,
} from "@dnd-kit/modifiers";

export type DragHandleProps = {
  attributes: ReturnType<typeof useSortable>["attributes"];
  listeners: ReturnType<typeof useSortable>["listeners"];
  isDragging: boolean;
};

type SortableItemWrapperProps = {
  id: string;
  className?: string;
  children: (handle: DragHandleProps) => React.ReactNode;
};

function SortableItemWrapper({
  id,
  className,
  children,
}: SortableItemWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : undefined,
  };

  return (
    <li ref={setNodeRef} style={style} className={className}>
      {children({ attributes, listeners, isDragging })}
    </li>
  );
}

export type SortableListProps<T> = {
  items: T[];
  getId: (item: T) => string;
  renderItem: (item: T, handle: DragHandleProps) => React.ReactNode;
  onReorder?: (orderedIds: string[]) => void;
  listClassName?: string;
  itemClassName?: string;
  axis?: "x" | "y";
};

export function SortableList<T>({
  items,
  getId,
  renderItem,
  onReorder,
  listClassName,
  itemClassName,
  axis,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 80, tolerance: 5 },
    }),
  );

  const idsFromItems = useMemo(() => items.map(getId), [items, getId]);
  const [orderedIds, setOrderedIds] = useState<string[]>(idsFromItems);

  useEffect(() => setOrderedIds(idsFromItems), [idsFromItems]);

  const idToItem = useMemo(() => {
    const m = new Map<string, T>();
    items.forEach((it) => m.set(getId(it), it));
    return m;
  }, [items, getId]);

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    setOrderedIds((prev) => {
      const oldIndex = prev.indexOf(String(active.id));
      const newIndex = prev.indexOf(String(over.id));
      const next = arrayMove(prev, oldIndex, newIndex);
      onReorder?.(next);
      return next;
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={
        axis === "x"
          ? [restrictToHorizontalAxis]
          : axis === "y"
            ? [restrictToVerticalAxis]
            : []
      }
    >
      <SortableContext
        items={orderedIds}
        strategy={verticalListSortingStrategy}
      >
        <ul className={listClassName}>
          {orderedIds.map((id) => {
            const item = idToItem.get(id);
            if (!item) return null;
            return (
              <SortableItemWrapper key={id} id={id} className={itemClassName}>
                {(handle) => renderItem(item, handle)}
              </SortableItemWrapper>
            );
          })}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
