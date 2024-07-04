(function(exports,_vendetta,metro,components,patcher,Assets,utils,common,plugin,ui,storage,toasts,alerts){'use strict';function _interopNamespaceDefault(e){var n=Object.create(null);if(e){Object.keys(e).forEach(function(k){if(k!=='default'){var d=Object.getOwnPropertyDescriptor(e,k);Object.defineProperty(n,k,d.get?d:{enumerable:true,get:function(){return e[k]}});}})}n.default=e;return Object.freeze(n)}var Assets__namespace=/*#__PURE__*/_interopNamespaceDefault(Assets);const { openLazy, hideActionSheet } = metro.findByProps("openLazy", "hideActionSheet");
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
const UIElements = {
  ...components.General,
  ...components.Forms
};
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
      if (plugin.storage?.switches?.enableLogging) {
        plugin.storage.log.push({
          type: "MessageDelete",
          author: {
            id: originalMessage?.author?.id,
            username: `${originalMessage?.author?.discriminator == "0" ? `@${originalMessage?.author?.username}` : `${originalMessage?.author?.username}#${originalMessage?.author?.discriminator}`}`,
            avatar: originalMessage?.author?.avatar,
            bot: originalMessage?.author?.bot
          },
          content: originalMessage?.content,
          where: {
            channel: originalMessage?.channel_id || event?.channelId,
            guild: messageGuildId,
            messageLink: originalMessage?.id
          }
        });
      }
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
      if (plugin.storage?.switches?.enableLogging) {
        plugin.storage.log.push({
          type: "MessageUpdate",
          author: {
            id: event?.message?.author?.id,
            username: `${event?.message?.author?.discriminator == "0" ? `@${event?.message?.author?.username}` : `${event?.message?.author?.username}#${event?.message?.author?.discriminator}`}`,
            avatar: event?.message?.author?.avatar,
            bot: event?.message?.author?.bot
          },
          content: originalMessage?.content,
          edited: event?.message?.content,
          where: {
            channel: event?.channelId || event?.message?.channel_id || originalMessage?.channel_id,
            guild: messageGuildId,
            messageLink: event?.message?.id
          }
        });
      }
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
}const { DCDChatManager } = common.ReactNative.NativeModules;
function updateRowsPatch(deletedMessagesArray) {
  return patcher.before("updateRows", DCDChatManager, function(r) {
    let rows = JSON.parse(r[1]);
    const { textColor, backgroundColor, backgroundColorAlpha, gutterColor, gutterColorAlpha } = plugin.storage.colors;
    const deletedText = plugin.storage.inputs?.deletedMessageBuffer;
    const { useBackgroundColor, minimalistic, removeDismissButton } = plugin.storage.switches;
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
    function transformObject(obj, inputColor) {
      const charColor = inputColor?.toString();
      const compTypes = [
        "text",
        "heading",
        "s",
        "u",
        "em",
        "strong",
        "list",
        "blockQuote"
      ];
      if (Array.isArray(obj)) {
        return obj.map(function(data) {
          return transformObject(data, charColor);
        });
      } else if (typeof obj === "object" && obj !== null) {
        const { content, type, target, items } = obj;
        if (!compTypes.includes(type))
          return obj;
        if (type === "text" && content && content.length >= 1) {
          return {
            content: [
              {
                content,
                type: "text"
              }
            ],
            target: "usernameOnClick",
            type: "link",
            context: {
              username: 1,
              medium: true,
              usernameOnClick: {
                action: "0",
                userId: "0",
                linkColor: common.ReactNative.processColor(charColor),
                messageChannelId: "0"
              }
            }
          };
        }
        const updatedContent = transformObject(content, charColor);
        const updatedItems = items ? items.map(transformObject, charColor) : void 0;
        if (updatedContent !== content || updatedItems !== items || !compTypes.includes(type)) {
          const updatedObj = {
            ...obj,
            content: updatedContent
          };
          if (type === "blockQuote" && target) {
            updatedObj.content = updatedContent;
            updatedObj.target = target;
          }
          if (type === "list") {
            if (updatedObj?.content) {
              delete updatedObj.content;
            }
          }
          if (items) {
            updatedObj.items = updatedItems;
          }
          return updatedObj;
        }
      }
      return obj;
    }
    function updateEphemeralIndication(object, onlyYouText, dismissText) {
      if (object) {
        {
          object.content[0].content.splice(1);
        }
      }
      return object;
    }
    rows.forEach(function(row) {
      if (plugin.storage.debug)
        console.log(row);
      if (row?.type == 1) {
        if (deletedMessagesArray[row?.message?.id]) {
          if (deletedText?.length > 0 || deletedText != "") {
            row.message.edited = deletedText;
          }
          if (minimalistic == false) {
            const characterColor = validateHex(textColor, "#E40303");
            const appliedColor = transformObject(row?.message?.content, characterColor);
            row.message.content = appliedColor;
          }
          if (removeDismissButton && row?.message?.ephemeralIndication) {
            row.message.ephemeralIndication = updateEphemeralIndication(row.message.ephemeralIndication);
          }
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
}const { FormSection: FormSection$5 } = components.Forms;
const getScreens = metro.findByName("getScreens");
const settingsModule = metro.findByName("UserSettingsOverviewWrapper", false);
const styles$5 = common.stylesheet.createThemedStyleSheet({
  container: {
    flex: 1,
    backgroundColor: ui.semanticColors.BACKGROUND_MOBILE_PRIMARY
  }
});
function managePage(options, navigation) {
  if (!navigation)
    navigation = common.NavigationNative.useNavigation();
  common.React.useEffect(function() {
    navigation.setOptions(options);
  }, [
    navigation
  ]);
}
function patchSettingsPin(shouldAppear, render, you) {
  const patches = [];
  const unpatch = patcher.after("default", settingsModule, function(_, ret) {
    unpatch();
    const Overview = utils.findInReactTree(ret.props.children, function(i) {
      return i.type && i.type.name === "UserSettingsOverview";
    });
    patches.push(patcher.after("render", Overview.type.prototype, function(_2, param) {
      let { props: { children } } = param;
      const titles = [
        common.i18n.Messages["BILLING_SETTINGS"],
        common.i18n.Messages["PREMIUM_SETTINGS"]
      ];
      children = utils.findInReactTree(children, function(t) {
        return t.children[1].type === FormSection$5;
      }).children;
      const index = children.findIndex(function(c) {
        return titles.includes(c?.props.label);
      });
      if (shouldAppear())
        children.splice(index === -1 ? 4 : index, 0, render({}));
    }));
  }, true);
  patches.push(unpatch);
  if (getScreens && you) {
    const screenKey = `BUNNY_PLUGIN_${common.lodash.snakeCase(you.key).toUpperCase()}`;
    const Page = you.page.render;
    const component = common.React.memo(function(param) {
      let { navigation } = param;
      managePage(utils.without(you.page, "noErrorBoundary", "render"), navigation);
      return /* @__PURE__ */ common.React.createElement(common.ReactNative.View, {
        style: styles$5.container
      }, you.page.noErrorBoundary ? /* @__PURE__ */ common.React.createElement(Page, null) : /* @__PURE__ */ common.React.createElement(components.ErrorBoundary, null, /* @__PURE__ */ common.React.createElement(Page, null)));
    });
    const rendererConfig = {
      [screenKey]: {
        type: "route",
        title: function() {
          return you.title;
        },
        usePredicate: shouldAppear,
        icon: you.icon,
        parent: null,
        screen: {
          route: `BunnyPlugin${common.lodash.chain(you.key).camelCase().upperFirst().value()}`,
          getComponent: function() {
            return component;
          }
        }
      }
    };
    const manipulateSections = function(ret, nw) {
      const cloned = [
        ...ret
      ];
      const sections = nw ? cloned?.[0]?.sections : cloned;
      if (!Array.isArray(sections))
        return sections;
      const title = "Bunny";
      const section = sections.find(function(x) {
        return x?.title === title || x?.label === title;
      });
      if (section && !section?.settings?.includes(screenKey))
        section.settings.push(screenKey);
      return cloned;
    };
    const oldYouPatch = function() {
      const layout = metro.findByProps("useOverviewSettings");
      const titleConfig = metro.findByProps("getSettingTitleConfig");
      const stuff = metro.findByProps("SETTING_RELATIONSHIPS", "SETTING_RENDERER_CONFIGS");
      const OLD_getterFunction = "getSettingSearchListItems";
      const NEW_getterFunction = "getSettingListItems";
      const oldGettersModule = metro.findByProps(OLD_getterFunction);
      const usingNewGettersModule = !oldGettersModule;
      const getterFunctionName = usingNewGettersModule ? NEW_getterFunction : OLD_getterFunction;
      const getters = oldGettersModule ?? metro.findByProps(NEW_getterFunction);
      if (!getters || !layout)
        return false;
      patches.push(patcher.after("useOverviewSettings", layout, function(_, ret) {
        return manipulateSections(ret);
      }));
      patches.push(patcher.after("getSettingTitleConfig", titleConfig, function(_, ret) {
        return {
          ...ret,
          [screenKey]: you.title
        };
      }));
      patches.push(patcher.after(getterFunctionName, getters, function(param, ret) {
        let [settings] = param;
        return [
          ...settings.includes(screenKey) ? [
            {
              type: "setting_search_result",
              ancestorRendererData: rendererConfig[screenKey],
              setting: screenKey,
              title: function() {
                return you.title;
              },
              breadcrumbs: [
                "Bunny",
                "Nexpid"
              ],
              icon: rendererConfig[screenKey].icon
            }
          ] : [],
          ...ret
        ];
      }));
      const oldRelationships = stuff.SETTING_RELATIONSHIPS;
      const oldRendererConfigs = stuff.SETTING_RENDERER_CONFIGS;
      stuff.SETTING_RELATIONSHIPS = {
        ...oldRelationships,
        [screenKey]: null
      };
      stuff.SETTING_RENDERER_CONFIGS = {
        ...oldRendererConfigs,
        ...rendererConfig
      };
      patches.push(function() {
        stuff.SETTING_RELATIONSHIPS = oldRelationships;
        stuff.SETTING_RENDERER_CONFIGS = oldRelationships;
      });
      return true;
    };
    const newYouPatch = function() {
      const settingsListComponents = metro.findByProps("SearchableSettingsList");
      const settingConstantsModule = metro.findByProps("SETTING_RENDERER_CONFIG");
      const gettersModule = metro.findByProps("getSettingListItems");
      if (!gettersModule || !settingsListComponents || !settingConstantsModule)
        return false;
      patches.push(patcher.before("type", settingsListComponents.SearchableSettingsList, function(ret) {
        return manipulateSections(ret, true);
      }));
      patches.push(patcher.after("getSettingListSearchResultItems", gettersModule, function(_, ret) {
        for (const s of ret)
          if (s.setting === screenKey)
            s.breadcrumbs = [
              "Bunny",
              "Nexpid"
            ];
      }));
      const oldRendererConfig = settingConstantsModule.SETTING_RENDERER_CONFIG;
      settingConstantsModule.SETTING_RENDERER_CONFIG = {
        ...oldRendererConfig,
        ...rendererConfig
      };
      patches.push(function() {
        settingConstantsModule.SETTING_RENDERER_CONFIG = oldRendererConfig;
      });
      return true;
    };
    if (!newYouPatch())
      oldYouPatch();
  }
  return function() {
    return patches.forEach(function(x) {
      return x();
    });
  };
}const { View: View$8, FormRow: FormRow$e, FormIcon: FormIcon$6, FormSwitch: FormSwitch$7, FormDivider: FormDivider$b } = UIElements;
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
  },
  {
    id: "enableLogging",
    default: false,
    label: "Toggle Antied Logging",
    subLabel: "Save Logs to plugin's storage"
  },
  {
    id: "logWarning",
    default: false,
    label: "Toggle Exceeding Log Limit Warning",
    subLabel: "Warn if log limit exceed"
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
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$e, {
      label: obj?.label,
      subLabel: obj?.subLabel,
      leading: obj?.icon && /* @__PURE__ */ React.createElement(FormIcon$6, {
        style: {
          opacity: 1
        },
        source: Assets.getAssetIDByName(obj?.icon)
      }),
      trailing: "id" in obj ? /* @__PURE__ */ React.createElement(FormSwitch$7, {
        value: plugin.storage?.switches[obj?.id] ?? obj?.default,
        onValueChange: function(value) {
          return plugin.storage.switches[obj?.id] = value;
        }
      }) : void 0
    }), index !== togglePatch?.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$b, null));
  })));
}const { View: View$7, FormInput: FormInput$4, FormDivider: FormDivider$a } = UIElements;
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
    id: "logLength",
    title: "Customize Log message length",
    type: "numeric",
    placeholder: "60"
  },
  {
    id: "logCount",
    title: "Customize Log Limit",
    type: "numeric",
    placeholder: "1000"
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
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormInput$4, {
      title: obj?.title,
      keyboardType: obj?.type,
      placeholder: obj?.placeholder?.toString(),
      value: plugin.storage?.inputs[obj.id] ?? obj?.placeholder,
      onChange: function(val) {
        return plugin.storage.inputs[obj.id] = val.toString();
      }
    }), index !== customizedableTexts.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$a, null));
  })));
}const dialog$1 = metro.findByProps("show", "confirm", "close");
metro.findByName("StaticSearchBarContainer");
metro.findByStoreName("UserStore");
const Profiles$1 = metro.findByProps("showUserProfile");
const useIsFocused$2 = metro.findByName("useIsFocused");
const { openURL } = metro.findByProps("openURL", "openDeeplink");
const { ScrollView: ScrollView$5, View: View$6, Text: Text$4, TouchableOpacity: TouchableOpacity$5, TextInput: TextInput$3, Image: Image$3, Animated: Animated$3 } = components.General;
const { FormLabel: FormLabel$3, FormIcon: FormIcon$5, FormArrow: FormArrow$3, FormRow: FormRow$d, FormSwitch: FormSwitch$6, FormSwitchRow: FormSwitchRow$3, FormSection: FormSection$4, FormDivider: FormDivider$9, FormInput: FormInput$3 } = components.Forms;
const { FlatList } = common.ReactNative;
const styles$4 = common.stylesheet.createThemedStyleSheet({
  main_text: {
    opacity: 0.975,
    letterSpacing: 0.25,
    fontFamily: common.constants.Fonts.DISPLAY_NORMAL
  },
  item_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 4,
    width: "100%"
  },
  log_header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "95%"
  },
  log_sub_header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "50%"
  },
  log_time: {
    color: ui.semanticColors.TEXT_MUTED,
    opacity: 0.99,
    fontSize: 13,
    paddingLeft: 4
  },
  log_type: {
    color: ui.semanticColors.TEXT_MUTED,
    opacity: 0.45,
    fontSize: 16,
    marginLeft: "auto"
  },
  avatar_container: {
    alignSelf: "start",
    justifySelf: "start",
    marginTop: 5
  },
  author_avatar: {
    width: 40,
    height: 40,
    borderRadius: 80
  },
  author_name: {
    color: ui.semanticColors.HEADER_PRIMARY,
    fontFamily: common.constants.Fonts.DISPLAY_BOLD,
    fontSize: 14,
    letterSpacing: 0.25,
    paddingBottom: 4
  },
  old_message: {
    color: ui.semanticColors.TEXT_MUTED,
    opacity: 0.89,
    fontSize: 13
  },
  message_content: {
    color: ui.semanticColors.TEXT_NORMAL,
    opacity: 0.985,
    fontSize: 13
  },
  main_container: {
    paddingLeft: 8,
    paddingRight: 4,
    paddingTop: 2,
    paddingBottom: 16,
    width: "95%"
  },
  text_container: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: 4,
    paddingLeft: 8,
    width: "95%"
  }
});
function shortenString(str, maxLength) {
  if (str?.length > maxLength) {
    return str?.substring(0, maxLength) + "...";
  }
  return str;
}
function Log() {
  storage.useProxy(plugin.storage);
  useIsFocused$2();
  const animatedButtonScale = common.React.useRef(new Animated$3.Value(1)).current;
  const onPressIn = function() {
    return Animated$3.spring(animatedButtonScale, {
      toValue: 1.1,
      duration: 10,
      useNativeDriver: true
    }).start();
  };
  const onPressOut = function() {
    return Animated$3.spring(animatedButtonScale, {
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
  const [log, setLog] = common.React.useState([]);
  common.React.useEffect(function() {
    if (plugin.storage?.log?.length > 0) {
      setLog(plugin.storage.log.reverse());
    }
  }, []);
  if (log?.length > plugin.storage?.inputs?.logCount && plugin.storage.logWarning) {
    dialog$1.show({
      title: "Log exceed limit",
      body: "Clear log?",
      confirmText: "Yes",
      cancelText: "NO",
      confirmColor: "brand",
      onConfirm: function() {
        plugin.storage.log = [];
        setLog([]);
        toasts.showToast("[ANTIED] Cleared the log");
      }
    });
  }
  const snipLength = Number(plugin.storage?.inputs?.logLength || 60);
  function MessageThing(param) {
    let { data } = param;
    const { type, author, content, edited, where } = data;
    return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(View$6, {
      style: styles$4.item_container
    }, /* @__PURE__ */ common.React.createElement(TouchableOpacity$5, {
      style: styles$4.avatar_container,
      onPress: function() {
        return Profiles$1.showUserProfile({
          userId: author["id"]
        });
      },
      onPressIn,
      onPressOut
    }, /* @__PURE__ */ common.React.createElement(Animated$3.View, {
      style: [
        animatedScaleStyle
      ]
    }, /* @__PURE__ */ common.React.createElement(Image$3, {
      source: {
        uri: author.avatar ? `https://cdn.discordapp.com/avatars/${author?.id}/${author.avatar}.png` : "https://cdn.discordapp.com/embed/avatars/2.png"
      },
      style: styles$4.author_avatar
    }))), /* @__PURE__ */ common.React.createElement(View$6, {
      style: styles$4.text_container
    }, /* @__PURE__ */ common.React.createElement(View$6, {
      style: styles$4.log_header
    }, /* @__PURE__ */ common.React.createElement(View$6, {
      style: styles$4.log_sub_header
    }, /* @__PURE__ */ common.React.createElement(Text$4, {
      style: [
        styles$4.main_text,
        styles$4.author_name
      ]
    }, `${author["username"]}`), /* @__PURE__ */ common.React.createElement(View$6, {
      style: {
        paddingLeft: "2px"
      }
    }, type == "MessageUpdate" ? /* @__PURE__ */ common.React.createElement(FormRow$d.Icon, {
      source: Assets.getAssetIDByName("pencil")
    }) : /* @__PURE__ */ common.React.createElement(FormRow$d.Icon, {
      source: Assets.getAssetIDByName("ic_message_delete")
    })), /* @__PURE__ */ common.React.createElement(TouchableOpacity$5, {
      onPress: function() {
        if (type == "MessageUpdate" && data.where.guild && data.where.channel && data.where.messageLink) {
          openURL(`https://discord.com/channels/${data.where.guild}/${data.where.channel}/${data.where.messageLink}`);
        } else {
          toasts.showToast("Cannot find target Message");
        }
      }
    }, /* @__PURE__ */ common.React.createElement(View$6, {
      style: {
        paddingLeft: "2px"
      }
    }, /* @__PURE__ */ common.React.createElement(FormRow$d.Icon, {
      source: Assets.getAssetIDByName("ic_show_media")
    }))))), /* @__PURE__ */ common.React.createElement(TouchableOpacity$5, {
      onPress: function() {
        let clip = author.username;
        clip += ` (${author.id}):
`;
        clip += `>>> ${content}`;
        if (edited) {
          clip += `

${edited}`;
        }
        common.clipboard.setString(clip);
        toasts.showToast("Log content copied");
      },
      style: styles$4.text_container
    }, /* @__PURE__ */ common.React.createElement(View$6, null, edited?.length > 0 ? /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(Text$4, {
      style: [
        styles$4.main_text,
        styles$4.old_message
      ]
    }, shortenString(content, snipLength)), /* @__PURE__ */ common.React.createElement(Text$4, {
      style: [
        styles$4.main_text,
        styles$4.message_content
      ]
    }, shortenString(edited, snipLength))) : /* @__PURE__ */ common.React.createElement(Text$4, {
      style: styles$4.message_content
    }, shortenString(content, snipLength)))))));
  }
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(ScrollView$5, null, !plugin.storage?.switches?.enableLogging && /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$d, {
    label: "To save log of edited/deleted messages, go to plugin setting > patches > Toggle Antied Logging"
  })), log?.length > 0 ? /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$d, {
    label: "Nuke logs",
    trailing: /* @__PURE__ */ common.React.createElement(FormRow$d.Icon, {
      source: Assets.getAssetIDByName("ic_trash_24px")
    }),
    onPress: function() {
      dialog$1.show({
        title: "Nuke logs",
        body: "Nuke the Log?",
        confirmText: "Yash",
        cancelText: "nu uh",
        confirmColor: "brand",
        onConfirm: function() {
          plugin.storage.log = [];
          setLog([]);
          toasts.showToast("[ANTIED] Logs cleared");
        }
      });
    }
  })) : /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$d, {
    label: "Only us chicken here, go touch some grass"
  })), log.length > 0 && /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(View$6, {
    style: styles$4.main_container
  }, /* @__PURE__ */ common.React.createElement(FlatList, {
    style: {
      paddingHorizontal: 10,
      paddingTop: 10
    },
    contentContainerStyle: {
      paddingBottom: 20,
      paddingHorizontal: 5
    },
    data: log,
    renderItem: function(param) {
      let { item } = param;
      return /* @__PURE__ */ common.React.createElement(MessageThing, {
        data: item
      });
    }
  })))));
}const dialog = metro.findByProps("show", "confirm", "close");
const { FormRow: FormRow$c } = UIElements;
function LoggingComponent() {
  storage.useProxy(plugin.storage);
  const navigation = common.NavigationNative.useNavigation();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$c, {
    label: "Anti Edit & Delete Logs",
    leading: /* @__PURE__ */ React.createElement(FormRow$c.Icon, {
      source: Assets.getAssetIDByName("ic_audit_log_24px")
    }),
    trailing: FormRow$c.Arrow,
    onPress: function() {
      return navigation.push("VendettaCustomPage", {
        title: "Antied Logging Page",
        render: function() {
          return /* @__PURE__ */ React.createElement(Log, null);
        }
      });
    }
  }), plugin.storage?.log?.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$c, {
    label: "Clear Logs",
    leading: /* @__PURE__ */ React.createElement(FormRow$c.Icon, {
      source: Assets.getAssetIDByName("ic_trash_24px")
    }),
    trailing: FormRow$c.Arrow,
    onPress: function() {
      dialog.show({
        title: "Clear logs",
        body: "This will erase saved logs, continue?",
        confirmText: "Yes",
        cancelText: "No",
        confirmColor: "brand",
        onConfirm: function() {
          plugin.storage.log = [];
          toasts.showToast("[ANTIED] Logs cleared");
        }
      });
    }
  })));
}const { FormRow: FormRow$b } = UIElements;
const RowCheckmark = metro.findByName("RowCheckmark");
function SelectRow(param) {
  let { label, subLabel, selected, onPress } = param;
  return /* @__PURE__ */ React.createElement(FormRow$b, {
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
const { FormRow: FormRow$a, FormDivider: FormDivider$8 } = UIElements;
function TimestampComponent() {
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$a, {
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
  }), /* @__PURE__ */ React.createElement(FormDivider$8, null), /* @__PURE__ */ React.createElement(FormRow$a, {
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
const { FormRow: FormRow$9, FormDivider: FormDivider$7, ScrollView: ScrollView$4 } = UIElements;
function SemRawComponent() {
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ScrollView$4, null, /* @__PURE__ */ React.createElement(FormRow$9, {
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
const { View: View$5, FormRow: FormRow$8, FormSwitch: FormSwitch$5, FormSliderRow, FormDivider: FormDivider$6, Text: Text$3, TouchableOpacity: TouchableOpacity$4, Image: Image$2 } = UIElements;
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
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(View$5, {
    style: [
      styles.subText
    ]
  }, plugin.storage?.switches?.useSemRawColors && /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$8, {
    label: "Semantic & Raw Colors",
    subLabel: "If you enabled [Use Semantic/Raw Color], you can pick the colors from here",
    leading: /* @__PURE__ */ common.React.createElement(FormRow$8.Icon, {
      source: Assets.getAssetIDByName("ic_audit_log_24px")
    }),
    trailing: FormRow$8.Arrow,
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
    return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$8, {
      label: obj?.label,
      subLabel: obj?.subLabel || "Click to Update",
      onPress: whenPressed,
      trailing: /* @__PURE__ */ common.React.createElement(TouchableOpacity$4, {
        onPress: whenPressed
      }, /* @__PURE__ */ common.React.createElement(Image$2, {
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
  }), /* @__PURE__ */ common.React.createElement(View$5, {
    style: styles.container
  }, /* @__PURE__ */ common.React.createElement(FormRow$8, {
    style: {
      justifyContent: "center",
      alignItems: "center"
    },
    label: `Preview Style: ${plugin.storage?.switches?.darkMode ? "Dark" : "Light"} Mode`,
    subLabel: `Click to Switch Mode`,
    trailing: /* @__PURE__ */ common.React.createElement(FormSwitch$5, {
      value: plugin.storage?.switches?.darkMode ?? true,
      onValueChange: function(value) {
        return plugin.storage.switches.darkMode = value;
      }
    })
  }), /* @__PURE__ */ common.React.createElement(View$5, {
    style: [
      styles.row,
      styles.border,
      {
        overflow: "hidden",
        marginRight: 10
      }
    ]
  }, /* @__PURE__ */ common.React.createElement(View$5, {
    style: {
      width: "2%",
      backgroundColor: `${plugin.storage.colors.gutterColor}${parseColorPercentage(gutterAlpha)}`
    }
  }), /* @__PURE__ */ common.React.createElement(View$5, {
    style: {
      flex: 1,
      backgroundColor: `${plugin.storage.switches.useSemRawColors ? handleSemRaw(plugin.storage?.colors?.semRawColorPrefix) || plugin.storage.colors.backgroundColor : plugin.storage.colors.backgroundColor}${parseColorPercentage(BGAlpha)}`,
      justifyContent: "center",
      alignItems: "center"
    }
  }, /* @__PURE__ */ common.React.createElement(Text$3, {
    style: {
      fontSize: 20,
      color: plugin.storage?.switches?.darkMode ? "white" : "black"
    }
  }, " Low Effort Normal Example Message "), /* @__PURE__ */ common.React.createElement(Text$3, {
    style: {
      fontSize: 20,
      color: plugin.storage.colors.textColor || "#000000"
    }
  }, " Low Effort Deleted Example Message "))), /* @__PURE__ */ common.React.createElement(FormSliderRow, {
    label: `Background Color Alpha: ${toPercentage(BGAlpha)}%`,
    value: BGAlpha,
    style: {
      width: "90%"
    },
    onValueChange: function(v) {
      setBGAlpha(Number(formatDecimal(v)));
      plugin.storage.colors.backgroundColorAlpha = alphaToHex(toPercentage(v));
    }
  }), /* @__PURE__ */ common.React.createElement(FormDivider$6, null), /* @__PURE__ */ common.React.createElement(FormSliderRow, {
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
}const { ScrollView: ScrollView$3, View: View$4, Text: Text$2, TouchableOpacity: TouchableOpacity$3, TextInput: TextInput$2, Image: Image$1, Animated: Animated$2 } = components.General;
const { FormLabel: FormLabel$2, FormIcon: FormIcon$4, FormArrow: FormArrow$2, FormRow: FormRow$7, FormSwitch: FormSwitch$4, FormSwitchRow: FormSwitchRow$2, FormSection: FormSection$3, FormDivider: FormDivider$5, FormInput: FormInput$2 } = components.Forms;
const useIsFocused$1 = metro.findByName("useIsFocused");
metro.findByProps("BottomSheetScrollView");
const UserStore = metro.findByStoreName("UserStore");
const Profiles = metro.findByProps("showUserProfile");
Assets.getAssetIDByName("ic_add_24px");
Assets.getAssetIDByName("ic_arrow");
Assets.getAssetIDByName("ic_minus_circle_24px");
Assets.getAssetIDByName("Check");
Assets.getAssetIDByName("Small");
function addIcon$2(i) {
  return /* @__PURE__ */ common.React.createElement(FormIcon$4, {
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
  const animatedButtonScale = common.React.useRef(new Animated$2.Value(1)).current;
  const onPressIn = function() {
    return Animated$2.spring(animatedButtonScale, {
      toValue: 1.1,
      duration: 10,
      useNativeDriver: true
    }).start();
  };
  const onPressOut = function() {
    return Animated$2.spring(animatedButtonScale, {
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
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(ScrollView$3, null, /* @__PURE__ */ common.React.createElement(View$4, {
    style: [
      styles$3.basicPad,
      styles$3.sub
    ]
  }, /* @__PURE__ */ common.React.createElement(FormSection$3, {
    title: "User Setting",
    style: [
      styles$3.header
    ]
  }, /* @__PURE__ */ common.React.createElement(FormRow$7, {
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
  }), /* @__PURE__ */ common.React.createElement(FormInput$2, {
    title: "User Username | Case Sensitive",
    placeholder: "Missing No",
    value: object?.username,
    onChange: function(v) {
      return object.username = v;
    }
  }), /* @__PURE__ */ common.React.createElement(FormInput$2, {
    title: "User Id",
    placeholder: "Missing No",
    value: object?.id,
    onChange: function(v) {
      return object.id = v;
    }
  }), /* @__PURE__ */ common.React.createElement(FormRow$7, {
    label: "User is webhook?",
    subLabel: "User is webhook or system, and not BOT or Normal User.",
    leading: addIcon$2("ic_webhook_24px"),
    trailing: /* @__PURE__ */ common.React.createElement(FormSwitch$4, {
      value: object?.isWebhook || false,
      onValueChange: function(value) {
        return object.isWebhook = value;
      }
    })
  })), user && /* @__PURE__ */ common.React.createElement(View$4, {
    style: [
      styles$3.container,
      {
        paddingBottom: 10
      }
    ]
  }, /* @__PURE__ */ common.React.createElement(TouchableOpacity$3, {
    onPress: function() {
      return Profiles.showUserProfile?.({
        userId: user?.id
      });
    },
    onPressIn,
    onPressOut
  }, /* @__PURE__ */ common.React.createElement(Animated$2.View, {
    style: animatedScaleStyle
  }, /* @__PURE__ */ common.React.createElement(Image$1, {
    source: {
      uri: user?.getAvatarURL?.()?.replace?.("webp", "png") || "https://cdn.discordapp.com/embed/avatars/2.png"
    },
    style: {
      width: 128,
      height: 128,
      borderRadius: 10
    }
  }))), /* @__PURE__ */ common.React.createElement(View$4, {
    style: styles$3.textContainer
  }, /* @__PURE__ */ common.React.createElement(TouchableOpacity$3, {
    onPress: function() {
      return Profiles.showUserProfile({
        userId: user?.id
      });
    }
  }, /* @__PURE__ */ common.React.createElement(Text$2, {
    style: [
      styles$3.mainText,
      styles$3.header
    ]
  }, user?.username || object?.username || "No Name"))), /* @__PURE__ */ common.React.createElement(FormDivider$5, null)), /* @__PURE__ */ common.React.createElement(FormRow$7, {
    label: /* @__PURE__ */ common.React.createElement(FormLabel$2, {
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
}const { ScrollView: ScrollView$2, View: View$3, Text: Text$1, TouchableOpacity: TouchableOpacity$2, TextInput: TextInput$1 } = components.General;
const { FormLabel: FormLabel$1, FormIcon: FormIcon$3, FormArrow: FormArrow$1, FormRow: FormRow$6, FormSwitch: FormSwitch$3, FormSwitchRow: FormSwitchRow$1, FormSection: FormSection$2, FormDivider: FormDivider$4, FormInput: FormInput$1 } = components.Forms;
function addIcon$1(i, dr) {
  return /* @__PURE__ */ common.React.createElement(FormIcon$3, {
    style: {
      opacity: 1
    },
    source: i 
  });
}
const useIsFocused = metro.findByName("useIsFocused");
metro.findByProps("BottomSheetScrollView");
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
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(ScrollView$2, {
    style: {
      flex: 1
    }
  }, /* @__PURE__ */ common.React.createElement(FormSection$2, {
    style: [
      styles$2.header,
      styles$2.basicPad
    ]
  }, /* @__PURE__ */ common.React.createElement(View$3, {
    style: [
      styles$2.header,
      styles$2.sub
    ]
  }, users.length > 0 && /* @__PURE__ */ common.React.createElement(FormRow$6, {
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
    return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$6, {
      label: comp?.username || comp?.id || "No Data",
      trailing: /* @__PURE__ */ common.React.createElement(FormArrow$1, null),
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
  }), /* @__PURE__ */ common.React.createElement(FormRow$6, {
    label: /* @__PURE__ */ common.React.createElement(TextInput$1, {
      value: newUser,
      onChangeText: setNewUser,
      placeholder: "User ID or Username",
      placeholderTextColor: styles$2.placeholder.color,
      selectionColor: common.constants.Colors.PRIMARY_DARK_100,
      onSubmitEditing: addNewUser,
      returnKeyType: "done",
      style: styles$2.input
    }),
    trailing: /* @__PURE__ */ common.React.createElement(TouchableOpacity$2, {
      onPress: addNewUser
    }, addIcon$1(Add))
  })))));
}const { FormRow: FormRow$5, FormDivider: FormDivider$3, FormIcon: FormIcon$2, TouchableOpacity: TouchableOpacity$1 } = UIElements;
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
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$5, {
    label: "Add User to List",
    subLabel: "List of ignored users for the plugin",
    leading: /* @__PURE__ */ React.createElement(FormIcon$2, {
      style: {
        opacity: 1
      },
      source: Assets.getAssetIDByName("ic_members")
    }),
    onPress: listIgnore,
    trailing: /* @__PURE__ */ React.createElement(TouchableOpacity$1, {
      onPress: listIgnore
    }, /* @__PURE__ */ React.createElement(FormIcon$2, {
      style: {
        opacity: 1
      },
      source: Assets.getAssetIDByName("ic_add_24px")
    }))
  }), /* @__PURE__ */ React.createElement(FormDivider$3, null));
}const { View: View$2, FormRow: FormRow$4, FormIcon: FormIcon$1, FormSwitch: FormSwitch$2, FormDivider: FormDivider$2 } = UIElements;
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
  }
];
function CustomizationComponent(param) {
  let { styles } = param;
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View$2, {
    style: [
      styles.subText
    ]
  }, customizeableSwitches?.map(function(obj, index) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$4, {
      label: obj?.label,
      subLabel: obj?.subLabel,
      leading: obj?.icon && /* @__PURE__ */ React.createElement(FormIcon$1, {
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
  createList("1.2.0", ma("Added Update Section")),
  createList("1.2.1", null, ma("Redesign Setting Page")),
  createList("1.2.2", ma("Added Support for Semantic Colors", "Added Support for Raw Colors", "Added Support for Timestamp Format"), ma("Reworked how Message update appends separator")),
  createList("1.2.3", null, null, ma("Fixed Remove Edit button to not persist under Edit Message Button")),
  createList("1.2.4", null, ma("Update Remove Edit button style"), ma("Fixed Message Parser Fails to parse edited message")),
  createList("1.2.5", ma("Added option useEphemeralForDeleted modification in Customize Section", "Added new button on actionMessage if useEphemeralForDeleted disabled"))
];
var updates = update.reverse();const { ScrollView: ScrollView$1, View: View$1, Text, TouchableOpacity, TextInput, Image, Animated: Animated$1 } = components.General;
const { FormLabel, FormIcon, FormArrow, FormRow: FormRow$3, FormSwitch: FormSwitch$1, FormSwitchRow, FormSection: FormSection$1, FormDivider: FormDivider$1, FormInput } = components.Forms;
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
  return /* @__PURE__ */ common.React.createElement(FormIcon, {
    style: {
      opacity: 1
    },
    source: icon
  });
}
function VersionChange(param) {
  let { change, index, totalIndex } = param;
  const [isOpen, setOpen] = common.React.useState(false);
  common.React.useState(false);
  function createSubRow(arr, label, subLabel, icon) {
    return /* @__PURE__ */ common.React.createElement(View$1, null, /* @__PURE__ */ common.React.createElement(FormRow$3, {
      label: label || "No Section",
      subLabel: subLabel || null,
      leading: icon && addIcon(icon),
      style: [
        styles$1.textHeader
      ]
    }), arr.map(function(x, i) {
      return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$3, {
        label: x,
        style: [
          styles$1.textBody,
          styles$1.rowLabel,
          styles$1.border
        ]
      }));
    }));
  }
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(components.ErrorBoundary, null, /* @__PURE__ */ common.React.createElement(FormRow$3, {
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
}const { FormSwitch, FormSection, FormRow: FormRow$2, ScrollView, View, FormDivider, Animated } = UIElements;
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
    createChild("logging", "Logging", "Toggle Logger", null, LoggingComponent, null),
    createChild("text", "Text Variables", "Customize Texts", null, TextComponent, styles),
    createChild("timestamp", "Timestamp", "Timestamp Styles", null, TimestampComponent, styles),
    createChild("colorpick", "Colors", "Customize Colors", null, ColorPickComponent, styles),
    createChild("ingorelist", "Ignore List", "Show IngoreList", null, IgnoreListComponent, null)
  ];
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
  }, /* @__PURE__ */ common.React.createElement(View, {
    style: [
      styles.lnBorder,
      bgStyle,
      styles.darkMask
    ]
  }, ComponentChildren.map(function(element) {
    return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormSection, {
      title: element?.title
    }, /* @__PURE__ */ common.React.createElement(FormRow$2, {
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
  }), /* @__PURE__ */ common.React.createElement(FormDivider, null), /* @__PURE__ */ common.React.createElement(FormRow$2, {
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
  }), /* @__PURE__ */ common.React.createElement(FormDivider, null), updates && /* @__PURE__ */ common.React.createElement(FormSection, {
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
  })))))));
}const { FormRow: FormRow$1 } = components.Forms;
function SettingsSection() {
  const navigation = common.NavigationNative.useNavigation();
  const stripVersions = function(str) {
    return str.replace(/\s?v\d+.\d+.\w+/, "");
  };
  const tits = _vendetta.plugin?.manifest?.name ? `${stripVersions(_vendetta.plugin.manifest.name)} Settings` : "Anti Edit & Delete Settings";
  return /* @__PURE__ */ React.createElement(components.ErrorBoundary, null, /* @__PURE__ */ React.createElement(FormRow$1, {
    label: tits,
    leading: /* @__PURE__ */ React.createElement(FormRow$1.Icon, {
      source: Assets.getAssetIDByName("ic_edit_24px")
    }),
    trailing: FormRow$1.Arrow,
    onPress: function() {
      return navigation.push("VendettaCustomPage", {
        title: tits,
        render: SettingPage
      });
    }
  }));
}const { FormRow } = components.Forms;
function LogSection() {
  const navigation = common.NavigationNative.useNavigation();
  const stripVersions = function(str) {
    return str.replace(/\s?v\d+.\d+.\w+/, "");
  };
  const tits = _vendetta.plugin?.manifest?.name ? `${stripVersions(_vendetta.plugin.manifest.name)} Logs` : "Anti Edit & Delete Logs";
  return /* @__PURE__ */ React.createElement(components.ErrorBoundary, null, /* @__PURE__ */ React.createElement(FormRow, {
    label: tits,
    leading: /* @__PURE__ */ React.createElement(FormRow.Icon, {
      source: Assets.getAssetIDByName("ic_audit_log_24px")
    }),
    trailing: FormRow.Arrow,
    onPress: function() {
      return navigation.push("VendettaCustomPage", {
        title: tits,
        render: Log
      });
    }
  }));
}function sillyPatch() {
  const patches = [];
  const stripVersions = function(str) {
    return str.replace(/\s?v\d+.\d+.\w+/, "");
  };
  const pluginName = _vendetta.plugin?.manifest?.name;
  const name_1 = pluginName ? `${stripVersions(pluginName)} Settings` : "Anti Edit & Delete Settings";
  const name_2 = pluginName ? `${stripVersions(pluginName)} Logs` : "Anti Edit & Delete Logs";
  patches.push(patchSettingsPin(function() {
    return true;
  }, function() {
    return /* @__PURE__ */ React.createElement(SettingsSection, null);
  }, {
    key: "antied_setting",
    icon: Assets.getAssetIDByName("ic_edit_24px"),
    title: name_1,
    page: {
      title: name_1,
      render: SettingPage
    }
  }), patchSettingsPin(function() {
    return true;
  }, function() {
    return /* @__PURE__ */ React.createElement(LogSection, null);
  }, {
    key: "antied_logs",
    icon: Assets.getAssetIDByName("ic_message_delete"),
    title: name_2,
    page: {
      title: name_2,
      render: Log
    }
  }));
  return function() {
    return patches.forEach(function(x) {
      return x();
    });
  };
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
                toasts.showToast(`[ANTI ED] ${plugin.storage?.inputs?.historyToast}`, Assets.getAssetIDByName("ic_edit_24px"));
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
    logging: false,
    patches: false,
    text: false,
    timestamp: false
  },
  switches: {
    customizeable: false,
    enableMD: true,
    enableMU: true,
    enableLogging: false,
    useBackgroundColor: false,
    useSemRawColors: false,
    ignoreBots: false,
    minimalistic: true,
    alwaysAdd: false,
    darkMode: true,
    removeDismissButton: false,
    addTimestampForEdits: false,
    timestampStyle: "R",
    useEphemeralForDeleted: true
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
    historyToast: "History Removed",
    logLength: 60,
    logCount: 100,
    ignoredUserList: []
  },
  misc: {
    timestampPos: "BEFORE",
    editHistoryIcon: "ic_edit_24px"
  },
  log: [],
  logWarning: false,
  debug: false
});
let deletedMessageArray = {};
const patches = [];
var index = {
  onLoad: function() {
    patches.push(sillyPatch(), fluxDispatchPatch(deletedMessageArray), updateRowsPatch(deletedMessageArray), selfEditPatch(), createMessageRecord(), messageRecordDefault(), updateMessageRecord(), actionsheet(deletedMessageArray));
  },
  onUnload: function() {
    for (const unpatch of patches) {
      unpatch();
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
};exports.default=index;exports.regexEscaper=regexEscaper;exports.stripVersions=stripVersions;exports.vendettaUiAssets=vendettaUiAssets;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({},vendetta,vendetta.metro,vendetta.ui.components,vendetta.patcher,vendetta.ui.assets,vendetta.utils,vendetta.metro.common,vendetta.plugin,vendetta.ui,vendetta.storage,vendetta.ui.toasts,vendetta.ui.alerts);