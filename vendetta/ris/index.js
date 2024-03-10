(function(exports,common,components,metro,patcher,assets,plugin,storage){'use strict';metro.findByProps("openLazy", "hideActionSheet");
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
}const { ScrollView: ScrollView$1, View: View$1, Text: Text$1, TouchableOpacity: TouchableOpacity$1, TextInput: TextInput$1, Image: Image$1, Animated: Animated$1 } = components.General;
const { FormLabel: FormLabel$2, FormIcon: FormIcon$2, FormArrow: FormArrow$2, FormRow: FormRow$3, FormSwitch: FormSwitch$2, FormSwitchRow: FormSwitchRow$2, FormSection: FormSection$2, FormDivider: FormDivider$2, FormInput: FormInput$2, FormRadioRow } = components.Forms;
function SettingPage() {
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(ScrollView$1, {
    style: {
      flex: 1
    },
    contentContainerStyle: {
      paddingBottom: 38
    }
  }, /* @__PURE__ */ React.createElement(FormSection$2, {
    title: "Services"
  }, /* @__PURE__ */ React.createElement(common.ReactNative.FlatList, {
    data: Object.entries(plugin.storage.services),
    ItemSeparatorComponent: FormDivider$2,
    renderItem: function(param) {
      let { item: [id, item] } = param;
      return /* @__PURE__ */ React.createElement(FormRadioRow, {
        label: item.name,
        selected: item.enabled,
        onPress: function() {
          return item.enabled = !item.enabled;
        }
      });
    }
  })));
}async function getData(url) {
  if (url) {
    const finalLink = `https://api-next.fuzzysearch.net/v1/url?url=${encodeURIComponent(url)}`;
    const response = await fetch(finalLink, {
      method: "GET",
      headers: {
        "x-api-key": "eluIOaOhIP1RXlgYetkcZCF8la7p3NoCPy8U0i8dKiT4xdIH",
        "Accept": "application/json"
      }
    });
    let data = await response.json();
    if (data == "unavailable") {
      data = null;
    }
    return data;
  }
}const { FormLabel: FormLabel$1, FormIcon: FormIcon$1, FormArrow: FormArrow$1, FormRow: FormRow$2, FormSwitch: FormSwitch$1, FormSwitchRow: FormSwitchRow$1, FormSection: FormSection$1, FormDivider: FormDivider$1, FormInput: FormInput$1 } = components.Forms;
const { openURL: openURL$1 } = metro.findByProps("openURL", "openDeeplink");
const styles$1 = common.stylesheet.createThemedStyleSheet({
  bg: {
    borderRadius: 10,
    padding: 10,
    margin: 6,
    backgroundColor: "rgba(87, 187, 131, 0.25)"
  }
});
function FuzzySearchRow(param) {
  let { data } = param;
  var _data_artists;
  const sites = {
    "furaffinity": "https://www.furaffinity.net/view/",
    "e621": "https://e621.net/posts/",
    "weasyl": "https://www.weasyl.com/view/"
  };
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$2, {
    label: data === null || data === void 0 ? void 0 : data.site,
    subLabel: `Uploaded/Created by ${data === null || data === void 0 ? void 0 : (_data_artists = data.artists) === null || _data_artists === void 0 ? void 0 : _data_artists[0]}`,
    trailing: /* @__PURE__ */ common.React.createElement(FormArrow$1, null),
    style: [
      styles$1.bg
    ],
    onPress: function() {
      var _data_site_toLowerCase, _data_site;
      if ((data === null || data === void 0 ? void 0 : (_data_site = data.site) === null || _data_site === void 0 ? void 0 : (_data_site_toLowerCase = _data_site.toLowerCase) === null || _data_site_toLowerCase === void 0 ? void 0 : _data_site_toLowerCase.call(_data_site)) == "twitter") {
        var _data_artists2;
        openURL$1(`https://twitter.com/${(_data_artists2 = data.artists) === null || _data_artists2 === void 0 ? void 0 : _data_artists2[0]}/status/${data === null || data === void 0 ? void 0 : data.site_id_str}`);
      } else {
        var _data_site_toLowerCase1, _data_site1;
        openURL$1(`${sites[data === null || data === void 0 ? void 0 : (_data_site1 = data.site) === null || _data_site1 === void 0 ? void 0 : (_data_site_toLowerCase1 = _data_site1.toLowerCase) === null || _data_site_toLowerCase1 === void 0 ? void 0 : _data_site_toLowerCase1.call(_data_site1)]}${(data === null || data === void 0 ? void 0 : data.site_id) || (data === null || data === void 0 ? void 0 : data.site_id_str)}`);
      }
    }
  }));
}const { ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated } = components.General;
const { FormLabel, FormIcon, FormArrow, FormRow: FormRow$1, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput } = components.Forms;
const styles = common.stylesheet.createThemedStyleSheet({
  baseBg: {
    margin: 20,
    padding: 25,
    backgroundColor: "rgba(55, 149, 225, 0.3)"
  },
  bg: {
    borderRadius: 10,
    backgroundColor: "rgba(117, 227, 151, 0.35)"
  },
  border: {
    borderRadius: 10
  }
});
function FuzzySearchPage(param) {
  let { url } = param;
  storage.useProxy(plugin.storage);
  const [data, setData] = common.React.useState([]);
  if (Array.isArray(data) && (data === null || data === void 0 ? void 0 : data.length) < 1) {
    const urx = new URL(url);
    getData(`${urx.origin}${urx.pathname}`).then(function(datax) {
      return setData(datax);
    });
  }
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(ScrollView, null, /* @__PURE__ */ common.React.createElement(View, {
    style: [
      styles.baseBg,
      styles.border
    ]
  }, Array.isArray(data) && data.length < 1 && /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$1, {
    label: "Loading..."
  })), Array.isArray(data) ? data === null || data === void 0 ? void 0 : data.map(function(res, inx) {
    return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FuzzySearchRow, {
      data: res
    }), inx == data.length - 1 ? void 0 : /* @__PURE__ */ common.React.createElement(FormDivider, null));
  }) : /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$1, {
    label: "Sorry, Couldn't find any results!"
  })))));
}var _findByProps, _findByProps1, _findByProps2;
const { openURL } = metro.findByProps("openURL", "openDeeplink");
const { FormRow } = components.Forms;
const Icon = metro.findByName("Icon") ?? metro.findByProps("Sizes", "compare");
const ActionSheet = metro.findByProps("openLazy", "hideActionSheet");
const SearchIcon = /* @__PURE__ */ common.React.createElement(Icon, {
  source: assets.getAssetIDByName("search")
});
const Navigation = metro.findByProps("push", "pushLazy", "pop");
const modalCloseButton = ((_findByProps = metro.findByProps("getRenderCloseButton")) === null || _findByProps === void 0 ? void 0 : _findByProps.getRenderCloseButton) ?? ((_findByProps1 = metro.findByProps("getHeaderCloseButton")) === null || _findByProps1 === void 0 ? void 0 : _findByProps1.getHeaderCloseButton);
const Navigator = metro.findByName("Navigator") ?? ((_findByProps2 = metro.findByProps("Navigator")) === null || _findByProps2 === void 0 ? void 0 : _findByProps2.Navigator);
const listOfServices = {
  saucenao: {
    name: "SauceNAO",
    url: `https://saucenao.com/search.php?url=%s`,
    enabled: true
  },
  tracemoe: {
    name: "trace.moe (Anime)",
    url: `https://trace.moe/?url=%s`,
    enabled: true
  },
  iqdb: {
    name: "IQDB",
    url: `https://iqdb.org/?url=%s`,
    enabled: false
  },
  imgops: {
    name: "ImgOps",
    url: `https://imgops.com/%s`,
    enabled: false
  },
  tineye: {
    name: "TinEye",
    url: `https://tineye.com/search?url=%s`,
    enabled: false
  },
  google: {
    name: "Google Images",
    url: `https://www.google.com/searchbyimage?image_url=%s&safe=off&sbisrc=cr_1_5_2`,
    enabled: false
  },
  yandex: {
    name: "Yandex Images",
    url: `https://yandex.com/images/search?rpt=imageview&url=%s`,
    enabled: false
  },
  fuzzysearch: {
    name: "FuzzySearch (FurAffinity, Twitter)",
    enabled: false,
    titlePage: "Fuzzysearch.net"
  }
};
makeDefaults(plugin.storage, {
  services: listOfServices
});
const patches = [];
var index = {
  onLoad: function() {
    patches.push(patcher.before("openLazy", ActionSheet, function(param) {
      let [component, key] = param;
      if (key !== "MediaShareActionSheet")
        return;
      component.then(function(instance) {
        const unpatch = patcher.after("default", instance, function(param2, res) {
          let [{ syncer }] = param2;
          common.React.useEffect(function() {
            return unpatch();
          }, []);
          let urlsource = syncer.sources[syncer.index.value];
          if (Array.isArray(urlsource))
            urlsource = urlsource[0];
          const targetURL = urlsource.sourceURI ?? urlsource.uri;
          const buttonRows = res.props.children.props.children;
          if (buttonRows) {
            const filtered = Object.keys(listOfServices).filter(function(id) {
              return plugin.storage.services[id].enabled;
            });
            buttonRows.push(filtered.map(function(id) {
              const onPress = function() {
                if (listOfServices[id].url) {
                  const parsedCode = new URL(targetURL);
                  openURL(listOfServices[id].url.replace("%s", `${parsedCode.origin}${parsedCode.pathname}`));
                } else {
                  const navigator = function() {
                    return /* @__PURE__ */ common.React.createElement(Navigator, {
                      initialRouteName: "ServicePage",
                      goBackOnBackPress: true,
                      screens: {
                        ServicePage: {
                          title: listOfServices[id].titlePage,
                          headerLeft: modalCloseButton === null || modalCloseButton === void 0 ? void 0 : modalCloseButton(function() {
                            return Navigation.pop();
                          }),
                          render: function() {
                            return /* @__PURE__ */ common.React.createElement(FuzzySearchPage, {
                              url: targetURL
                            });
                          }
                        }
                      }
                    });
                  };
                  ActionSheet.hideActionSheet();
                  Navigation.push(navigator);
                }
              };
              return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow, {
                leading: SearchIcon,
                label: listOfServices[id].name,
                onPress
              }));
            }));
          }
        });
      });
    }));
  },
  onUnload: function() {
    patches.forEach(function(un) {
      return un();
    });
  },
  settings: SettingPage
};exports.default=index;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({},vendetta.metro.common,vendetta.ui.components,vendetta.metro,vendetta.patcher,vendetta.ui.assets,vendetta.plugin,vendetta.storage);