(function(exports,patcher$1,metro,toasts,common,assets,utils,storage,plugin,components){'use strict';const ChannelStore$1 = metro.findByProps("getChannel", "getDMFromUserId");
const ChannelMessages$1 = metro.findByProps("_channelMessages");
const MessageStore$1 = metro.findByProps("getMessage", "getMessages");
function fluxDispatchPatch(deletedMessageArray) {
  return patcher$1.before("dispatch", common.FluxDispatcher, function(args) {
    if (exports.isEnabled) {
      try {
        const ev = args[0];
        if (!ev || !ev.type)
          return;
        if (ev.type === "MESSAGE_DELETE") {
          if (ev.otherPluginBypass)
            return;
          const orig = ChannelMessages$1.get(ev.channelId)?.get(ev.id);
          if (!orig?.author?.id || !orig.author.username)
            return;
          if (orig?.author?.bot && orig?.flags == 64 || orig.author.bot)
            return;
          if (!orig.content && !orig.attachments?.length && !orig.embeds?.length)
            return;
          const entry = deletedMessageArray.get(ev.id);
          if (entry?.stage === 2) {
            if (deletedMessageArray.size >= 100) {
              deletedMessageArray = /* @__PURE__ */ new Map();
            }
            return;
          }
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
            message_reference: orig?.message_reference || orig?.messageReference || null,
            flags: 64
          };
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
          if (ev.otherPluginBypass)
            return;
          const msg = ev.message;
          if (!msg || msg.author?.bot)
            return;
          const chId = msg.channel_id || ev.channelId;
          const id = msg.id || ev.id;
          const orig = MessageStore$1.getMessage(chId, id) || ChannelMessages$1.get(chId)?.get(id);
          if (!orig?.author?.id || !orig.author.username)
            return;
          if (!orig.content && !orig.attachments?.length && !orig.embeds?.length)
            return;
          if (!msg.content || msg.content === orig.content)
            return;
          let prefix = "`[ EDITED ]`\n\n";
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
        toasts.showToast("[ANTIED Zero] FluxDispatcher crash \u2013 check logs");
        console.error("[ANTIED Zero] Flux patch\n", e);
      }
    }
  });
}const Message = metro.findByProps("sendMessage", "startEditMessage");
function selfEditPatch() {
  return patcher$1.before("startEditMessage", Message, function(args) {
    if (!exports.isEnabled)
      return;
    const DAN = regexEscaper("`[ EDITED ]`\n\n");
    const regexPattern = new RegExp(DAN, "gmi");
    const [, , msg] = args;
    const lats = msg.split(regexPattern);
    const f = lats[lats.length - 1];
    args[2] = f;
  });
}const ActionSheet = metro.findByProps("openLazy", "hideActionSheet");
const MessageStore = metro.findByProps("getMessage", "getMessages");
const ChannelStore = metro.findByProps("getChannel", "getDMFromUserId");
const ChannelMessages = metro.findByProps("_channelMessages");
const { ActionSheetRow } = metro.findByProps("ActionSheetRow");
function someFunc(a) {
  return a?.props?.label?.toLowerCase?.() == "reply";
}
function actionsheet() {
  return patcher$1.before("openLazy", ActionSheet, function([component, args, actionMessage]) {
    if (exports.isEnabled) {
      try {
        const message = actionMessage?.message;
        if (args !== "MessageLongPressActionSheet" || !message)
          return;
        component.then(function(instance) {
          const unpatch = patcher$1.after("default", instance, function(_, comp) {
            try {
              common.React.useEffect(function() {
                return function() {
                  unpatch();
                };
              }, []);
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
                  const channel = ChannelMessages.get(message?.channel_id);
                  originalMessage = channel?.get(message?.id);
                }
              }
              if (!originalMessage)
                return comp;
              const escapedBuffer = regexEscaper("`[ EDITED ]`\n\n");
              const separator = new RegExp(escapedBuffer, "gmi");
              const checkIfBufferExist = separator.test(message.content);
              if (checkIfBufferExist) {
                const targetPos = position || 1;
                buttons.splice(targetPos, 0, /* @__PURE__ */ common.React.createElement(ActionSheetRow, {
                  label: "Remove Edit History",
                  subLabel: `Added by Antied Zero`,
                  icon: /* @__PURE__ */ common.React.createElement(ActionSheetRow.Icon, {
                    source: assets.getAssetIDByName("ic_edit_24px")
                  }),
                  onPress: function() {
                    const lats = message?.content?.split(separator);
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
                    toasts.showToast("History Removed", assets.getAssetIDByName("ic_edit_24px"));
                  }
                }));
              }
            } catch (e) {
              toasts.showToast("[ANTIED Zero] Crash on ActionSheet, check debug log for more info");
              console.error("[ANTIED Zero] Error > ActionSheet:Component Patch\n", e);
            }
          });
        });
      } catch (e) {
        toasts.showToast("[ANTIED Zero] Crash on ActionSheet, check debug log for more info");
        console.error("[ANTIED Zero] Error > ActionSheet Patch\n", e);
      }
    }
  });
}const UserStore = metro.findByStoreName("UserStore");
const { ScrollView, View, Image } = components.General;
const { FormArrow, FormRow: FormRow$1, FormSection, FormDivider } = components.Forms;
const devs = [
  {
    name: "Angel",
    role: "Author & Maintainer",
    uuid: "692632336961110087"
  }
];
const qa = [
  {
    name: "Moodle",
    role: "Quality Assurance",
    uuid: "807170846497570848"
  },
  {
    name: "Rairof",
    role: "Quality Assurance",
    uuid: "923212189123346483"
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
    return /* @__PURE__ */ common.React.createElement(Image, {
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
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(ScrollView, null, /* @__PURE__ */ common.React.createElement(FormSection, {
    title: "Developers"
  }, devs.map(function(p, i) {
    const avatarUri = getUserPng(p?.uuid);
    return /* @__PURE__ */ common.React.createElement(FormRow$1, {
      key: i,
      label: p.name,
      subLabel: p.role,
      leading: avatarUri ? box(avatarUri) : null
    });
  })), /* @__PURE__ */ common.React.createElement(FormSection, {
    title: "Testers"
  }, qa.map(function(p, i) {
    const avatarUri = getUserPng(p?.uuid);
    return /* @__PURE__ */ common.React.createElement(FormRow$1, {
      key: i,
      label: p.name,
      subLabel: p.role,
      leading: avatarUri ? box(avatarUri) : null
    });
  })), /* @__PURE__ */ common.React.createElement(FormDivider, null), /* @__PURE__ */ common.React.createElement(FormSection, {
    title: "Support & Source"
  }, /* @__PURE__ */ common.React.createElement(View, {
    style: {
      margin: 50
    }
  }, links.map(function(l, i) {
    let finalIcon = l.icon ? l.icon?.startsWith("https") ? /* @__PURE__ */ common.React.createElement(Image, {
      source: {
        uri: l.icon
      },
      style: {
        width: 120,
        height: 40
      }
    }) : /* @__PURE__ */ common.React.createElement(FormRow$1.Icon, {
      source: assets.getAssetIDByName(l.icon)
    }) : null;
    return /* @__PURE__ */ common.React.createElement(FormRow$1, {
      key: i,
      label: l.label,
      leading: finalIcon,
      trailing: /* @__PURE__ */ common.React.createElement(FormArrow, null),
      onPress: function() {
        return open(l.url);
      }
    });
  }))), /* @__PURE__ */ common.React.createElement(FormDivider, null), /* @__PURE__ */ common.React.createElement(View, {
    style: {
      height: 40
    }
  })));
}const { FormRow } = components.Forms;
function SettingPage() {
  storage.useProxy(plugin.storage);
  const navigation = common.NavigationNative.useNavigation();
  const openCreditPage = function() {
    navigation.push("VendettaCustomPage", {
      title: `Credits & Support`,
      render: function() {
        return common.React.createElement(CreditsPage);
      }
    });
  };
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow, {
    label: "CREDITS",
    subLabel: "See the people behind the plugin and ways to support its development.",
    onPress: openCreditPage,
    trailing: /* @__PURE__ */ common.React.createElement(FormRow.Icon, {
      source: assets.getAssetIDByName("ic_arrow_right")
    })
  }));
}const regexEscaper = function(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
exports.isEnabled = false;
const deletedMessageArray = /* @__PURE__ */ new Map();
let unpatch;
const patches = [
  [
    fluxDispatchPatch,
    [
      deletedMessageArray
    ]
  ],
  [
    actionsheet,
    []
  ],
  [
    selfEditPatch,
    []
  ]
];
const patcher = function() {
  return patches.forEach(function([fn, args]) {
    return fn(...args);
  });
};
unpatch = patcher();
var index = {
  onLoad: function() {
    exports.isEnabled = true;
  },
  onUnload: function() {
    exports.isEnabled = false;
    unpatch?.();
  },
  settings: SettingPage
};exports.default=index;exports.regexEscaper=regexEscaper;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({},vendetta.patcher,vendetta.metro,vendetta.ui.toasts,vendetta.metro.common,vendetta.ui.assets,vendetta.utils,vendetta.storage,vendetta.plugin,vendetta.ui.components);