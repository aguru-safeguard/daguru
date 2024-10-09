import { color } from "metabase/lib/colors";
import type { MantineThemeOther } from "metabase/ui";
import { getSizeInPx } from "metabase/visualizations/shared/utils/size-in-px";
import type { VisualizationTheme } from "metabase/visualizations/types";
import { getThemeOverrides } from "metabase/ui/theme";

function getPieBorderColor(
  dashboardCardBg: string,
  questionBg: string,
  isDashboard: boolean | undefined,
  isNightMode: boolean | undefined,
) {
  if (isDashboard && isNightMode) {
    return "var(--mb-color-bg-night)";
  }
  if (isDashboard) {
    return dashboardCardBg;
  }
  if (questionBg === "transparent") {
    return "var(--mb-color-bg-white)";
  }
  return questionBg;
}

/**
 * Computes the visualization style from the Mantine theme.
 */
export function getVisualizationTheme({
  theme,
  isDashboard,
  isNightMode,
  isStaticViz,
}: {
  theme: Partial<MantineThemeOther>;
  isDashboard?: boolean;
  isNightMode?: boolean;
  isStaticViz?: boolean;
}): VisualizationTheme {
  const { cartesian, dashboard, question } = theme;

  // Provide default values if theme properties are missing
  const defaultCartesian = { label: { fontSize: '14px' }, goalLine: { label: { fontSize: '12px' } } };
  const defaultDashboard = { card: { backgroundColor: 'white' } };
  const defaultQuestion = { backgroundColor: 'white' };

  const safeCartesian = cartesian ?? defaultCartesian;
  const safeDashboard = dashboard ?? defaultDashboard;
  const safeQuestion = question ?? defaultQuestion;

  // This allows sdk users to set the base font size,
  // which scales the visualization's font sizes.
  const baseFontSize = getSizeInPx(theme.fontSize) ?? 14;

  // ECharts requires font sizes in px for offset calculations.
  const px = (value: string) =>
    getSizeInPx(value, baseFontSize) ?? baseFontSize;

  return {
    cartesian: {
      label: { fontSize: px(safeCartesian.label.fontSize) },
      goalLine: {
        label: { fontSize: px(safeCartesian.goalLine.label.fontSize) },
      },
    },
    pie: {
      borderColor: isStaticViz
        ? color("text-white")
        : getPieBorderColor(
            safeDashboard.card.backgroundColor,
            safeQuestion.backgroundColor,
            isDashboard,
            isNightMode,
          ),
    },
  };
}

export const getDefaultVisualizationTheme = () => {
  const themeOverrides = getThemeOverrides();
  return getVisualizationTheme({
    theme: themeOverrides as Partial<MantineThemeOther>,
    isStaticViz: true,
  });
};

export const DEFAULT_VISUALIZATION_THEME = getDefaultVisualizationTheme();
