(function(v,I,s,E,a,e,y,b,O,g,T,w,V){"use strict";s.findByProps("openLazy","hideActionSheet");function L(r,t){if(r!=null&&t!=null)for(const n of Object.keys(t))typeof t[n]=="object"&&!Array.isArray(t[n])?(typeof r[n]!="object"&&(r[n]={}),L(r[n],t[n])):r[n]??(r[n]=t[n])}function j(r,t,n,o){return{id:r,title:t,type:n,placeholder:o}}const F={...E.General,...E.Forms};function $(r){var t;if(((t=Object.keys(a.storage.users))===null||t===void 0?void 0:t.length)>0){const n=a.storage===null||a.storage===void 0?void 0:a.storage.users[r];if(n&&n?.avatar)return new URL(n?.avatar).toString()}}const G=function(r){return new URL(r).pathname.split(".").slice(-1)[0]};Array.from(crypto.getRandomValues(new Uint8Array(20))).map(function(r){return r.toString(16).padStart(2,"0")}).join("");var U;const{ScrollView:z,View:Fe,Text:Ue,TouchableOpacity:M,TextInput:pe,Image:H,Animated:X,FormLabel:Pe,FormIcon:Te,FormArrow:Le,FormRow:W,FormSwitch:$e,FormSwitchRow:Be,FormSection:Y,FormDivider:p,FormInput:P,FormRadioRow:Ne}=F,Z=s.findByStoreName("GuildStore"),{GuildIconSizes:q}=s.findByProps("GuildIconSizes"),{ActionSheetTitleHeader:J,ActionSheetCloseButton:K}=s.findByProps("ActionSheetTitleHeader"),B=s.findByProps("hideActionSheet"),Q=((U=s.findByProps("ActionSheet"))===null||U===void 0?void 0:U.ActionSheet)??find(function(r){var t;return((t=r.render)===null||t===void 0?void 0:t.name)==="ActionSheet"}),{BottomSheetFlatList:ee}=s.findByProps("BottomSheetScrollView"),te=s.findByProps("showUserProfile"),N=[j("avatar","Override target Avatar","default","https://totally.work/image.jpg")];function re(r){let{data:t}=r;var n;b.useProxy(a.storage);const[o,i]=e.React.useState([]),[d,f]=e.React.useState([]),{username:h,avatar:l}=t;if(!o?.length){const c=Z.getGuilds();i(Object.values(c))}!d.length&&(t==null||(n=t.serverAvatars)===null||n===void 0?void 0:n.length)>0&&f(t.serverAvatars);function S(c){let{serverData:u}=c;return e.React.createElement(e.React.Fragment,null,e.React.createElement(W,{label:u.name||"No Srver Name",subLabel:u.id||null,disabled:d.some(function(R){return R.serverId==u.id}),leading:e.React.createElement(q.default,{guild:u,size:"LARGE",animated:!0}),onPress:function(){B.hideActionSheet(),O.showInputAlert({title:"Enter image link",placeholder:"can be a discord attachment CDN link",confirmText:"Confirm",confirmColor:"brand",cancelText:"Cancel",onConfirm:async function(R){var A;const x=R==null||(A=R.match(I.constants.HTTP_REGEX_MULTI))===null||A===void 0?void 0:A[0];if(!x)return g.showToast("Invalid URL",y.getAssetIDByName("Small"));g.showToast("Setting up image...",y.getAssetIDByName("ic_clock"));try{t.serverAvatars.push({serverId:u?.id,serverName:u?.name,serverPfp:x}),f(t.serverAvatars),g.showToast(`Server custom avatar Added for ${u?.name}`,y.getAssetIDByName("Check"))}catch(we){console.error("[Fake Avatars] ImageActionSheet->serverAvatars addition error!"),I.logger.error(`ImageActionSheet->serverAvatars addition error!
${we.stack}`),g.showToast("Failed to add server customAvatar",y.getAssetIDByName("Small"))}}})}}))}return e.React.createElement(e.React.Fragment,null,e.React.createElement(Q,{scrollable:!0},e.React.createElement(E.ErrorBoundary,null,e.React.createElement(J,{title:"Pick target Server",leading:m("ic_category_16px"),trailing:e.React.createElement(K,{onPress:function(){return B.hideActionSheet()}})}),e.React.createElement(ee,{style:{flex:1},contentContainerStyle:{paddingBottom:36},data:o,renderItem:function(c){let{item:u}=c;return e.React.createElement(S,{serverData:u})},ItemSeparatorComponent:p})))),e.React.createElement(e.React.Fragment,null,e.React.createElement(z,{style:{margin:5,paddingBottom:24}},e.React.createElement(E.ErrorBoundary,null,e.React.createElement(Y,{title:"Default Customization"},e.React.createElement(P,{title:"User ID",value:t?.userId,disabled:!0}),e.React.createElement(p,null),e.React.createElement(P,{title:"Username",value:t?.username,disabled:!0}),N?.map(function(c,u){var R;return e.React.createElement(e.React.Fragment,null,e.React.createElement(P,{title:c?.title,keyboardType:c?.type,placeholder:c==null||(R=c.placeholder)===null||R===void 0?void 0:R.toString(),value:t[c?.id],onChange:function(A){return t[c.id]=A.toString()}}),u!=N.length-1&&e.React.createElement(p,null))}),e.React.createElement(M,{onPress:function(){return te.showUserProfile({userId:t?.userId})}},e.React.createElement(X.View,{style:{alignItems:"stretch"}},e.React.createElement(H,{style:{width:128,height:128,borderRadius:10,alignSelf:"center"},source:{uri:l||"https://cdn.discordapp.com/embed/avatars/2.png"}})))))))}const ae=e.stylesheet.createThemedStyleSheet({i_like_dark:{margin:5,padding:5,borderRadius:10,backgroundColor:"rgba(0, 0, 0, 0.3)"},inputTextColor:{color:T.semanticColors.INPUT_PLACEHOLDER_TEXT},inputTextStyling:{fontSize:18,fontFamily:e.constants.Fonts.PRIMARY_MEDIUM,color:T.semanticColors.TEXT_NORMAL}}),{ScrollView:ke,View:ne,Text:Ce,TouchableOpacity:ie,TextInput:_e,Image:De,Animated:xe,FormLabel:Oe,FormIcon:Ve,FormArrow:je,FormRow:k,FormSwitch:Ge,FormSwitchRow:ze,FormSection:le,FormDivider:C,FormInput:se,FormRadioRow:Me}=F,oe=s.findByName("useIsFocused"),{getUser:ce}=s.findByProps("getUser");function de(){b.useProxy(a.storage);const[r,t]=e.React.useState(""),n=e.NavigationNative.useNavigation();oe();const o=function(d){n.push("VendettaCustomPage",{title:`${d?.username||"User"} Information`,render:function(){return e.React.createElement(re,{data:d})}})},i=function(){if(r){if(!isNaN(parseInt(r)))if(!(a.storage===null||a.storage===void 0)&&a.storage.users[r])g.showToast("User already existed on the list");else{let l=ce(r);if(l){var d,f,h;a.storage.users[`${l.id}`]={userId:l.id,username:l?.username,avatar:(l==null||(h=l.getAvatarURL)===null||h===void 0||(f=h.call(l))===null||f===void 0||(d=f.replace)===null||d===void 0?void 0:d.call(f,"webp","png"))||null,serverAvatars:[]},o(a.storage.users[l.id])}else return t(""),g.showToast("Invalid User Id")}t("")}};return e.React.createElement(e.React.Fragment,null,e.React.createElement(le,{title:"User List"},e.React.createElement(ne,{style:[ae.i_like_dark]},e.React.createElement(k,{label:e.React.createElement(se,{value:r,onChangeText:t,placeholder:"User ID",onSubmitEditing:i}),trailing:m("ic_add_24px"),onPress:i}),e.React.createElement(C,null),Object.keys(a.storage===null||a.storage===void 0?void 0:a.storage.users).length>0&&Object.entries(a.storage===null||a.storage===void 0?void 0:a.storage.users).map(function(d,f){let[h,l]=d;var S;return e.React.createElement(e.React.Fragment,null,e.React.createElement(k,{label:l?.username||"Couldn't find Username",subLabel:h,trailing:e.React.createElement(ie,{onPress:function(){g.showToast(`${l.username} is deleted.`),delete a.storage.users[h]}},m("trash")),onPress:function(){o(l)}}),f==((S=Object.keys(a.storage===null||a.storage===void 0?void 0:a.storage.users))===null||S===void 0?void 0:S.length)+1?void 0:e.React.createElement(C,null))}))))}const{ScrollView:ue,View:He,Text:Xe,TouchableOpacity:We,TextInput:Ye,Image:Ze,Animated:qe,FormLabel:Je,FormIcon:ve,FormArrow:Ke,FormRow:fe,FormSwitch:Qe,FormSwitchRow:et,FormSection:ge,FormDivider:tt,FormInput:rt,FormRadioRow:at}=F,m=function(r){return React.createElement(ve,{style:{opacity:1},source:y.getAssetIDByName(r)})};function Re(){b.useProxy(a.storage);const r=e.NavigationNative.useNavigation(),t=function(){r.push("VendettaCustomPage",{title:"Users List",render:function(){return React.createElement(de,null)}})};return React.createElement(React.Fragment,null,React.createElement(ue,null,React.createElement(E.ErrorBoundary,null,React.createElement(ge,{title:"Users List"},React.createElement(fe,{label:"Click to View Users List",subLabel:"All saved users data",leading:m("ic_members"),trailing:m("ic_arrow"),onPress:t})))))}const he=s.findByStoreName("UserStore");function ye(){return w.after("getUser",he,function(r,t){let[n]=r;if(v.isEnabled){var o;const i=a.storage===null||a.storage===void 0||(o=a.storage.users[n])===null||o===void 0?void 0:o.avatar;i&&(G(i)=="gif"?t.avatar=i.startsWith("a_")?i:`a_${i}`:t.avatar=i)}})}const Ee=s.findByProps("getUserAvatarURL","getUserAvatarSource");function me(){return w.after("getUserAvatarSource",Ee,function(r,t){let[{id:n},o]=r;if(v.isEnabled){const i=$(n);return i?i?{uri:i}:t:void 0}})}const Se=s.findByProps("getUserAvatarURL","getUserAvatarSource");function Ae(){return w.after("getUserAvatarURL",Se,function(r){let[{id:t},n]=r;if(v.isEnabled)return $(t)})}L(a.storage,{users:{}});let _=[],D;_.push(ye,me,Ae);const Ie=function(){return _.forEach(function(r){return r()})};v.isEnabled=!1;var be={onLoad:async function(){v.isEnabled=!0;try{D=await Ie()}catch(r){console.error("[Fake Avatars] Error when Loading"),I.logger.error(`${r.stack}`),g.showToast("Error When Loading",y.getAssetIDByName("Small")),V.stopPlugin(a.id)}},onunload:function(){v.isEnabled=!1,D?.()},settings:Re};return v.default=be,Object.defineProperty(v,"__esModule",{value:!0}),v})({},vendetta,vendetta.metro,vendetta.ui.components,vendetta.plugin,vendetta.metro.common,vendetta.ui.assets,vendetta.storage,vendetta.ui.alerts,vendetta.ui.toasts,vendetta.ui,vendetta.patcher,vendetta.plugins);
