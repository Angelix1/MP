(function(exports,plugin,storage,metro,common,ui,assets,components,_vendetta,toasts,patcher$1,utils,plugins){'use strict';const { ScrollView: ScrollView$4, View: View$4, Text: Text$4, TouchableOpacity: TouchableOpacity$4, TextInput: TextInput$4, Image: Image$4, Animated: Animated$4 } = components.General;
const { FormLabel: FormLabel$4, FormIcon: FormIcon$6, FormArrow: FormArrow$4, FormRow: FormRow$7, FormSwitch: FormSwitch$6, FormSwitchRow: FormSwitchRow$4, FormSection: FormSection$4, FormDivider: FormDivider$5, FormInput: FormInput$5 } = components.Forms;
const current = assets.getAssetIDByName("ic_radio_square_checked_24px");
const older = assets.getAssetIDByName("ic_radio_square_24px");
const info = assets.getAssetIDByName("ic_information_24px");
assets.getAssetIDByName("ic_info");
const newStuff = assets.getAssetIDByName("premium_sparkles");
const updatedStuff = assets.getAssetIDByName("ic_sync_24px");
const fixStuff = assets.getAssetIDByName("ic_progress_wrench_24px");
const styles = common.stylesheet.createThemedStyleSheet({
  border: {
    borderRadius: 10
  },
  textBody: {
    color: ui.semanticColors.TEXT_NORMAL,
    fontFamily: common.constants.Fonts.PRIMARY_MEDIUM,
    letterSpacing: 0.25,
    fontSize: 22
  },
  textBody: {
    color: ui.semanticColors.INPUT_PLACEHOLDER_TEXT,
    fontFamily: common.constants.Fonts.DISPLAY_NORMAL,
    letterSpacing: 0.25,
    fontSize: 16
  },
  versionBG: {
    margin: 10,
    padding: 15,
    backgroundColor: "rgba(55, 149, 225, 0.3)"
  },
  rowLabel: {
    margin: 10,
    padding: 15,
    backgroundColor: "rgba(33, 219, 222, 0.34)"
  }
});
function addIcon(icon) {
  return /* @__PURE__ */ common.React.createElement(FormIcon$6, {
    style: {
      opacity: 1
    },
    source: icon
  });
}
function VersionChange(param) {
  let { change, index, totalIndex } = param;
  const [isOpen, setOpen] = common.React.useState(false);
  const [isRowOpen, setRowOpen] = common.React.useState(false);
  function createSubRow(arr, label, subLabel, icon) {
    return /* @__PURE__ */ common.React.createElement(View$4, null, /* @__PURE__ */ common.React.createElement(FormRow$7, {
      label: label || "No Section",
      subLabel: subLabel || null,
      leading: icon && addIcon(icon),
      style: [
        styles.textHeader
      ]
    }), arr.map(function(x, i) {
      return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$7, {
        label: x,
        style: [
          styles.textBody,
          styles.rowLabel,
          styles.border
        ]
      }));
    }));
  }
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(components.ErrorBoundary, null, /* @__PURE__ */ common.React.createElement(FormRow$7, {
    label: change?.version,
    leading: index == 0 ? addIcon(current) : addIcon(older),
    trailing: addIcon(info),
    onPress: function() {
      setOpen(!isOpen);
    }
  }), isOpen && /* @__PURE__ */ common.React.createElement(View$4, {
    style: [
      styles.versionBG,
      styles.border
    ]
  }, change?.new?.length > 0 && createSubRow(change.new, "New", "New stuffies", newStuff), change?.updated?.length > 0 && createSubRow(change.updated, "Changes", "Update things", updatedStuff), change?.fix?.length > 0 && createSubRow(change.fix, "Fixes", "Me hate borken things", fixStuff)), index == totalIndex.length - 1 ? void 0 : /* @__PURE__ */ common.React.createElement(FormDivider$5, null)));
}const { openLazy, hideActionSheet } = metro.findByProps("openLazy", "hideActionSheet");
function makeDefaults(object, defaults) {
  if (object != void 0) {
    if (defaults != void 0) {
      for (const key of Object.keys(defaults)) {
        if (typeof defaults[key] === "object" && !Array.isArray(defaults[key])) {
          if (typeof object[key] !== "object")
            object[key] = {};
          makeDefaults(object[key], defaults[key]);
        } else {
          object[key] ?? (object[key] = defaults[key]);
        }
      }
    }
  }
}
function openSheet(sheet, props) {
  try {
    openLazy(new Promise(function(call) {
      return call({
        default: sheet
      });
    }), "ActionSheet", props);
  } catch (e) {
    _vendetta.logger.error(e.stack);
    showToast("Got error when opening ActionSheet! Please check debug logs");
  }
}
function numToHex(numericColor) {
  const red = numericColor >> 16 & 255;
  const green = numericColor >> 8 & 255;
  const blue = numericColor & 255;
  return `#${(1 << 24 | red << 16 | green << 8 | blue).toString(16).slice(1)}`;
}
function createList(version) {
  let a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null, u = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null, f = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    version,
    new: a,
    updated: u,
    fix: f
  };
}
const transparentBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mJsrQAAAgwBAJ9P6qYAAAAASUVORK5CYII=";
function validateHex(input) {
  let defaultColor = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "#000";
  if (!input)
    input = defaultColor;
  const trimmedInput = input?.trim();
  if (trimmedInput.startsWith("#")) {
    const hexCode = trimmedInput.slice(1);
    if (/^[0-9A-Fa-f]{6}$/.test(hexCode)) {
      return "#" + hexCode.toUpperCase();
    }
  } else {
    if (/^[0-9A-Fa-f]{6}$/.test(trimmedInput)) {
      return "#" + trimmedInput.toUpperCase();
    }
  }
  return defaultColor;
}
const convert = {
  toPercentage: function(decimalValue) {
    decimalValue = Number(decimalValue);
    return decimalValue === 0 ? 0 : decimalValue === 1 ? 100 : Math.round(decimalValue * 100);
  },
  toDecimal: function(percentageValue) {
    percentageValue = Number(percentageValue);
    const clampedPercentage = Math.min(Math.max(percentageValue, 0), 100);
    return clampedPercentage === 0 ? 0 : clampedPercentage === 100 ? 1 : clampedPercentage / 100;
  },
  formatDecimal: function(decimalValue) {
    decimalValue = Number(decimalValue);
    return decimalValue === 0 || decimalValue === 1 ? decimalValue : decimalValue.toFixed(2);
  },
  alphaToHex: function(percentageValue) {
    percentageValue = Number(percentageValue);
    const clampedPercentage = Math.min(Math.max(percentageValue, 0), 100);
    const hexValue = Math.round(clampedPercentage / 100 * 255).toString(16).toUpperCase();
    return hexValue.length === 1 ? "0" + hexValue : hexValue;
  },
  hexAlphaToPercent: function(hexAlpha) {
    const decimalAlpha = parseInt(hexAlpha, 16);
    if (isNaN(decimalAlpha)) {
      return 0;
    }
    return Math.round(decimalAlpha / 255 * 100);
  }
};
function withinChance(percentage) {
  const random = Math.random();
  return random < percentage / 100;
}function ma() {
  for (var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++) {
    a[_key] = arguments[_key];
  }
  return [
    ...a
  ];
}
const update = [
  createList("1.0.0", ma("Created the Plugin")),
  createList("1.0.1 - 1.0.3", ma("[1.0.1] Added Remove Decor", "[1.0.1] Customization for reply alert", "[1.0.1] Option to revert locally edited message (wipe on unload of the plugin)", "[1.0.22] Setting for Quick Id", "[1.0.22] Option to toggle Force alert", "[1.0.22] Preview for ReplyAlert"), ma("[1.0.2] Remove Custom Timestamp", "[1.0.24] EML will wipe its log when onunload and revert every message its edit", "[1.0.3] Update EML, QID buttons"), ma("[1.0.21] Fix Cactus", "[1.0.22] Fix No Share fails to find Share button", "[1.0.23] Fix Quick ID removing edit message button", "[1.0.3] Fixed EML button fails to append under Reply Button", "[1.0.3] Fixed QID buttons fails to append to a correct place")),
  createList("1.1", ma("[1.1.0] Added Custom Username Color", "[1.1.0] Added Custom Role Icon"), ma("[1.1.0] Separated reply alert and custom mention to be their own thing")),
  createList("1.2", null, ma("[1.2] Removed EML due possibly harmful use case"))
];
var updates = update.reverse();const { ScrollView: ScrollView$3, View: View$3, Text: Text$3, TouchableOpacity: TouchableOpacity$3, TextInput: TextInput$3, Pressable: Pressable$3, Image: Image$3, Animated: Animated$3, Component: Component$3 } = components.General;
const { FormLabel: FormLabel$3, FormIcon: FormIcon$5, FormArrow: FormArrow$3, FormRow: FormRow$6, FormSwitch: FormSwitch$5, FormSwitchRow: FormSwitchRow$3, FormSection: FormSection$3, FormDivider: FormDivider$4, FormInput: FormInput$4, FormRadioRow: FormRadioRow$3, FormSliderRow } = components.Forms;
const CustomColorPickerActionSheet$1 = metro.findByName("CustomColorPickerActionSheet");
function ReplyAlertSetting() {
  storage.useProxy(plugin.storage);
  const reply = plugin.storage.utils.replyAlert;
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$6, {
    label: "Toggle Force Alert",
    subLabel: "When someone replying to your message with mention disabled, this option will force ping you",
    trailing: /* @__PURE__ */ common.React.createElement(FormSwitch$5, {
      value: reply?.useReplyAlert || false,
      onValueChange: function(value) {
        reply.useReplyAlert = value;
      }
    })
  }), /* @__PURE__ */ common.React.createElement(FormDivider$4, null), /* @__PURE__ */ common.React.createElement(FormRow$6, {
    label: "Ignore self Reply",
    subLabel: "When replying to own message, do not ping",
    trailing: /* @__PURE__ */ common.React.createElement(FormSwitch$5, {
      value: reply?.ignoreSelf || false,
      onValueChange: function(value) {
        reply.ignoreSelf = value;
      }
    })
  }));
}
function CustomMentionsSetting() {
  storage.useProxy(plugin.storage);
  const reply = plugin.storage.utils.replyAlert;
  const [CA, setCA] = common.React.useState(convert.toDecimal(convert.hexAlphaToPercent(reply.colorAlpha) || 100));
  const [GA, setGA] = common.React.useState(convert.toDecimal(convert.hexAlphaToPercent(reply.gutterAlpha) || 100));
  const colorSet = function() {
    return openSheet(CustomColorPickerActionSheet$1, {
      color: common.ReactNative.processColor(reply?.customColor) || 0,
      onSelect: function(color) {
        const hex = numToHex(color);
        reply.customColor = hex;
        if (plugin.storage?.debug)
          _vendetta.logger.log("Reply Alert BG Color", "[Changed]", hex);
      }
    });
  };
  const gutterSet = function() {
    return openSheet(CustomColorPickerActionSheet$1, {
      color: common.ReactNative.processColor(reply?.customColor) || 0,
      onSelect: function(color) {
        const hex = numToHex(color);
        reply.gutterColor = hex;
        if (plugin.storage?.debug)
          _vendetta.logger.log("Reply Alert Gutter Color", "[Changed]", hex);
      }
    });
  };
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$6, {
    label: "Preview",
    subLabel: "How it looks in the chat"
  }), /* @__PURE__ */ common.React.createElement(View$3, {
    style: [
      {
        flexDirection: "row",
        height: 80,
        width: "100%",
        overflow: "hidden",
        borderRadius: 12,
        marginBottom: 20,
        marginRight: 10,
        marginLeft: 10
      }
    ]
  }, /* @__PURE__ */ common.React.createElement(View$3, {
    style: {
      width: "2%",
      backgroundColor: `${reply?.gutterColor}${convert.alphaToHex(convert.toPercentage(GA))}`
    }
  }), /* @__PURE__ */ common.React.createElement(View$3, {
    style: {
      flex: 1,
      backgroundColor: `${reply?.customColor}${convert.alphaToHex(convert.toPercentage(CA))}`,
      justifyContent: "center",
      alignItems: "center"
    }
  }, /* @__PURE__ */ common.React.createElement(Text$3, {
    style: {
      fontSize: 20,
      color: "#FFFFFF"
    }
  }, " Example White Text "), /* @__PURE__ */ common.React.createElement(Text$3, {
    style: {
      fontSize: 20,
      color: "#000000"
    }
  }, " Example Black Text "))), /* @__PURE__ */ common.React.createElement(FormDivider$4, null), /* @__PURE__ */ common.React.createElement(FormRow$6, {
    label: "Background Color",
    subLabel: "Click to Update",
    onPress: colorSet,
    trailing: /* @__PURE__ */ common.React.createElement(TouchableOpacity$3, {
      onPress: colorSet
    }, /* @__PURE__ */ common.React.createElement(Image$3, {
      source: {
        uri: transparentBase64
      },
      style: {
        width: 128,
        height: 128,
        borderRadius: 10,
        backgroundColor: reply?.customColor || "#000"
      }
    }))
  }), /* @__PURE__ */ common.React.createElement(FormDivider$4, null), /* @__PURE__ */ common.React.createElement(FormRow$6, {
    label: "Gutter Color",
    subLabel: "Click to Update",
    onPress: gutterSet,
    trailing: /* @__PURE__ */ common.React.createElement(TouchableOpacity$3, {
      onPress: gutterSet
    }, /* @__PURE__ */ common.React.createElement(Image$3, {
      source: {
        uri: transparentBase64
      },
      style: {
        width: 128,
        height: 128,
        borderRadius: 10,
        backgroundColor: reply?.gutterColor || "#000"
      }
    }))
  }), /* @__PURE__ */ common.React.createElement(FormDivider$4, null), /* @__PURE__ */ common.React.createElement(FormSliderRow, {
    label: `Background Color Alpha: ${convert.toPercentage(CA)}%`,
    value: CA,
    style: {
      width: "90%"
    },
    onValueChange: function(v) {
      setCA(Number(convert.formatDecimal(v)));
      reply.colorAlpha = convert.alphaToHex(convert.toPercentage(v));
    }
  }), /* @__PURE__ */ common.React.createElement(FormDivider$4, null), /* @__PURE__ */ common.React.createElement(FormSliderRow, {
    label: `Gutter Color Alpha: ${convert.toPercentage(GA)}%`,
    value: GA,
    style: {
      width: "90%"
    },
    onValueChange: function(v) {
      setGA(Number(convert.formatDecimal(v)));
      reply.gutterAlpha = convert.alphaToHex(convert.toPercentage(v));
    }
  }));
}const { FormRow: FormRow$5, FormSwitch: FormSwitch$4 } = components.Forms;
function NoShareSetting() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$5, {
    label: "Add Save Image Button to Image ActionSheet",
    subLabel: "if Built-in Save Image gone",
    trailing: /* @__PURE__ */ React.createElement(FormSwitch$4, {
      value: plugin.storage?.utils?.noshare?.addSaveImage || false,
      onValueChange: function(value) {
        plugin.storage.utils.noshare.addSaveImage = value;
      }
    })
  }));
}const { FormInput: FormInput$3 } = components.Forms;
function CAT() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormInput$3, {
    title: "Name",
    keyboardType: "default",
    placeholder: "Angel",
    value: plugin.storage?.utils?.cactus?.name,
    onChange: function(val) {
      return plugin.storage.utils.cactus.name = val.toString();
    }
  }));
}const { FormRow: FormRow$4, FormSwitch: FormSwitch$3, FormDivider: FormDivider$3 } = components.Forms;
function QuickIdSetting() {
  storage.useProxy(plugin.storage);
  const cl = function(label, subLabel, key) {
    return {
      label,
      subLabel,
      key
    };
  };
  const lists = [
    cl("Id", "add Copy User Id", "addID"),
    cl("Mention", "add Copy User Mention", "addMention"),
    cl("Id and Mention", "add Copy User Id & Mention", "addCombine")
  ];
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, lists.map(function(el, i) {
    return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$4, {
      label: el?.label || "Missing Label",
      subLabel: el?.subLabel,
      trailing: /* @__PURE__ */ common.React.createElement(FormSwitch$3, {
        value: plugin.storage?.utils?.quickid?.[el?.key] || false,
        onValueChange: function(value) {
          plugin.storage.utils.quickid[el.key] = value;
        }
      })
    }), i !== lists?.length - 1 && /* @__PURE__ */ common.React.createElement(FormDivider$3, null));
  }), /* @__PURE__ */ common.React.createElement(FormDivider$3, null));
}const CustomColorPickerActionSheet = metro.findByName("CustomColorPickerActionSheet");
const { ScrollView: ScrollView$2, View: View$2, Text: Text$2, TouchableOpacity: TouchableOpacity$2, TextInput: TextInput$2, Pressable: Pressable$2, Image: Image$2, Animated: Animated$2, Component: Component$2 } = components.General;
const { FormLabel: FormLabel$2, FormIcon: FormIcon$4, FormArrow: FormArrow$2, FormRow: FormRow$3, FormSwitch: FormSwitch$2, FormSwitchRow: FormSwitchRow$2, FormSection: FormSection$2, FormDivider: FormDivider$2, FormInput: FormInput$2, FormRadioRow: FormRadioRow$2 } = components.Forms;
const switches = [
  {
    id: "enableReply",
    label: "Patch reply",
    subLabel: "also replace username color in mentioned referenced message",
    icon: null,
    def: false
  }
];
function CustomUsernameColorPage() {
  const SUCUC = plugin.storage?.utils?.customUsernameColor;
  const whenPressed = function() {
    return openSheet(CustomColorPickerActionSheet, {
      color: common.ReactNative.processColor(SUCUC?.hex) || 0,
      onSelect: function(color) {
        const hex = numToHex(color);
        SUCUC.hex = hex;
      }
    });
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$3, {
    label: "Color",
    subLabel: "Click to Update",
    onPress: whenPressed,
    trailing: /* @__PURE__ */ React.createElement(TouchableOpacity$2, {
      onPress: whenPressed
    }, /* @__PURE__ */ React.createElement(Image$2, {
      source: {
        uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mJsrQAAAgwBAJ9P6qYAAAAASUVORK5CYII="
      },
      style: {
        width: 128,
        height: 128,
        borderRadius: 10,
        backgroundColor: SUCUC?.hex || "#000000"
      }
    }))
  }), /* @__PURE__ */ React.createElement(FormDivider$2, null), switches?.map(function(obj, index) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$3, {
      label: obj?.label,
      subLabel: obj?.subLabel,
      leading: obj?.icon && /* @__PURE__ */ React.createElement(FormIcon$4, {
        style: {
          opacity: 1
        },
        source: assets.getAssetIDByName(obj?.icon)
      }),
      trailing: "id" in obj ? /* @__PURE__ */ React.createElement(FormSwitch$2, {
        value: plugin.storage?.utils?.customUsernameColor[obj?.id] ?? obj?.def,
        onValueChange: function(value) {
          return plugin.storage.utils.customUsernameColor[obj?.id] = value;
        }
      }) : void 0
    }), index !== switches?.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$2, null));
  }));
}const defaultImageURL = "https://cdn.discordapp.com/role-icons/1222207470714486825/bc3ef24c3f220155f90e55cc0cb0d0cf.png?size=512";
const { ScrollView: ScrollView$1, View: View$1, Text: Text$1, TouchableOpacity: TouchableOpacity$1, TextInput: TextInput$1, Pressable: Pressable$1, Image: Image$1, Animated: Animated$1, Component: Component$1 } = components.General;
const { FormLabel: FormLabel$1, FormIcon: FormIcon$3, FormArrow: FormArrow$1, FormRow: FormRow$2, FormSwitch: FormSwitch$1, FormSwitchRow: FormSwitchRow$1, FormSection: FormSection$1, FormDivider: FormDivider$1, FormInput: FormInput$1, FormRadioRow: FormRadioRow$1 } = components.Forms;
const textInput = [
  {
    id: "name",
    label: "Role Icon Name",
    keyType: "default",
    placeholder: "BlobCatSip",
    def: "BlobCatSip"
  },
  {
    id: "source",
    label: "Role Icon Image Url",
    keyType: "default",
    placeholder: "https://cdn.discordapp.com/role-icons/1222207470714486825/bc3ef24c3f220155f90e55cc0cb0d0cf.png?size=512",
    def: defaultImageURL
  },
  {
    id: "size",
    label: "Size of the Image",
    keyType: "number",
    placeholder: "18",
    def: 18
  }
];
function CustomRoleIconPage() {
  const SUCRI = plugin.storage?.utils?.customRoleIcon;
  const copyDefaultURL = function() {
    common.clipboard.setString("https://cdn.discordapp.com/role-icons/1222207470714486825/bc3ef24c3f220155f90e55cc0cb0d0cf.png?size=512");
    toasts.showToast("Copied placeholder URL", assets.getAssetIDByName("toast_copy_link"));
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$2, {
    label: "Icon Preview",
    trailing: /* @__PURE__ */ React.createElement(TouchableOpacity$1, {
      onPress: copyDefaultURL
    }, /* @__PURE__ */ React.createElement(Image$1, {
      source: {
        uri: SUCRI?.source || defaultImageURL
      },
      style: {
        width: 128,
        height: 128,
        borderRadius: 10
      }
    }))
  }), /* @__PURE__ */ React.createElement(FormDivider$1, null), textInput?.map(function(obj, index) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormInput$1, {
      title: obj.label,
      keyboardType: obj?.keyType,
      placeholder: obj?.placeholder,
      value: SUCRI[obj?.id] ?? obj?.def,
      onChange: function(val) {
        return SUCRI[obj?.id] = val.toString();
      }
    }), index !== textInput?.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$1, null));
  }));
}const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated, Component } = components.General;
const { FormLabel, FormIcon: FormIcon$2, FormArrow, FormRow: FormRow$1, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormRadioRow } = components.Forms;
function settingPage() {
  storage.useProxy(plugin.storage);
  const createList = function(id, title, label, subLabel, props) {
    return {
      id,
      title,
      label,
      subLabel,
      props
    };
  };
  const PageChildren = [
    createList("cactus", "Cactus", "Toggle uhhh.. something", null, CAT),
    createList("notype", "No Type", "Toggle No Typings", null, null),
    createList("quickid", "QID", "Toggle Quick ID Setting", null, QuickIdSetting),
    createList("noshare", "No Share", "Toggle No Share", null, NoShareSetting),
    createList("customUsernameColor", "CUC", "Toggle Custom Username Color", null, CustomUsernameColorPage),
    createList("customRoleIcon", "CRI", "Toggle Custom Role Icon", null, CustomRoleIconPage),
    createList("ralert", "Reply Alert", "Toggle Settings", null, ReplyAlertSetting),
    createList("customMention", "Custom Mentions", "Toggle Custom Mentions Settings", null, CustomMentionsSetting),
    createList("removeDecor", "I HATE AVATAR DECORATIONS", "Toggle Remove Avatar Decoration", null, null)
  ];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ScrollView, null, /* @__PURE__ */ React.createElement(View, {
    style: {
      borderRadius: 10,
      backgroundColor: "rgba(0, 12, 46, 0.15)"
    }
  }, /* @__PURE__ */ React.createElement(FormRow$1, {
    label: "Debug",
    subLabel: "enable console logging",
    trailing: /* @__PURE__ */ React.createElement(FormSwitch, {
      value: plugin.storage.debug,
      onValueChange: function(value) {
        plugin.storage.debug = value;
      }
    })
  }), /* @__PURE__ */ React.createElement(FormDivider, null), PageChildren.map(function(element, i) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormSection, {
      title: element?.title
    }, /* @__PURE__ */ React.createElement(FormRow$1, {
      label: element?.label,
      subLabel: element?.subLabel,
      trailing: /* @__PURE__ */ React.createElement(FormSwitch, {
        value: plugin.storage.toggle[element?.id],
        onValueChange: function(value) {
          plugin.storage.toggle[element?.id] = value;
        }
      })
    }), plugin.storage.toggle[element.id] && element.props && /* @__PURE__ */ React.createElement(View, {
      style: {
        margin: 5,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "rgba(0, 0, 0, 0.15)"
      }
    }, /* @__PURE__ */ React.createElement(element.props, null))));
  })), /* @__PURE__ */ React.createElement(FormDivider, null), updates && /* @__PURE__ */ React.createElement(View, {
    style: {
      paddingBottom: 36
    }
  }, /* @__PURE__ */ React.createElement(FormSection, {
    title: "Updates"
  }, /* @__PURE__ */ React.createElement(View, {
    style: {
      margin: 5,
      padding: 5,
      borderRadius: 10,
      backgroundColor: "rgba(59, 30, 55, 0.15)"
    }
  }, updates.map(function(data, index) {
    return /* @__PURE__ */ React.createElement(VersionChange, {
      change: data,
      index,
      totalIndex: updates.length
    });
  }))))));
}const UserStore$3 = metro.findByStoreName("UserStore");
metro.findByProps("getMessage", "getMessages");
const selfId = UserStore$3?.getCurrentUser?.()?.id;
function replyAlertPatch(event) {
  if (event.type == "MESSAGE_CREATE") {
    const check1 = event?.message?.referenced_message?.author?.id == selfId;
    const check2 = event?.message?.mentions?.some(function(e) {
      return e?.id === selfId;
    });
    if (plugin.storage?.utils?.replyAlert?.useReplyAlert) {
      if (check1 || check2) {
        if (event?.message?.author?.id != selfId) {
          event.message.mentions.push({
            id: selfId
          });
        } else {
          if (plugin.storage?.utils?.replyAlert?.ignoreSelf == false) {
            event.message.mentions.push({
              id: selfId
            });
          }
        }
      }
    }
  }
}
function updateRowCustomMentionPatch(row) {
  const { gutterColor, customColor, gutterAlpha, colorAlpha } = plugin.storage?.utils?.replyAlert;
  if (plugin.storage?.toggle?.customMention && row?.message?.mentioned) {
    row.backgroundHighlight ?? (row.backgroundHighlight = {});
    const backgroundRow = validateHex(customColor, "#DAFFFF");
    const gutterColorColor = validateHex(gutterColor, "#121212");
    row.backgroundHighlight = {
      backgroundColor: common.ReactNative.processColor(`${backgroundRow}${colorAlpha}`),
      gutterColor: common.ReactNative.processColor(`${gutterColorColor}${gutterAlpha}`)
    };
  }
  return row;
}function fluxDispatch() {
  return patcher$1.before("dispatch", common.FluxDispatcher, function(param) {
    let [event] = param;
    if (exports.isEnabled) {
      replyAlertPatch(event);
    }
  });
}const { ActionSheetRow } = metro.findByProps("ActionSheetRow");
function quickCopyID(component, args, actionMessage, ActionSheet) {
  if (args == "MessageLongPressActionSheet" && plugin.storage?.toggle?.quickid) {
    const message = actionMessage?.message;
    if (!message)
      return;
    component.then(function(instance) {
      const unpatch = patcher$1.after("default", instance, function(_, comp) {
        common.React.useEffect(function() {
          return function() {
            unpatch();
          };
        }, []);
        const buttons = utils.findInReactTree(comp, function(c) {
          return c?.find?.(function(child) {
            return child?.props?.label == common.i18n?.Messages?.MENTION;
          });
        });
        if (!buttons)
          return comp;
        const position = Math.max(buttons.findIndex(function(x) {
          return x?.props?.label == common.i18n?.Messages?.MENTION;
        }), buttons.length - 1);
        if (plugin.storage.debug) {
          console.log(buttons);
          console.log("Position => " + position);
        }
        function createButton(label, sub, icon, callback) {
          return {
            label,
            sub,
            icon,
            callback
          };
        }
        let customButtons = [];
        const { addID, addMention, addCombine } = plugin.storage?.utils?.quickid;
        if (addID) {
          customButtons.push(createButton("Copy User's Id", "Result: <Some ID>", "ic_copy_id", function() {
            ActionSheet.hideActionSheet();
            common.clipboard.setString(message?.author?.id ?? "");
            toasts.showToast("Copied User's ID to clipboard", assets.getAssetIDByName("toast_copy_link"));
          }));
        }
        if (addMention) {
          customButtons.push(createButton("Copy User's Mention", "Result: <Mention>", "ic_copy_id", function() {
            ActionSheet.hideActionSheet();
            common.clipboard.setString(`<@${message?.author?.id ?? ""}>`);
            toasts.showToast("Copied User's Mention to clipboard", assets.getAssetIDByName("toast_copy_link"));
          }));
        }
        if (addCombine) {
          customButtons.push(createButton("Copy User's Id and Mention", "Result: <Some ID> <Mention>", "ic_copy_id", function() {
            ActionSheet.hideActionSheet();
            common.clipboard.setString(`${message?.author?.id ?? ""} <@${message?.author?.id ?? ""}>`);
            toasts.showToast("Copied User to clipboard", assets.getAssetIDByName("toast_copy_link"));
          }));
        }
        customButtons.reverse();
        if (position >= 0) {
          buttons.splice(position, 1);
        }
        for (const btn of customButtons) {
          const newButton = /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(ActionSheetRow, {
            label: btn?.label,
            subLabel: btn?.sub,
            icon: btn?.icon && /* @__PURE__ */ common.React.createElement(ActionSheetRow.Icon, {
              source: assets.getAssetIDByName(btn?.icon)
            }),
            onPress: btn?.callback
          }));
          if (position >= 0) {
            buttons.splice(position, 0, newButton);
          } else {
            buttons.push(newButton);
          }
        }
      });
    });
  }
}const { FormIcon: FormIcon$1 } = components.Forms;const { downloadMediaAsset } = metro.findByProps("downloadMediaAsset");
const { FormRow, FormIcon } = components.Forms;
function noShare(component, args, actionMessage, ActionSheet) {
  if (plugin.storage?.toggle?.noshare) {
    if (args == "MediaShareActionSheet") {
      component.then(function(instance) {
        const unpatch = patcher$1.after("default", instance, function(param, res) {
          let [{ syncer }] = param;
          common.React.useEffect(function() {
            return unpatch();
          }, []);
          let urlsource = syncer.sources[syncer.index.value];
          if (Array.isArray(urlsource))
            urlsource = urlsource[0];
          const targetURL = urlsource.sourceURI ?? urlsource.uri;
          const buttonRows = res.props.children.props.children;
          const position = buttonRows.findIndex(function(x) {
            return x?.props?.label === common.i18n?.Messages?.SHARE || x?.props?.label === "Share";
          });
          const leButton = /* @__PURE__ */ common.React.createElement(FormRow, {
            label: "Copy Image Link",
            subLabel: "Added by Azzy Util",
            leading: /* @__PURE__ */ common.React.createElement(FormIcon, {
              style: {
                opacity: 1
              },
              source: assets.getAssetIDByName("ic_message_copy")
            }),
            onPress: function() {
              ActionSheet.hideActionSheet();
              common.clipboard.setString(targetURL);
              toasts.showToast("Link copied");
            }
          });
          const saveButton = /* @__PURE__ */ common.React.createElement(FormRow, {
            label: "Save Image",
            subLabel: "Added by Azzy Util",
            leading: /* @__PURE__ */ common.React.createElement(FormIcon, {
              style: {
                opacity: 1
              },
              source: assets.getAssetIDByName("ic_download_24px")
            }),
            onPress: function() {
              ActionSheet.hideActionSheet();
              downloadMediaAsset(targetURL, 0);
              toasts.showToast(`Downloading image`, assets.getAssetIDByName("toast_image_saved"));
            }
          });
          const arr = [
            leButton
          ];
          if (plugin.storage.utils.noshare.addSaveImage) {
            arr.push(saveButton);
          }
          if (buttonRows) {
            if (position >= 0) {
              buttonRows.splice(position, 1);
              for (const b of arr) {
                buttonRows.splice(position, 0, b);
              }
            } else {
              buttonRows.push(...arr);
            }
          }
        });
      });
    }
  }
}const ActionSheet = metro.findByProps("openLazy", "hideActionSheet");
function actionSheet() {
  return patcher$1.before("openLazy", ActionSheet, function(param) {
    let [component, args, actionMessage] = param;
    if (exports.isEnabled) {
      quickCopyID(component, args, actionMessage, ActionSheet);
      noShare(component, args, actionMessage, ActionSheet);
    }
  });
}const UserStore$2 = metro.findByStoreName("UserStore");
function patchCustomUsernameColor(row) {
  if (row?.message) {
    let { hex, enableReply } = plugin.storage?.utils?.customUsernameColor;
    hex ?? (hex = "#000");
    enableReply ?? (enableReply = false);
    const handleColor = function(mes) {
      if (hex)
        mes.usernameColor = common.ReactNative.processColor(hex);
      return mes;
    };
    if (plugin.storage?.debug)
      console.log("[AZZYUTILS cuc.js]", row.message.authorId, row?.message?.referencedMessage?.message?.authorId);
    if (UserStore$2?.getCurrentUser?.()?.id == row?.message?.authorId)
      handleColor(row?.message);
    if (enableReply && row?.message?.referencedMessage?.message && UserStore$2?.getCurrentUser?.()?.id == row?.message?.referencedMessage?.message?.authorId) {
      handleColor(row?.message?.referencedMessage?.message);
    }
    return row;
  }
}const UserStore$1 = metro.findByStoreName("UserStore");
function patchCustomRoleIcon(row) {
  if (row?.message) {
    if (UserStore$1?.getCurrentUser?.()?.id == row?.message?.authorId) {
      const CRI = plugin.storage?.utils?.customRoleIcon;
      let roleIconObject = {};
      if (!CRI?.name && !CRI?.source && !CRI?.size) {
        roleIconObject = {
          name: "BlobCatSip",
          source: "https://cdn.discordapp.com/role-icons/1222207470714486825/bc3ef24c3f220155f90e55cc0cb0d0cf.png?size=512",
          alt: "Role icon, BlobCatSip",
          size: 18
        };
      } else {
        roleIconObject.name = CRI.name;
        roleIconObject.source = CRI.source;
        roleIconObject.size = CRI.size;
        roleIconObject.alt = `Role icon, ${CRI.name}`;
      }
      row.message.roleIcon = roleIconObject;
    }
    return row;
  }
}const { DCDChatManager } = common.ReactNative.NativeModules;
const patchUpdateRowBefore = function() {
  return patcher$1.before("updateRows", DCDChatManager, function(r) {
    if (exports.isEnabled) {
      let rows = JSON.parse(r[1]);
      if (plugin.storage?.debug)
        console.log("[AZZYUTILS update_rows.js] ========== updateRows rows ==========");
      rows.forEach(function(row) {
        if (plugin.storage?.debug)
          console.log(row);
        updateRowCustomMentionPatch(row);
        if (plugin.storage?.toggle?.customUsernameColor)
          patchCustomUsernameColor(row);
        if (plugin.storage?.toggle?.customRoleIcon)
          patchCustomRoleIcon(row);
      });
      if (plugin.storage?.debug)
        console.log("=====================================");
      r[1] = JSON.stringify(rows);
      return r[1];
    }
  });
};
const patchUpdateRowAfter = function() {
  return patcher$1.after("updateRows", DCDChatManager, function(r) {
    if (exports.isEnabled) {
      let rows = JSON.parse(r[1]);
      rows.forEach(function(row) {
        updateRowCustomMentionPatch(row);
      });
      r[1] = JSON.stringify(rows);
      return r[1];
    }
  });
};const Typing = metro.findByProps("startTyping");
const startTyping = function() {
  return patcher$1.instead("startTyping", Typing, function() {
  });
};
const stopTyping = function() {
  return patcher$1.instead("stopTyping", Typing, function() {
  });
};const Messages$1 = metro.findByProps("startEditMessage");
const beforeStartEdit = function() {
  return patcher$1.before("startEditMessage", Messages$1, function(args) {
  });
};
const beforeEdit = function() {
  return patcher$1.before("editMessage", Messages$1, function(args) {
  });
};function removeDecorGetUser(user) {
  if (user?.avatarDecorationData && plugin.storage?.toggle?.removeDecor) {
    user.avatarDecorationData = null;
  }
  return user;
}const UserStore = metro.findByStoreName("UserStore");
const getUser = function() {
  return patcher$1.after("getUser", UserStore, function(_, user) {
    if (exports.isEnabled) {
      removeDecorGetUser(user);
    }
  });
};const yapsArray = [
  "Rawr~",
  "Nyaa",
  "Don't touch my tail!",
  "Maawww! Nappy!",
  "Awowooo",
  "I can chase butterflies all day!",
  "Cuddles?!",
  "These ears pick up everything :3",
  "Shiny things~",
  "Belly rubs, yay",
  "Am cute",
  "Snuggles",
  "Tails",
  "Pawbs",
  "Boxes, owo",
  "Feeling cuddly today!",
  "Feeling cute"
];
function Cactus(message) {
  if (plugin.storage?.toggle?.cactus && message?.content?.length > 25 && withinChance(3)) {
    const randomIndex = Math.floor(Math.random() * yapsArray.length);
    message.content = `${message?.content}

*${yapsArray[randomIndex]}*  - \`${plugin.storage?.utils?.cactus?.name || "Angel"}\``;
  }
}const Messages = metro.findByProps("sendMessage", "receiveMessage");
function sendMessage() {
  return patcher$1.before("sendMessage", Messages, function(args) {
    if (exports.isEnabled) {
      Cactus(args[1]);
    }
  });
}makeDefaults(plugin.storage, {
  toggle: {
    ctime: false,
    ralert: false,
    customMention: false,
    notype: false,
    quickid: false,
    eml: false,
    noshare: false,
    removeDecor: false,
    cactus: false,
    customUsernameColor: false,
    customRoleIcon: false,
    customClan: false
  },
  utils: {
    cactus: {
      name: ""
    },
    quickid: {
      addID: false,
      addMention: false,
      addCombine: false
    },
    replyAlert: {
      customColor: "#000",
      gutterColor: "#FFF",
      colorAlpha: "33",
      gutterAlpha: "33",
      useReplyAlert: false,
      useCustomColor: false,
      ignoreSelf: false
    },
    eml: {
      logEdit: false,
      editedMsg: []
    },
    noshare: {
      addSaveImage: false,
      addCopyImage: false
    },
    customUsernameColor: {
      hex: "#FFFFFF",
      enableReply: false
    },
    customRoleIcon: {
      name: "BlobCatSip",
      source: "https://cdn.discordapp.com/role-icons/1222207470714486825/bc3ef24c3f220155f90e55cc0cb0d0cf.png?size=512",
      size: 18,
      showOthers: false
    },
    customClan: {
      icon: "",
      tag: ""
    }
  },
  debug: false
});
let patches = [], unpatch;
exports.isEnabled = false;
patches.push(actionSheet, fluxDispatch, patchUpdateRowBefore, patchUpdateRowAfter, beforeStartEdit, beforeEdit, getUser, sendMessage);
const patcher = function() {
  return patches.forEach(function(x) {
    return x();
  });
};
const unLoadDatas = function() {
  plugin.storage.utils.eml.editedMsg.forEach(function(savedMsg) {
    common.FluxDispatcher.dispatch({
      type: "MESSAGE_UPDATE",
      message: savedMsg,
      otherPluginBypass: true
    });
  });
  plugin.storage.utils.eml.editedMsg = [];
};
var index = {
  onLoad: function() {
    exports.isEnabled = true;
    if (plugin.storage?.toggle?.notype) {
      patches.push(startTyping, stopTyping);
    }
    unpatch = patcher()?.catch(function(err) {
      console.log("AZZYUTIL, Crash On Load");
      console.log(err);
      plugins.stopPlugin(plugin.id);
    });
  },
  onUnload: function() {
    exports.isEnabled = false;
    unpatch();
    unLoadDatas();
  },
  settings: settingPage
};exports.default=index;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({},vendetta.plugin,vendetta.storage,vendetta.metro,vendetta.metro.common,vendetta.ui,vendetta.ui.assets,vendetta.ui.components,vendetta,vendetta.ui.toasts,vendetta.patcher,vendetta.utils,vendetta.plugins);