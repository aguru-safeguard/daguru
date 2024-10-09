import { useEffect } from "react";
import { usePrevious } from "react-use";

import {
  getIsLoading,
  getIsLoadingWithoutCards,
} from "metabase/dashboard/selectors";
import { useSelector } from "metabase/lib/redux";
import type { PublicOrEmbeddedDashboardEventHandlersProps } from "metabase/public/containers/PublicOrEmbeddedDashboard/types";
import { getErrorPage } from "metabase/selectors/app";
import type { Dashboard } from "metabase-types/api";

export const useDashboardLoadHandlers = ({
  dashboard,
  onLoad,
  onLoadWithoutCards,
}: {
  dashboard: Dashboard | null;
} & PublicOrEmbeddedDashboardEventHandlersProps) => {
  const isLoading = useSelector(getIsLoading);
  const isLoadingWithoutCards = useSelector(getIsLoadingWithoutCards);
  const isErrorPage = useSelector(getErrorPage);

  const previousIsLoading = usePrevious(isLoading);
  const previousIsLoadingWithoutCards = usePrevious(isLoadingWithoutCards);

  useEffect(() => {
    if (
      !isLoadingWithoutCards &&
      previousIsLoadingWithoutCards &&
      !isErrorPage
    ) {
      onLoadWithoutCards?.(dashboard);
    }
  }, [
    isLoadingWithoutCards,
    isErrorPage,
    previousIsLoadingWithoutCards,
    dashboard,
    onLoadWithoutCards,
  ]);

  useEffect(() => {
    if (!isLoading && previousIsLoading && !isErrorPage) {
      onLoad?.(dashboard);
    }
  }, [
    isLoading,
    isErrorPage,
    previousIsLoading,
    dashboard,
    onLoad,
  ]);
};
