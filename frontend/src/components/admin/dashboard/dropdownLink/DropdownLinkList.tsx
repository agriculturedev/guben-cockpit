import { useTranslation } from "react-i18next";
import { LinkIcon } from "lucide-react";

import { DropdownLinkResponse } from "@/endpoints/gubenSchemas";

import { formatUrl } from "../formatUrl";
import { PreviewButton } from "../PreviewButton";
import { CopyButton } from "../CopyButton";
import { CreateLinkButton } from "./CreateLinkButton";
import { DeleteLinkButton } from "./DeleteLinkButton";
import { EditLinkButton } from "./EditLinkButton";

interface DropdownLinkListProps {
  dropdownId: string;
  refetch: () => Promise<any>;
  links?: DropdownLinkResponse[];
  isAdmin?: boolean;
}

export function DropdownLinkList({
  dropdownId,
  links,
  refetch,
  isAdmin,
}: DropdownLinkListProps) {
  const { t } = useTranslation(["dashboard", "common"]);

  const createLinkButtonElement = isAdmin && (
    <CreateLinkButton dropdownId={dropdownId} onSuccess={refetch} />
  );

  if (!links || links.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <div className="italic text-sm text-muted-foreground">
          {t("NoLinksYet")}
        </div>
        {createLinkButtonElement}
      </div>
    );
  }

  return (
    <div>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li
            key={link.id}
            className="relative flex items-center gap-2 rounded-lg border px-3 py-2"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate mb-1">
                {link.title}
              </div>
              <div className="text-xs text-muted-foreground flex items-center truncate">
                <LinkIcon className="h-3.5 w-3.5" />
                {link.link ? (
                  <>
                    <div className="truncate mr-2 ml-1">
                      {formatUrl(link.link)}
                    </div>
                    <PreviewButton url={link.link} />
                    <CopyButton text={link.link} />
                  </>
                ) : (
                  <div className="truncate mr-2 ml-1 italic">{t("NoUrl")}</div>
                )}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                  {isAdmin && <EditLinkButton link={link} refetch={refetch} />}
                  {isAdmin && (
                    <DeleteLinkButton linkId={link.id} refetch={refetch} />
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {createLinkButtonElement}
    </div>
  );
}
