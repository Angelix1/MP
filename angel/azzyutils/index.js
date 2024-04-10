(function(C,l,U,O,w,P,n,X,E,F,ee,T,$e){"use strict";const{openLazy:_e,hideActionSheet:Mt}=w.findByProps("openLazy","hideActionSheet");function te(e,t){if(e!=null&&t!=null)for(const a of Object.keys(t))typeof t[a]=="object"&&!Array.isArray(t[a])?(typeof e[a]!="object"&&(e[a]={}),te(e[a],t[a])):e[a]??(e[a]=t[a])}function ne(e,t){try{_e(new Promise(function(a){return a({default:e})}),"ActionSheet",t)}catch(a){O.logger.error(a.stack),showToast("Got error when opening ActionSheet! Please check debug logs")}}function ae(e){const t=e>>16&255,a=e>>8&255,r=e&255;return`#${(1<<24|t<<16|a<<8|r).toString(16).slice(1)}`}function V(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null,a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:null,r=arguments.length>3&&arguments[3]!==void 0?arguments[3]:null;return{version:e,new:t,updated:a,fix:r}}const I={...P.General,...P.Forms},le="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mJsrQAAAgwBAJ9P6qYAAAAASUVORK5CYII=";function re(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"#000";e||(e=t);const a=e?.trim();if(a.startsWith("#")){const r=a.slice(1);if(/^[0-9A-Fa-f]{6}$/.test(r))return"#"+r.toUpperCase()}else if(/^[0-9A-Fa-f]{6}$/.test(a))return"#"+a.toUpperCase();return t}const p={toPercentage:function(e){return e=Number(e),e===0?0:e===1?100:Math.round(e*100)},toDecimal:function(e){e=Number(e);const t=Math.min(Math.max(e,0),100);return t===0?0:t===100?1:t/100},formatDecimal:function(e){return e=Number(e),e===0||e===1?e:e.toFixed(2)},alphaToHex:function(e){e=Number(e);const t=Math.min(Math.max(e,0),100),a=Math.round(t/100*255).toString(16).toUpperCase();return a.length===1?"0"+a:a},hexAlphaToPercent:function(e){const t=parseInt(e,16);return isNaN(t)?0:Math.round(t/255*100)}};function Te(e){if(typeof e!="number"||e<1||e>100)throw new Error("withinChance(percentage): percentage must be a number between 1 and 100");return Math.random()<e/100}const{ScrollView:$t,View:z,Text:oe,TouchableOpacity:ie,TextInput:_t,Image:se,Animated:Tt,FormLabel:Dt,FormIcon:Nt,FormArrow:Pt,FormRow:D,FormSwitch:H,FormSwitchRow:Bt,FormSection:Lt,FormDivider:M,FormInput:kt,FormRadioRow:xt,FormSliderRow:ue}=I,ce=w.findByName("CustomColorPickerActionSheet");function De(){U.useProxy(l.storage);const e=l.storage.utils.replyAlert,[t,a]=n.React.useState(p.toDecimal(p.hexAlphaToPercent(e.colorAlpha)||100)),[r,s]=n.React.useState(p.toDecimal(p.hexAlphaToPercent(e.gutterAlpha)||100)),o=function(){return ne(ce,{color:n.ReactNative.processColor(e?.customColor)||0,onSelect:function(u){const h=ae(u);e.customColor=h,!(l.storage===null||l.storage===void 0)&&l.storage.debug&&O.logger.log("Reply Alert BG Color","[Changed]",h)}})},g=function(){return ne(ce,{color:n.ReactNative.processColor(e?.customColor)||0,onSelect:function(u){const h=ae(u);e.gutterColor=h,!(l.storage===null||l.storage===void 0)&&l.storage.debug&&O.logger.log("Reply Alert Gutter Color","[Changed]",h)}})};return n.React.createElement(n.React.Fragment,null,n.React.createElement(D,{label:"Toggle Force Alert",subLabel:"When someone replying to your message with mention disabled, this option will force ping you",trailing:n.React.createElement(H,{value:e?.useReplyAlert||!1,onValueChange:function(u){e.useReplyAlert=u}})}),n.React.createElement(M,null),n.React.createElement(D,{label:"Use Custom Color Mentions",trailing:n.React.createElement(H,{value:e?.useCustomColor||!1,onValueChange:function(u){e.useCustomColor=u}})}),n.React.createElement(M,null),n.React.createElement(D,{label:"Ignore self Reply",subLabel:"When replying to own message, do not ping",trailing:n.React.createElement(H,{value:e?.ignoreSelf||!1,onValueChange:function(u){e.ignoreSelf=u}})}),n.React.createElement(M,null),n.React.createElement(D,{label:"Preview",subLabel:"How it looks in then chat"}),n.React.createElement(z,{style:[{flexDirection:"row",height:80,width:"100%",overflow:"hidden",borderRadius:12,marginBottom:20,marginRight:10,marginLeft:10}]},n.React.createElement(z,{style:{width:"2%",backgroundColor:`${e?.gutterColor}${p.alphaToHex(p.toPercentage(r))}`}}),n.React.createElement(z,{style:{flex:1,backgroundColor:`${e?.customColor}${p.alphaToHex(p.toPercentage(t))}`,justifyContent:"center",alignItems:"center"}},n.React.createElement(oe,{style:{fontSize:20,color:"#FFFFFF"}}," Example White Text "),n.React.createElement(oe,{style:{fontSize:20,color:"#000000"}}," Example Black Text "))),n.React.createElement(M,null),n.React.createElement(D,{label:"Background Color",subLabel:"Click to Update",onPress:o,trailing:n.React.createElement(ie,{onPress:o},n.React.createElement(se,{source:{uri:le},style:{width:128,height:128,borderRadius:10,backgroundColor:e?.customColor||"#000"}}))}),n.React.createElement(M,null),n.React.createElement(D,{label:"Gutter Color",subLabel:"Click to Update",onPress:g,trailing:n.React.createElement(ie,{onPress:g},n.React.createElement(se,{source:{uri:le},style:{width:128,height:128,borderRadius:10,backgroundColor:e?.gutterColor||"#000"}}))}),n.React.createElement(M,null),n.React.createElement(ue,{label:`Background Color Alpha: ${p.toPercentage(t)}%`,value:t,style:{width:"90%"},onValueChange:function(u){a(Number(p.formatDecimal(u))),e.colorAlpha=p.alphaToHex(p.toPercentage(u))}}),n.React.createElement(M,null),n.React.createElement(ue,{label:`Gutter Color Alpha: ${p.toPercentage(r)}%`,value:r,style:{width:"90%"},onValueChange:function(u){s(Number(p.formatDecimal(u))),e.gutterAlpha=p.alphaToHex(p.toPercentage(u))}}))}const{FormRow:Ne,FormSwitch:Pe}=I;function Be(){var e,t;return React.createElement(React.Fragment,null,React.createElement(Ne,{label:"Bypass Antied Logging",trailing:React.createElement(Pe,{value:(l.storage===null||l.storage===void 0||(t=l.storage.utils)===null||t===void 0||(e=t.eml)===null||e===void 0?void 0:e.logEdit)||!1,onValueChange:function(a){l.storage.utils.eml.logEdit=a}})}))}function B(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return[...t]}var G=[V("1.0.0",B("Created the Plugin")),V("1.0.1",B("Added Remove Decor","Customization for reply alert","Option to revert locally edited message (wipe on unload of the plugin)")),V("1.0.2",B("[1.0.22] Setting for Quick Id","[1.0.22] Option to toggle Force alert","[1.0.22] Preview for ReplyAlert"),B("[1.0.2] Remove Custom Timestamp"),B("[1.0.21] Fix Cactus","[1.0.22] Fix No Share fails to find Share button","[1.0.23] Fix Quick ID removing edit message button"))].reverse();const{ScrollView:Ot,View:de,Text:Vt,TouchableOpacity:zt,TextInput:Ht,Image:Gt,Animated:qt}=P.General,{FormLabel:Yt,FormIcon:Le,FormArrow:Zt,FormRow:q,FormSwitch:Qt,FormSwitchRow:jt,FormSection:Jt,FormDivider:ke,FormInput:Wt}=P.Forms,xe=E.getAssetIDByName("ic_radio_square_checked_24px"),Ue=E.getAssetIDByName("ic_radio_square_24px"),Oe=E.getAssetIDByName("ic_information_24px");E.getAssetIDByName("ic_info");const Ve=E.getAssetIDByName("premium_sparkles"),ze=E.getAssetIDByName("ic_sync_24px"),He=E.getAssetIDByName("ic_progress_wrench_24px"),N=n.stylesheet.createThemedStyleSheet({border:{borderRadius:10},textBody:{color:X.semanticColors.TEXT_NORMAL,fontFamily:n.constants.Fonts.PRIMARY_MEDIUM,letterSpacing:.25,fontSize:22},textBody:{color:X.semanticColors.INPUT_PLACEHOLDER_TEXT,fontFamily:n.constants.Fonts.DISPLAY_NORMAL,letterSpacing:.25,fontSize:16},versionBG:{margin:10,padding:15,backgroundColor:"rgba(55, 149, 225, 0.3)"},rowLabel:{margin:10,padding:15,backgroundColor:"rgba(33, 219, 222, 0.34)"}});function k(e){return n.React.createElement(Le,{style:{opacity:1},source:e})}function Ge(e){let{change:t,index:a,totalIndex:r}=e;var s,o,g;const[u,h]=n.React.useState(!1);n.React.useState(!1);function d(R,b,y,m){return n.React.createElement(de,null,n.React.createElement(q,{label:b||"No Section",subLabel:y||null,leading:m&&k(m),style:[N.textHeader]}),R.map(function(S,$){return n.React.createElement(n.React.Fragment,null,n.React.createElement(q,{label:S,style:[N.textBody,N.rowLabel,N.border]}))}))}return n.React.createElement(n.React.Fragment,null,n.React.createElement(P.ErrorBoundary,null,n.React.createElement(q,{label:t?.version,leading:a==0?k(xe):k(Ue),trailing:k(Oe),onPress:function(){h(!u)}}),u&&n.React.createElement(de,{style:[N.versionBG,N.border]},(t==null||(s=t.new)===null||s===void 0?void 0:s.length)>0&&d(t.new,"New","New stuffies",Ve),(t==null||(o=t.updated)===null||o===void 0?void 0:o.length)>0&&d(t.updated,"Changes","Update things",ze),(t==null||(g=t.fix)===null||g===void 0?void 0:g.length)>0&&d(t.fix,"Fixes","Me hate borken things",He)),a==r.length-1?void 0:n.React.createElement(ke,null)))}const{FormRow:qe,FormSwitch:Ye}=I;function Ze(){var e,t;return React.createElement(React.Fragment,null,React.createElement(qe,{label:"Add Save Image Button to Image ActionSheet",subLabel:"if Built-in Save Image gone",trailing:React.createElement(Ye,{value:(l.storage===null||l.storage===void 0||(t=l.storage.utils)===null||t===void 0||(e=t.noshare)===null||e===void 0?void 0:e.addSaveImage)||!1,onValueChange:function(a){l.storage.utils.noshare.addSaveImage=a}})}))}const{FormInput:Qe}=I;function je(){var e,t;return React.createElement(React.Fragment,null,React.createElement(Qe,{title:"Name",keyboardType:"default",placeholder:"Angel",value:l.storage===null||l.storage===void 0||(t=l.storage.utils)===null||t===void 0||(e=t.cactus)===null||e===void 0?void 0:e.name,onChange:function(a){return l.storage.utils.cactus.name=a.toString()}}))}const{FormRow:Je,FormSwitch:We,FormDivider:ge}=I;function Ke(){U.useProxy(l.storage);const e=function(a,r,s){return{label:a,subLabel:r,key:s}},t=[e("Id","add Copy User Id","addID"),e("Mention","add Copy User Mention","addMention"),e("Id and Mention","add Copy User Id & Mention","addCombine")];return n.React.createElement(n.React.Fragment,null,t.map(function(a,r){var s,o;return n.React.createElement(n.React.Fragment,null,n.React.createElement(Je,{label:a?.label||"Missing Label",subLabel:a?.subLabel,trailing:n.React.createElement(We,{value:(l.storage===null||l.storage===void 0||(o=l.storage.utils)===null||o===void 0||(s=o.quickid)===null||s===void 0?void 0:s[a?.key])||!1,onValueChange:function(g){l.storage.utils.quickid[a.key]=g}})}),r!==t?.length-1&&n.React.createElement(ge,null))}),n.React.createElement(ge,null))}const{ScrollView:Xe,View:Y,Text:Kt,TouchableOpacity:Xt,TextInput:en,Image:tn,Animated:nn,FormLabel:an,FormIcon:ln,FormArrow:rn,FormRow:ve,FormSwitch:fe,FormSwitchRow:on,FormSection:he,FormDivider:Re,FormInput:sn,FormRadioRow:un,Component:cn}=I;function et(){U.useProxy(l.storage);const e=function(a,r,s,o,g){return{id:a,title:r,label:s,subLabel:o,props:g}},t=[e("cactus","Cactus","Toggle uhhh.. something",null,je),e("eml","EML","Toggle Edit Message Locally",null,Be),e("notype","No Type","Toggle No Typings",null,null),e("quickid","QID","Toggle Quick ID Setting",null,Ke),e("noshare","No Share","Toggle No Share",null,Ze),e("ralert","Reply Alert & Custom Mentions","Toggle Reply Alert & Custom Mentions Settings",null,De),e("removeDecor","I HATE AVATAR DECORATIONS","Toggle Remove Avatar Decoration",null,null)];return React.createElement(React.Fragment,null,React.createElement(Xe,null,React.createElement(Y,{style:{paddingBottom:36,borderRadius:10,backgroundColor:"rgba(0, 12, 46, 0.15)"}},React.createElement(ve,{label:"Debug",subLabel:"enable console logging",trailing:React.createElement(fe,{value:l.storage.debug,onValueChange:function(a){l.storage.debug=a}})}),React.createElement(Re,null),t.map(function(a,r){return React.createElement(React.Fragment,null,React.createElement(he,{title:a?.title},React.createElement(ve,{label:a?.label,subLabel:a?.subLabel,trailing:React.createElement(fe,{value:l.storage.toggle[a?.id],onValueChange:function(s){l.storage.toggle[a?.id]=s}})}),l.storage.toggle[a.id]&&a.props&&React.createElement(Y,{style:{margin:5,padding:10,borderRadius:10,backgroundColor:"rgba(0, 0, 0, 0.15)"}},React.createElement(a.props,null))))})),React.createElement(Re,null),G&&React.createElement(he,{title:"Updates"},React.createElement(Y,{style:{margin:5,padding:5,borderRadius:10,backgroundColor:"rgba(59, 30, 55, 0.15)"}},G.map(function(a,r){return React.createElement(Ge,{change:a,index:r,totalIndex:G.length})})))))}var Z,Q;const j=w.findByStoreName("UserStore");w.findByProps("getMessage","getMessages");const L=j==null||(Q=j.getCurrentUser)===null||Q===void 0||(Z=Q.call(j))===null||Z===void 0?void 0:Z.id;function tt(e){if(e.type=="MESSAGE_CREATE"){var t,a,r,s,o,g,u;const y=(e==null||(r=e.message)===null||r===void 0||(a=r.referenced_message)===null||a===void 0||(t=a.author)===null||t===void 0?void 0:t.id)==L,m=e==null||(o=e.message)===null||o===void 0||(s=o.mentions)===null||s===void 0?void 0:s.some(function(S){return S?.id===L});if(!(l.storage===null||l.storage===void 0||(u=l.storage.utils)===null||u===void 0||(g=u.replyAlert)===null||g===void 0)&&g.useReplyAlert&&(y||m)){var h,d;if((e==null||(d=e.message)===null||d===void 0||(h=d.author)===null||h===void 0?void 0:h.id)!=L)e.message.mentions.push({id:L});else{var R,b;(l.storage===null||l.storage===void 0||(b=l.storage.utils)===null||b===void 0||(R=b.replyAlert)===null||R===void 0?void 0:R.ignoreSelf)==!1&&e.message.mentions.push({id:L})}}}}function be(e){var t,a;const{gutterColor:r,customColor:s,gutterAlpha:o,colorAlpha:g,useCustomColor:u}=l.storage===null||l.storage===void 0||(t=l.storage.utils)===null||t===void 0?void 0:t.replyAlert;if(u&&!(e==null||(a=e.message)===null||a===void 0)&&a.mentioned){e.backgroundHighlight??(e.backgroundHighlight={});const h=re(s,"#DAFFFF"),d=re(r,"#121212");e.backgroundHighlight={backgroundColor:n.ReactNative.processColor(`${h}${g}`),gutterColor:n.ReactNative.processColor(`${d}${o}`)}}return e}function nt(){return F.before("dispatch",n.FluxDispatcher,function(e){let[t]=e;C.isEnabled&&tt(t)})}const ye=w.findByProps("getMessage","getMessages"),Ae=w.findByProps("getChannel","getDMFromUserId"),at=w.findByProps("startEditMessage"),{FormRow:Ee,FormIcon:me}=I;let J=!1;function lt(e,t,a,r){var s;if(t=="MessageLongPressActionSheet"&&!(l.storage===null||l.storage===void 0||(s=l.storage.toggle)===null||s===void 0)&&s.eml){const o=a?.message;if(!o)return;e.then(function(g){const u=F.after("default",g,function(h,d){var R,b,y;n.React.useEffect(function(){return function(){u()}},[]);const m=ee.findInReactTree(d,function(A){var f,i;return(A==null||(i=A[0])===null||i===void 0||(f=i.type)===null||f===void 0?void 0:f.name)==="ButtonRow"});if(!m)return d;const S=Math.max(m.findIndex(function(A){var f,i,c,v;return(A==null||(f=A.props)===null||f===void 0?void 0:f.message)===(n.i18n===null||n.i18n===void 0||(i=n.i18n.Messages)===null||i===void 0?void 0:i.MESSAGE_ACTION_REPLY)||(A==null||(c=A.props)===null||c===void 0?void 0:c.label)===(n.i18n===null||n.i18n===void 0||(v=n.i18n.Messages)===null||v===void 0?void 0:v.MESSAGE_ACTION_REPLY)}),0),$=l.storage===null||l.storage===void 0||(y=l.storage.utils)===null||y===void 0||(b=y.eml)===null||b===void 0||(R=b.editedMsg)===null||R===void 0?void 0:R.find(function(A){return A.id==o?.id});$?m.splice(S,0,n.React.createElement(n.React.Fragment,null,n.React.createElement(Ee,{label:"Revert Locally Edited Message",subLabel:"Added by Azzy Util",leading:n.React.createElement(me,{style:{opacity:1},source:E.getAssetIDByName("ic_edit_24px")}),onPress:function(){var A,f,i,c;const v=ye.getMessage(o.channel_id,o.id);n.FluxDispatcher.dispatch({type:"MESSAGE_UPDATE",message:{...v,...o,content:$.content,edited_timestamp:v.editedTimestamp,mention_roles:v.mentionRoles,mention_everyone:v.mentionEveryone,guild_id:(A=Ae.getChannel(v.channel_id||o.channel_id))===null||A===void 0?void 0:A.guild_id},otherPluginBypass:!0}),l.storage.utils.eml.editedMsg=l.storage===null||l.storage===void 0||(c=l.storage.utils)===null||c===void 0||(i=c.eml)===null||i===void 0||(f=i.editedMsg)===null||f===void 0?void 0:f.filter(function(_){return _.id!=o.id}),r.hideActionSheet()}}))):m.splice(S,0,n.React.createElement(n.React.Fragment,null,n.React.createElement(Ee,{label:"Edit Message Locally",subLabel:"Added by Azzy Util",leading:n.React.createElement(me,{style:{opacity:1},source:E.getAssetIDByName("ic_edit_24px")}),onPress:function(){at.startEditMessage(`AZZYEML-${o.channel_id}`,o.id,o.content),r.hideActionSheet()}})))})})}}function rt(e){var t;return!((t=e[0])===null||t===void 0)&&t.startsWith("AZZYEML-")?(e[0]=e[0].replaceAll("AZZYEML-",""),J=!0,e):(J=!1,e)}function ot(e){if(J){var t,a,r,s,o;let[g,u,h]=e;const d=ye.getMessage(g,u);l.storage===null||l.storage===void 0||(a=l.storage.utils)===null||a===void 0||(t=a.eml)===null||t===void 0||t.editedMsg.push(d),n.FluxDispatcher.dispatch({type:"MESSAGE_UPDATE",message:{...d,...h,edited_timestamp:d.editedTimestamp,mention_roles:d.mentionRoles,mention_everyone:d.mentionEveryone,member:d.author,guild_id:(r=Ae.getChannel(d.channel_id||g))===null||r===void 0?void 0:r.guild_id},otherPluginBypass:l.storage===null||l.storage===void 0||(o=l.storage.utils)===null||o===void 0||(s=o.eml)===null||s===void 0?void 0:s.logEdit}),T.showToast("Message Edited",E.getAssetIDByName("ic_edit_24px"))}}const{FormRow:it,FormIcon:st}=I;function ut(e,t,a,r){var s;if(t=="MessageLongPressActionSheet"&&!(l.storage===null||l.storage===void 0||(s=l.storage.toggle)===null||s===void 0)&&s.quickid){const o=a?.message;if(!o)return;e.then(function(g){const u=F.after("default",g,function(h,d){var R;n.React.useEffect(function(){return function(){u()}},[]);const b=ee.findInReactTree(d,function(i){var c,v;return(i==null||(v=i[0])===null||v===void 0||(c=v.type)===null||c===void 0?void 0:c.name)==="ButtonRow"});if(!b)return d;const y=b.findIndex(function(i){var c,v,_,K;return(i==null||(c=i.props)===null||c===void 0?void 0:c.message)===(n.i18n===null||n.i18n===void 0||(v=n.i18n.Messages)===null||v===void 0?void 0:v.MENTION)||(i==null||(_=i.props)===null||_===void 0?void 0:_.label)===(n.i18n===null||n.i18n===void 0||(K=n.i18n.Messages)===null||K===void 0?void 0:K.MENTION)});l.storage.debug&&(console.log(b),console.log("Position => "+y));function m(i,c,v,_){return{label:i,sub:c,icon:v,callback:_}}let S=[];const{addID:$,addMention:A,addCombine:f}=l.storage===null||l.storage===void 0||(R=l.storage.utils)===null||R===void 0?void 0:R.quickid;$&&S.push(m("Copy User's Id","Result: <Some ID>","ic_copy_id",function(){var i;r.hideActionSheet(),n.clipboard.setString((o==null||(i=o.author)===null||i===void 0?void 0:i.id)??""),T.showToast("Copied User's ID to clipboard",E.getAssetIDByName("toast_copy_link"))})),A&&S.push(m("Copy User's Mention","Result: <Mention>","ic_copy_id",function(){var i;r.hideActionSheet(),n.clipboard.setString(`<@${(o==null||(i=o.author)===null||i===void 0?void 0:i.id)??""}>`),T.showToast("Copied User's Mention to clipboard",E.getAssetIDByName("toast_copy_link"))})),f&&S.push(m("Copy User's Id and Mention","Result: <Some ID> <Mention>","ic_copy_id",function(){var i,c;r.hideActionSheet(),n.clipboard.setString(`${(o==null||(i=o.author)===null||i===void 0?void 0:i.id)??""} <@${(o==null||(c=o.author)===null||c===void 0?void 0:c.id)??""}>`),T.showToast("Copied User to clipboard",E.getAssetIDByName("toast_copy_link"))})),S.reverse(),y>=0&&b.splice(y,1);for(const i of S){const c=n.React.createElement(n.React.Fragment,null,n.React.createElement(it,{label:i?.label,subLabel:i?.sub,onPress:i?.callback,leading:i?.icon&&n.React.createElement(st,{style:{opacity:1},source:E.getAssetIDByName(i?.icon)})}));y>=0?b.splice(y,0,c):b.push(c)}})})}}const{downloadMediaAsset:ct}=w.findByProps("downloadMediaAsset"),{FormRow:pe,FormIcon:Ce}=I;function dt(e,t,a,r){var s;!(l.storage===null||l.storage===void 0||(s=l.storage.toggle)===null||s===void 0)&&s.noshare&&t=="MediaShareActionSheet"&&e.then(function(o){const g=F.after("default",o,function(u,h){let[{syncer:d}]=u;n.React.useEffect(function(){return g()},[]);let R=d.sources[d.index.value];Array.isArray(R)&&(R=R[0]);const b=R.sourceURI??R.uri,y=h.props.children.props.children,m=y.findIndex(function(f){var i,c,v;return(f==null||(i=f.props)===null||i===void 0?void 0:i.label)===(n.i18n===null||n.i18n===void 0||(c=n.i18n.Messages)===null||c===void 0?void 0:c.SHARE)||(f==null||(v=f.props)===null||v===void 0?void 0:v.label)==="Share"}),S=n.React.createElement(pe,{label:"Copy Image Link",subLabel:"Added by Azzy Util",leading:n.React.createElement(Ce,{style:{opacity:1},source:E.getAssetIDByName("ic_message_copy")}),onPress:function(){r.hideActionSheet(),n.clipboard.setString(b),T.showToast("Link copied")}}),$=n.React.createElement(pe,{label:"Save Image",subLabel:"Added by Azzy Util",leading:n.React.createElement(Ce,{style:{opacity:1},source:E.getAssetIDByName("ic_download_24px")}),onPress:function(){r.hideActionSheet(),ct(b,0),T.showToast("Downloading image",E.getAssetIDByName("toast_image_saved"))}}),A=[S];if(l.storage.utils.noshare.addSaveImage&&A.push($),y)if(m>=0){y.splice(m,1);for(const f of A)y.splice(m,0,f)}else y.push(...A)})})}const x=w.findByProps("openLazy","hideActionSheet");function gt(){return F.before("openLazy",x,function(e){let[t,a,r]=e;C.isEnabled&&(ut(t,a,r,x),dt(t,a,r,x),lt(t,a,r,x))})}const{DCDChatManager:Se}=n.ReactNative.NativeModules,vt=function(){return F.before("updateRows",Se,function(e){if(C.isEnabled){let t=JSON.parse(e[1]);return t.forEach(function(a){be(a)}),e[1]=JSON.stringify(t),e[1]}})},ft=function(){return F.after("updateRows",Se,function(e){if(C.isEnabled){let t=JSON.parse(e[1]);return t.forEach(function(a){be(a)}),e[1]=JSON.stringify(t),e[1]}})},we=w.findByProps("startTyping"),ht=function(){return F.instead("startTyping",we,function(){})},Rt=function(){return F.instead("stopTyping",we,function(){})},Fe=w.findByProps("startEditMessage"),bt=function(){return F.before("startEditMessage",Fe,function(e){C.isEnabled&&rt(e)})},yt=function(){return F.before("editMessage",Fe,function(e){C.isEnabled&&ot(e)})};function At(e){var t;return e?.avatarDecorationData&&!(l.storage===null||l.storage===void 0||(t=l.storage.toggle)===null||t===void 0)&&t.removeDecor&&(e.avatarDecorationData=null),e}const Et=w.findByStoreName("UserStore"),mt=function(){return F.after("getUser",Et,function(e,t){C.isEnabled&&At(t)})},Ie=["Rawr~","Nyaa","Don't touch my tail!","Maawww! Nappy!","Awowooo","I can chase butterflies all day!","Cuddles?!","These ears pick up everything :3","Shiny things~","Belly rubs, yay","Am cute","Snuggles","Tails","Pawbs","Boxes, owo","Feeling cuddly today!","Feeling cute"];function pt(e){var t,a;if(!(l.storage===null||l.storage===void 0||(t=l.storage.toggle)===null||t===void 0)&&t.cactus&&(e==null||(a=e.content)===null||a===void 0?void 0:a.length)>25&&Te(3)){var r,s;const o=Math.floor(Math.random()*Ie.length);e.content=`${e?.content}

*${Ie[o]}*  - \`${(l.storage===null||l.storage===void 0||(s=l.storage.utils)===null||s===void 0||(r=s.cactus)===null||r===void 0?void 0:r.name)||"Angel"}\``}}const Ct=w.findByProps("sendMessage","receiveMessage");function St(){return F.before("sendMessage",Ct,function(e){C.isEnabled&&pt(e[1])})}te(l.storage,{toggle:{ctime:!1,ralert:!1,notype:!1,quickid:!1,eml:!1,noshare:!1,removeDecor:!1,cactus:!1},utils:{cactus:{name:""},quickid:{addID:!1,addMention:!1,addCombine:!1},replyAlert:{customColor:"#000",gutterColor:"#FFF",colorAlpha:"33",gutterAlpha:"33",useReplyAlert:!1,useCustomColor:!1,ignoreSelf:!1},eml:{logEdit:!1,editedMsg:[]},noshare:{addSaveImage:!1,addCopyImage:!1}},debug:!1});let W=[],Me;C.isEnabled=!1,W.push(gt,nt,vt,ft,bt,yt,mt,St);const wt=function(){return W.forEach(function(e){return e()})},Ft=function(){l.storage.utils.eml.editedMsg=[]};var It={onLoad:function(){var e,t;C.isEnabled=!0,!(l.storage===null||l.storage===void 0||(e=l.storage.toggle)===null||e===void 0)&&e.notype&&W.push(ht,Rt),Me=(t=wt())===null||t===void 0?void 0:t.catch(function(a){console.log("AZZYUTIL, Crash On Load"),console.log(a),$e.stopPlugin(l.id)})},onUnload:function(){C.isEnabled=!1,Me(),Ft()},settings:et};return C.default=It,Object.defineProperty(C,"__esModule",{value:!0}),C})({},vendetta.plugin,vendetta.storage,vendetta,vendetta.metro,vendetta.ui.components,vendetta.metro.common,vendetta.ui,vendetta.ui.assets,vendetta.patcher,vendetta.utils,vendetta.ui.toasts,vendetta.plugins);
