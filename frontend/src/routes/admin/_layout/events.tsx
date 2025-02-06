import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from "react-i18next";
import * as React from "react";

export const Route = createFileRoute('/admin/_layout/events')({
  component: () =>{
    const {t} = useTranslation();
    return (<div className='text-5xl flex items-center justify-center h-full'>{t("ComingSoon")}...</div>);
  },})
