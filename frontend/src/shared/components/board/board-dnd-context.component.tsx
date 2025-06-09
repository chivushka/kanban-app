import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensors,
  useSensor,
  TouchSensor,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Card } from '@/shared/components/board/card.component';
import { Column } from '@/shared/components/board/column.component';
import type { BoardColumns, ColumnsType } from '@/types/column.types';
import { isMobile } from 'react-device-detect';
import { useBoardColumns } from '@/hooks/useBoardColumns';
import { useBoardStore } from '@/store/board.store';
import { cardService } from '@/shared/services/card.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/keys';
import { useToastStore } from '@/store/toast.store';

export const BoardDndContext: React.FC = () => {
  const { data: columns, isLoading, error } = useBoardColumns();
  const [currentColumns, setCurrentColumns] = useState<BoardColumns>(
    columns || { todo: [], in_progress: [], done: [] },
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const boardId = useBoardStore((state) => state.boardId);
  const queryClient = useQueryClient();
  const [prevColumns, setPrevColumns] = useState<BoardColumns | null>(null);
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    if (columns) setCurrentColumns(columns);
  }, [columns]);

  const moveMutation = useMutation({
    mutationFn: ({
      cardId,
      column,
      order,
    }: {
      cardId: string;
      column: ColumnsType;
      order: number;
    }) => cardService.move(boardId, cardId, { column, order }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CARD, boardId] });
    },
    onError: () => {
      if (prevColumns) setCurrentColumns(prevColumns);
      showToast('Moving card failed :(', 'error');
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;
    if (active.id === over.id) return;

    let sourceColKey: ColumnsType | null = null;
    let sourceIndex = -1;
    let targetColKey: ColumnsType | null = null;
    let targetIndex = -1;

    for (const key in currentColumns) {
      const idx = currentColumns[key].findIndex(
        (card) => card.id === active.id,
      );
      if (idx !== -1) {
        sourceColKey = key as ColumnsType;
        sourceIndex = idx;
      }
      const overIdx = currentColumns[key].findIndex(
        (card) => card.id === over.id,
      );
      if (overIdx !== -1) {
        targetColKey = key as ColumnsType;
        targetIndex = overIdx;
      }
    }

    if (!targetColKey) {
      targetColKey = over.id as ColumnsType;
      targetIndex = 0;
    }

    if (sourceColKey && targetColKey) {
      setPrevColumns(currentColumns);
      if (sourceColKey === targetColKey) {
        moveMutation.mutate({
          cardId: active.id as string,
          column: sourceColKey,
          order: targetIndex,
        });
        setCurrentColumns((prev) => {
          const updated = arrayMove(
            prev[sourceColKey]!,
            sourceIndex,
            targetIndex,
          );
          const newCols = { ...prev, [sourceColKey]: updated };
          return newCols;
        });
      } else {
        moveMutation.mutate({
          cardId: active.id as string,
          column: targetColKey,
          order: 0,
        });
        setCurrentColumns((prev) => {
          const sourceCards = [...prev[sourceColKey]!];
          const targetCards = [...prev[targetColKey]!];
          const [movedCard] = sourceCards.splice(sourceIndex, 1);
          targetCards.splice(0, 0, movedCard);
          const newCols = {
            ...prev,
            [sourceColKey]: sourceCards,
            [targetColKey]: targetCards,
          };
          return newCols;
        });
      }
    }
  };

  const pointerSensor = useSensor(PointerSensor);
  const touchSensor = useSensor(TouchSensor);

  const sensors = useSensors(...(isMobile ? [] : [pointerSensor, touchSensor]));

  if (isLoading) {
    return (
      <div className="text-white mt-10 text-lg self-center">
        Loading cards...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-white mt-10 text-lg self-center">
        Failed to load cards
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      {(['todo', 'in_progress', 'done'] as ColumnsType[]).map((colKey) => (
        <Column
          key={colKey}
          id={colKey}
          title={colKey.replace('_', ' ').toUpperCase()}
          cards={currentColumns[colKey]}
          setCards={(cards) => {
            setCurrentColumns((prev) => {
              const newCols = { ...prev, [colKey]: cards };
              return newCols;
            });
          }}
        />
      ))}

      {activeId && (
        <DragOverlay>
          {(() => {
            const card = currentColumns[
              Object.keys(currentColumns).find((colKey) =>
                currentColumns[colKey].some((card) => card.id === activeId),
              )!
            ].find((card) => card.id === activeId);
            return card ? (
              <Card
                id={card.id}
                title={card.title}
                description={card.description}
              />
            ) : null;
          })()}
        </DragOverlay>
      )}
    </DndContext>
  );
};
