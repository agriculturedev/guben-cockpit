import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FetchInterceptor } from "@/utilities/fetchApiExtensions";
import i18next from "i18next";

export const useLanguageUpdater = () => {
  const queryClient = useQueryClient();

  return useCallback(async (language: string) => {
    FetchInterceptor.setHeader("Accept-Language", language);
    await i18next.changeLanguage(language)
    await queryClient.refetchQueries() // refetch all
  }, [queryClient]);
}
