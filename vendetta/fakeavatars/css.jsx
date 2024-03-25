import { constants, stylesheet } from "@vendetta/metro/common";
import { semanticColors } from "@vendetta/ui";

export const styles = stylesheet.createThemedStyleSheet({
	i_like_dark: {
		margin: 5,
		padding: 5,
		borderRadius: 10,
		backgroundColor: "rgba(0, 0, 0, 0.3)",
	},
	inputTextColor: {
		color: semanticColors.INPUT_PLACEHOLDER_TEXT,
	},
	inputTextStyling: {
		fontSize: 18,
		fontFamily: constants.Fonts.PRIMARY_MEDIUM,
		color: semanticColors.TEXT_NORMAL,
	},
});

