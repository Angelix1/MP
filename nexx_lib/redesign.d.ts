type ButtonVariant =
  | "primary"
  | "primary-on-blurple"
  | "primary-alt"
  | "primary-alt-on-blurple"
  | "secondary"
  | "secondary-alt"
  | "secondary-input"
  | "danger"
  | "positive";

type TextButtonIcon = React.FC<{
  source: import("react-native").ImageSourcePropType;
  variant?: "entity";
}>;

interface ContextMenuItem {
  label: string;
  iconSource?: import("react-native").ImageSourcePropType;
  IconComponent?: React.JSXElementConstructor;
  action: () => void;
}

export type Redesign = {
  Button: React.FC<{
    variant: ButtonVariant;
    size: "sm" | "md" | "lg";
    onPress?: () => any;
    text: string;
    icon?:
      | import("react-native").ImageSourcePropType
      | React.JSXElementConstructor;
    iconPosition?: "start" | "end";
    style?: import("react-native").StyleProp<import("react-native").ViewStyle>;
    disabled?: boolean;
    loading?: boolean;
  }> & {
    Icon: TextButtonIcon;
  };

  ContextMenu: React.FC<{
    triggerOnLongPress?: boolean;
    items?: ContextMenuItem[] | ContextMenuItem[][];
    align?: "left" | "below" | "above" | "right";
    title?: string;
    children?: () => React.ReactNode;
    disableGesture?: boolean;
    returnRef?: object;
  }>;

  TextInput: React.FC<{
    size?: "sm" | "md" | "lg";
    label?: string;
    description?: string;
    editable?: boolean;
    focusable?: boolean;
    placeholder?: string;
    placeholderTextColor?: string;
    defaultValue?: string;
    value?: string;
    isDisabled?: boolean;
    leadingPressableProps?: import("react-native").PressableProps;
    leadingIcon?: React.FC<any>;
    leadingText?: string;
    trailingPressableProps?: import("react-native").PressableProps;
    trailingIcon?: React.FC<any>;
    trailingText?: string;
    secureTextEntry?: boolean;
    isClearable?: boolean;
    status?: "error" | "default";
    errorMessage?: string;
    spellCheck?: boolean;
    isCentered?: boolean;
    returnKeyType?: "search";
    grow?: boolean;
    onChange?: (value: string) => void;
  }>;

  Slider: React.FC<{
    value: number;
    accessibilityLabel?: string;
    accessibilityValue?: {
      text: string;
    };
    step: number;
    onValueChange?: (value: number) => void;
    minimumValue: number;
    maximumValue: number;
    onSlidingStart?: () => void;
    onSlidingComplete?: () => void;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
  }>;
};
