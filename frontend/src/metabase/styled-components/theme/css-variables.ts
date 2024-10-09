import { css } from "@emotion/react";
import { getIn } from "icepick";

import type { MantineTheme } from "metabase/ui";

// https://www.raygesualdo.com/posts/flattening-object-keys-with-typescript-types/
type FlattenObjectKeys<
  T extends Record<string, unknown>,
  Key = keyof T,
> = Key extends string
  ? T[Key] extends Record<string, unknown>
    ? `${Key}.${FlattenObjectKeys<T[Key]>}`
    : `${Key}`
  : never;

type MetabaseComponentThemeKey = FlattenObjectKeys<MetabaseComponentTheme>;

/**
 * Defines the CSS variables used across Metabase.
 */
export function getMetabaseCssVariables(theme: MantineTheme) {
  return css`
    :root {
      --mb-default-font-family: "${theme.fontFamily}";

      /* Semantic colors */
      --mb-color-brand: ${theme.fn.themeColor("brand")};
      --mb-color-summarize: ${theme.fn.themeColor("summarize")};
      --mb-color-filter: ${theme.fn.themeColor("filter")};
      ${getThemeSpecificCssVariables(theme)}
    }
  `;
}

/**
 * Theming-specific CSS variables.
 *
 * These CSS variables are NOT part of the core design system colors.
 * Do NOT add them to [palette.ts] and [colors.ts].
 *
 * Keep in sync with [GlobalStyles.tsx].
 **/
export function getThemeSpecificCssVariables(theme: MantineTheme) {
  // Get value from theme.other, which is typed as MetabaseComponentTheme
  const getValue = (key: MetabaseComponentThemeKey): string | undefined => {
    return getIn(theme.other, key.split("."));
  };

  return css`
    --mb-color-bg-dashboard: ${getValue("dashboard.backgroundColor")};
    --mb-color-bg-dashboard-card: ${getValue("dashboard.card.backgroundColor")};
    --mb-color-bg-question: ${getValue("question.backgroundColor")};

    --mb-color-text-collection-browser-expand-button: ${getValue(
      "collectionBrowser.breadcrumbs.expandButton.textColor",
    )};
    --mb-color-bg-collection-browser-expand-button: ${getValue(
      "collectionBrowser.breadcrumbs.expandButton.backgroundColor",
    )};
    --mb-color-text-collection-browser-expand-button-hover: ${getValue(
      "collectionBrowser.breadcrumbs.expandButton.hoverTextColor",
    )};
    --mb-color-bg-collection-browser-expand-button-hover: ${getValue(
      "collectionBrowser.breadcrumbs.expandButton.hoverBackgroundColor",
    )};
  `;
}
