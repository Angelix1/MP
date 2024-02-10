(function(exports,_vendetta,metro,common,components,assets,plugin,storage,toasts,patcher){'use strict';metro.findByProps("openLazy", "hideActionSheet");
function makeDefaults(object, defaults) {
  if (object != void 0) {
    if (defaults != void 0) {
      for (const key of Object.keys(defaults)) {
        if (typeof defaults[key] === "object" && !Array.isArray(defaults[key])) {
          if (typeof object[key] !== "object")
            object[key] = {};
          makeDefaults(object[key], defaults[key]);
        } else {
          object[key] ??= defaults[key];
        }
      }
    }
  }
}const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image } = components.General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormSliderRow } = components.Forms;
function createInput(id, title, type, placeholder) {
  return {
    id,
    title,
    type,
    placeholder
  };
}
const textInputs = [
  createInput("imageURL", "URL for the avatars (Leave Empty to Disable)", "default", "https://cdn.discordapp.com/attachments/919655852724604978/1197224092554772622/9k.png"),
  createInput("username", "The usernames (Leave Empty to Disable)", "default", "Wario"),
  createInput("tagText", "The Tag text (Leave Empty to Disable)", "default", "WARIO")
];
function settingPage() {
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(ScrollView, null, /* @__PURE__ */ React.createElement(FormSection, {
    title: "Plugin Setting"
  }, textInputs === null || textInputs === void 0 ? void 0 : textInputs.map(function(obj, index) {
    var _obj_placeholder;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormInput, {
      title: obj === null || obj === void 0 ? void 0 : obj.title,
      keyboardType: obj === null || obj === void 0 ? void 0 : obj.type,
      placeholder: obj === null || obj === void 0 ? void 0 : (_obj_placeholder = obj.placeholder) === null || _obj_placeholder === void 0 ? void 0 : _obj_placeholder.toString(),
      value: (plugin.storage === null || plugin.storage === void 0 ? void 0 : plugin.storage[obj.id]) ?? (obj === null || obj === void 0 ? void 0 : obj.placeholder),
      onChange: function(val) {
        return plugin.storage[obj.id] = val.toString();
      }
    }), index !== textInputs.length - 1 && /* @__PURE__ */ React.createElement(FormDivider, null));
  })));
}const { DCDChatManager } = common.ReactNative.NativeModules;
function chatThing() {
  return patcher.before("updateRows", DCDChatManager, function(args) {
    let rows = JSON.parse(args[1]);
    for (const row of rows) {
      let handleUpdate = function(m) {
        var _storage_imageURL, _storage_imageURL1, _storage_username, _storage_tagText, _m_referencedMessage;
        if ((plugin.storage === null || plugin.storage === void 0 ? void 0 : plugin.storage.imageURL) && (plugin.storage === null || plugin.storage === void 0 ? void 0 : (_storage_imageURL = plugin.storage.imageURL) === null || _storage_imageURL === void 0 ? void 0 : _storage_imageURL.length) > 0 && (plugin.storage === null || plugin.storage === void 0 ? void 0 : plugin.storage.imageURL) != "" && (plugin.storage === null || plugin.storage === void 0 ? void 0 : (_storage_imageURL1 = plugin.storage.imageURL) === null || _storage_imageURL1 === void 0 ? void 0 : _storage_imageURL1.startsWith("http"))) {
          let sanitizedLinkies = plugin.storage === null || plugin.storage === void 0 ? void 0 : plugin.storage.imageURL;
          const urlObj = new URL(sanitizedLinkies);
          if (urlObj === null || urlObj === void 0 ? void 0 : urlObj.search) {
            sanitizedLinkies = sanitizedLinkies === null || sanitizedLinkies === void 0 ? void 0 : sanitizedLinkies.replace(urlObj.search, "");
          }
          m.avatarURL = sanitizedLinkies;
        }
        if ((plugin.storage === null || plugin.storage === void 0 ? void 0 : plugin.storage.username) && (plugin.storage === null || plugin.storage === void 0 ? void 0 : (_storage_username = plugin.storage.username) === null || _storage_username === void 0 ? void 0 : _storage_username.length) > 0 && (plugin.storage === null || plugin.storage === void 0 ? void 0 : plugin.storage.username) != "") {
          var _storage_username_toString, _storage_username1;
          m.username = plugin.storage === null || plugin.storage === void 0 ? void 0 : (_storage_username1 = plugin.storage.username) === null || _storage_username1 === void 0 ? void 0 : (_storage_username_toString = _storage_username1.toString) === null || _storage_username_toString === void 0 ? void 0 : _storage_username_toString.call(_storage_username1);
        }
        if ((plugin.storage === null || plugin.storage === void 0 ? void 0 : plugin.storage.tagText) && (plugin.storage === null || plugin.storage === void 0 ? void 0 : (_storage_tagText = plugin.storage.tagText) === null || _storage_tagText === void 0 ? void 0 : _storage_tagText.length) > 0 && (plugin.storage === null || plugin.storage === void 0 ? void 0 : plugin.storage.tagText) != "") {
          var _storage_tagText_toString, _storage_tagText1;
          m.tagText = plugin.storage === null || plugin.storage === void 0 ? void 0 : (_storage_tagText1 = plugin.storage.tagText) === null || _storage_tagText1 === void 0 ? void 0 : (_storage_tagText_toString = _storage_tagText1.toString) === null || _storage_tagText_toString === void 0 ? void 0 : _storage_tagText_toString.call(_storage_tagText1);
        }
        if (m === null || m === void 0 ? void 0 : (_m_referencedMessage = m.referencedMessage) === null || _m_referencedMessage === void 0 ? void 0 : _m_referencedMessage.message) {
          handleUpdate(m.referencedMessage.message);
        }
      };
      const { message } = row;
      if (!message)
        continue;
      handleUpdate(message);
    }
    args[1] = JSON.stringify(rows);
  });
}makeDefaults(plugin.storage, {
  imageURL: "https://cdn.discordapp.com/attachments/919655852724604978/1197224092554772622/9k.png",
  username: "Wario",
  tagText: "WARIO"
});
const patches = [];
var index = {
  onLoad: function() {
    patches.push(chatThing());
  },
  onUnload: function() {
    patches.forEach(function(un) {
      return un();
    });
  },
  settings: settingPage
};exports.default=index;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({},vendetta,vendetta.metro,vendetta.metro.common,vendetta.ui.components,vendetta.ui.assets,vendetta.plugin,vendetta.storage,vendetta.ui.toasts,vendetta.patcher);