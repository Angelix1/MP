(function(exports,_vendetta,metro,components,patcher,Assets,utils,common,plugin,toasts,storage,ui,alerts){'use strict';function _interopNamespaceDefault(e){var n=Object.create(null);if(e){Object.keys(e).forEach(function(k){if(k!=='default'){var d=Object.getOwnPropertyDescriptor(e,k);Object.defineProperty(n,k,d.get?d:{enumerable:true,get:function(){return e[k]}});}})}n.default=e;return Object.freeze(n)}var Assets__namespace=/*#__PURE__*/_interopNamespaceDefault(Assets);const { openLazy, hideActionSheet } = metro.findByProps("openLazy", "hideActionSheet");
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
const setOpacity = function(hex, alpha) {
  return `${hex}${Math.floor(alpha * 255).toString(16).padStart(2, 0)}`;
};
const colorConverter = {
  toInt(hex) {
    hex = hex.replace(/^#/, "");
    return parseInt(hex, 16);
  },
  toHex(integer) {
    const hex = integer.toString(16).toUpperCase();
    return "#" + hex;
  },
  HSLtoHEX(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = function(n) {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
};
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
};metro.findByProps("openLazy", "hideActionSheet");
const ChannelStore$1 = metro.findByProps("getChannel", "getDMFromUserId");
const ChannelMessages$1 = metro.findByProps("_channelMessages");
const MessageStore$1 = metro.findByProps("getMessage", "getMessages");
function fluxDispatchPatch(deletedMessageArray) {
  return patcher.before("dispatch", common.FluxDispatcher, function(args) {
    const [event] = args;
    const type = event?.type;
    if (plugin.storage.debug)
      console.log(`[ANTIED fluxdispatcher]`, event);
    if (type == "MESSAGE_DELETE") {
      if (plugin.storage.switches.enableMD == false)
        return args;
      if (event?.otherPluginBypass)
        return args;
      const channel = ChannelMessages$1.get(event.channelId);
      const originalMessage = channel?.get(event.id);
      if (!originalMessage)
        return args;
      if (event?.id && deletedMessageArray[event?.id]?.stage == 2)
        return args;
      if (event?.id && deletedMessageArray[event?.id]?.stage == 1) {
        deletedMessageArray[event?.id].stage = 2;
        return deletedMessageArray[event?.id]?.message ?? args;
      }
      const OMCheck1 = originalMessage?.author?.id;
      const OMCheck2 = originalMessage?.author?.username;
      const OMCheck3 = !originalMessage?.content && originalMessage?.attachments?.length == 0 && originalMessage?.embeds?.length == 0;
      if (!OMCheck1 || !OMCheck2 || OMCheck3)
        return args;
      if (plugin.storage?.switches?.ignoreBots && originalMessage?.author?.bot)
        return args;
      if (plugin.storage?.inputs?.ignoredUserList?.length > 0 && plugin.storage.inputs.ignoredUserList?.some(function(user) {
        return user?.id == originalMessage?.author?.id || user.username == originalMessage.author.username;
      }))
        return args;
      const messageGuildId = ChannelStore$1?.getChannel(originalMessage?.channel_id)?.guild_id;
      let messageObjectByAntied = {
        ...originalMessage,
        content: originalMessage?.content,
        type: 0,
        channel_id: originalMessage?.channel_id || event?.channelId,
        guild_id: messageGuildId,
        timestamp: `${(/* @__PURE__ */ new Date()).toJSON()}`,
        state: "SENT",
        was_deleted: true
      };
      if (plugin.storage?.switches?.useEphemeralForDeleted)
        messageObjectByAntied.flags = 64;
      args[0] = {
        type: "MESSAGE_UPDATE",
        channelId: originalMessage?.channel_id || event?.channelId,
        message: messageObjectByAntied,
        optimistic: false,
        sendMessageOptions: {},
        isPushNotification: false
      };
      deletedMessageArray[event?.id || originalMessage?.id] = {
        message: args,
        stage: 1
      };
      return args;
    }
    if (type == "MESSAGE_UPDATE") {
      if (plugin.storage.switches.enableMU == false)
        return args;
      if (event?.otherPluginBypass)
        return args;
      if (event?.message?.author?.bot)
        return args;
      const originalMessage = MessageStore$1.getMessage(event?.message?.channel_id || event?.channelId, event?.message?.id || event?.id);
      const OMCheck1 = originalMessage?.author?.id;
      const OMCheck2 = originalMessage?.author?.username;
      const OMCheck3 = !originalMessage?.content && originalMessage?.attachments?.length == 0 && originalMessage?.embeds?.length == 0;
      if (!originalMessage || !OMCheck1 || !OMCheck2 || OMCheck3)
        return args;
      if (!event?.message?.content || !originalMessage?.content)
        return args;
      if (event?.message?.content == originalMessage?.content)
        return args;
      if (plugin.storage?.inputs?.ignoredUserList?.length > 0 && plugin.storage?.inputs?.ignoredUserList?.some(function(user) {
        return user?.id == originalMessage?.author?.id || user?.username == originalMessage?.author?.username;
      }))
        return args;
      let Edited = plugin.storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`";
      const addNewLine = function(str) {
        return `${str}

`;
      };
      const newMsg = event?.message || originalMessage;
      let newMessageContent = `${originalMessage?.content}`;
      if (plugin.storage?.switches?.addTimestampForEdits) {
        const now = Date.now();
        const validPrefix = [
          "t",
          "T",
          "d",
          "D",
          "f",
          "F",
          "R"
        ];
        const timeStyle = validPrefix.some(function(x) {
          return x == plugin.storage.switches.timestampStyle;
        }) ? plugin.storage.switches.timestampStyle : "R";
        const timeRelative = `<t:${Math.abs(Math.round(now / 1e3))}:${timeStyle}>`;
        if (plugin.storage?.misc?.timestampPos == "BEFORE") {
          const tem = `${addNewLine(`(${timeRelative}) ${Edited}`)}${event?.message?.content ?? ""}`;
          newMessageContent += `  ${tem}`;
        } else {
          const tem = `${addNewLine(`${Edited} (${timeRelative})`)}${event?.message?.content ?? ""}`;
          newMessageContent += `  ${tem}`;
        }
      } else {
        newMessageContent += `  ${addNewLine(Edited)}${event?.message?.content ?? ""}`;
      }
      const messageGuildId = ChannelStore$1.getChannel(event?.channelId || event?.message?.channel_id || originalMessage?.channel_id)?.guild_id;
      args[0] = {
        type: "MESSAGE_UPDATE",
        message: {
          ...newMsg,
          content: newMessageContent,
          guild_id: messageGuildId,
          edited_timestamp: "invalid_timestamp"
        }
      };
      return args;
    }
    return args;
  });
}const Message = metro.findByProps("startEditMessage");
function selfEditPatch() {
  return patcher.before("startEditMessage", Message, function(args) {
    let Edited = plugin.storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`";
    const DAN = regexEscaper(Edited);
    const regexPattern = new RegExp(`(?:(?:\\s${DAN}(\\s\\(<t:\\d+:[tTdDfFR]>\\))?\\n{2})|(?:(?:\\s\\(<t:\\d+:[tTdDfFR]>\\) ${DAN}\\n{2})))`, "gm");
    const [channelId, messageId, msg] = args;
    const lats = msg.split(regexPattern);
    args[2] = lats[lats.length - 1];
    return args;
  });
}const rowsController = metro.findByProps("updateRows", "getConstants");
function updateRowsPatch(deletedMessagesArray) {
  return patcher.before("updateRows", rowsController, function(r) {
    let rows = JSON.parse(r[1]);
    const { textColor, backgroundColor, backgroundColorAlpha, gutterColor, gutterColorAlpha } = plugin.storage.colors;
    const { useBackgroundColor, minimalistic, removeDismissButton, overrideIndicator, useIndicatorForDeleted, useEphemeralForDeleted } = plugin.storage.switches;
    const { deletedMessageBuffer, customIndicator } = plugin.storage.inputs;
    const bufferSymbol = " \u2022 ";
    function validateHex(input, defaultColor) {
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
      return defaultColor || "#000";
    }
    function updateEphemeralIndication(object) {
      let removeDismissText = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false, overrideText = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false, onlyYouText = arguments.length > 3 ? arguments[3] : void 0, overrideArray = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : [];
      if (object) {
        if (overrideText) {
          if (onlyYouText != void 0) {
            object.content[0].content = onlyYouText + "  ";
          } else if (Array.isArray(overrideArray)) {
            object.content = overrideArray;
          }
        } else {
          if (removeDismissText) {
            object?.content?.splice?.(1);
          }
        }
      }
      object.helpArticleLink = "";
      object.helpButtonAccessibilityLabel = "Hello, Antied here Again";
      return object;
    }
    rows.forEach(function(row) {
      if (plugin.storage.debugUpdateRows)
        console.log(row);
      if (row?.type == 1) {
        if (deletedMessagesArray[row?.message?.id]) {
          if (deletedMessageBuffer?.length > 0 || deletedMessageBuffer != "") {
            if (useIndicatorForDeleted && useEphemeralForDeleted) {
              row.message.ephemeralIndication = updateEphemeralIndication(row.message.ephemeralIndication, void 0, true, `${deletedMessageBuffer}${bufferSymbol}`);
            } else {
              row.message.edited = deletedMessageBuffer;
            }
          }
          if (minimalistic == false) {
            const characterColor = validateHex(textColor, "#E40303");
            row.message.textColor = common.ReactNative.processColor(characterColor);
          }
          if (removeDismissButton && typeof row?.message?.ephemeralIndication == "object") {
            row.message.ephemeralIndication = updateEphemeralIndication(row.message.ephemeralIndication, true);
          }
          if (overrideIndicator) {
            row.message.ephemeralIndication = {
              content: [],
              helpArticleLink: "",
              helpButtonAccessibilityLabel: "Hello, Antied here Again"
            };
          } else if (!useIndicatorForDeleted) {
            if (customIndicator?.length > 0 || customIndicator != "") {
              row.message.ephemeralIndication = updateEphemeralIndication(row.message.ephemeralIndication, void 0, true, customIndicator);
            }
          }
          row.message.obscureLearnMoreLabel = "Hello, Antied here";
          if (minimalistic == false && useBackgroundColor == true) {
            const BG = validateHex(`${backgroundColor}`, "#FF2C2F");
            const GC = validateHex(`${gutterColor}`, "#FF2C2F");
            row.backgroundHighlight ?? (row.backgroundHighlight = {});
            row.backgroundHighlight = {
              backgroundColor: common.ReactNative.processColor(`${BG}${backgroundColorAlpha}`),
              gutterColor: common.ReactNative.processColor(`${GC}${gutterColorAlpha}`)
            };
          }
        }
      }
    });
    r[1] = JSON.stringify(rows);
    return r[1];
  });
}const MessageRecordUtils$1 = metro.findByProps("updateMessageRecord", "createMessageRecord");
function createMessageRecord() {
  return patcher.after("createMessageRecord", MessageRecordUtils$1, function(param, record) {
    let [message] = param;
    record.was_deleted = message.was_deleted;
  });
}const MessageRecord = metro.findByName("MessageRecord", false);
function messageRecordDefault() {
  return patcher.after("default", MessageRecord, function(param, record) {
    let [props] = param;
    record.was_deleted = !!props.was_deleted;
  });
}const MessageRecordUtils = metro.findByProps("updateMessageRecord", "createMessageRecord");
function updateMessageRecord() {
  return patcher.instead("updateMessageRecord", MessageRecordUtils, function(param, orig) {
    let [oldRecord, newRecord] = param;
    if (newRecord.was_deleted) {
      return MessageRecordUtils.createMessageRecord(newRecord, oldRecord.reactions);
    }
    return orig.apply(this, [
      oldRecord,
      newRecord
    ]);
  });
}const ActionSheet = metro.findByProps("openLazy", "hideActionSheet");
const MessageStore = metro.findByProps("getMessage", "getMessages");
const ChannelStore = metro.findByProps("getChannel", "getDMFromUserId");
const { ActionSheetRow } = metro.findByProps("ActionSheetRow");
function actionsheet(deletedMessageArray) {
  return patcher.before("openLazy", ActionSheet, function(param) {
    let [component, args, actionMessage] = param;
    const message = actionMessage?.message;
    if (args !== "MessageLongPressActionSheet" || !message)
      return;
    component.then(function(instance) {
      const unpatch = patcher.after("default", instance, function(_, comp) {
        common.React.useEffect(function() {
          return function() {
            unpatch();
          };
        }, []);
        if (plugin.storage.debug)
          console.log(`[ANTIED ActionSheet]`, message);
        const buttons = utils.findInReactTree(comp, function(c) {
          return c?.find?.(function(child) {
            return child?.props?.label == common.i18n?.Messages?.MESSAGE_ACTION_REPLY;
          });
        });
        if (!buttons)
          return comp;
        const position = Math.max(buttons.findIndex(function(x) {
          return x?.props?.label == common.i18n?.Messages?.MESSAGE_ACTION_REPLY;
        }), buttons.length - 1);
        const originalMessage = MessageStore.getMessage(message.channel_id, message?.id);
        const escapedBuffer = regexEscaper(plugin.storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`");
        const separator = new RegExp(escapedBuffer, "gmi");
        const checkIfBufferExist = separator.test(message.content);
        if (checkIfBufferExist) {
          const targetPos = position || 1;
          buttons.splice(targetPos, 0, /* @__PURE__ */ common.React.createElement(ActionSheetRow, {
            label: "Remove Edit History",
            subLabel: `Added by ${stripVersions(_vendetta.plugin?.manifest?.name) || "ANTIED"}`,
            icon: /* @__PURE__ */ common.React.createElement(ActionSheetRow.Icon, {
              source: Assets.getAssetIDByName("ic_edit_24px")
            }),
            onPress: function() {
              let Edited = plugin.storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`";
              const DAN = regexEscaper(Edited);
              const regexPattern = new RegExp(`(?:(?:\\s${DAN}(\\s\\(<t:\\d+:[tTdDfFR]>\\))?\\n{2})|(?:(?:\\s\\(<t:\\d+:[tTdDfFR]>\\) ${DAN}\\n{2})))`, "gm");
              const lats = message?.content?.split(regexPattern);
              if (plugin.storage.debug) {
                console.log([
                  [
                    Edited
                  ],
                  message?.content?.split(regexPattern),
                  lats
                ]);
              }
              const targetMessage = lats[lats.length - 1];
              const messageEmbeds = message?.embeds?.map(function(embedData) {
                const rawHSLA = embedData?.color?.replace(/.+\(/, "")?.replace(/%/g, "")?.replace(")", "");
                const split = rawHSLA?.split(", ");
                const embedColor = common.ReactNative.processColor(`${setOpacity(colorConverter.HSLtoHEX(split[0], split[1], split[2]), split[3])}`);
                return {
                  ...embedData,
                  author: embedData.author,
                  title: embedData.rawTitle,
                  description: embedData.rawDescription,
                  url: embedData.url,
                  type: embedData.type,
                  image: embedData.image,
                  thumbnail: embedData.thumbnail,
                  color: embedColor,
                  content_scan_version: 1
                };
              });
              common.FluxDispatcher.dispatch({
                type: "MESSAGE_UPDATE",
                message: {
                  ...message,
                  content: `${targetMessage}`,
                  embeds: messageEmbeds ?? [],
                  attachments: message.attachments ?? [],
                  mentions: message.mentions ?? [],
                  guild_id: ChannelStore.getChannel(originalMessage.channel_id).guild_id
                },
                otherPluginBypass: true
              });
              ActionSheet.hideActionSheet();
              if (plugin.storage?.inputs?.historyToast?.length > 0 || plugin.storage?.inputs?.historyToast != "") {
                toasts.showToast(plugin.storage?.inputs?.historyToast?.toString?.(), Assets.getAssetIDByName(plugin.storage?.misc?.editHistoryIcon || "ic_edit_24px"));
              }
            }
          }));
        }
        if (plugin.storage.debug)
          console.log(`[ANTIED ActionSheet]`, "useEphemeralForDeleted", !plugin.storage?.switches?.useEphemeralForDeleted, "msgExist?", Boolean(deletedMessageArray[message.id]));
        if (!plugin.storage?.switches?.useEphemeralForDeleted && deletedMessageArray[message.id]) {
          const targetPos = position || 1;
          buttons.splice(targetPos, 0, /* @__PURE__ */ common.React.createElement(ActionSheetRow, {
            label: "Remove Deleted Message",
            subLabel: `Added by ${stripVersions(_vendetta.plugin?.manifest?.name) || "ANTIED"}`,
            isDestructive: true,
            icon: /* @__PURE__ */ common.React.createElement(ActionSheetRow.Icon, {
              source: Assets.getAssetIDByName("ic_edit_24px")
            }),
            onPress: function() {
              common.FluxDispatcher.dispatch({
                type: "MESSAGE_DELETE",
                guildId: ChannelStore.getChannel(originalMessage.channel_id).guild_id,
                id: message?.id,
                channelId: message?.channel_id,
                otherPluginBypass: true
              });
              ActionSheet.hideActionSheet();
              if (plugin.storage?.inputs?.historyToast?.length > 0 || plugin.storage?.inputs?.historyToast != "") {
                toasts.showToast(`[ANTIED] Message Removed`, Assets.getAssetIDByName("ic_edit_24px"));
              }
            }
          }));
        }
      });
    });
  });
}const { ScrollView: ScrollView$9, View: View$8, Text: Text$8, TouchableOpacity: TouchableOpacity$8, TextInput: TextInput$8, Pressable: Pressable$5, Image: Image$7, Animated: Animated$7 } = components.General;
const { FormLabel: FormLabel$7, FormIcon: FormIcon$8, FormArrow: FormArrow$7, FormRow: FormRow$b, FormSwitch: FormSwitch$8, FormSwitchRow: FormSwitchRow$7, FormSection: FormSection$7, FormDivider: FormDivider$a, FormInput: FormInput$7, FormSliderRow: FormSliderRow$4 } = components.Forms;
const togglePatch = [
  {
    id: "enableMD",
    default: true,
    label: "Toggle Message Delete",
    subLabel: "Logs deleted message"
  },
  {
    id: "enableMU",
    default: true,
    label: "Toggle Message Update",
    subLabel: "Logs edited message"
  }
];
function PatchesComponent(param) {
  let { styles } = param;
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View$8, {
    style: [
      styles.subText
    ]
  }, togglePatch?.map(function(obj, index) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$b, {
      label: obj?.label,
      subLabel: obj?.subLabel,
      leading: obj?.icon && /* @__PURE__ */ React.createElement(FormIcon$8, {
        style: {
          opacity: 1
        },
        source: Assets.getAssetIDByName(obj?.icon)
      }),
      trailing: "id" in obj ? /* @__PURE__ */ React.createElement(FormSwitch$8, {
        value: plugin.storage?.switches[obj?.id] ?? obj?.default,
        onValueChange: function(value) {
          return plugin.storage.switches[obj?.id] = value;
        }
      }) : void 0
    }), index !== togglePatch?.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$a, null));
  })));
}const { ScrollView: ScrollView$8, View: View$7, Text: Text$7, TouchableOpacity: TouchableOpacity$7, TextInput: TextInput$7, Pressable: Pressable$4, Image: Image$6, Animated: Animated$6 } = components.General;
const { FormLabel: FormLabel$6, FormIcon: FormIcon$7, FormArrow: FormArrow$6, FormRow: FormRow$a, FormSwitch: FormSwitch$7, FormSwitchRow: FormSwitchRow$6, FormSection: FormSection$6, FormDivider: FormDivider$9, FormInput: FormInput$6, FormSliderRow: FormSliderRow$3 } = components.Forms;
const customizedableTexts = [
  {
    id: "deletedMessageBuffer",
    title: "Customize Deleted Message",
    type: "default",
    placeholder: "This message is deleted"
  },
  {
    id: "editedMessageBuffer",
    title: "Customize Edited Separator",
    type: "default",
    placeholder: "`[ EDITED ]`"
  },
  {
    id: "historyToast",
    title: "Customize Remove History Toast Message",
    type: "default",
    placeholder: "History Removed"
  },
  {
    id: "customIndicator",
    title: "Customize Ephemeral 'Only You Can See This' Indicator (if useIndicatorForDeletedMessage enabled this feature be overriden)",
    type: "default",
    placeholder: "Only you can see this \u2022 "
  }
];
function TextComponent(param) {
  let { styles } = param;
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View$7, {
    style: [
      styles.subText
    ]
  }, customizedableTexts?.map(function(obj, index) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormInput$6, {
      title: obj?.title,
      keyboardType: obj?.type,
      placeholder: obj?.placeholder?.toString(),
      value: plugin.storage?.inputs[obj.id] ?? obj?.placeholder,
      onChange: function(val) {
        return plugin.storage.inputs[obj.id] = val.toString();
      }
    }), index !== customizedableTexts.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$9, null));
  }), /* @__PURE__ */ React.createElement(FormInput$6, {
    title: "Customize Plugin Name",
    keyboardType: "default",
    placeholder: plugin.storage?.inputs?.customPluginName || _vendetta.plugin?.manifest?.name || "ANTIED",
    value: plugin.storage?.inputs?.customPluginName,
    onChange: function(val) {
      plugin.storage.inputs.customPluginName = val.toString();
      _vendetta.plugin.manifest.name = val.toString();
    }
  }), /* @__PURE__ */ React.createElement(FormDivider$9, null), /* @__PURE__ */ React.createElement(FormRow$a, {
    label: `Current Used Icon - ${plugin.storage?.misc?.editHistoryIcon || "ic_edit_24px"}`,
    subLabel: "Icon for Message History Removed toast",
    trailing: /* @__PURE__ */ React.createElement(FormIcon$7, {
      style: {
        opacity: 1
      },
      source: Assets.getAssetIDByName(plugin.storage?.misc?.editHistoryIcon)
    })
  }), /* @__PURE__ */ React.createElement(FormDivider$9, null), /* @__PURE__ */ React.createElement(FormInput$6, {
    title: "Icon Name",
    keyboardType: "default",
    placeholder: "ic_edit_24px",
    value: plugin.storage?.misc?.editHistoryIcon || "ic_edit_24px",
    onChange: function(val) {
      return plugin.storage.misc.editHistoryIcon = val.toString();
    }
  })));
}const { FormRow: FormRow$9 } = components.Forms;
const RowCheckmark = metro.findByName("RowCheckmark");
function SelectRow(param) {
  let { label, subLabel, selected, onPress } = param;
  return /* @__PURE__ */ React.createElement(FormRow$9, {
    label,
    subLabel,
    trailing: /* @__PURE__ */ React.createElement(RowCheckmark, {
      selected
    }),
    onPress
  });
}const timestamps = [
  {
    type: "t",
    label: "Short Time",
    subLabel: "16:20"
  },
  {
    type: "T",
    label: "Long Time",
    subLabel: "16:20:30"
  },
  {
    type: "d",
    label: "Short Date",
    subLabel: "20/04/2021"
  },
  {
    type: "D",
    label: "Long Date",
    subLabel: "20 April 2021"
  },
  {
    type: "f",
    label: "Short Date/Time",
    subLabel: "20 April 2021 16:20"
  },
  {
    type: "F",
    label: "Long Date/Time",
    subLabel: "Tuesday, 20 April 2021 16:20"
  },
  {
    type: "R",
    label: "Relative Time",
    subLabel: "2 months ago"
  }
];
const timestampsPosition = [
  {
    label: "Before",
    subLabel: "Old Message (2 minutes ago) [Edited] New Message",
    key: "BEFORE"
  },
  {
    label: "After",
    subLabel: "Old Message [Edited] (2 minutes ago) New Message",
    key: "AFTER"
  }
];
const { FormRow: FormRow$8, FormDivider: FormDivider$8 } = components.Forms;
function TimestampComponent() {
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$8, {
    label: "Timestamp Style"
  }), timestamps.map(function(param, i) {
    let { type, label, subLabel } = param;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SelectRow, {
      label,
      subLabel: `Example: ${subLabel}`,
      selected: plugin.storage.switches.timestampStyle == type,
      onPress: function() {
        return plugin.storage.switches.timestampStyle = type;
      }
    }), i !== timestamps.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$8, null));
  }), /* @__PURE__ */ React.createElement(FormDivider$8, null), /* @__PURE__ */ React.createElement(FormRow$8, {
    label: "Timestamp Position"
  }), timestampsPosition.map(function(param, i) {
    let { key, label, subLabel } = param;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SelectRow, {
      label,
      subLabel: `Example: ${subLabel}`,
      selected: plugin.storage.misc?.timestampPos == key,
      onPress: function() {
        return plugin.storage.misc.timestampPos = key;
      }
    }), i !== timestampsPosition.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$8, null));
  }));
}const SC = Object.keys(ui.semanticColors).map(function(x) {
  return `semanticColors.${x}`;
});
const RC = Object.keys(ui.rawColors).map(function(x) {
  return `rawColors.${x}`;
});
const semRaw = [
  ...SC,
  ...RC
];
const { FormRow: FormRow$7, FormDivider: FormDivider$7, ScrollView: ScrollView$7 } = components.Forms;
function SemRawComponent() {
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ScrollView$7, null, /* @__PURE__ */ React.createElement(FormRow$7, {
    label: "Choose Color"
  }), semRaw.map(function(NAME, i) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SelectRow, {
      label: NAME,
      selected: plugin.storage.colors.semRawColorPrefix == NAME,
      onPress: function() {
        return plugin.storage.colors.semRawColorPrefix = NAME;
      }
    }), i !== semRaw.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$7, null));
  })));
}const CustomColorPickerActionSheet = metro.findByName("CustomColorPickerActionSheet");
const { alphaToHex, hexAlphaToPercent, toPercentage, toDecimal, formatDecimal } = convert;
const { ScrollView: ScrollView$6, View: View$6, Text: Text$6, TouchableOpacity: TouchableOpacity$6, TextInput: TextInput$6, Pressable: Pressable$3, Image: Image$5, Animated: Animated$5 } = components.General;
const { FormLabel: FormLabel$5, FormIcon: FormIcon$6, FormArrow: FormArrow$5, FormRow: FormRow$6, FormSwitch: FormSwitch$6, FormSwitchRow: FormSwitchRow$5, FormSection: FormSection$5, FormDivider: FormDivider$6, FormInput: FormInput$5, FormSliderRow: FormSliderRow$2 } = components.Forms;
const customizeableColors = [
  {
    id: "textColor",
    label: "Deleted Message Text Color",
    subLabel: "Click to customize Deleted Message Text Color",
    defaultColor: "#E40303"
  },
  {
    id: "backgroundColor",
    label: "Deleted Message Background Color",
    subLabel: "Click to customize Background Color",
    defaultColor: "#FF2C2F"
  },
  {
    id: "gutterColor",
    label: "Deleted Message Background Gutter Color",
    subLabel: "Click to customize Background Gutter Color",
    defaultColor: "#FF2C2F"
  }
];
function ColorPickComponent(param) {
  let { styles } = param;
  storage.useProxy(plugin.storage);
  const [BGAlpha, setBGAlpha] = common.React.useState(toDecimal(hexAlphaToPercent(plugin.storage?.colors?.backgroundColorAlpha) ?? 100));
  const [gutterAlpha, setGutterAlpha] = common.React.useState(toDecimal(hexAlphaToPercent(plugin.storage?.colors?.gutterColorAlpha) ?? 100));
  const navigation = common.NavigationNative.useNavigation();
  const parseColorPercentage = function(clr) {
    return alphaToHex(toPercentage(clr));
  };
  const handleSemRaw = function(prefix) {
    if (!prefix)
      return null;
    const [pref, col] = prefix.split(".");
    if (pref == "semanticColors") {
      return ui.semanticColors[col];
    } else {
      return ui.rawColors[col];
    }
  };
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(View$6, {
    style: [
      styles.subText
    ]
  }, plugin.storage?.switches?.useSemRawColors && /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$6, {
    label: "Semantic & Raw Colors",
    subLabel: "If you enabled [Use Semantic/Raw Color], you can pick the colors from here",
    leading: /* @__PURE__ */ common.React.createElement(FormRow$6.Icon, {
      source: Assets.getAssetIDByName("ic_audit_log_24px")
    }),
    trailing: FormRow$6.Arrow,
    onPress: function() {
      return navigation.push("VendettaCustomPage", {
        title: "Semantic & Raw Colors",
        render: function() {
          return /* @__PURE__ */ common.React.createElement(SemRawComponent, null);
        }
      });
    }
  })), customizeableColors?.map(function(obj) {
    const whenPressed = function() {
      return openSheet(CustomColorPickerActionSheet, {
        color: colorConverter?.toInt(plugin.storage.colors[obj.id] || obj?.defaultColor || "#000"),
        onSelect: function(color) {
          const value = colorConverter?.toHex(color);
          plugin.storage.colors[obj.id] = value;
        }
      });
    };
    return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$6, {
      label: obj?.label,
      subLabel: obj?.subLabel || "Click to Update",
      onPress: whenPressed,
      trailing: /* @__PURE__ */ common.React.createElement(TouchableOpacity$6, {
        onPress: whenPressed
      }, /* @__PURE__ */ common.React.createElement(Image$5, {
        source: {
          uri: transparentBase64
        },
        style: {
          width: 32,
          height: 32,
          borderRadius: 10,
          backgroundColor: plugin.storage?.colors[obj.id] || customizeableColors.find(function(x) {
            return x?.id == obj?.id;
          })?.defaultColor || "#000"
        }
      }))
    }));
  }), /* @__PURE__ */ common.React.createElement(View$6, {
    style: styles.container
  }, /* @__PURE__ */ common.React.createElement(FormRow$6, {
    style: {
      justifyContent: "center",
      alignItems: "center"
    },
    label: `Preview Style: ${plugin.storage?.switches?.darkMode ? "Dark" : "Light"} Mode`,
    subLabel: `Click to Switch Mode`,
    trailing: /* @__PURE__ */ common.React.createElement(FormSwitch$6, {
      value: plugin.storage?.switches?.darkMode ?? true,
      onValueChange: function(value) {
        return plugin.storage.switches.darkMode = value;
      }
    })
  }), /* @__PURE__ */ common.React.createElement(View$6, {
    style: [
      styles.row,
      styles.border,
      {
        overflow: "hidden",
        marginRight: 10
      }
    ]
  }, /* @__PURE__ */ common.React.createElement(View$6, {
    style: {
      width: "2%",
      backgroundColor: `${plugin.storage.colors.gutterColor}${parseColorPercentage(gutterAlpha)}`
    }
  }), /* @__PURE__ */ common.React.createElement(View$6, {
    style: {
      flex: 1,
      backgroundColor: `${plugin.storage.switches.useSemRawColors ? handleSemRaw(plugin.storage?.colors?.semRawColorPrefix) || plugin.storage.colors.backgroundColor : plugin.storage.colors.backgroundColor}${parseColorPercentage(BGAlpha)}`,
      justifyContent: "center",
      alignItems: "center"
    }
  }, /* @__PURE__ */ common.React.createElement(Text$6, {
    style: {
      fontSize: 20,
      color: plugin.storage?.switches?.darkMode ? "white" : "black"
    }
  }, " Low Effort Normal Example Message "), /* @__PURE__ */ common.React.createElement(Text$6, {
    style: {
      fontSize: 20,
      color: plugin.storage.colors.textColor || "#000000"
    }
  }, " Low Effort Deleted Example Message "))), /* @__PURE__ */ common.React.createElement(FormSliderRow$2, {
    label: `Background Color Alpha: ${toPercentage(BGAlpha)}%`,
    value: BGAlpha,
    style: {
      width: "90%"
    },
    onValueChange: function(v) {
      setBGAlpha(Number(formatDecimal(v)));
      plugin.storage.colors.backgroundColorAlpha = alphaToHex(toPercentage(v));
    }
  }), /* @__PURE__ */ common.React.createElement(FormDivider$6, null), /* @__PURE__ */ common.React.createElement(FormSliderRow$2, {
    label: `Background Gutter Alpha: ${toPercentage(gutterAlpha)}%`,
    value: gutterAlpha,
    style: {
      width: "90%"
    },
    onValueChange: function(v) {
      setGutterAlpha(Number(formatDecimal(v)));
      plugin.storage.colors.gutterColorAlpha = alphaToHex(toPercentage(v));
    }
  }))));
}const { ScrollView: ScrollView$5, View: View$5, Text: Text$5, TouchableOpacity: TouchableOpacity$5, TextInput: TextInput$5, Image: Image$4, Animated: Animated$4 } = components.General;
const { FormLabel: FormLabel$4, FormIcon: FormIcon$5, FormArrow: FormArrow$4, FormRow: FormRow$5, FormSwitch: FormSwitch$5, FormSwitchRow: FormSwitchRow$4, FormSection: FormSection$4, FormDivider: FormDivider$5, FormInput: FormInput$4 } = components.Forms;
const useIsFocused$1 = metro.findByName("useIsFocused");
const { BottomSheetFlatList: BottomSheetFlatList$1 } = metro.findByProps("BottomSheetScrollView");
const UserStore = metro.findByStoreName("UserStore");
const Profiles = metro.findByProps("showUserProfile");
Assets.getAssetIDByName("ic_add_24px");
Assets.getAssetIDByName("ic_arrow");
Assets.getAssetIDByName("ic_minus_circle_24px");
Assets.getAssetIDByName("Check");
Assets.getAssetIDByName("Small");
function addIcon$2(i) {
  return /* @__PURE__ */ common.React.createElement(FormIcon$5, {
    style: {
      opacity: 1
    },
    source: Assets.getAssetIDByName(i)
  });
}
const styles$3 = common.stylesheet.createThemedStyleSheet({
  basicPad: {
    paddingRight: 10,
    marginBottom: 10,
    letterSpacing: 0.25
  },
  header: {
    color: ui.semanticColors.HEADER_PRIMARY,
    fontFamily: common.constants.Fonts.DISPLAY_BOLD,
    fontSize: 25,
    paddingLeft: "3%",
    letterSpacing: 0.25
  },
  sub: {
    color: ui.semanticColors.TEXT_POSITIVE,
    fontFamily: common.constants.Fonts.DISPLAY_NORMAL,
    paddingLeft: "4%",
    fontSize: 18
  },
  flagsText: {
    color: ui.semanticColors.HEADER_SECONDARY,
    fontFamily: common.constants.Fonts.PRIMARY_BOLD,
    paddingLeft: "4%",
    fontSize: 16
  },
  container: {
    marginTop: 25,
    marginLeft: "5%",
    marginBottom: -15,
    flexDirection: "row"
  },
  textContainer: {
    paddingLeft: 15,
    paddingTop: 5,
    flexDirection: "column",
    flexWrap: "wrap",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 8
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 8
  },
  mainText: {
    opacity: 0.975,
    letterSpacing: 0.25
  },
  subHeader: {
    color: ui.semanticColors.HEADER_SECONDARY,
    fontSize: 12.75
  }
});
function AddUser(param) {
  let { index } = param;
  storage.useProxy(plugin.storage);
  let object = plugin.storage?.inputs?.ignoredUserList[index];
  const animatedButtonScale = common.React.useRef(new Animated$4.Value(1)).current;
  const onPressIn = function() {
    return Animated$4.spring(animatedButtonScale, {
      toValue: 1.1,
      duration: 10,
      useNativeDriver: true
    }).start();
  };
  const onPressOut = function() {
    return Animated$4.spring(animatedButtonScale, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true
    }).start();
  };
  const animatedScaleStyle = {
    transform: [
      {
        scale: animatedButtonScale
      }
    ]
  };
  let user = UserStore.getUser(object?.id);
  let cached = Object.values(UserStore.getUsers());
  if (!user)
    user = cached.find(function(u) {
      return u?.username == object?.username;
    });
  if (!user)
    user = cached.find(function(u) {
      return u?.username?.toLowerCase() == object?.username?.toLowerCase();
    });
  const navigation = common.NavigationNative.useNavigation();
  useIsFocused$1();
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(ScrollView$5, null, /* @__PURE__ */ common.React.createElement(View$5, {
    style: [
      styles$3.basicPad,
      styles$3.sub
    ]
  }, /* @__PURE__ */ common.React.createElement(FormSection$4, {
    title: "User Setting",
    style: [
      styles$3.header
    ]
  }, /* @__PURE__ */ common.React.createElement(FormRow$5, {
    label: "Find User Id or Username",
    leading: addIcon$2("ic_search"),
    onPress: function() {
      if (user && !object.username?.length) {
        object.username = user.username;
      } else if (user && !object.id?.length) {
        object.id = user.id;
      } else {
        toasts.showToast("Cannot find User Id/Username.");
      }
    }
  }), /* @__PURE__ */ common.React.createElement(FormInput$4, {
    title: "User Username | Case Sensitive",
    placeholder: "Missing No",
    value: object?.username,
    onChange: function(v) {
      return object.username = v;
    }
  }), /* @__PURE__ */ common.React.createElement(FormInput$4, {
    title: "User Id",
    placeholder: "Missing No",
    value: object?.id,
    onChange: function(v) {
      return object.id = v;
    }
  }), /* @__PURE__ */ common.React.createElement(FormRow$5, {
    label: "User is webhook?",
    subLabel: "User is webhook or system, and not BOT or Normal User.",
    leading: addIcon$2("ic_webhook_24px"),
    trailing: /* @__PURE__ */ common.React.createElement(FormSwitch$5, {
      value: object?.isWebhook || false,
      onValueChange: function(value) {
        return object.isWebhook = value;
      }
    })
  })), user && /* @__PURE__ */ common.React.createElement(View$5, {
    style: [
      styles$3.container,
      {
        paddingBottom: 10
      }
    ]
  }, /* @__PURE__ */ common.React.createElement(TouchableOpacity$5, {
    onPress: function() {
      return Profiles.showUserProfile?.({
        userId: user?.id
      });
    },
    onPressIn,
    onPressOut
  }, /* @__PURE__ */ common.React.createElement(Animated$4.View, {
    style: animatedScaleStyle
  }, /* @__PURE__ */ common.React.createElement(Image$4, {
    source: {
      uri: user?.getAvatarURL?.()?.replace?.("webp", "png") || "https://cdn.discordapp.com/embed/avatars/2.png"
    },
    style: {
      width: 128,
      height: 128,
      borderRadius: 10
    }
  }))), /* @__PURE__ */ common.React.createElement(View$5, {
    style: styles$3.textContainer
  }, /* @__PURE__ */ common.React.createElement(TouchableOpacity$5, {
    onPress: function() {
      return Profiles.showUserProfile({
        userId: user?.id
      });
    }
  }, /* @__PURE__ */ common.React.createElement(Text$5, {
    style: [
      styles$3.mainText,
      styles$3.header
    ]
  }, user?.username || object?.username || "No Name"))), /* @__PURE__ */ common.React.createElement(FormDivider$5, null)), /* @__PURE__ */ common.React.createElement(FormRow$5, {
    label: /* @__PURE__ */ common.React.createElement(FormLabel$4, {
      text: "Remove User from Ignore List",
      style: {
        color: ui.rawColors.RED_400
      }
    }),
    onPress: function() {
      navigation.pop();
      plugin.storage?.inputs?.ignoredUserList?.splice(index, 1);
    }
  }))));
}const { ScrollView: ScrollView$4, View: View$4, Text: Text$4, TouchableOpacity: TouchableOpacity$4, TextInput: TextInput$4 } = components.General;
const { FormLabel: FormLabel$3, FormIcon: FormIcon$4, FormArrow: FormArrow$3, FormRow: FormRow$4, FormSwitch: FormSwitch$4, FormSwitchRow: FormSwitchRow$3, FormSection: FormSection$3, FormDivider: FormDivider$4, FormInput: FormInput$3 } = components.Forms;
function addIcon$1(i, dr) {
  return /* @__PURE__ */ common.React.createElement(FormIcon$4, {
    style: {
      opacity: 1
    },
    source: i 
  });
}
const useIsFocused = metro.findByName("useIsFocused");
const { BottomSheetFlatList } = metro.findByProps("BottomSheetScrollView");
const { getUser } = metro.findByProps("getUser");
const Add = Assets.getAssetIDByName("ic_add_24px");
Assets.getAssetIDByName("ic_arrow");
Assets.getAssetIDByName("ic_minus_circle_24px");
Assets.getAssetIDByName("Check");
Assets.getAssetIDByName("Small");
const Trash = Assets.getAssetIDByName("ic_trash_24px");
const styles$2 = common.stylesheet.createThemedStyleSheet({
  basicPad: {
    paddingRight: 10,
    marginBottom: 10,
    letterSpacing: 0.25
  },
  header: {
    color: ui.semanticColors.HEADER_SECONDARY,
    fontFamily: common.constants.Fonts.PRIMARY_BOLD,
    paddingLeft: "3.5%",
    fontSize: 24
  },
  sub: {
    color: ui.semanticColors.TEXT_POSITIVE,
    fontFamily: common.constants.Fonts.DISPLAY_NORMAL,
    paddingLeft: "4%",
    fontSize: 18
  },
  flagsText: {
    color: ui.semanticColors.HEADER_SECONDARY,
    fontFamily: common.constants.Fonts.PRIMARY_BOLD,
    paddingLeft: "4%",
    fontSize: 16
  },
  input: {
    fontSize: 16,
    fontFamily: common.constants.Fonts.PRIMARY_MEDIUM,
    color: ui.semanticColors.TEXT_NORMAL
  },
  placeholder: {
    color: ui.semanticColors.INPUT_PLACEHOLDER_TEXT
  }
});
function ListUsers() {
  storage.useProxy(plugin.storage);
  let [newUser, setNewUser] = common.React.useState("");
  const navigation = common.NavigationNative.useNavigation();
  useIsFocused();
  let users = plugin.storage?.inputs?.ignoredUserList ?? [];
  const addNewUser = function() {
    if (newUser) {
      if (!isNaN(parseInt(newUser))) {
        let validUser = getUser(newUser);
        if (validUser) {
          users.push({
            id: validUser?.id,
            username: "",
            showUser: false,
            isWebhook: false
          });
        } else {
          return toasts.showToast("Invalid User Id");
        }
      } else {
        users.push({
          id: void 0,
          username: newUser
        });
      }
      setNewUser("");
      navigation.push("VendettaCustomPage", {
        title: `Adding User to Ignore List`,
        render: function() {
          return /* @__PURE__ */ common.React.createElement(AddUser, {
            index: users?.length - 1
          });
        }
      });
    }
  };
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(ScrollView$4, {
    style: {
      flex: 1
    }
  }, /* @__PURE__ */ common.React.createElement(FormSection$3, {
    style: [
      styles$2.header,
      styles$2.basicPad
    ]
  }, /* @__PURE__ */ common.React.createElement(View$4, {
    style: [
      styles$2.header,
      styles$2.sub
    ]
  }, users.length > 0 && /* @__PURE__ */ common.React.createElement(FormRow$4, {
    label: "Clear List",
    trailing: addIcon$1(Trash),
    onPress: function() {
      if (users.length !== 0) {
        alerts.showConfirmationAlert({
          title: "Hol up, wait a minute!",
          content: `This will removes in total ${users.length} users from ignore list.`,
          confirmText: "Ye",
          cancelText: "Nah",
          confirmColor: "brand",
          onConfirm: function() {
            plugin.storage.inputs.ignoredUserList = [];
          }
        });
      }
    }
  }), users?.map(function(comp, i) {
    return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$4, {
      label: comp?.username || comp?.id || "No Data",
      trailing: /* @__PURE__ */ common.React.createElement(FormArrow$3, null),
      onPress: function() {
        return navigation.push("VendettaCustomPage", {
          title: "Editing User",
          render: function() {
            return /* @__PURE__ */ common.React.createElement(AddUser, {
              index: i
            });
          }
        });
      }
    }), i !== users?.length - 1 && /* @__PURE__ */ common.React.createElement(FormDivider$4, null));
  }), /* @__PURE__ */ common.React.createElement(FormRow$4, {
    label: /* @__PURE__ */ common.React.createElement(TextInput$4, {
      value: newUser,
      onChangeText: setNewUser,
      placeholder: "User ID or Username",
      placeholderTextColor: styles$2.placeholder.color,
      selectionColor: common.constants.Colors.PRIMARY_DARK_100,
      onSubmitEditing: addNewUser,
      returnKeyType: "done",
      style: styles$2.input
    }),
    trailing: /* @__PURE__ */ common.React.createElement(TouchableOpacity$4, {
      onPress: addNewUser
    }, addIcon$1(Add))
  })))));
}const { ScrollView: ScrollView$3, View: View$3, Text: Text$3, TouchableOpacity: TouchableOpacity$3, TextInput: TextInput$3, Pressable: Pressable$2, Image: Image$3, Animated: Animated$3 } = components.General;
const { FormLabel: FormLabel$2, FormIcon: FormIcon$3, FormArrow: FormArrow$2, FormRow: FormRow$3, FormSwitch: FormSwitch$3, FormSwitchRow: FormSwitchRow$2, FormSection: FormSection$2, FormDivider: FormDivider$3, FormInput: FormInput$2, FormSliderRow: FormSliderRow$1 } = components.Forms;
function IgnoreListComponent() {
  storage.useProxy(plugin.storage);
  const navigation = common.NavigationNative.useNavigation();
  const listIgnore = function() {
    navigation.push("VendettaCustomPage", {
      title: `List of Ignored Users`,
      render: function() {
        return /* @__PURE__ */ React.createElement(ListUsers, null);
      }
    });
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$3, {
    label: "Add User to List",
    subLabel: "List of ignored users for the plugin",
    leading: /* @__PURE__ */ React.createElement(FormIcon$3, {
      style: {
        opacity: 1
      },
      source: Assets.getAssetIDByName("ic_members")
    }),
    onPress: listIgnore,
    trailing: /* @__PURE__ */ React.createElement(TouchableOpacity$3, {
      onPress: listIgnore
    }, /* @__PURE__ */ React.createElement(FormIcon$3, {
      style: {
        opacity: 1
      },
      source: Assets.getAssetIDByName("ic_add_24px")
    }))
  }), /* @__PURE__ */ React.createElement(FormDivider$3, null));
}const { ScrollView: ScrollView$2, View: View$2, Text: Text$2, TouchableOpacity: TouchableOpacity$2, TextInput: TextInput$2, Pressable: Pressable$1, Image: Image$2, Animated: Animated$2 } = components.General;
const { FormRow: FormRow$2, FormIcon: FormIcon$2, FormSwitch: FormSwitch$2, FormDivider: FormDivider$2 } = components.Forms;
const HelpMessage = metro.findByName("HelpMessage");
const customizeableSwitches = [
  {
    id: "minimalistic",
    default: true,
    label: "Minimalistic Settings",
    subLabel: "Removes all Styling (Enabled by Default)"
  },
  {
    id: "useBackgroundColor",
    default: false,
    label: "Enable Background Color",
    subLabel: "Background Color for Deleted Message, similiar to Mention but Customizeable"
  },
  {
    id: "useSemRawColors",
    default: false,
    label: "Use Semantic/Raw Color",
    subLabel: "Use Semantic/Raw Color instead of Custom Color for Background Color, doesn't applied to GutterColor"
  },
  {
    id: "ignoreBots",
    default: false,
    label: "Ignore Bots",
    subLabel: "Ignore bot deleted messages."
  },
  {
    id: "removeDismissButton",
    default: false,
    label: "Remove Dissmiss Message",
    subLabel: "Remove clickable Dismiss Message text from deleted ephemeral messages."
  },
  {
    id: "addTimestampForEdits",
    default: false,
    label: "Add Edit Timestamp",
    subLabel: "Add Timestamp for edited messages."
  },
  {
    id: "useEphemeralForDeleted",
    default: true,
    label: "Use Ephemeral for Deleted",
    subLabel: "When messages got deleted it'll use ephemeral instead of normal message (Enabled by Default)."
  },
  {
    id: "useIndicatorForDeleted",
    default: false,
    label: "use Indicator For 'This Message is Deleted'",
    subLabel: "Use 'only you can see this' for deleted message info, instead of (edited)"
  },
  {
    id: "overrideIndicator",
    default: false,
    label: "Remove Ephemeral Indicator",
    subLabel: "When messages got deleted it'll have indicator under the text like 'only you can see this' and this remove those."
  }
];
function CustomizationComponent(param) {
  let { styles } = param;
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View$2, {
    style: [
      styles.subText
    ]
  }, plugin.storage?.switches.minimalistic && /* @__PURE__ */ React.createElement(HelpMessage, {
    messageType: 0
  }, 'To use styling, disable "Minimalistic" option'), customizeableSwitches?.map(function(obj, index) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$2, {
      label: obj?.label,
      subLabel: obj?.subLabel,
      leading: obj?.icon && /* @__PURE__ */ React.createElement(FormIcon$2, {
        style: {
          opacity: 1
        },
        source: Assets.getAssetIDByName(obj?.icon)
      }),
      trailing: "id" in obj ? /* @__PURE__ */ React.createElement(FormSwitch$2, {
        value: plugin.storage?.switches[obj?.id] ?? obj?.default,
        onValueChange: function(value) {
          return plugin.storage.switches[obj?.id] = value;
        }
      }) : void 0
    }), index !== customizeableSwitches?.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$2, null));
  })));
}function ma() {
  for (var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++) {
    a[_key] = arguments[_key];
  }
  return [
    ...a
  ];
}
const update = [
  createList("1.0 - 1.3", null, ma("Version 1.4 does not support backwards compatibility after Discord version 265.16 Stable.")),
  createList("1.4.0", ma("[1.4] Trying to reinstate colorful setting for IOS.", "[1.4] Added new Option to Remove Ephemeral Indicator", "[1.4] Added new Option to Switch 'this message is deleted' to be an indicator", "[1.4] Added debug updateRows Switch for nerds.", "[1.4] Added Known Bugs Section for those annoying peoples complaining about things."), ma("[1.4] Discontinued Support for older version related to updateRows function, Use Version 1.3.1 if you using old version"), ma("[1.4] Update updateRows function to Support Newer Version of Discord"))
];
var updates = update.reverse();const knownBugs = [
  {
    bugType: "ActionSheet",
    bugDescription: "Fail to patch custom buttons into Action Sheet"
  },
  {
    bugType: "EDIT",
    bugDescription: "Removing Edit Logs with link in it caused a crash"
  },
  {
    bugType: "EDIT",
    bugDescription: "in Rare Occasion, edits Patcher can logs multiple edits of same text or Double Fire Func"
  }
];const { ScrollView: ScrollView$1, View: View$1, Text: Text$1, TouchableOpacity: TouchableOpacity$1, TextInput: TextInput$1, Image: Image$1, Animated: Animated$1 } = components.General;
const { FormLabel: FormLabel$1, FormIcon: FormIcon$1, FormArrow: FormArrow$1, FormRow: FormRow$1, FormSwitch: FormSwitch$1, FormSwitchRow: FormSwitchRow$1, FormSection: FormSection$1, FormDivider: FormDivider$1, FormInput: FormInput$1 } = components.Forms;
const current = Assets.getAssetIDByName("ic_radio_square_checked_24px");
const older = Assets.getAssetIDByName("ic_radio_square_24px");
const info = Assets.getAssetIDByName("ic_information_24px");
Assets.getAssetIDByName("ic_info");
const newStuff = Assets.getAssetIDByName("premium_sparkles");
const updatedStuff = Assets.getAssetIDByName("ic_sync_24px");
const fixStuff = Assets.getAssetIDByName("ic_progress_wrench_24px");
const styles$1 = common.stylesheet.createThemedStyleSheet({
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
  return /* @__PURE__ */ common.React.createElement(FormIcon$1, {
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
    return /* @__PURE__ */ common.React.createElement(View$1, null, /* @__PURE__ */ common.React.createElement(FormRow$1, {
      label: label || "No Section",
      subLabel: subLabel || null,
      leading: icon && addIcon(icon),
      style: [
        styles$1.textHeader
      ]
    }), arr.map(function(x, i) {
      return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$1, {
        label: x,
        style: [
          styles$1.textBody,
          styles$1.rowLabel,
          styles$1.border
        ]
      }));
    }));
  }
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(components.ErrorBoundary, null, /* @__PURE__ */ common.React.createElement(FormRow$1, {
    label: change?.version,
    leading: index == 0 ? addIcon(current) : addIcon(older),
    trailing: addIcon(info),
    onPress: function() {
      setOpen(!isOpen);
    }
  }), isOpen && /* @__PURE__ */ common.React.createElement(View$1, {
    style: [
      styles$1.versionBG,
      styles$1.border
    ]
  }, change?.new?.length > 0 && createSubRow(change.new, "New", "New stuffies", newStuff), change?.updated?.length > 0 && createSubRow(change.updated, "Changes", "Update things", updatedStuff), change?.fix?.length > 0 && createSubRow(change.fix, "Fixes", "Me hate borken things", fixStuff)), index == totalIndex.length - 1 ? void 0 : /* @__PURE__ */ common.React.createElement(FormDivider$1, null)));
}const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated } = components.General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormSliderRow } = components.Forms;
const LinearGradient = metro.findByName("LinearGradient");
const styles = common.stylesheet.createThemedStyleSheet({
  text: {
    color: ui.semanticColors.HEADER_SECONDARY,
    paddingLeft: "5.5%",
    paddingRight: 10,
    marginBottom: 10,
    letterSpacing: 0.25,
    fontFamily: common.constants.Fonts.PRIMARY_BOLD,
    fontSize: 16
  },
  subText: {
    color: ui.semanticColors.TEXT_POSITIVE,
    paddingLeft: "6%",
    paddingRight: 10,
    marginBottom: 10,
    letterSpacing: 0.25,
    fontFamily: common.constants.Fonts.DISPLAY_NORMAL,
    fontSize: 12
  },
  input: {
    fontSize: 16,
    fontFamily: common.constants.Fonts.PRIMARY_MEDIUM,
    color: ui.semanticColors.TEXT_NORMAL
  },
  placeholder: {
    color: ui.semanticColors.INPUT_PLACEHOLDER_TEXT
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  colorPreview: {
    width: "75%",
    height: 100,
    marginBottom: 20
  },
  row: {
    flexDirection: "row",
    height: 80,
    width: "90%",
    marginBottom: 20
  },
  border: {
    borderRadius: 12
  },
  lnBorder: {
    borderRadius: 12,
    overflow: "hidden"
  },
  shadowTemplate: {
    shadowOffset: {
      width: 1,
      height: 3
    },
    shadowOpacity: 0.9,
    shadowRadius: 24,
    elevation: 16
  },
  lnShadow: {
    flex: 1,
    margin: "1%",
    shadowColor: "#b8ff34"
  },
  darkMask: {
    backgroundColor: "rgba(10, 10, 10, 0.9)",
    margin: 2,
    padding: "3%"
  },
  padBot: {
    paddingBottom: 20
  }
});
function SettingPage() {
  storage.useProxy(plugin.storage);
  const [animation] = common.React.useState(new Animated.Value(0));
  const [isKnownBugOpen, setKnownBugOpen] = common.React.useState(false);
  common.React.useEffect(function() {
    Animated.loop(Animated.timing(animation, {
      toValue: 4,
      duration: 8e3,
      useNativeDriver: true
    })).start();
  }, []);
  const bgStyle = {
    backgroundColor: animation.interpolate({
      inputRange: [
        0,
        1,
        2,
        3,
        4
      ],
      outputRange: [
        "rgba(188,31,31,0.5)",
        "rgba(46,168,30,0.5)",
        "rgba(48,179,173,0.5)",
        "rgba(183,40,198,0.5)",
        "rgba(188,31,31,0.5)"
      ]
    })
  };
  const createChild = function(id, title, label, subLabel, props, propsData) {
    return {
      id,
      title,
      label,
      subLabel,
      props,
      propsData
    };
  };
  const ComponentChildren = [
    createChild("patches", "Plugin Patcher", "Show Patches", "Toggle what the plugin patch", PatchesComponent, styles),
    createChild("customize", "Customization", "Customize", null, CustomizationComponent, styles),
    createChild("text", "Text Variables", "Customize Texts", null, TextComponent, styles),
    createChild("timestamp", "Timestamp", "Timestamp Styles", null, TimestampComponent, styles),
    createChild("colorpick", "Colors", "Customize Colors", null, ColorPickComponent, styles),
    createChild("ingorelist", "Ignore List", "Show IngoreList", null, IgnoreListComponent, null)
  ];
  common.ReactNative?.Platform?.OS || null;
  const entireUIList = /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(View, {
    style: [
      styles.lnBorder,
      bgStyle,
      styles.darkMask
    ]
  }, ComponentChildren.map(function(element) {
    return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormSection, {
      title: element?.title
    }, /* @__PURE__ */ common.React.createElement(FormRow, {
      label: element?.label,
      subLabel: element?.subLabel,
      trailing: /* @__PURE__ */ common.React.createElement(FormSwitch, {
        value: plugin.storage.setting[element?.id],
        onValueChange: function(value) {
          plugin.storage.setting[element?.id] = value;
        }
      })
    }), plugin.storage.setting[element.id] && element.props && /* @__PURE__ */ common.React.createElement(View, {
      style: {
        margin: 5,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "rgba(0, 0, 0, 0.15)"
      }
    }, common.React.createElement(element.props, {
      styles: element.propsData
    }))));
  }), /* @__PURE__ */ common.React.createElement(FormDivider, null), /* @__PURE__ */ common.React.createElement(FormSection, {
    title: "Nerd Stuff"
  }, /* @__PURE__ */ common.React.createElement(FormRow, {
    label: "Debug",
    subLabel: "Enable console logging",
    style: [
      styles.padBot
    ],
    trailing: /* @__PURE__ */ common.React.createElement(FormSwitch, {
      value: plugin.storage.debug,
      onValueChange: function(value) {
        plugin.storage.debug = value;
      }
    })
  }), /* @__PURE__ */ common.React.createElement(FormDivider, null), /* @__PURE__ */ common.React.createElement(FormRow, {
    label: "Debug updateRows",
    subLabel: "Enable updateRows console logging",
    style: [
      styles.padBot
    ],
    trailing: /* @__PURE__ */ common.React.createElement(FormSwitch, {
      value: plugin.storage.debugUpdateRows,
      onValueChange: function(value) {
        plugin.storage.debugUpdateRows = value;
      }
    })
  })), /* @__PURE__ */ common.React.createElement(FormDivider, null), updates && /* @__PURE__ */ common.React.createElement(FormSection, {
    title: "Updates"
  }, /* @__PURE__ */ common.React.createElement(View, {
    style: {
      margin: 5,
      padding: 5,
      borderRadius: 10,
      backgroundColor: "rgba(59, 30, 55, 0.15)"
    }
  }, updates.map(function(data, index) {
    return /* @__PURE__ */ common.React.createElement(VersionChange, {
      change: data,
      index,
      totalIndex: updates.length
    });
  }))), /* @__PURE__ */ common.React.createElement(FormDivider, null), knownBugs && /* @__PURE__ */ common.React.createElement(FormSection, {
    title: "Known Bugs"
  }, /* @__PURE__ */ common.React.createElement(FormRow, {
    label: "Click to show those Lady Bug",
    onPress: function() {
      setKnownBugOpen(!isKnownBugOpen);
    }
  }), isKnownBugOpen && /* @__PURE__ */ common.React.createElement(View, {
    style: {
      margin: 5,
      padding: 5,
      borderRadius: 10,
      backgroundColor: "rgba(59, 30, 55, 0.15)"
    }
  }, knownBugs.map(function(data, index) {
    return /* @__PURE__ */ common.React.createElement(FormRow, {
      label: data.bugType,
      subLabel: data.bugDescription,
      style: [
        styles.padBot
      ]
    });
  })))));
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(ScrollView, null, /* @__PURE__ */ common.React.createElement(LinearGradient, {
    start: {
      x: 0.8,
      y: 0
    },
    end: {
      x: 0,
      y: 0.8
    },
    colors: [
      "#b8ff34",
      "#4bff61",
      "#44f6ff",
      "#4dafff",
      "#413dff",
      "#d63efd"
    ],
    style: [
      styles.lnBorder,
      styles.shadowTemplate,
      styles.lnShadow,
      styles.padBot
    ]
  }, entireUIList)));
}const ChannelMessages = metro.findByProps("_channelMessages");
const regexEscaper = function(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
const stripVersions = function(str) {
  return str.replace(/\s?v\d+.\d+.\w+/, "");
};
const vendettaUiAssets = Object.keys(Assets__namespace.all).map(function(x) {
  return x?.name;
});
makeDefaults(plugin.storage, {
  setting: {
    colorpick: false,
    customize: false,
    ingorelist: false,
    patches: false,
    text: false,
    timestamp: false
  },
  switches: {
    customizeable: false,
    enableMD: true,
    enableMU: true,
    useBackgroundColor: false,
    useSemRawColors: false,
    ignoreBots: false,
    minimalistic: true,
    alwaysAdd: false,
    darkMode: true,
    removeDismissButton: false,
    addTimestampForEdits: false,
    timestampStyle: "R",
    useEphemeralForDeleted: true,
    overrideIndicator: false,
    useIndicatorForDeleted: false
  },
  colors: {
    textColor: "#E40303",
    backgroundColor: "#FF2C2F",
    backgroundColorAlpha: "33",
    gutterColor: "#FF2C2F",
    gutterColorAlpha: "CC",
    semRawColorPrefix: "semanticColors.TEXT_BRAND"
  },
  inputs: {
    deletedMessageBuffer: "This message is deleted",
    editedMessageBuffer: "`[ EDITED ]`",
    historyToast: "[ANTI ED] History Removed",
    ignoredUserList: [],
    customPluginName: _vendetta.plugin?.manifest?.name || "ANTIED",
    customIndicator: ""
  },
  misc: {
    timestampPos: "BEFORE",
    editHistoryIcon: "ic_edit_24px"
  },
  debug: false,
  debugUpdateRows: false
});
let deletedMessageArray = {};
const patches = [];
var index = {
  onLoad: function() {
    patches.push(fluxDispatchPatch(deletedMessageArray), updateRowsPatch(deletedMessageArray), selfEditPatch(), createMessageRecord(), messageRecordDefault(), updateMessageRecord(), actionsheet(deletedMessageArray));
    if (_vendetta.plugin?.manifest?.name != plugin.storage?.inputs?.customPluginName) {
      _vendetta.plugin.manifest.name = plugin.storage?.inputs?.customPluginName;
    }
  },
  onUnload: function() {
    for (const unpatch of patches) {
      unpatch();
    }
    if (_vendetta.plugin?.manifest?.name != plugin.storage?.inputs?.customPluginName) {
      _vendetta.plugin.manifest.name = plugin.storage?.inputs?.customPluginName;
    }
    for (const channelId in ChannelMessages._channelMessages) {
      for (const message of ChannelMessages._channelMessages[channelId]._array) {
        if (message.was_deleted) {
          common.FluxDispatcher.dispatch({
            type: "MESSAGE_DELETE",
            id: message.id,
            channelId: message.channel_id,
            otherPluginBypass: true
          });
        }
      }
    }
  },
  settings: SettingPage
};exports.default=index;exports.regexEscaper=regexEscaper;exports.stripVersions=stripVersions;exports.vendettaUiAssets=vendettaUiAssets;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({},vendetta,vendetta.metro,vendetta.ui.components,vendetta.patcher,vendetta.ui.assets,vendetta.utils,vendetta.metro.common,vendetta.plugin,vendetta.ui.toasts,vendetta.storage,vendetta.ui,vendetta.ui.alerts);