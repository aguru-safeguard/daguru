import { useMemo } from "react";
import { t } from "ttag";

import { editQuestion } from "metabase/dashboard/actions";
import type { DashCardMenuItem } from "metabase/dashboard/components/DashCard/DashCardMenu/DashCardMenu";
import { useDispatch } from "metabase/lib/redux";
import { Icon, Menu } from "metabase/ui";
import type Question from "metabase-lib/v1/Question";
import type { Dataset } from "metabase-types/api";

import { canDownloadResults, canEditQuestion } from "./utils";

type DashCardMenuItemsProps = {
  question: Question;
  result: Dataset;
  isDownloadingData: boolean;
  onDownload: () => void;
};

export const DashCardMenuItems = ({
  question,
  result,
  isDownloadingData,
  onDownload,
}: DashCardMenuItemsProps) => {
  const dispatch = useDispatch();

  const onEditQuestion = (question: Question, mode = "notebook") =>
    dispatch(editQuestion(question, mode));

  const menuItems = useMemo(() => {
    const items: (DashCardMenuItem & {
      key: string;
    })[] = [];

    if (canEditQuestion(question)) {
      const type = question.type();
      if (type === "question") {
        items.push({
          key: "MB_EDIT_QUESTION",
          iconName: "pencil",
          label: t`Edit question`,
          onClick: () => onEditQuestion(question),
        });
      }
      if (type === "model") {
        items.push({
          key: "MB_EDIT_MODEL",
          iconName: "pencil",
          label: t`Edit model`,
          onClick: () => onEditQuestion(question, "query"),
        });
      }
      if (type === "metric") {
        items.push({
          key: "MB_EDIT_METRIC",
          iconName: "pencil",
          label: t`Edit metric`,
          onClick: () => onEditQuestion(question, "query"),
        });
      }
    }

    if (canDownloadResults(result)) {
      items.push({
        key: "MB_DOWNLOAD_RESULTS",
        iconName: "download",
        label: isDownloadingData ? t`Downloading…` : t`Download results`,
        onClick: onDownload,
        disabled: isDownloadingData,
        closeMenuOnClick: false,
      });
    }

    return items;
  }, [
    isDownloadingData,
    onDownload,
    onEditQuestion,
    question,
    result,
  ]);

  return menuItems.map(item => (
    <Menu.Item
      fw="bold"
      {...item}
      key={item.key}
      icon={<Icon name={item.iconName} aria-hidden />}
    >
      {item.label}
    </Menu.Item>
  ));
};
