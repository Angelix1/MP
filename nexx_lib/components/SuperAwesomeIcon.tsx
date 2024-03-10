import { ReactNative as RN, stylesheet } from "@vendetta/metro/common";
import { semanticColors } from "@vendetta/ui";

export default function SuperAwesomeIcon({
  onPress,
  onLongPress,
  icon,
  style,
  destructive,
  color,
}: {
  onPress?: () => void;
  onLongPress?: () => void;
  destructive?: boolean;
  color?: any;
  icon: number;
  style: "header" | "card" | any;
}) {
  const styles = stylesheet.createThemedStyleSheet({
    headerStyleIcon: {
      width: 24,
      height: 24,
      marginRight: 10,
      tintColor: semanticColors.HEADER_PRIMARY,
    },
    cardStyleIcon: {
      width: 22,
      height: 22,
      marginLeft: 5,
      tintColor: semanticColors.INTERACTIVE_NORMAL,
    },
    destructiveIcon: {
      tintColor: semanticColors.TEXT_DANGER,
    },
  });

  return (
    <RN.TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <RN.Image
        style={[
          typeof style === "string"
            ? style === "header"
              ? styles.headerStyleIcon
              : styles.cardStyleIcon
            : style,
          destructive && styles.destructiveIcon,
          color && { tintColor: color },
        ].filter((x) => !!x)}
        source={icon}
      />
    </RN.TouchableOpacity>
  );
}
