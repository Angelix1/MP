(function(exports,_vendetta,metro,components,patcher$1,plugin,toasts,common,Assets,plugins,utils,storage,ui,alerts){'use strict';function _interopNamespaceDefault(e){var n=Object.create(null);if(e){Object.keys(e).forEach(function(k){if(k!=='default'){var d=Object.getOwnPropertyDescriptor(e,k);Object.defineProperty(n,k,d.get?d:{enumerable:true,get:function(){return e[k]}});}})}n.default=e;return Object.freeze(n)}var Assets__namespace=/*#__PURE__*/_interopNamespaceDefault(Assets);const { openLazy, hideActionSheet } = metro.findByProps("openLazy", "hideActionSheet");
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
const transparentBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mJsrQAAAgwBAJ9P6qYAAAAASUVORK5CYII=";
const convert = {
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
};const ChannelStore$1 = metro.findByProps("getChannel", "getDMFromUserId");
const ChannelMessages$2 = metro.findByProps("_channelMessages");
const MessageStore$1 = metro.findByProps("getMessage", "getMessages");
const now = function() {
  return Date.now();
};
const tsStyle = function() {
  const s = plugin.storage.switches?.timestampStyle;
  return s && "tTdDfFR".includes(s) ? s : "R";
};
function fluxDispatchPatch(deletedMessageArray) {
  return patcher$1.before("dispatch", common.FluxDispatcher, function(args) {
    if (exports.isEnabled) {
      try {
        const ev = args[0];
        if (!ev || !ev.type)
          return;
        const cfg = plugin.storage;
        if (cfg.debug)
          console.log("[ANTIED flux]", ev);
        if (ev.type === "MESSAGE_DELETE") {
          if (!cfg.switches?.enableMD || ev.otherPluginBypass)
            return;
          const orig = ChannelMessages$2.get(ev.channelId)?.get(ev.id);
          if (!orig?.author?.id || !orig.author.username)
            return;
          if (orig?.author?.bot && orig?.flags == 64)
            return;
          if (!orig.content && !orig.attachments?.length && !orig.embeds?.length)
            return;
          if (cfg.switches.ignoreBots && orig.author.bot)
            return;
          if (cfg.inputs?.ignoredUserList?.length) {
            const list = cfg.inputs.ignoredUserList;
            if (list.some(function(u) {
              return u.id === orig.author.id || u.username === orig.author.username;
            }))
              return;
          }
          const entry = deletedMessageArray.get(ev.id);
          if (entry?.stage === 2)
            return;
          if (entry?.stage === 1) {
            entry.stage = 2;
            return entry.message || args;
          }
          const guildId = ChannelStore$1.getChannel(orig.channel_id || ev.channelId)?.guild_id;
          ev.message = {
            ...orig,
            content: orig.content,
            channel_id: orig.channel_id || ev.channelId,
            guild_id: guildId,
            was_deleted: true,
            message_reference: orig?.message_reference || orig?.messageReference || null
          };
          if (cfg.switches.useEphemeralForDeleted)
            ev.message.flags = 64;
          ev.type = "MESSAGE_UPDATE";
          ev.channelId = orig.channel_id || ev.channelId;
          ev.optimistic = false;
          ev.sendMessageOptions = {};
          ev.isPushNotification = false;
          deletedMessageArray.set(ev.id, {
            message: args,
            stage: 1
          });
          return args;
        }
        if (ev.type === "MESSAGE_UPDATE") {
          if (!cfg.switches?.enableMU || ev.otherPluginBypass)
            return;
          const msg = ev.message;
          if (!msg || msg.author?.bot)
            return;
          const chId = msg.channel_id || ev.channelId;
          const id = msg.id || ev.id;
          const orig = MessageStore$1.getMessage(chId, id) || ChannelMessages$2.get(chId)?.get(id);
          if (!orig?.author?.id || !orig.author.username)
            return;
          if (!orig.content && !orig.attachments?.length && !orig.embeds?.length)
            return;
          if (!msg.content || msg.content === orig.content)
            return;
          if (cfg.inputs?.ignoredUserList?.length) {
            const list = cfg.inputs.ignoredUserList;
            if (list.some(function(u) {
              return u.id === orig.author.id || u.username === orig.author.username;
            }))
              return;
          }
          const editedTag = cfg.inputs?.editedMessageBuffer || "`[ EDITED ]`";
          const time = cfg.switches?.addTimestampForEdits ? `(<t:${Math.floor(now() / 1e3)}:${tsStyle()}>)` : null;
          const tsPos = cfg.misc?.timestampPos === "BEFORE";
          let prefix = `${editedTag}`;
          prefix = time ? tsPos ? `${time} ${prefix}

` : `${prefix} ${time}

` : `${prefix}

`;
          ev.message = {
            ...msg,
            content: `${orig.content} ${prefix}${msg.content}`,
            guild_id: ChannelStore$1.getChannel(chId)?.guild_id ?? msg.guild_id,
            edited_timestamp: "invalid_timestamp",
            message_reference: msg?.message_reference || orig?.messageReference || null
          };
          return args;
        }
      } catch (e) {
        toasts.showToast("[ANTIED] FluxDispatcher crash \u2013 check logs");
        console.error("[ANTIED] Flux patch\n", e);
      }
    }
  });
}const Message = metro.findByProps("sendMessage", "startEditMessage");
function selfEditPatch() {
  return patcher$1.before("startEditMessage", Message, function(args) {
    if (!exports.isEnabled)
      return;
    let Edited = plugin.storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`";
    const DAN = regexEscaper(Edited);
    const regexPattern = new RegExp(`(?:(?:\\s${DAN}(\\s\\(<t:\\d+:[tTdDfFR]>\\))?\\n{2})|(?:(?:\\s\\(<t:\\d+:[tTdDfFR]>\\) ${DAN}\\n{2})))`, "gm");
    const [channelId, messageId, msg] = args;
    const lats = msg.split(regexPattern);
    const f = lats[lats.length - 1];
    args[2] = f;
  });
}const rowsController = metro.findByProps("updateRows", "getConstants") ?? metro.findByProps("updateRows");
if (!rowsController) {
  console.error("[ANTIED] rowsController not found \u2013 patch will not be applied");
}
function updateRowsPatch(deletedMessagesArray) {
  return patcher$1.before("updateRows", rowsController, function(args) {
    if (exports.isEnabled) {
      if (!args?.length)
        return;
      const raw = args[1];
      if (!raw)
        return;
      let rows;
      let isString = false;
      if (typeof raw === "string") {
        try {
          rows = JSON.parse(raw);
          isString = true;
        } catch {
          return;
        }
      } else if (Array.isArray(raw)) {
        rows = raw;
      } else {
        return;
      }
      const hasDeleted = rows.some(function(r) {
        return r?.message && deletedMessagesArray.has(r.message.id);
      });
      if (!hasDeleted)
        return;
      const { colors: { textColor, backgroundColor, backgroundColorAlpha, gutterColor, gutterColorAlpha }, switches: { useBackgroundColor, minimalistic, removeDismissButton, overrideIndicator, useIndicatorForDeleted, useEphemeralForDeleted }, inputs: { deletedMessageBuffer, customIndicator } } = plugin.storage;
      const toHex = function(v, fallback) {
        const s = String(v || "").trim();
        const hex = s.startsWith("#") ? s.slice(1) : s;
        return /^[0-9a-fA-F]{6}$/.test(hex) ? `#${hex.toUpperCase()}` : fallback;
      };
      const bufferSymbol = " \u2022 ";
      for (const row of rows) {
        if (row?.type !== 1)
          continue;
        const msg = row.message;
        if (!msg || !deletedMessagesArray.has(msg.id))
          continue;
        if (useIndicatorForDeleted && useEphemeralForDeleted) {
          msg.ephemeralIndication.content[0].content = `${deletedMessageBuffer}${bufferSymbol}  `;
        } else if (deletedMessageBuffer) {
          msg.edited = deletedMessageBuffer;
        }
        if (!minimalistic) {
          msg.textColor = common.ReactNative.processColor(toHex(textColor, "#E40303"));
        }
        if (overrideIndicator) {
          msg.ephemeralIndication.content = [];
        } else if (!useIndicatorForDeleted && customIndicator) {
          msg.ephemeralIndication.content[0].content = `${customIndicator}  `;
        }
        if (removeDismissButton && msg.ephemeralIndication?.content) {
          msg.ephemeralIndication?.content?.splice?.(1, 1);
        }
        if (!minimalistic && useBackgroundColor) {
          row.backgroundHighlight = {
            backgroundColor: common.ReactNative.processColor(toHex(backgroundColor, "#FF2C2F") + backgroundColorAlpha),
            gutterColor: common.ReactNative.processColor(toHex(gutterColor, "#FF2C2F") + gutterColorAlpha)
          };
        }
      }
      if (isString)
        args[1] = JSON.stringify(rows);
      else
        args[1] = rows;
      return args;
    }
  });
}const MessageRecordUtils$1 = metro.findByProps("updateMessageRecord", "createMessageRecord");
function createMessageRecord() {
  return patcher$1.after("createMessageRecord", MessageRecordUtils$1, function([message], record) {
    if (exports.isEnabled) {
      record.was_deleted = message.was_deleted;
    }
  });
}const MessageRecord = metro.findByName("MessageRecord", false);
function messageRecordDefault() {
  return patcher$1.after("default", MessageRecord, function([props], record) {
    if (exports.isEnabled) {
      record.was_deleted = !!props.was_deleted;
    }
  });
}const MessageRecordUtils = metro.findByProps("updateMessageRecord", "createMessageRecord");
function updateMessageRecord() {
  return patcher$1.instead("updateMessageRecord", MessageRecordUtils, function([oldRecord, newRecord], orig) {
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
const ChannelMessages$1 = metro.findByProps("_channelMessages");
const { ActionSheetRow } = metro.findByProps("ActionSheetRow");
function actionsheet(deletedMessageArray) {
  return patcher$1.before("openLazy", ActionSheet, function([component, args, actionMessage]) {
    if (exports.isEnabled) {
      try {
        const message = actionMessage?.message;
        if (args !== "MessageLongPressActionSheet" || !message)
          return;
        component.then(function(instance) {
          const unpatch = patcher$1.after("default", instance, function(_, comp) {
            try {
              let someFunc = function(a) {
                return a?.props?.label?.toLowerCase?.() == "reply";
              };
              common.React.useEffect(function() {
                return function() {
                  unpatch();
                };
              }, []);
              if (plugin.storage.debug)
                console.log(`[ANTIED ActionSheet]`, message);
              const buttons = utils.findInReactTree(comp, function(c) {
                return c?.find?.(someFunc);
              });
              if (!buttons)
                return comp;
              const position = Math.max(buttons.findIndex(someFunc), buttons.length - 1);
              let originalMessage = null;
              if (message?.channel_id && message?.id) {
                originalMessage = MessageStore.getMessage(message?.channel_id, message?.id);
                if (!originalMessage) {
                  const channel = ChannelMessages$1.get(message?.channel_id);
                  originalMessage = channel?.get(message?.id);
                }
              }
              if (!originalMessage)
                return comp;
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
                    const DAN = escapedBuffer;
                    const regexPattern = new RegExp(`(?:(?:\\s${DAN}(\\s\\(<t:\\d+:[tTdDfFR]>\\))?\\n{2})|(?:(?:\\s\\(<t:\\d+:[tTdDfFR]>\\) ${DAN}\\n{2})))`, "gm");
                    const lats = message?.content?.split(regexPattern);
                    if (plugin.storage.debug) {
                      console.log([
                        [
                          escapedBuffer
                        ],
                        message?.content?.split(regexPattern),
                        lats
                      ]);
                    }
                    const targetMessage = lats[lats.length - 1];
                    common.FluxDispatcher.dispatch({
                      type: "MESSAGE_UPDATE",
                      message: {
                        ...message,
                        message_reference: message?.message_reference || message?.messageReference || null,
                        content: `${targetMessage}`,
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
                console.log(`[ANTIED ActionSheet]`, "useEphemeralForDeleted", !plugin.storage?.switches?.useEphemeralForDeleted, "msgExist?", Boolean(deletedMessageArray.has(message.id)));
              if (!plugin.storage?.switches?.useEphemeralForDeleted && deletedMessageArray.has(message.id)) {
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
            } catch (e) {
              toasts.showToast("[ANTIED] Crash on ActionSheet, check debug log for more info");
              console.error("[ANTIED Error > ActionSheet:Component Patch\n", e);
            }
          });
        });
      } catch (e) {
        toasts.showToast("[ANTIED] Crash on ActionSheet, check debug log for more info");
        console.error("[ANTIED Error > ActionSheet Patch\n", e);
      }
    }
  });
}const { FormRow: FormRow$d } = components.Forms;
const RowCheckmark = metro.findByName("RowCheckmark");
function SelectRow({ label, subLabel, selected, onPress }) {
  return /* @__PURE__ */ React.createElement(FormRow$d, {
    label,
    subLabel,
    trailing: /* @__PURE__ */ React.createElement(RowCheckmark, {
      selected
    }),
    onPress
  });
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
const { FormRow: FormRow$c, FormDivider: FormDivider$c, ScrollView: ScrollView$a } = components.Forms;
function SemRawComponent() {
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ScrollView$a, null, /* @__PURE__ */ React.createElement(FormRow$c, {
    label: "Choose Color"
  }), semRaw.map(function(NAME, i) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SelectRow, {
      label: NAME,
      selected: plugin.storage.colors.semRawColorPrefix == NAME,
      onPress: function() {
        return plugin.storage.colors.semRawColorPrefix = NAME;
      }
    }), i !== semRaw.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$c, null));
  })));
}const CustomColorPickerActionSheet = metro.findByName("CustomColorPickerActionSheet");
const { alphaToHex, hexAlphaToPercent } = convert;
const { ScrollView: ScrollView$9, View: View$9, Text: Text$9, TouchableOpacity: TouchableOpacity$9, TextInput: TextInput$9, Pressable: Pressable$6, Image: Image$8, Animated: Animated$8 } = components.General;
const { FormLabel: FormLabel$8, FormIcon: FormIcon$8, FormArrow: FormArrow$8, FormRow: FormRow$b, FormSwitch: FormSwitch$9, FormSwitchRow: FormSwitchRow$7, FormSection: FormSection$8, FormDivider: FormDivider$b, FormInput: FormInput$9, FormSliderRow: FormSliderRow$4 } = components.Forms;
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
function ColorPickComponent({ styles }) {
  storage.useProxy(plugin.storage);
  const clamp = function(v, min, max) {
    return Math.max(min, Math.min(max, v));
  };
  const [BGAlpha, setBGAlpha] = common.React.useState(clamp(hexAlphaToPercent(plugin.storage?.colors?.backgroundColorAlpha) ?? 100, 0, 100));
  const [gutterAlpha, setGutterAlpha] = common.React.useState(clamp(hexAlphaToPercent(plugin.storage?.colors?.gutterColorAlpha) ?? 100, 0, 100));
  const [useText, setUseText] = common.React.useState(false);
  const navigation = common.NavigationNative.useNavigation();
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
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(View$9, {
    style: [
      styles.subText
    ]
  }, plugin.storage?.switches?.useSemRawColors && /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$b, {
    label: "Semantic & Raw Colors",
    subLabel: "If you enabled [Use Semantic/Raw Color], you can pick the colors from here",
    leading: /* @__PURE__ */ common.React.createElement(FormRow$b.Icon, {
      source: Assets.getAssetIDByName("ic_audit_log_24px")
    }),
    trailing: FormRow$b.Arrow,
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
    return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$b, {
      label: obj?.label,
      subLabel: obj?.subLabel || "Click to Update",
      onPress: whenPressed,
      trailing: /* @__PURE__ */ common.React.createElement(TouchableOpacity$9, {
        onPress: whenPressed
      }, /* @__PURE__ */ common.React.createElement(Image$8, {
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
  }), /* @__PURE__ */ common.React.createElement(View$9, {
    style: styles.container
  }, /* @__PURE__ */ common.React.createElement(FormRow$b, {
    style: {
      justifyContent: "center",
      alignItems: "center"
    },
    label: `Preview Style: ${plugin.storage?.switches?.darkMode ? "Dark" : "Light"} Mode`,
    subLabel: `Click to Switch Mode`,
    trailing: /* @__PURE__ */ common.React.createElement(FormSwitch$9, {
      value: plugin.storage?.switches?.darkMode ?? true,
      onValueChange: function(value) {
        return plugin.storage.switches.darkMode = value;
      }
    })
  }), /* @__PURE__ */ common.React.createElement(View$9, {
    style: [
      styles.row,
      styles.border,
      {
        overflow: "hidden",
        marginRight: 10
      }
    ]
  }, /* @__PURE__ */ common.React.createElement(View$9, {
    style: {
      width: "2%",
      backgroundColor: `${plugin.storage.colors.gutterColor}${plugin.storage.colors.gutterColorAlpha}`
    }
  }), /* @__PURE__ */ common.React.createElement(View$9, {
    style: {
      flex: 1,
      backgroundColor: `${plugin.storage.switches.useSemRawColors ? handleSemRaw(plugin.storage?.colors?.semRawColorPrefix) || plugin.storage.colors.backgroundColor : plugin.storage.colors.backgroundColor}${plugin.storage.colors.backgroundColorAlpha}`,
      justifyContent: "center",
      alignItems: "center"
    }
  }, /* @__PURE__ */ common.React.createElement(Text$9, {
    style: {
      fontSize: 20,
      color: plugin.storage?.switches?.darkMode ? "black" : "white"
    }
  }, " Low Effort Normal Example Message "), /* @__PURE__ */ common.React.createElement(Text$9, {
    style: {
      fontSize: 20,
      color: plugin.storage.colors.textColor || "#000000"
    }
  }, " Low Effort Deleted Example Message "))), /* @__PURE__ */ common.React.createElement(FormRow$b, {
    label: "Click to switch input type",
    subLabel: "Switch from slider to number and vise versa",
    onPress: function() {
      setUseText(!useText);
    }
  }), useText ? /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormInput$9, {
    title: `Background Color Alpha: ${BGAlpha}%`,
    keyboardType: "numeric",
    style: {
      width: "90%"
    },
    value: `${BGAlpha}`,
    onChange: function(val) {
      val = clamp(val, 0, 100);
      setBGAlpha(Number(val));
      plugin.storage.colors.backgroundColorAlpha = alphaToHex(val);
    }
  })) : /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormSliderRow$4, {
    label: `Background Color Alpha: ${BGAlpha}%`,
    value: BGAlpha,
    minVal: 0,
    maxVal: 100,
    style: {
      width: "90%"
    },
    onValueChange: function(v) {
      setBGAlpha(Number(v));
      plugin.storage.colors.backgroundColorAlpha = alphaToHex(v);
    }
  })), /* @__PURE__ */ common.React.createElement(FormDivider$b, null), useText ? /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormInput$9, {
    title: `Background Gutter Alpha: ${gutterAlpha}%`,
    keyboardType: "numeric",
    style: {
      width: "90%"
    },
    value: `${gutterAlpha}`,
    onChange: function(val) {
      val = clamp(val, 0, 100);
      setGutterAlpha(Number(val));
      plugin.storage.colors.gutterColorAlpha = alphaToHex(val);
    }
  })) : /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormSliderRow$4, {
    label: `Background Gutter Alpha: ${gutterAlpha}%`,
    value: gutterAlpha,
    minVal: 0,
    maxVal: 100,
    style: {
      width: "90%"
    },
    onValueChange: function(v) {
      setGutterAlpha(Number(v));
      plugin.storage.colors.gutterColorAlpha = alphaToHex(v);
    }
  })))));
}const { ScrollView: ScrollView$8, View: View$8, Text: Text$8, TouchableOpacity: TouchableOpacity$8, TextInput: TextInput$8, Pressable: Pressable$5, Image: Image$7, Animated: Animated$7 } = components.General;
const { FormRow: FormRow$a, FormIcon: FormIcon$7, FormSwitch: FormSwitch$8, FormDivider: FormDivider$a } = components.Forms;
const HelpMessage$1 = metro.findByName("HelpMessage");
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
  },
  {
    id: "useCustomPluginName",
    default: false,
    label: "Override Plugin Name with custom one",
    subLabel: "Replace plugin name with custom one when enabled"
  }
];
function CustomizationComponent({ styles }) {
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View$8, {
    style: [
      styles.subText
    ]
  }, plugin.storage?.switches.minimalistic && /* @__PURE__ */ React.createElement(HelpMessage$1, {
    messageType: 0
  }, 'To use styling, disable "Minimalistic" option'), customizeableSwitches?.map(function(obj, index) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$a, {
      label: obj?.label,
      subLabel: obj?.subLabel,
      leading: obj?.icon && /* @__PURE__ */ React.createElement(FormIcon$7, {
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
    }), index !== customizeableSwitches?.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$a, null));
  })));
}const { ScrollView: ScrollView$7, View: View$7, Text: Text$7, TouchableOpacity: TouchableOpacity$7, TextInput: TextInput$7, Image: Image$6, Animated: Animated$6 } = components.General;
const { FormLabel: FormLabel$7, FormIcon: FormIcon$6, FormArrow: FormArrow$7, FormRow: FormRow$9, FormSwitch: FormSwitch$7, FormSwitchRow: FormSwitchRow$6, FormSection: FormSection$7, FormDivider: FormDivider$9, FormInput: FormInput$8 } = components.Forms;
const useIsFocused$1 = metro.findByName("useIsFocused");
const { BottomSheetFlatList: BottomSheetFlatList$1 } = metro.findByProps("BottomSheetScrollView");
const UserStore$1 = metro.findByStoreName("UserStore");
const Profiles = metro.findByProps("showUserProfile");
Assets.getAssetIDByName("ic_add_24px");
Assets.getAssetIDByName("ic_arrow");
Assets.getAssetIDByName("ic_minus_circle_24px");
Assets.getAssetIDByName("Check");
Assets.getAssetIDByName("Small");
function addIcon$1(i) {
  return /* @__PURE__ */ common.React.createElement(FormIcon$6, {
    style: {
      opacity: 1
    },
    source: Assets.getAssetIDByName(i)
  });
}
const styles$2 = common.stylesheet.createThemedStyleSheet({
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
function AddUser({ index }) {
  storage.useProxy(plugin.storage);
  let object = plugin.storage?.inputs?.ignoredUserList[index];
  const animatedButtonScale = common.React.useRef(new Animated$6.Value(1)).current;
  const onPressIn = function() {
    return Animated$6.spring(animatedButtonScale, {
      toValue: 1.1,
      duration: 10,
      useNativeDriver: true
    }).start();
  };
  const onPressOut = function() {
    return Animated$6.spring(animatedButtonScale, {
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
  let user = UserStore$1.getUser(object?.id);
  let cached = Object.values(UserStore$1.getUsers());
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
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(ScrollView$7, null, /* @__PURE__ */ common.React.createElement(View$7, {
    style: [
      styles$2.basicPad,
      styles$2.sub
    ]
  }, /* @__PURE__ */ common.React.createElement(FormSection$7, {
    title: "User Setting",
    style: [
      styles$2.header
    ]
  }, /* @__PURE__ */ common.React.createElement(FormRow$9, {
    label: "Find User Id or Username",
    leading: addIcon$1("ic_search"),
    onPress: function() {
      if (user && !object.username?.length) {
        object.username = user.username;
      } else if (user && !object.id?.length) {
        object.id = user.id;
      } else {
        toasts.showToast("Cannot find User Id/Username.");
      }
    }
  }), /* @__PURE__ */ common.React.createElement(FormInput$8, {
    title: "User Username | Case Sensitive",
    placeholder: "Missing No",
    value: object?.username,
    onChange: function(v) {
      return object.username = v;
    }
  }), /* @__PURE__ */ common.React.createElement(FormInput$8, {
    title: "User Id",
    placeholder: "Missing No",
    value: object?.id,
    onChange: function(v) {
      return object.id = v;
    }
  }), /* @__PURE__ */ common.React.createElement(FormRow$9, {
    label: "User is webhook?",
    subLabel: "User is webhook or system, and not BOT or Normal User.",
    leading: addIcon$1("ic_webhook_24px"),
    trailing: /* @__PURE__ */ common.React.createElement(FormSwitch$7, {
      value: object?.isWebhook || false,
      onValueChange: function(value) {
        return object.isWebhook = value;
      }
    })
  })), user && /* @__PURE__ */ common.React.createElement(View$7, {
    style: [
      styles$2.container,
      {
        paddingBottom: 10
      }
    ]
  }, /* @__PURE__ */ common.React.createElement(TouchableOpacity$7, {
    onPress: function() {
      return Profiles.showUserProfile?.({
        userId: user?.id
      });
    },
    onPressIn,
    onPressOut
  }, /* @__PURE__ */ common.React.createElement(Animated$6.View, {
    style: animatedScaleStyle
  }, /* @__PURE__ */ common.React.createElement(Image$6, {
    source: {
      uri: user?.getAvatarURL?.()?.replace?.("webp", "png") || "https://cdn.discordapp.com/embed/avatars/2.png"
    },
    style: {
      width: 128,
      height: 128,
      borderRadius: 10
    }
  }))), /* @__PURE__ */ common.React.createElement(View$7, {
    style: styles$2.textContainer
  }, /* @__PURE__ */ common.React.createElement(TouchableOpacity$7, {
    onPress: function() {
      return Profiles.showUserProfile({
        userId: user?.id
      });
    }
  }, /* @__PURE__ */ common.React.createElement(Text$7, {
    style: [
      styles$2.mainText,
      styles$2.header
    ]
  }, user?.username || object?.username || "No Name"))), /* @__PURE__ */ common.React.createElement(FormDivider$9, null)), /* @__PURE__ */ common.React.createElement(FormRow$9, {
    label: /* @__PURE__ */ common.React.createElement(FormLabel$7, {
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
}const { ScrollView: ScrollView$6, View: View$6, Text: Text$6, TouchableOpacity: TouchableOpacity$6, TextInput: TextInput$6 } = components.General;
const { FormLabel: FormLabel$6, FormIcon: FormIcon$5, FormArrow: FormArrow$6, FormRow: FormRow$8, FormSwitch: FormSwitch$6, FormSwitchRow: FormSwitchRow$5, FormSection: FormSection$6, FormDivider: FormDivider$8, FormInput: FormInput$7 } = components.Forms;
function addIcon(i, dr) {
  return /* @__PURE__ */ common.React.createElement(FormIcon$5, {
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
const styles$1 = common.stylesheet.createThemedStyleSheet({
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
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(ScrollView$6, {
    style: {
      flex: 1
    }
  }, /* @__PURE__ */ common.React.createElement(FormSection$6, {
    style: [
      styles$1.header,
      styles$1.basicPad
    ]
  }, /* @__PURE__ */ common.React.createElement(View$6, {
    style: [
      styles$1.header,
      styles$1.sub
    ]
  }, users.length > 0 && /* @__PURE__ */ common.React.createElement(FormRow$8, {
    label: "Clear List",
    trailing: addIcon(Trash),
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
    return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$8, {
      label: comp?.username || comp?.id || "No Data",
      trailing: /* @__PURE__ */ common.React.createElement(FormArrow$6, null),
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
    }), i !== users?.length - 1 && /* @__PURE__ */ common.React.createElement(FormDivider$8, null));
  }), /* @__PURE__ */ common.React.createElement(FormRow$8, {
    label: /* @__PURE__ */ common.React.createElement(TextInput$6, {
      value: newUser,
      onChangeText: setNewUser,
      placeholder: "User ID or Username",
      placeholderTextColor: styles$1.placeholder.color,
      selectionColor: common.constants.Colors.PRIMARY_DARK_100,
      onSubmitEditing: addNewUser,
      returnKeyType: "done",
      style: styles$1.input
    }),
    trailing: /* @__PURE__ */ common.React.createElement(TouchableOpacity$6, {
      onPress: addNewUser
    }, addIcon(Add))
  })))));
}const { ScrollView: ScrollView$5, View: View$5, Text: Text$5, TouchableOpacity: TouchableOpacity$5, TextInput: TextInput$5, Pressable: Pressable$4, Image: Image$5, Animated: Animated$5 } = components.General;
const { FormLabel: FormLabel$5, FormIcon: FormIcon$4, FormArrow: FormArrow$5, FormRow: FormRow$7, FormSwitch: FormSwitch$5, FormSwitchRow: FormSwitchRow$4, FormSection: FormSection$5, FormDivider: FormDivider$7, FormInput: FormInput$6, FormSliderRow: FormSliderRow$3 } = components.Forms;
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
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$7, {
    label: "Add User to List",
    subLabel: "List of ignored users for the plugin",
    leading: /* @__PURE__ */ React.createElement(FormIcon$4, {
      style: {
        opacity: 1
      },
      source: Assets.getAssetIDByName("ic_members")
    }),
    onPress: listIgnore,
    trailing: /* @__PURE__ */ React.createElement(TouchableOpacity$5, {
      onPress: listIgnore
    }, /* @__PURE__ */ React.createElement(FormIcon$4, {
      style: {
        opacity: 1
      },
      source: Assets.getAssetIDByName("ic_add_24px")
    }))
  }), /* @__PURE__ */ React.createElement(FormDivider$7, null));
}const HelpMessage = metro.findByName("HelpMessage");
const { FormRow: FormRow$6, FormDivider: FormDivider$6, FormInput: FormInput$5, FormSwitch: FormSwitch$4 } = components.Forms;
function NerdComponent({ stx }) {
  storage.useProxy(plugin.storage);
  const [plugUri, setPlugUri] = React.useState(_vendetta.plugin.id);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(HelpMessage, {
    messageType: 0
  }, "Changing the plugin URL may redirect future updates to the new source, or prevent updates entirely."), /* @__PURE__ */ React.createElement(FormInput$5, {
    title: "Change Plugin URL",
    keyboardType: "default",
    placeholder: "https://angelix1.github.io/MP/angel/antied",
    value: plugUri,
    onChange: function(val) {
      _vendetta.plugin.id = val?.toString();
      setPlugUri(val?.toString());
    }
  }), /* @__PURE__ */ React.createElement(FormDivider$6, null), /* @__PURE__ */ React.createElement(FormRow$6, {
    label: "Restore original URL",
    subLabel: "Click to switch to the production build URL (will exit debug version)",
    onPress: function() {
      _vendetta.plugin.id = "https://angelix1.github.io/MP/angel/antied";
      toasts.showToast("Plugin URL source restored to original URL.");
    }
  }), /* @__PURE__ */ React.createElement(FormDivider$6, null), /* @__PURE__ */ React.createElement(FormRow$6, {
    label: "Restore original plugin name",
    subLabel: "Click to reset to the default name",
    onPress: function() {
      _vendetta.plugin.manifest.name = _vendetta.plugin.manifest.originalName;
      toasts.showToast("Plugin Name restored to original name.");
    }
  }), /* @__PURE__ */ React.createElement(FormDivider$6, null), /* @__PURE__ */ React.createElement(FormRow$6, {
    label: "Debug",
    subLabel: "Enable general console logging",
    style: {
      paddingBottom: 20
    },
    trailing: /* @__PURE__ */ React.createElement(FormSwitch$4, {
      value: plugin.storage.debug,
      onValueChange: function(value) {
        plugin.storage.debug = value;
      }
    })
  }), /* @__PURE__ */ React.createElement(FormDivider$6, null), /* @__PURE__ */ React.createElement(FormRow$6, {
    label: "Debug updateRows",
    subLabel: "Enable updateRows console logging",
    style: {
      paddingBottom: 20
    },
    trailing: /* @__PURE__ */ React.createElement(FormSwitch$4, {
      value: plugin.storage.debugUpdateRows,
      onValueChange: function(value) {
        plugin.storage.debugUpdateRows = value;
      }
    })
  }));
}const { ScrollView: ScrollView$4, View: View$4, Text: Text$4, TouchableOpacity: TouchableOpacity$4, TextInput: TextInput$4, Pressable: Pressable$3, Image: Image$4, Animated: Animated$4 } = components.General;
const { FormLabel: FormLabel$4, FormIcon: FormIcon$3, FormArrow: FormArrow$4, FormRow: FormRow$5, FormSwitch: FormSwitch$3, FormSwitchRow: FormSwitchRow$3, FormSection: FormSection$4, FormDivider: FormDivider$5, FormInput: FormInput$4, FormSliderRow: FormSliderRow$2 } = components.Forms;
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
function PatchesComponent({ styles }) {
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View$4, {
    style: [
      styles.subText
    ]
  }, togglePatch?.map(function(obj, index) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$5, {
      label: obj?.label,
      subLabel: obj?.subLabel,
      leading: obj?.icon && /* @__PURE__ */ React.createElement(FormIcon$3, {
        style: {
          opacity: 1
        },
        source: Assets.getAssetIDByName(obj?.icon)
      }),
      trailing: "id" in obj ? /* @__PURE__ */ React.createElement(FormSwitch$3, {
        value: plugin.storage?.switches[obj?.id] ?? obj?.default,
        onValueChange: function(value) {
          return plugin.storage.switches[obj?.id] = value;
        }
      }) : void 0
    }), index !== togglePatch?.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$5, null));
  })));
}const { ScrollView: ScrollView$3, View: View$3, Text: Text$3, TouchableOpacity: TouchableOpacity$3, TextInput: TextInput$3, Pressable: Pressable$2, Image: Image$3, Animated: Animated$3 } = components.General;
const { FormLabel: FormLabel$3, FormIcon: FormIcon$2, FormArrow: FormArrow$3, FormRow: FormRow$4, FormSwitch: FormSwitch$2, FormSwitchRow: FormSwitchRow$2, FormSection: FormSection$3, FormDivider: FormDivider$4, FormInput: FormInput$3, FormSliderRow: FormSliderRow$1 } = components.Forms;
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
function TextComponent({ styles }) {
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View$3, {
    style: [
      styles.subText
    ]
  }, customizedableTexts?.map(function(obj, index) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormInput$3, {
      title: obj?.title,
      keyboardType: obj?.type,
      placeholder: obj?.placeholder?.toString(),
      value: plugin.storage?.inputs[obj.id] ?? obj?.placeholder,
      onChange: function(val) {
        return plugin.storage.inputs[obj.id] = val.toString();
      }
    }), index !== customizedableTexts.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$4, null));
  }), /* @__PURE__ */ React.createElement(FormInput$3, {
    title: "Customize Plugin Name",
    keyboardType: "default",
    placeholder: plugin.storage?.inputs?.customPluginName || _vendetta.plugin?.manifest?.name || "ANTIED",
    value: plugin.storage?.inputs?.customPluginName,
    onChange: function(val) {
      plugin.storage.inputs.customPluginName = val.toString();
      _vendetta.plugin.manifest.name = val.toString();
    }
  }), /* @__PURE__ */ React.createElement(FormDivider$4, null), /* @__PURE__ */ React.createElement(FormRow$4, {
    label: `Current Used Icon - ${plugin.storage?.misc?.editHistoryIcon || "ic_edit_24px"}`,
    subLabel: "Icon for Message History Removed toast",
    trailing: /* @__PURE__ */ React.createElement(FormIcon$2, {
      style: {
        opacity: 1
      },
      source: Assets.getAssetIDByName(plugin.storage?.misc?.editHistoryIcon)
    })
  }), /* @__PURE__ */ React.createElement(FormDivider$4, null), /* @__PURE__ */ React.createElement(FormInput$3, {
    title: "Icon Name",
    keyboardType: "default",
    placeholder: "ic_edit_24px",
    value: plugin.storage?.misc?.editHistoryIcon || "ic_edit_24px",
    onChange: function(val) {
      return plugin.storage.misc.editHistoryIcon = val.toString();
    }
  })));
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
const { FormRow: FormRow$3, FormDivider: FormDivider$3 } = components.Forms;
function TimestampComponent() {
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$3, {
    label: "Timestamp Style"
  }), timestamps.map(function({ type, label, subLabel }, i) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SelectRow, {
      label,
      subLabel: `Example: ${subLabel}`,
      selected: plugin.storage.switches.timestampStyle == type,
      onPress: function() {
        return plugin.storage.switches.timestampStyle = type;
      }
    }), i !== timestamps.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$3, null));
  }), /* @__PURE__ */ React.createElement(FormDivider$3, null), /* @__PURE__ */ React.createElement(FormRow$3, {
    label: "Timestamp Position"
  }), timestampsPosition.map(function({ key, label, subLabel }, i) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SelectRow, {
      label,
      subLabel: `Example: ${subLabel}`,
      selected: plugin.storage.misc?.timestampPos == key,
      onPress: function() {
        return plugin.storage.misc.timestampPos = key;
      }
    }), i !== timestampsPosition.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$3, null));
  }));
}const UserStore = metro.findByStoreName("UserStore");
const { ScrollView: ScrollView$2, View: View$2, Text: Text$2, TouchableOpacity: TouchableOpacity$2, TextInput: TextInput$2, Pressable: Pressable$1, Image: Image$2, Animated: Animated$2 } = components.General;
const { FormLabel: FormLabel$2, FormArrow: FormArrow$2, FormRow: FormRow$2, FormSection: FormSection$2, FormDivider: FormDivider$2, FormInput: FormInput$2 } = components.Forms;
const me = {
  name: "Angel",
  role: "Author & Maintainer",
  uuid: "692632336961110087"
};
const qa = [
  {
    name: "Rairof",
    role: "Quality Assurance",
    uuid: "923212189123346483"
  },
  {
    name: "Moodle",
    role: "Quality Assurance",
    uuid: "807170846497570848"
  },
  {
    name: "Catinette",
    role: "Quality Assurance",
    uuid: "1302022854740807730"
  },
  {
    name: "Win8.1VMUser",
    role: "Quality Assurance",
    uuid: "793935599702507542"
  }
];
const links = [
  {
    label: "Source Code",
    url: "https://github.com/angelix1/MP"
  },
  {
    label: "Tip via PayPal",
    url: "https://paypal.me/alixymizuki"
  },
  {
    label: "Buy me a Ko-fi",
    url: "https://ko-fi.com/angel_wolf"
  }
];
function CreditsPage() {
  storage.useProxy(plugin.storage);
  const open = function(uri) {
    return common.url.openURL(uri).catch(function() {
    });
  };
  const getUser = function(id) {
    return UserStore?.getUser(id) || Object.values(UserStore?.getUsers()).find(function(u) {
      return u.id === id;
    }) || null;
  };
  const getUserPng = function(id) {
    const u = getUser(id);
    return u?.getAvatarURL?.()?.replace("webp", "png") || null;
  };
  const box = function(u) {
    return /* @__PURE__ */ common.React.createElement(Image$2, {
      source: {
        uri: u
      },
      style: {
        width: 40,
        height: 40,
        borderRadius: 20
      }
    });
  };
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(ScrollView$2, null, /* @__PURE__ */ common.React.createElement(FormSection$2, {
    title: "Developers"
  }, /* @__PURE__ */ common.React.createElement(FormRow$2, {
    label: me.name,
    subLabel: me.role,
    leading: box(getUserPng(me?.uuid))
  })), /* @__PURE__ */ common.React.createElement(FormSection$2, {
    title: "Testers"
  }, qa.map(function(p, i) {
    const avatarUri = getUserPng(p?.uuid);
    return /* @__PURE__ */ common.React.createElement(FormRow$2, {
      key: i,
      label: p.name,
      subLabel: p.role,
      leading: avatarUri ? box(avatarUri) : null
    });
  })), /* @__PURE__ */ common.React.createElement(FormDivider$2, null), /* @__PURE__ */ common.React.createElement(FormSection$2, {
    title: "Support & Source"
  }, /* @__PURE__ */ common.React.createElement(View$2, {
    style: {
      margin: 50
    }
  }, links.map(function(l, i) {
    let finalIcon = l.icon ? l.icon?.startsWith("https") ? /* @__PURE__ */ common.React.createElement(Image$2, {
      source: {
        uri: l.icon
      },
      style: {
        width: 120,
        height: 40
      }
    }) : /* @__PURE__ */ common.React.createElement(FormRow$2.Icon, {
      source: Assets.getAssetIDByName(l.icon)
    }) : null;
    return /* @__PURE__ */ common.React.createElement(FormRow$2, {
      key: i,
      label: l.label,
      leading: finalIcon,
      trailing: /* @__PURE__ */ common.React.createElement(FormArrow$2, null),
      onPress: function() {
        return open(l.url);
      }
    });
  }))), /* @__PURE__ */ common.React.createElement(FormDivider$2, null), /* @__PURE__ */ common.React.createElement(View$2, {
    style: {
      height: 40
    }
  })));
}const knownBugs = [
  {
    bugType: "SELF_EDIT_MESSAGE",
    bugDescription: "When starting to edit a message, old history gets included. Use BetterBetterChatGestrure Plugin to force edit message using function Antied Watch."
  },
  {
    bugType: "MESSAGE_DELETION_BOT_DISMISS",
    bugDescription: "in Rare Occasion, Delete Patcher can fail to dismiss ephemeral messages, often happens in bot messages."
  }
];const { ScrollView: ScrollView$1, View: View$1, Text: Text$1, TouchableOpacity: TouchableOpacity$1, TextInput: TextInput$1, Image: Image$1, Animated: Animated$1 } = components.General;
const { FormLabel: FormLabel$1, FormIcon: FormIcon$1, FormArrow: FormArrow$1, FormRow: FormRow$1, FormSwitch: FormSwitch$1, FormSwitchRow: FormSwitchRow$1, FormSection: FormSection$1, FormDivider: FormDivider$1, FormInput: FormInput$1 } = components.Forms;
Assets.getAssetIDByName("ic_radio_square_checked_24px");
Assets.getAssetIDByName("ic_radio_square_24px");
Assets.getAssetIDByName("ic_information_24px");
Assets.getAssetIDByName("ic_info");
Assets.getAssetIDByName("premium_sparkles");
Assets.getAssetIDByName("ic_sync_24px");
Assets.getAssetIDByName("ic_progress_wrench_24px");
common.stylesheet.createThemedStyleSheet({
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
});const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated } = components.General;
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
  const navigation = common.NavigationNative.useNavigation();
  const openCreditPage = function() {
    navigation.push("VendettaCustomPage", {
      title: `Credits & Support`,
      render: function() {
        return common.React.createElement(CreditsPage, {
          styles
        });
      }
    });
  };
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
    createChild("ingorelist", "Ignore List", "Show Ignore List", null, IgnoreListComponent, null),
    createChild("nerd", "Nerd Stuff", "Open Sesami", null, NerdComponent, null)
  ];
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
      onPress: function() {
        plugin.storage.setting[element?.id] = !plugin.storage.setting[element?.id];
      },
      trailing: plugin.storage.setting[element?.id] == true ? /* @__PURE__ */ common.React.createElement(FormRow.Icon, {
        source: Assets.getAssetIDByName("ic_arrow_down")
      }) : /* @__PURE__ */ common.React.createElement(FormRow.Icon, {
        source: Assets.getAssetIDByName("ic_arrow_right")
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
  }), knownBugs && /* @__PURE__ */ common.React.createElement(FormSection, {
    title: "Known Bugs"
  }, /* @__PURE__ */ common.React.createElement(FormRow, {
    label: "Click to show those Lady Bug",
    style: {
      padding: 2
    },
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
  }, /* @__PURE__ */ common.React.createElement(FormRow, {
    label: "CREDITS",
    subLabel: "See the people behind the plugin and ways to support its development.",
    onPress: openCreditPage,
    style: [
      styles.lnBorder,
      bgStyle,
      styles.darkMask
    ],
    trailing: /* @__PURE__ */ common.React.createElement(FormRow.Icon, {
      source: Assets.getAssetIDByName("ic_arrow_right")
    })
  }), entireUIList), /* @__PURE__ */ common.React.createElement(View, {
    style: {
      height: 60
    }
  })));
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
exports.isEnabled = false;
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
    useIndicatorForDeleted: false,
    useCustomPluginName: false
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
let deletedMessageArray = /* @__PURE__ */ new Map();
let unpatch = null;
let intervalPurge;
const KEEP_NEWEST = 10;
const DELETE_EACH_CYCLE = 140;
const patches = [
  [
    fluxDispatchPatch,
    [
      deletedMessageArray
    ]
  ],
  [
    updateRowsPatch,
    [
      deletedMessageArray
    ]
  ],
  [
    selfEditPatch,
    []
  ],
  [
    createMessageRecord,
    []
  ],
  [
    messageRecordDefault,
    []
  ],
  [
    updateMessageRecord,
    []
  ],
  [
    actionsheet,
    [
      deletedMessageArray
    ]
  ]
];
const patcher = function() {
  return patches.forEach(function([fn, args]) {
    return fn(...args);
  });
};
var index = {
  onLoad: function() {
    exports.isEnabled = true;
    try {
      unpatch = patcher();
    } catch (err) {
      console.log("[ANTIED], Crash On Load.\n\n", err);
      toasts.showToast("[ANTIED], Crashing On Load. Please check debug log for more info.");
      plugins.stopPlugin(plugin.id);
    }
    intervalPurge = setInterval(function() {
      if (deletedMessageArray.size <= KEEP_NEWEST)
        return;
      const toDelete = Math.min(DELETE_EACH_CYCLE, deletedMessageArray.size - KEEP_NEWEST);
      let i = 0;
      for (const key of deletedMessageArray.keys()) {
        deletedMessageArray.delete(key);
        if (++i >= toDelete)
          break;
      }
    }, 15 * 60 * 1e3);
    _vendetta.plugin.manifest.name = plugin.storage?.switches?.useCustomPluginName ? plugin.storage?.inputs?.customPluginName : _vendetta.plugin?.manifest?.name;
  },
  onUnload: function() {
    exports.isEnabled = false;
    clearInterval(intervalPurge);
    unpatch?.();
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
};exports.default=index;exports.regexEscaper=regexEscaper;exports.stripVersions=stripVersions;exports.vendettaUiAssets=vendettaUiAssets;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({},vendetta,vendetta.metro,vendetta.ui.components,vendetta.patcher,vendetta.plugin,vendetta.ui.toasts,vendetta.metro.common,vendetta.ui.assets,vendetta.plugins,vendetta.utils,vendetta.storage,vendetta.ui,vendetta.ui.alerts);