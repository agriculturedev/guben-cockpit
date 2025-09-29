import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { GripVertical } from "lucide-react";

import { SortableList } from "@/components/dnd/SortableList";
import { InfoCard } from "@/components/home/InfoCard/InfoCard";
import { InformationCardResponse } from "@/endpoints/gubenSchemas";
import { Button } from "@/components/ui/button";
import { useDashboardCardReorder } from "@/endpoints/gubenComponents";
import { EditDashboardCardButton } from "@/components/dashboard/cards/editDashboardCard.tsx/editDashboardCardButton";
import { DeleteDashboardCardButton } from "@/components/dashboard/cards/deleteDashboardCard/DeleteDashboardCardButton";

interface DropdownTabCardsListProps {
  tabId: string;
  informationCards: InformationCardResponse[];
  canEdit?: boolean;
  refetch?: () => Promise<any>;
  onSuccess?: () => void;
}

export function DropdownTabCardsList({
  tabId,
  informationCards,
  canEdit,
  refetch,
  onSuccess,
}: DropdownTabCardsListProps) {
  const { t } = useTranslation(["dashboard", "common"]);
  const [cards, setCards] =
    useState<InformationCardResponse[]>(informationCards);

  useEffect(() => {
    setCards(informationCards);
  }, [informationCards]);

  const isDirty = useMemo(() => {
    if (cards.length !== informationCards.length) return true;
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].id !== informationCards[i].id) return true;
    }
    return false;
  }, [cards, informationCards]);

  const refetchCards = async () => {
    await refetch?.();
  };

  const reorder = useDashboardCardReorder({
    onSuccess: async () => {
      await refetch?.();
      onSuccess?.();
    },
  });

  const handleSave = () => {
    if (!isDirty || cards.length === 0) return;
    const orderedCardIds = cards.map((c) => c.id);
    reorder.mutate({
      pathParams: { id: tabId },
      body: { orderedCardIds },
    });
  };

  return (
    <div className="max-h-[80vh]">
      {cards.length === 0 ? (
        <div className="italic text-sm text-muted-foreground">
          {t("NoCardsYet")}
        </div>
      ) : (
        <SortableList
          items={cards}
          getId={(item) => item.id}
          axis="y"
          renderItem={(item, handle) => (
            <div className="relative">
              {canEdit && (
                <button
                  type="button"
                  {...handle.attributes}
                  {...handle.listeners}
                  className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-accent absolute top-[50%] -translate-y-1/2 right-2 z-10"
                  aria-label={t("DragToReorder")}
                  title={t("DragToReorder")}
                >
                  <GripVertical className="h-4 w-4" />
                </button>
              )}

              <InfoCard card={item} />

              {canEdit && (
                <div className="flex absolute top-2 right-10 gap-2">
                  <EditDashboardCardButton
                    card={item}
                    dashboardTabId={tabId}
                    refetch={refetchCards}
                  />
                  <DeleteDashboardCardButton
                    cardId={item.id}
                    dashboardTabId={tabId}
                    refetch={refetchCards}
                  />
                </div>
              )}
            </div>
          )}
          onReorder={(ids: string[]) => {
            const byId = new Map(cards.map((c) => [c.id, c]));
            const next = ids
              .map((id) => byId.get(id))
              .filter(Boolean) as InformationCardResponse[];

            if (next.length === ids.length) setCards(next);
          }}
        />
      )}

      {canEdit && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="default"
            disabled={!isDirty || reorder.isPending}
            onClick={handleSave}
          >
            {t("common:Save")}
          </Button>
        </div>
      )}
    </div>
  );
}
