(function(exports,plugin,_vendetta,metro,components,plugins,toasts,patcher$1,common,storage){'use strict';const { openLazy, hideActionSheet } = metro.findByProps("openLazy", "hideActionSheet");
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
}function ViewComponent() {
  return patcher$1.before("render", components.General.View, function(args) {
    if (!exports.isEnabled)
      return;
    const [wrapper] = args;
    if (!wrapper || !Array.isArray(wrapper.style))
      return;
    const statusColours = plugin.storage.colors || {
      online: "#3BA55C",
      idle: "#FAA81A",
      dnd: "#ED4245"
    };
    const circleIdx = wrapper.style.findIndex(function(s) {
      return s && s.width === 32 && s.height === 32 && s.borderRadius === 16;
    });
    wrapper.style.findIndex(function(s) {
      return s && s.width === 92 && s.height === 92 && s.borderRadius === 92 && s.padding === 6 && s.zIndex === 0;
    });
    if (circleIdx !== -1) {
      const userProps = wrapper.children?.[1]?.props;
      const presenceProps = wrapper.children?.[3]?.props;
      if (!userProps?.hasOwnProperty("user") || typeof userProps.user?.id !== "string")
        return;
      if (!presenceProps?.hasOwnProperty("status") || typeof presenceProps.status !== "string")
        return;
      const userPresence = presenceProps.status;
      const colour = statusColours[userPresence] ?? null;
      if (colour) {
        presenceProps.size = 0;
        presenceProps.isMobileOnline = false;
        presenceProps.style.display = "none";
        userProps.cutout.nativeCutouts[0].size = 0;
        const mult = plugin.storage.mult || 1.2;
        const size = plugin.storage.size || 30;
        wrapper.style[0] = {
          width: size * mult,
          height: size * mult,
          borderRadius: 16 * mult,
          overflow: "hidden"
        };
        wrapper.style.push({
          borderWidth: 2.5 * mult,
          borderColor: colour,
          borderStyle: "solid"
        });
      }
    }
  });
}const { ScrollView, View, Text, TextInput, Animated, Easing, Pressable } = common.ReactNative;
const { useState, useEffect, useRef } = common.React;
const { FormSection, FormDivider, FormRow } = components.Forms;
const { openAlert } = metro.findByProps("openAlert", "dismissAlert");
const { AlertModal, AlertActions, AlertActionButton } = metro.findByProps("AlertModal", "AlertActions", "AlertActionButton");
function setting() {
  storage.useProxy(plugin.storage);
  const [colors, setColors] = useState(plugin.storage.colors || {
    online: "#3BA55C",
    idle: "#FAA81A",
    dnd: "#ED4245"
  });
  const [mult, setMult] = useState(plugin.storage.mult || 1.2);
  const [size, setSize] = useState(plugin.storage.size || 30);
  const hue = useRef(new Animated.Value(0)).current;
  useEffect(function() {
    Animated.loop(Animated.timing(hue, {
      toValue: 1,
      duration: 1e3,
      easing: Easing.linear,
      useNativeDriver: false
    })).start();
  }, []);
  const headerColor = hue.interpolate({
    inputRange: [
      0,
      1
    ],
    outputRange: [
      "#ff0000",
      "#ff0000"
    ]
  });
  const updateColor = function(key, val) {
    const next = {
      ...colors,
      [key]: val
    };
    setColors(next);
    plugin.storage.colors = next;
  };
  const Ring = function({ status, color }) {
    return /* @__PURE__ */ common.React.createElement(View, {
      style: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#1E1E1E",
        margin: 8,
        justifyContent: "center",
        alignItems: "center"
      }
    }, /* @__PURE__ */ common.React.createElement(View, {
      style: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 4,
        borderColor: color
      }
    }), /* @__PURE__ */ common.React.createElement(Text, {
      style: {
        color: "#fff",
        fontSize: 10,
        marginTop: 4
      }
    }, status));
  };
  const thing = "I'm toooooo lazy to finish this plugin, so deal with it.";
  const keyDict = {
    "online": "Online",
    "idle": "Idle",
    "dnd": "Do Not Disturb"
  };
  return /* @__PURE__ */ common.React.createElement(ScrollView, {
    style: {
      backgroundColor: "#111"
    }
  }, /* @__PURE__ */ common.React.createElement(Animated.View, {
    style: {
      paddingVertical: 40,
      alignItems: "center",
      backgroundColor: headerColor
    }
  }, /* @__PURE__ */ common.React.createElement(Text, {
    style: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#fff"
    }
  }, "Presence Ring"), /* @__PURE__ */ common.React.createElement(Text, {
    style: {
      fontSize: 14,
      color: "#eee",
      marginTop: 4
    }
  }, "Customise indicator colors")), /* @__PURE__ */ common.React.createElement(FormSection, {
    title: "Live preview"
  }, /* @__PURE__ */ common.React.createElement(View, {
    style: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      paddingVertical: 16
    }
  }, /* @__PURE__ */ common.React.createElement(Ring, {
    status: "Online",
    color: colors.online
  }), /* @__PURE__ */ common.React.createElement(Ring, {
    status: "Idle",
    color: colors.idle
  }), /* @__PURE__ */ common.React.createElement(Ring, {
    status: "DND",
    color: colors.dnd
  }))), /* @__PURE__ */ common.React.createElement(FormSection, {
    title: "Colour palette"
  }, /* @__PURE__ */ common.React.createElement(View, {
    style: {
      marginHorizontal: 16,
      marginVertical: 8
    }
  }, Object.entries(colors).map(function([key, value]) {
    return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(Text, {
      style: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 4
      }
    }, keyDict[key]), /* @__PURE__ */ common.React.createElement(View, {
      style: {
        flexDirection: "row",
        alignItems: "center"
      }
    }, /* @__PURE__ */ common.React.createElement(TextInput, {
      style: {
        flex: 1,
        backgroundColor: "#222",
        color: "#fff",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontFamily: "monospace",
        fontSize: 14,
        borderWidth: 2,
        borderColor: value
      },
      value,
      onChangeText: function(v) {
        return updateColor(key, v);
      },
      placeholder: "#RRGGBB"
    }), /* @__PURE__ */ common.React.createElement(View, {
      style: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: value,
        marginLeft: 12,
        borderWidth: 3,
        borderColor: "#444"
      }
    })));
  }))), /* @__PURE__ */ common.React.createElement(FormSection, {
    title: "Wild extras"
  }, /* @__PURE__ */ common.React.createElement(View, {
    style: {
      margin: 16,
      padding: 20,
      backgroundColor: "#252525",
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "#5865F2"
    }
  }, /* @__PURE__ */ common.React.createElement(FormRow, {
    label: "Click to Randomize the color palette",
    style: {
      color: "#aaa",
      fontSize: 12,
      textAlign: "center",
      marginTop: 8
    },
    onPress: function() {
      openAlert("rainbomizer", /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(AlertModal, {
        title: "Note",
        content: /* @__PURE__ */ common.React.createElement(Text, {
          variant: "text-md/semibold",
          color: "TEXT_NORMAL"
        }, thing),
        actions: /* @__PURE__ */ common.React.createElement(AlertActions, null, /* @__PURE__ */ common.React.createElement(AlertActionButton, {
          text: "OK",
          variant: "primary"
        }))
      })));
    }
  }))), /* @__PURE__ */ common.React.createElement(View, {
    style: {
      paddingBottom: "50vh"
    }
  }));
}makeDefaults(plugin.storage, {
  colors: {
    online: "#3BA55C",
    idle: "#FAA81A",
    dnd: "#ED4245"
  },
  mult: 1.3,
  size: 28
});
exports.isEnabled = false;
const pluginNameToast = "[Radial Status]";
const getExt = function(url) {
  return new URL(url).pathname.split(".").pop();
};
let unpatch = null;
const patches = [
  [
    ViewComponent,
    []
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
      _vendetta.logger.info(`${pluginNameToast} Crash On Load.

`, err);
      toasts.showToast(`${pluginNameToast} Crashing On Load. Please check debug log for more info.`);
      plugins.stopPlugin(plugin.id);
    }
  },
  onUnload: function() {
    exports.isEnabled = false;
    unpatch?.();
  },
  settings: setting
};exports.default=index;exports.getExt=getExt;exports.pluginNameToast=pluginNameToast;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({},vendetta.plugin,vendetta,vendetta.metro,vendetta.ui.components,vendetta.plugins,vendetta.ui.toasts,vendetta.patcher,vendetta.metro.common,vendetta.storage);