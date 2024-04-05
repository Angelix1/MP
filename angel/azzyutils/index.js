(function(f,r,w,B,p,N,l,y,k,S,A){"use strict";const{openLazy:H,hideActionSheet:He}=p.findByProps("openLazy","hideActionSheet");function D(e,t){if(e!=null&&t!=null)for(const n of Object.keys(t))typeof t[n]=="object"&&!Array.isArray(t[n])?(typeof e[n]!="object"&&(e[n]={}),D(e[n],t[n])):e[n]??(e[n]=t[n])}function Q(e,t){try{H(new Promise(function(n){return n({default:e})}),"ActionSheet",t)}catch(n){B.logger.error(n.stack),showToast("Got error when opening ActionSheet! Please check debug logs")}}function j(e){const t=e>>16&255,n=e>>8&255,o=e&255;return`#${(1<<24|t<<16|n<<8|o).toString(16).slice(1)}`}const R={...N.General,...N.Forms},q="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mJsrQAAAgwBAJ9P6qYAAAAASUVORK5CYII=";function T(e){switch(arguments.length>1&&arguments[1]!==void 0?arguments[1]:r.storage.selected){case"calendar":return e.calendar();case"relative":return e.fromNow();case"iso":return e.toISOString();case"custom":return e.format(r.storage.customFormat)}}const U={beforePatch(e,t){e.rowType===1?(r.storage.separateMessages&&(e.isFirst=!0),e.message.__customTimestamp=T(e.message.timestamp)):e.rowType==="day"&&(e.text=T(t(e.text,"LL")))},afterPatch(e){var t,n,o;if(e.rowType===1&&!(e==null||(t=e.message)===null||t===void 0)&&t.__customTimestamp&&(e==null||(n=e.message)===null||n===void 0?void 0:n.state)==="SENT"&&!(e==null||(o=e.message)===null||o===void 0)&&o.timestamp){var a;e.message.message.timestamp=e==null||(a=e.message)===null||a===void 0?void 0:a.__customTimestamp}}},{FormRow:K}=R,W=p.findByName("RowCheckmark");function X(e){let{label:t,subLabel:n,selected:o,onPress:a}=e;return React.createElement(K,{label:t,subLabel:n,trailing:React.createElement(W,{selected:o}),onPress:a})}const{ClearButtonVisibility:ee,default:te}=p.findByProps("ClearButtonVisibility");function ne(e){let{value:t,onChangeText:n,placeholder:o,disabled:a}=e;return React.createElement(te,{value:t,onChangeText:n,placeholder:o,clearButtonVisibility:ee.WITH_CONTENT,showBorder:!1,showTopContainer:!1,disabled:a,style:{paddingHorizontal:15,paddingVertical:13}})}const{FormDivider:oe,FormSwitchRow:ae,FormRow:re}=R;let x=[{label:"Calendar",key:"calendar"},{label:"Relative",key:"relative"},{label:"ISO 8601",key:"iso"},{label:"Custom",key:"custom",renderExtra:function(e){return React.createElement(ne,{value:r.storage.utils.customTimestamp.customFormat,onChangeText:function(t){return r.storage.utils.customTimestamp.customFormat=t},placeholder:"dddd, MMMM Do YYYY, h:mm:ss a",disabled:!e})}}];function le(){w.useProxy(r.storage);const e=r.storage.utils.customTimestamp;return e.selected??(e.selected="calendar"),e.customFormat??(e.customFormat="dddd, MMMM Do YYYY, h:mm:ss a"),e.separateMessages??(e.separateMessages=!1),React.createElement(React.Fragment,null,React.createElement(re,{label:"Mode"}),x.map(function(t,n){let{label:o,key:a,renderExtra:i}=t;return React.createElement(React.Fragment,null,React.createElement(X,{label:o,subLabel:T(l.moment(),a),selected:e.selected===a,onPress:function(){return e.selected=a}}),i&&i(e.selected===a),n!==x.length-1&&React.createElement(oe,null))}),React.createElement(ae,{label:"Separate messages",subLabel:"Always shows username, avatar and timestamp for each message",value:e.separateMessages,onValueChange:function(t){e.separateMessages=t}}))}const{ScrollView:Qe,View:je,Text:qe,TouchableOpacity:se,TextInput:Ke,Image:ie,Animated:We,FormLabel:Xe,FormIcon:et,FormArrow:tt,FormRow:Y,FormSwitch:ce,FormSwitchRow:nt,FormSection:ot,FormDivider:ue,FormInput:at,FormRadioRow:rt}=R,de=p.findByName("CustomColorPickerActionSheet");function ge(){w.useProxy(r.storage);const e=r.storage.utils.replyAlert,t=function(){return Q(de,{color:l.ReactNative.processColor(e?.customColor)||0,onSelect:function(n){const o=j(n);e.customColor=o,!(r.storage===null||r.storage===void 0)&&r.storage.debug&&B.logger.log("Reply Alert Color","[Changed]",o)}})};return React.createElement(React.Fragment,null,React.createElement(Y,{label:"Use Custom Color Mentions",trailing:React.createElement(ce,{value:e?.useCustomColor||!1,onValueChange:function(n){e.useCustomColor=n}})}),React.createElement(ue,null),React.createElement(Y,{label:"Color",subLabel:"Click to Update",onPress:t,trailing:React.createElement(se,{onPress:t},React.createElement(ie,{source:{uri:q},style:{width:128,height:128,borderRadius:10,backgroundColor:e?.customColor||"#000"}}))}))}const{FormRow:me,FormSwitch:fe}=R;function ve(){var e,t;return React.createElement(React.Fragment,null,React.createElement(me,{label:"Bypass Antied Logging",trailing:React.createElement(fe,{value:(r.storage===null||r.storage===void 0||(t=r.storage.utils)===null||t===void 0||(e=t.eml)===null||e===void 0?void 0:e.logEdit)||!1,onValueChange:function(n){r.storage.utils.eml.logEdit=n}})}))}const{ScrollView:he,View:V,Text:lt,TouchableOpacity:st,TextInput:it,Image:ct,Animated:ut,FormLabel:dt,FormIcon:gt,FormArrow:mt,FormRow:pe,FormSwitch:ye,FormSwitchRow:ft,FormSection:be,FormDivider:vt,FormInput:ht,FormRadioRow:pt,Component:yt}=R;function Re(){w.useProxy(r.storage);const e=function(n,o,a,i,b){return{id:n,title:o,label:a,subLabel:i,props:b}},t=[e("ctime","Custom Timestamp","open Custom TimeStamp Settings",null,le),e("ralert","Reply Alert","open Reply Alert Settings",null,ge),e("notype","No Type","Toggle No Typings",null,null),e("quickid","QID","Toggle Quick ID",null,null),e("noshare","No Share","Toggle No Share",null,null),e("eml","EML","Toggle Edit Message Locally",null,ve)];return React.createElement(React.Fragment,null,React.createElement(he,null,React.createElement(V,{style:{paddingBottom:36}},t.map(function(n,o){return React.createElement(React.Fragment,null,React.createElement(be,{title:n?.title},React.createElement(pe,{label:n?.label,subLabel:n?.subLabel,trailing:React.createElement(ye,{value:r.storage.toggle[n?.id],onValueChange:function(a){r.storage.toggle[n?.id]=a}})}),r.storage.toggle[n.id]&&n.props&&React.createElement(V,{style:{margin:5,padding:10,borderRadius:10,backgroundColor:"rgba(0, 0, 0, 0.15)"}},React.createElement(n.props,null))))}))))}var F,I;const $=p.findByStoreName("UserStore"),_=$==null||(I=$.getCurrentUser)===null||I===void 0||(F=I.call($))===null||F===void 0?void 0:F.id;function Ee(e){if(e.type=="MESSAGE_CREATE"){var t,n,o,a,i;(((o=e.message)===null||o===void 0||(n=o.referenced_message)===null||n===void 0||(t=n.author)===null||t===void 0?void 0:t.id)==_||!((i=e.message)===null||i===void 0||(a=i.mentions)===null||a===void 0)&&a.some(function(b){return b?.id===_}))&&e.message.mentions.push({id:_})}}function Ae(){return y.before("dispatch",l.FluxDispatcher,function(e){let[t]=e;f.isEnabled&&Ee(t)})}const{DCDChatManager:O}=l.ReactNative.NativeModules,Me=function(){return y.before("updateRows",O,function(e){if(f.isEnabled){let t=JSON.parse(e[1]);return t.forEach(function(n){U.beforePatch(n,l.moment)}),e[1]=JSON.stringify(t),e[1]}})},Se=function(){return y.after("updateRows",O,function(e){if(f.isEnabled){let t=JSON.parse(e[1]);return t.forEach(function(n){U.afterPatch(n)}),e[1]=JSON.stringify(t),e[1]}})},z=p.findByProps("startTyping"),Ce=function(){return y.instead("startTyping",z,function(){})},we=function(){return y.instead("stopTyping",z,function(){})},Te=p.findByProps("getMessage","getMessages"),Fe=p.findByProps("getChannel","getDMFromUserId"),Ie=p.findByProps("startEditMessage"),{FormRow:$e,FormIcon:_e}=R;let P=!1;function Pe(e,t,n,o){var a;if(t=="MessageLongPressActionSheet"&&!(r.storage===null||r.storage===void 0||(a=r.storage.toggle)===null||a===void 0)&&a.eml){const i=n?.message;if(!i)return;e.then(function(b){const v=y.after("default",b,function(L,E){l.React.useEffect(function(){return function(){v()}},[]);const d=k.findInReactTree(E,function(u){var g,h;return(u==null||(h=u[0])===null||h===void 0||(g=h.type)===null||g===void 0?void 0:g.name)==="ButtonRow"});if(!d)return E;const M=Math.max(d.findIndex(function(u){var g,h;return(u==null||(g=u.props)===null||g===void 0?void 0:g.message)===(l.i18n===null||l.i18n===void 0||(h=l.i18n.Messages)===null||h===void 0?void 0:h.MESSAGE_ACTION_REPLY)}),0);d.splice(M,0,l.React.createElement(l.React.Fragment,null,l.React.createElement($e,{label:"Edit Message Locally",subLabel:"Added by Azzy Util",leading:l.React.createElement(_e,{style:{opacity:1},source:A.getAssetIDByName("ic_edit_24px")}),onPress:function(){Ie.startEditMessage(`AZZYEML-${i.channel_id}`,i.id,i.content),o.hideActionSheet()}})))})})}}function Le(e){var t;return!((t=e[0])===null||t===void 0)&&t.startsWith("AZZYEML-")?(e[0]=e[0].replaceAll("AZZYEML-",""),P=!0,e):(P=!1,e)}function Be(e){if(P){var t,n,o;let[a,i,b]=e;const v=Te.getMessage(a,i);l.FluxDispatcher.dispatch({type:"MESSAGE_UPDATE",message:{...v,...b,edited_timestamp:v.editedTimestamp,mention_roles:v.mentionRoles,mention_everyone:v.mentionEveryone,member:v.author,guild_id:(t=Fe.getChannel(v.channel_id||a))===null||t===void 0?void 0:t.guild_id},otherPluginBypass:r.storage===null||r.storage===void 0||(o=r.storage.utils)===null||o===void 0||(n=o.eml)===null||n===void 0?void 0:n.logEdit}),S.showToast("Message Edited",A.getAssetIDByName("ic_edit_24px"))}}const Z=p.findByProps("startEditMessage"),Ne=function(){return y.before("startEditMessage",Z,function(e){f.isEnabled&&Le(e)})},ke=function(){return y.before("editMessage",Z,function(e){f.isEnabled&&Be(e)})},{FormRow:De,FormIcon:Ue}=R;function xe(e,t,n,o){var a;if(t=="MessageLongPressActionSheet"&&!(r.storage===null||r.storage===void 0||(a=r.storage.toggle)===null||a===void 0)&&a.quickid){const i=n?.message;if(!i)return;e.then(function(b){const v=y.after("default",b,function(L,E){l.React.useEffect(function(){return function(){v()}},[]);const d=k.findInReactTree(E,function(s){var c,m;return(s==null||(m=s[0])===null||m===void 0||(c=m.type)===null||c===void 0?void 0:c.name)==="ButtonRow"});if(!d)return E;const M=Math.max(d.findIndex(function(s){var c,m;return(s==null||(c=s.props)===null||c===void 0?void 0:c.message)===(l.i18n===null||l.i18n===void 0||(m=l.i18n.Messages)===null||m===void 0?void 0:m.MENTION)}),0);function u(s,c,m,Je){return{label:s,sub:c,icon:m,callback:Je}}let g=[u("Copy User's Id","Result: <Some ID>","ic_copy_id",function(){var s;o.hideActionSheet(),l.clipboard.setString((i==null||(s=i.author)===null||s===void 0?void 0:s.id)??""),S.showToast("Copied User's ID to clipboard",A.getAssetIDByName("toast_copy_link"))}),u("Copy User's Mention","Result: <Mention>","ic_copy_id",function(){var s;o.hideActionSheet(),l.clipboard.setString(`<@${(i==null||(s=i.author)===null||s===void 0?void 0:s.id)??""}>`),S.showToast("Copied User's Mention to clipboard",A.getAssetIDByName("toast_copy_link"))}),u("Copy User's Id and Mention","Result: <Some ID> <Mention>","ic_copy_id",function(){var s,c;o.hideActionSheet(),l.clipboard.setString(`${(i==null||(s=i.author)===null||s===void 0?void 0:s.id)??""} <@${(i==null||(c=i.author)===null||c===void 0?void 0:c.id)??""}>`),S.showToast("Copied User to clipboard",A.getAssetIDByName("toast_copy_link"))})];g.reverse();const h=M||1;d.splice(M,1);for(const s of g)d.splice(h,0,l.React.createElement(l.React.Fragment,null,l.React.createElement(De,{label:s?.label,subLabel:s?.subLabel,onPress:s?.callback,leading:s?.icon&&l.React.createElement(Ue,{style:{opacity:1},source:A.getAssetIDByName(s?.icon)})})))})})}}const{FormRow:Ye,FormIcon:Ve}=R;function Oe(e,t,n,o){var a;t=="MediaShareActionSheet"&&!(r.storage===null||r.storage===void 0||(a=r.storage.toggle)===null||a===void 0)&&a.noshare&&e.then(function(i){const b=y.after("default",i,function(v,L){let[{syncer:E}]=v;l.React.useEffect(function(){return b()},[]);let d=E.sources[E.index.value];Array.isArray(d)&&(d=d[0]);const M=d.sourceURI??d.uri,u=L.props.children.props.children;console.log(u),console.log("=".repeat(40));const g=Math.max(u.findIndex(function(s){var c,m;return(s==null||(c=s.props)===null||c===void 0?void 0:c.message)===(l.i18n===null||l.i18n===void 0||(m=l.i18n.Messages)===null||m===void 0?void 0:m.SHARE)}),0);console.log(u);const h=l.React.createElement(Ye,{label:"Copy Image Link",subLabel:"Added by Azzy Util",leading:l.React.createElement(Ve,{style:{opacity:1},source:A.getAssetIDByName("ic_message_copy")}),onPress:function(){o.hideActionSheet(),l.clipboard.setString(M),S.showToast("Link copied")}});u&&(g>=0?u.splice(g,1,h):u.push(h))})})}const C=p.findByProps("openLazy","hideActionSheet");function ze(){return y.before("openLazy",C,function(e){let[t,n,o]=e;f.isEnabled&&(xe(t,n,o,C),Oe(t,n,o,C),Pe(t,n,o,C))})}D(r.storage,{toggle:{ctime:!1,ralert:!1,notype:!1,quickid:!1,eml:!1,noshare:!1},utils:{customTimestamp:{selected:"calendar",customFormat:"dddd, MMMM Do YYYY, h:mm:ss a",separateMessages:!1},replyAlert:{customColor:"#000",useCustomColor:!1},eml:{logEdit:!1}},debug:!1});let G=[],J;f.isEnabled=!1,G.push(ze,Ae,Me,Se,Ce,we,Ne,ke);const Ze=function(){return G.forEach(function(e){return e()})};var Ge={onLoad:function(){f.isEnabled=!0,J=Ze()},onUnload:function(){f.isEnabled=!1,J()},settings:Re};return f.default=Ge,Object.defineProperty(f,"__esModule",{value:!0}),f})({},vendetta.plugin,vendetta.storage,vendetta,vendetta.metro,vendetta.ui.components,vendetta.metro.common,vendetta.patcher,vendetta.utils,vendetta.ui.toasts,vendetta.ui.assets);
