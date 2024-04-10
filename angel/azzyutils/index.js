(function(C,r,U,O,w,P,n,W,R,F,K,T,we){"use strict";const{openLazy:Fe,hideActionSheet:It}=w.findByProps("openLazy","hideActionSheet");function X(e,t){if(e!=null&&t!=null)for(const a of Object.keys(t))typeof t[a]=="object"&&!Array.isArray(t[a])?(typeof e[a]!="object"&&(e[a]={}),X(e[a],t[a])):e[a]??(e[a]=t[a])}function ee(e,t){try{Fe(new Promise(function(a){return a({default:e})}),"ActionSheet",t)}catch(a){O.logger.error(a.stack),showToast("Got error when opening ActionSheet! Please check debug logs")}}function te(e){const t=e>>16&255,a=e>>8&255,l=e&255;return`#${(1<<24|t<<16|a<<8|l).toString(16).slice(1)}`}function z(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null,a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:null,l=arguments.length>3&&arguments[3]!==void 0?arguments[3]:null;return{version:e,new:t,updated:a,fix:l}}const I={...P.General,...P.Forms},ne="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mJsrQAAAgwBAJ9P6qYAAAAASUVORK5CYII=";function ae(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"#000";e||(e=t);const a=e?.trim();if(a.startsWith("#")){const l=a.slice(1);if(/^[0-9A-Fa-f]{6}$/.test(l))return"#"+l.toUpperCase()}else if(/^[0-9A-Fa-f]{6}$/.test(a))return"#"+a.toUpperCase();return t}const m={toPercentage:function(e){return e=Number(e),e===0?0:e===1?100:Math.round(e*100)},toDecimal:function(e){e=Number(e);const t=Math.min(Math.max(e,0),100);return t===0?0:t===100?1:t/100},formatDecimal:function(e){return e=Number(e),e===0||e===1?e:e.toFixed(2)},alphaToHex:function(e){e=Number(e);const t=Math.min(Math.max(e,0),100),a=Math.round(t/100*255).toString(16).toUpperCase();return a.length===1?"0"+a:a},hexAlphaToPercent:function(e){const t=parseInt(e,16);return isNaN(t)?0:Math.round(t/255*100)}};function Me(e){if(typeof e!="number"||e<1||e>100)throw new Error("withinChance(percentage): percentage must be a number between 1 and 100");return Math.random()<e/100}const{ScrollView:$t,View:V,Text:re,TouchableOpacity:le,TextInput:_t,Image:oe,Animated:Tt,FormLabel:Dt,FormIcon:Nt,FormArrow:Pt,FormRow:D,FormSwitch:H,FormSwitchRow:Bt,FormSection:Lt,FormDivider:$,FormInput:xt,FormRadioRow:kt,FormSliderRow:ie}=I,se=w.findByName("CustomColorPickerActionSheet");function Ie(){U.useProxy(r.storage);const e=r.storage.utils.replyAlert,[t,a]=n.React.useState(m.toDecimal(m.hexAlphaToPercent(e.colorAlpha)||100)),[l,i]=n.React.useState(m.toDecimal(m.hexAlphaToPercent(e.gutterAlpha)||100)),o=function(){return ee(se,{color:n.ReactNative.processColor(e?.customColor)||0,onSelect:function(u){const v=te(u);e.customColor=v,!(r.storage===null||r.storage===void 0)&&r.storage.debug&&O.logger.log("Reply Alert BG Color","[Changed]",v)}})},g=function(){return ee(se,{color:n.ReactNative.processColor(e?.customColor)||0,onSelect:function(u){const v=te(u);e.gutterColor=v,!(r.storage===null||r.storage===void 0)&&r.storage.debug&&O.logger.log("Reply Alert Gutter Color","[Changed]",v)}})};return n.React.createElement(n.React.Fragment,null,n.React.createElement(D,{label:"Toggle Force Alert",subLabel:"When someone replying to your message with mention disabled, this option will force ping you",trailing:n.React.createElement(H,{value:e?.useReplyAlert||!1,onValueChange:function(u){e.useReplyAlert=u}})}),n.React.createElement($,null),n.React.createElement(D,{label:"Use Custom Color Mentions",trailing:n.React.createElement(H,{value:e?.useCustomColor||!1,onValueChange:function(u){e.useCustomColor=u}})}),n.React.createElement($,null),n.React.createElement(D,{label:"Ignore self Reply",subLabel:"When replying to own message, do not ping",trailing:n.React.createElement(H,{value:e?.ignoreSelf||!1,onValueChange:function(u){e.ignoreSelf=u}})}),n.React.createElement($,null),n.React.createElement(D,{label:"Preview",subLabel:"How it looks in then chat"}),n.React.createElement(V,{style:[{flexDirection:"row",height:80,width:"100%",overflow:"hidden",borderRadius:12,marginBottom:20,marginRight:10,marginLeft:10}]},n.React.createElement(V,{style:{width:"2%",backgroundColor:`${e?.gutterColor}${m.alphaToHex(m.toPercentage(l))}`}}),n.React.createElement(V,{style:{flex:1,backgroundColor:`${e?.customColor}${m.alphaToHex(m.toPercentage(t))}`,justifyContent:"center",alignItems:"center"}},n.React.createElement(re,{style:{fontSize:20,color:"#FFFFFF"}}," Example White Text "),n.React.createElement(re,{style:{fontSize:20,color:"#000000"}}," Example Black Text "))),n.React.createElement($,null),n.React.createElement(D,{label:"Background Color",subLabel:"Click to Update",onPress:o,trailing:n.React.createElement(le,{onPress:o},n.React.createElement(oe,{source:{uri:ne},style:{width:128,height:128,borderRadius:10,backgroundColor:e?.customColor||"#000"}}))}),n.React.createElement($,null),n.React.createElement(D,{label:"Gutter Color",subLabel:"Click to Update",onPress:g,trailing:n.React.createElement(le,{onPress:g},n.React.createElement(oe,{source:{uri:ne},style:{width:128,height:128,borderRadius:10,backgroundColor:e?.gutterColor||"#000"}}))}),n.React.createElement($,null),n.React.createElement(ie,{label:`Background Color Alpha: ${m.toPercentage(t)}%`,value:t,style:{width:"90%"},onValueChange:function(u){a(Number(m.formatDecimal(u))),e.colorAlpha=m.alphaToHex(m.toPercentage(u))}}),n.React.createElement($,null),n.React.createElement(ie,{label:`Gutter Color Alpha: ${m.toPercentage(l)}%`,value:l,style:{width:"90%"},onValueChange:function(u){i(Number(m.formatDecimal(u))),e.gutterAlpha=m.alphaToHex(m.toPercentage(u))}}))}const{FormRow:$e,FormSwitch:_e}=I;function Te(){var e,t;return React.createElement(React.Fragment,null,React.createElement($e,{label:"Bypass Antied Logging",trailing:React.createElement(_e,{value:(r.storage===null||r.storage===void 0||(t=r.storage.utils)===null||t===void 0||(e=t.eml)===null||e===void 0?void 0:e.logEdit)||!1,onValueChange:function(a){r.storage.utils.eml.logEdit=a}})}))}function B(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return[...t]}var G=[z("1.0.0",B("Created the Plugin")),z("1.0.1",B("Added Remove Decor","Customization for reply alert","Option to revert locally edited message (wipe on unload of the plugin)")),z("1.0.2",B("[1.0.22] Setting for Quick Id","[1.0.22] Option to toggle Force alert","[1.0.22] Preview for ReplyAlert"),B("[1.0.2] Remove Custom Timestamp"),B("[1.0.21] Fix Cactus","[1.0.22] Fix No Share fails to find Share button"))].reverse();const{ScrollView:Ot,View:ue,Text:zt,TouchableOpacity:Vt,TextInput:Ht,Image:Gt,Animated:qt}=P.General,{FormLabel:Yt,FormIcon:De,FormArrow:Zt,FormRow:q,FormSwitch:jt,FormSwitchRow:Qt,FormSection:Jt,FormDivider:Ne,FormInput:Wt}=P.Forms,Pe=R.getAssetIDByName("ic_radio_square_checked_24px"),Be=R.getAssetIDByName("ic_radio_square_24px"),Le=R.getAssetIDByName("ic_information_24px");R.getAssetIDByName("ic_info");const xe=R.getAssetIDByName("premium_sparkles"),ke=R.getAssetIDByName("ic_sync_24px"),Ue=R.getAssetIDByName("ic_progress_wrench_24px"),N=n.stylesheet.createThemedStyleSheet({border:{borderRadius:10},textBody:{color:W.semanticColors.TEXT_NORMAL,fontFamily:n.constants.Fonts.PRIMARY_MEDIUM,letterSpacing:.25,fontSize:22},textBody:{color:W.semanticColors.INPUT_PLACEHOLDER_TEXT,fontFamily:n.constants.Fonts.DISPLAY_NORMAL,letterSpacing:.25,fontSize:16},versionBG:{margin:10,padding:15,backgroundColor:"rgba(55, 149, 225, 0.3)"},rowLabel:{margin:10,padding:15,backgroundColor:"rgba(33, 219, 222, 0.34)"}});function x(e){return n.React.createElement(De,{style:{opacity:1},source:e})}function Oe(e){let{change:t,index:a,totalIndex:l}=e;var i,o,g;const[u,v]=n.React.useState(!1);n.React.useState(!1);function d(h,b,p,A){return n.React.createElement(ue,null,n.React.createElement(q,{label:b||"No Section",subLabel:p||null,leading:A&&x(A),style:[N.textHeader]}),h.map(function(S,_){return n.React.createElement(n.React.Fragment,null,n.React.createElement(q,{label:S,style:[N.textBody,N.rowLabel,N.border]}))}))}return n.React.createElement(n.React.Fragment,null,n.React.createElement(P.ErrorBoundary,null,n.React.createElement(q,{label:t?.version,leading:a==0?x(Pe):x(Be),trailing:x(Le),onPress:function(){v(!u)}}),u&&n.React.createElement(ue,{style:[N.versionBG,N.border]},(t==null||(i=t.new)===null||i===void 0?void 0:i.length)>0&&d(t.new,"New","New stuffies",xe),(t==null||(o=t.updated)===null||o===void 0?void 0:o.length)>0&&d(t.updated,"Changes","Update things",ke),(t==null||(g=t.fix)===null||g===void 0?void 0:g.length)>0&&d(t.fix,"Fixes","Me hate borken things",Ue)),a==l.length-1?void 0:n.React.createElement(Ne,null)))}const{FormRow:ze,FormSwitch:Ve}=I;function He(){var e,t;return React.createElement(React.Fragment,null,React.createElement(ze,{label:"Add Save Image Button to Image ActionSheet",subLabel:"if Built-in Save Image gone",trailing:React.createElement(Ve,{value:(r.storage===null||r.storage===void 0||(t=r.storage.utils)===null||t===void 0||(e=t.noshare)===null||e===void 0?void 0:e.addSaveImage)||!1,onValueChange:function(a){r.storage.utils.noshare.addSaveImage=a}})}))}const{FormInput:Ge}=I;function qe(){var e,t;return React.createElement(React.Fragment,null,React.createElement(Ge,{title:"Name",keyboardType:"default",placeholder:"Angel",value:r.storage===null||r.storage===void 0||(t=r.storage.utils)===null||t===void 0||(e=t.cactus)===null||e===void 0?void 0:e.name,onChange:function(a){return r.storage.utils.cactus.name=a.toString()}}))}const{FormRow:Ye,FormSwitch:Ze,FormDivider:ce}=I;function je(){U.useProxy(r.storage);const e=function(a,l,i){return{label:a,subLabel:l,key:i}},t=[e("Id","add Copy User Id","addID"),e("Mention","add Copy User Mention","addMention"),e("Id and Mention","add Copy User Id & Mention","addCombine")];return n.React.createElement(n.React.Fragment,null,t.map(function(a,l){var i,o;return n.React.createElement(n.React.Fragment,null,n.React.createElement(Ye,{label:a?.label||"Missing Label",subLabel:a?.subLabel,trailing:n.React.createElement(Ze,{value:(r.storage===null||r.storage===void 0||(o=r.storage.utils)===null||o===void 0||(i=o.quickid)===null||i===void 0?void 0:i[a?.key])||!1,onValueChange:function(g){r.storage.utils.quickid[a.key]=g}})}),l!==t?.length-1&&n.React.createElement(ce,null))}),n.React.createElement(ce,null))}const{ScrollView:Qe,View:Y,Text:Kt,TouchableOpacity:Xt,TextInput:en,Image:tn,Animated:nn,FormLabel:an,FormIcon:rn,FormArrow:ln,FormRow:Je,FormSwitch:We,FormSwitchRow:on,FormSection:de,FormDivider:Ke,FormInput:sn,FormRadioRow:un,Component:cn}=I;function Xe(){U.useProxy(r.storage);const e=function(a,l,i,o,g){return{id:a,title:l,label:i,subLabel:o,props:g}},t=[e("cactus","Cactus","Toggle uhhh.. something",null,qe),e("eml","EML","Toggle Edit Message Locally",null,Te),e("notype","No Type","Toggle No Typings",null,null),e("quickid","QID","Toggle Quick ID Setting",null,je),e("noshare","No Share","Toggle No Share",null,He),e("ralert","Reply Alert & Custom Mentions","Toggle Reply Alert Settings",null,Ie),e("removeDecor","I HATE AVATAR DECORATIONS","Toggle Remove Avatar Decoration",null,null)];return React.createElement(React.Fragment,null,React.createElement(Qe,null,React.createElement(Y,{style:{paddingBottom:36,borderRadius:10,backgroundColor:"rgba(0, 12, 46, 0.15)"}},t.map(function(a,l){return React.createElement(React.Fragment,null,React.createElement(de,{title:a?.title},React.createElement(Je,{label:a?.label,subLabel:a?.subLabel,trailing:React.createElement(We,{value:r.storage.toggle[a?.id],onValueChange:function(i){r.storage.toggle[a?.id]=i}})}),r.storage.toggle[a.id]&&a.props&&React.createElement(Y,{style:{margin:5,padding:10,borderRadius:10,backgroundColor:"rgba(0, 0, 0, 0.15)"}},React.createElement(a.props,null))))})),React.createElement(Ke,null),G&&React.createElement(de,{title:"Updates"},React.createElement(Y,{style:{margin:5,padding:5,borderRadius:10,backgroundColor:"rgba(59, 30, 55, 0.15)"}},G.map(function(a,l){return React.createElement(Oe,{change:a,index:l,totalIndex:G.length})})))))}var Z,j;const Q=w.findByStoreName("UserStore");w.findByProps("getMessage","getMessages");const L=Q==null||(j=Q.getCurrentUser)===null||j===void 0||(Z=j.call(Q))===null||Z===void 0?void 0:Z.id;function et(e){if(e.type=="MESSAGE_CREATE"){var t,a,l,i,o,g,u;const p=(e==null||(l=e.message)===null||l===void 0||(a=l.referenced_message)===null||a===void 0||(t=a.author)===null||t===void 0?void 0:t.id)==L,A=e==null||(o=e.message)===null||o===void 0||(i=o.mentions)===null||i===void 0?void 0:i.some(function(S){return S?.id===L});if(!(r.storage===null||r.storage===void 0||(u=r.storage.utils)===null||u===void 0||(g=u.replyAlert)===null||g===void 0)&&g.useReplyAlert&&(p||A)){var v,d;if((e==null||(d=e.message)===null||d===void 0||(v=d.author)===null||v===void 0?void 0:v.id)!=L)e.message.mentions.push({id:L});else{var h,b;(r.storage===null||r.storage===void 0||(b=r.storage.utils)===null||b===void 0||(h=b.replyAlert)===null||h===void 0?void 0:h.ignoreSelf)==!1&&e.message.mentions.push({id:L})}}}}function ge(e){var t,a;const{gutterColor:l,customColor:i,gutterAlpha:o,colorAlpha:g,useCustomColor:u}=r.storage===null||r.storage===void 0||(t=r.storage.utils)===null||t===void 0?void 0:t.replyAlert;if(u&&!(e==null||(a=e.message)===null||a===void 0)&&a.mentioned){e.backgroundHighlight??(e.backgroundHighlight={});const v=ae(i,"#DAFFFF"),d=ae(l,"#121212");e.backgroundHighlight={backgroundColor:n.ReactNative.processColor(`${v}${g}`),gutterColor:n.ReactNative.processColor(`${d}${o}`)}}return e}function tt(){return F.before("dispatch",n.FluxDispatcher,function(e){let[t]=e;C.isEnabled&&et(t)})}const fe=w.findByProps("getMessage","getMessages"),ve=w.findByProps("getChannel","getDMFromUserId"),nt=w.findByProps("startEditMessage"),{FormRow:he,FormIcon:ye}=I;let J=!1;function at(e,t,a,l){var i;if(t=="MessageLongPressActionSheet"&&!(r.storage===null||r.storage===void 0||(i=r.storage.toggle)===null||i===void 0)&&i.eml){const o=a?.message;if(!o)return;e.then(function(g){const u=F.after("default",g,function(v,d){var h,b,p;n.React.useEffect(function(){return function(){u()}},[]);const A=K.findInReactTree(d,function(y){var f,E;return(y==null||(E=y[0])===null||E===void 0||(f=E.type)===null||f===void 0?void 0:f.name)==="ButtonRow"});if(!A)return d;const S=Math.max(A.findIndex(function(y){var f,E,s,c;return(y==null||(f=y.props)===null||f===void 0?void 0:f.message)===(n.i18n===null||n.i18n===void 0||(E=n.i18n.Messages)===null||E===void 0?void 0:E.MESSAGE_ACTION_REPLY)||(y==null||(s=y.props)===null||s===void 0?void 0:s.label)===(n.i18n===null||n.i18n===void 0||(c=n.i18n.Messages)===null||c===void 0?void 0:c.MESSAGE_ACTION_REPLY)}),0),_=r.storage===null||r.storage===void 0||(p=r.storage.utils)===null||p===void 0||(b=p.eml)===null||b===void 0||(h=b.editedMsg)===null||h===void 0?void 0:h.find(function(y){return y.id==o?.id});_?A.splice(S,0,n.React.createElement(n.React.Fragment,null,n.React.createElement(he,{label:"Revert Locally Edited Message",subLabel:"Added by Azzy Util",leading:n.React.createElement(ye,{style:{opacity:1},source:R.getAssetIDByName("ic_edit_24px")}),onPress:function(){var y,f,E,s;const c=fe.getMessage(o.channel_id,o.id);n.FluxDispatcher.dispatch({type:"MESSAGE_UPDATE",message:{...c,...o,content:_.content,edited_timestamp:c.editedTimestamp,mention_roles:c.mentionRoles,mention_everyone:c.mentionEveryone,guild_id:(y=ve.getChannel(c.channel_id||o.channel_id))===null||y===void 0?void 0:y.guild_id},otherPluginBypass:!0}),r.storage.utils.eml.editedMsg=r.storage===null||r.storage===void 0||(s=r.storage.utils)===null||s===void 0||(E=s.eml)===null||E===void 0||(f=E.editedMsg)===null||f===void 0?void 0:f.filter(function(M){return M.id!=o.id}),l.hideActionSheet()}}))):A.splice(S,0,n.React.createElement(n.React.Fragment,null,n.React.createElement(he,{label:"Edit Message Locally",subLabel:"Added by Azzy Util",leading:n.React.createElement(ye,{style:{opacity:1},source:R.getAssetIDByName("ic_edit_24px")}),onPress:function(){nt.startEditMessage(`AZZYEML-${o.channel_id}`,o.id,o.content),l.hideActionSheet()}})))})})}}function rt(e){var t;return!((t=e[0])===null||t===void 0)&&t.startsWith("AZZYEML-")?(e[0]=e[0].replaceAll("AZZYEML-",""),J=!0,e):(J=!1,e)}function lt(e){if(J){var t,a,l,i,o;let[g,u,v]=e;const d=fe.getMessage(g,u);r.storage===null||r.storage===void 0||(a=r.storage.utils)===null||a===void 0||(t=a.eml)===null||t===void 0||t.editedMsg.push(d),n.FluxDispatcher.dispatch({type:"MESSAGE_UPDATE",message:{...d,...v,edited_timestamp:d.editedTimestamp,mention_roles:d.mentionRoles,mention_everyone:d.mentionEveryone,member:d.author,guild_id:(l=ve.getChannel(d.channel_id||g))===null||l===void 0?void 0:l.guild_id},otherPluginBypass:r.storage===null||r.storage===void 0||(o=r.storage.utils)===null||o===void 0||(i=o.eml)===null||i===void 0?void 0:i.logEdit}),T.showToast("Message Edited",R.getAssetIDByName("ic_edit_24px"))}}const{FormRow:ot,FormIcon:it}=I;function st(e,t,a,l){var i;if(t=="MessageLongPressActionSheet"&&!(r.storage===null||r.storage===void 0||(i=r.storage.toggle)===null||i===void 0)&&i.quickid){const o=a?.message;if(!o)return;e.then(function(g){const u=F.after("default",g,function(v,d){var h;n.React.useEffect(function(){return function(){u()}},[]);const b=K.findInReactTree(d,function(s){var c,M;return(s==null||(M=s[0])===null||M===void 0||(c=M.type)===null||c===void 0?void 0:c.name)==="ButtonRow"});if(!b)return d;const p=Math.max(b.findIndex(function(s){var c,M;return(s==null||(c=s.props)===null||c===void 0?void 0:c.message)===(n.i18n===null||n.i18n===void 0||(M=n.i18n.Messages)===null||M===void 0?void 0:M.MENTION)}),0);function A(s,c,M,Mt){return{label:s,sub:c,icon:M,callback:Mt}}let S=[];const{addID:_,addMention:y,addCombine:f}=r.storage===null||r.storage===void 0||(h=r.storage.utils)===null||h===void 0?void 0:h.quickid;_&&S.push(A("Copy User's Id","Result: <Some ID>","ic_copy_id",function(){var s;l.hideActionSheet(),n.clipboard.setString((o==null||(s=o.author)===null||s===void 0?void 0:s.id)??""),T.showToast("Copied User's ID to clipboard",R.getAssetIDByName("toast_copy_link"))})),y&&S.push(A("Copy User's Mention","Result: <Mention>","ic_copy_id",function(){var s;l.hideActionSheet(),n.clipboard.setString(`<@${(o==null||(s=o.author)===null||s===void 0?void 0:s.id)??""}>`),T.showToast("Copied User's Mention to clipboard",R.getAssetIDByName("toast_copy_link"))})),f&&S.push(A("Copy User's Id and Mention","Result: <Some ID> <Mention>","ic_copy_id",function(){var s,c;l.hideActionSheet(),n.clipboard.setString(`${(o==null||(s=o.author)===null||s===void 0?void 0:s.id)??""} <@${(o==null||(c=o.author)===null||c===void 0?void 0:c.id)??""}>`),T.showToast("Copied User to clipboard",R.getAssetIDByName("toast_copy_link"))})),S.reverse();const E=p||1;b.splice(p,1);for(const s of S)b.splice(E,0,n.React.createElement(n.React.Fragment,null,n.React.createElement(ot,{label:s?.label,subLabel:s?.sub,onPress:s?.callback,leading:s?.icon&&n.React.createElement(it,{style:{opacity:1},source:R.getAssetIDByName(s?.icon)})})))})})}}const{downloadMediaAsset:ut}=w.findByProps("downloadMediaAsset"),{FormRow:Re,FormIcon:be}=I;function ct(e,t,a,l){var i;!(r.storage===null||r.storage===void 0||(i=r.storage.toggle)===null||i===void 0)&&i.noshare&&t=="MediaShareActionSheet"&&e.then(function(o){const g=F.after("default",o,function(u,v){let[{syncer:d}]=u;n.React.useEffect(function(){return g()},[]);let h=d.sources[d.index.value];Array.isArray(h)&&(h=h[0]);const b=h.sourceURI??h.uri,p=v.props.children.props.children,A=Math.max(p.findIndex(function(f){var E,s,c;return(f==null||(E=f.props)===null||E===void 0?void 0:E.label)===(n.i18n===null||n.i18n===void 0||(s=n.i18n.Messages)===null||s===void 0?void 0:s.SHARE)||(f==null||(c=f.props)===null||c===void 0?void 0:c.label)==="Share"}),0),S=n.React.createElement(Re,{label:"Copy Image Link",subLabel:"Added by Azzy Util",leading:n.React.createElement(be,{style:{opacity:1},source:R.getAssetIDByName("ic_message_copy")}),onPress:function(){l.hideActionSheet(),n.clipboard.setString(b),T.showToast("Link copied")}}),_=n.React.createElement(Re,{label:"Save Image",subLabel:"Added by Azzy Util",leading:n.React.createElement(be,{style:{opacity:1},source:R.getAssetIDByName("ic_download_24px")}),onPress:function(){l.hideActionSheet(),ut(b,0),T.showToast("Downloading image",R.getAssetIDByName("toast_image_saved"))}}),y=[S];if(r.storage.utils.noshare.addSaveImage&&y.push(_),p)if(A>=0){p.splice(A,1);for(const f of y)p.splice(A,0,f)}else p.push(...y)})})}const k=w.findByProps("openLazy","hideActionSheet");function dt(){return F.before("openLazy",k,function(e){let[t,a,l]=e;C.isEnabled&&(st(t,a,l,k),ct(t,a,l,k),at(t,a,l,k))})}const{DCDChatManager:Ae}=n.ReactNative.NativeModules,gt=function(){return F.before("updateRows",Ae,function(e){if(C.isEnabled){let t=JSON.parse(e[1]);return t.forEach(function(a){ge(a)}),e[1]=JSON.stringify(t),e[1]}})},ft=function(){return F.after("updateRows",Ae,function(e){if(C.isEnabled){let t=JSON.parse(e[1]);return t.forEach(function(a){ge(a)}),e[1]=JSON.stringify(t),e[1]}})},Ee=w.findByProps("startTyping"),vt=function(){return F.instead("startTyping",Ee,function(){})},ht=function(){return F.instead("stopTyping",Ee,function(){})},me=w.findByProps("startEditMessage"),yt=function(){return F.before("startEditMessage",me,function(e){C.isEnabled&&rt(e)})},Rt=function(){return F.before("editMessage",me,function(e){C.isEnabled&&lt(e)})};function bt(e){return e?.avatarDecorationData&&(e.avatarDecorationData=null),e}const At=w.findByStoreName("UserStore"),Et=function(){return F.after("getUser",At,function(e,t){C.isEnabled&&bt(t)})},pe=["Rawr~","Nyaa","Don't touch my tail!","Maawww! Nappy!","Awowooo","I can chase butterflies all day!","Cuddles?!","These ears pick up everything :3","Shiny things~","Belly rubs, yay","Am cute","Snuggles","Tails","Pawbs","Boxes, owo","Feeling cuddly today!","Feeling cute"];function mt(e){var t,a;if(!(r.storage===null||r.storage===void 0||(t=r.storage.toggle)===null||t===void 0)&&t.cactus&&(e==null||(a=e.content)===null||a===void 0?void 0:a.length)>25&&Me(3)){var l,i;const o=Math.floor(Math.random()*pe.length);e.content=`${e?.content}

*${pe[o]}*  - \`${(r.storage===null||r.storage===void 0||(i=r.storage.utils)===null||i===void 0||(l=i.cactus)===null||l===void 0?void 0:l.name)||"Angel"}\``}}const pt=w.findByProps("sendMessage","receiveMessage");function Ct(){return F.before("sendMessage",pt,function(e){C.isEnabled&&mt(e[1])})}X(r.storage,{toggle:{ctime:!1,ralert:!1,notype:!1,quickid:!1,eml:!1,noshare:!1,removeDecor:!1,cactus:!1},utils:{cactus:{name:""},quickid:{addID:!1,addMention:!1,addCombine:!1},replyAlert:{customColor:"#000",gutterColor:"#FFF",colorAlpha:"33",gutterAlpha:"33",useReplyAlert:!1,useCustomColor:!1,ignoreSelf:!1},eml:{logEdit:!1,editedMsg:[]},noshare:{addSaveImage:!1,addCopyImage:!1}},debug:!1});let Ce=[],Se;C.isEnabled=!1,Ce.push(dt,tt,gt,ft,vt,ht,yt,Rt,Et,Ct);const St=function(){return Ce.forEach(function(e){return e()})},wt=function(){r.storage.utils.eml.editedMsg=[]};var Ft={onLoad:function(){var e;C.isEnabled=!0,Se=(e=St())===null||e===void 0?void 0:e.catch(function(t){console.log("AZZYUTIL, Crash On Load"),console.log(t),we.stopPlugin(r.id)})},onUnload:function(){C.isEnabled=!1,Se(),wt()},settings:Xe};return C.default=Ft,Object.defineProperty(C,"__esModule",{value:!0}),C})({},vendetta.plugin,vendetta.storage,vendetta,vendetta.metro,vendetta.ui.components,vendetta.metro.common,vendetta.ui,vendetta.ui.assets,vendetta.patcher,vendetta.utils,vendetta.ui.toasts,vendetta.plugins);
