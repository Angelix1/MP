(function(b,r,M,g,n,H,s,u,P,S,R,Ee,Se){"use strict";const{ScrollView:Nt,View:q,Text:Bt,TouchableOpacity:Dt,TextInput:Pt,Image:Ut,Animated:kt}=u.General,{FormLabel:xt,FormIcon:Fe,FormArrow:Lt,FormRow:U,FormSwitch:_t,FormSwitchRow:Ot,FormSection:Vt,FormDivider:we,FormInput:zt}=u.Forms,Ie=s.getAssetIDByName("ic_radio_square_checked_24px"),$e=s.getAssetIDByName("ic_radio_square_24px"),ve=s.getAssetIDByName("ic_information_24px");s.getAssetIDByName("ic_info");const Te=s.getAssetIDByName("premium_sparkles"),Me=s.getAssetIDByName("ic_sync_24px"),Ne=s.getAssetIDByName("ic_progress_wrench_24px"),F=n.stylesheet.createThemedStyleSheet({border:{borderRadius:10},textBody:{color:H.semanticColors.TEXT_NORMAL,fontFamily:n.constants.Fonts.PRIMARY_MEDIUM,letterSpacing:.25,fontSize:22},textBody:{color:H.semanticColors.INPUT_PLACEHOLDER_TEXT,fontFamily:n.constants.Fonts.DISPLAY_NORMAL,letterSpacing:.25,fontSize:16},versionBG:{margin:10,padding:15,backgroundColor:"rgba(55, 149, 225, 0.3)"},rowLabel:{margin:10,padding:15,backgroundColor:"rgba(33, 219, 222, 0.34)"}});function N(e){return n.React.createElement(Fe,{style:{opacity:1},source:e})}function Be(e){let{change:a,index:t,totalIndex:o}=e;const[l,p]=n.React.useState(!1);n.React.useState(!1);function f(m,h,d,y){return n.React.createElement(q,null,n.React.createElement(U,{label:h||"No Section",subLabel:d||null,leading:y&&N(y),style:[F.textHeader]}),m.map(function(A,C){return n.React.createElement(n.React.Fragment,null,n.React.createElement(U,{label:A,style:[F.textBody,F.rowLabel,F.border]}))}))}return n.React.createElement(n.React.Fragment,null,n.React.createElement(u.ErrorBoundary,null,n.React.createElement(U,{label:a?.version,leading:t==0?N(Ie):N($e),trailing:N(ve),onPress:function(){p(!l)}}),l&&n.React.createElement(q,{style:[F.versionBG,F.border]},a?.new?.length>0&&f(a.new,"New","New stuffies",Te),a?.updated?.length>0&&f(a.updated,"Changes","Update things",Me),a?.fix?.length>0&&f(a.fix,"Fixes","Me hate borken things",Ne)),t==o.length-1?void 0:n.React.createElement(we,null)))}const{openLazy:De,hideActionSheet:Gt}=g.findByProps("openLazy","hideActionSheet");function Q(e,a){if(e!=null&&a!=null)for(const t of Object.keys(a))typeof a[t]=="object"&&!Array.isArray(a[t])?(typeof e[t]!="object"&&(e[t]={}),Q(e[t],a[t])):e[t]??(e[t]=a[t])}function k(e,a){try{De(new Promise(function(t){return t({default:e})}),"ActionSheet",a)}catch(t){P.logger.error(t.stack),showToast("Got error when opening ActionSheet! Please check debug logs")}}function x(e){const a=e>>16&255,t=e>>8&255,o=e&255;return`#${(1<<24|a<<16|t<<8|o).toString(16).slice(1)}`}function B(e){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null,t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:null,o=arguments.length>3&&arguments[3]!==void 0?arguments[3]:null;return{version:e,new:a,updated:t,fix:o}}const J="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mJsrQAAAgwBAJ9P6qYAAAAASUVORK5CYII=";function Y(e){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"#000";e||(e=a);const t=e?.trim();if(t.startsWith("#")){const o=t.slice(1);if(/^[0-9A-Fa-f]{6}$/.test(o))return"#"+o.toUpperCase()}else if(/^[0-9A-Fa-f]{6}$/.test(t))return"#"+t.toUpperCase();return a}const c={toPercentage:function(e){return e=Number(e),e===0?0:e===1?100:Math.round(e*100)},toDecimal:function(e){e=Number(e);const a=Math.min(Math.max(e,0),100);return a===0?0:a===100?1:a/100},formatDecimal:function(e){return e=Number(e),e===0||e===1?e:e.toFixed(2)},alphaToHex:function(e){e=Number(e);const a=Math.min(Math.max(e,0),100),t=Math.round(a/100*255).toString(16).toUpperCase();return t.length===1?"0"+t:t},hexAlphaToPercent:function(e){const a=parseInt(e,16);return isNaN(a)?0:Math.round(a/255*100)}};function Pe(e){return Math.random()<e/100}function E(){for(var e=arguments.length,a=new Array(e),t=0;t<e;t++)a[t]=arguments[t];return[...a]}var L=[B("1.0.0",E("Created the Plugin")),B("1.0.1 - 1.0.3",E("[1.0.1] Added Remove Decor","[1.0.1] Customization for reply alert","[1.0.1] Option to revert locally edited message (wipe on unload of the plugin)","[1.0.22] Setting for Quick Id","[1.0.22] Option to toggle Force alert","[1.0.22] Preview for ReplyAlert"),E("[1.0.2] Remove Custom Timestamp","[1.0.24] EML will wipe its log when onunload and revert every message its edit","[1.0.3] Update EML, QID buttons"),E("[1.0.21] Fix Cactus","[1.0.22] Fix No Share fails to find Share button","[1.0.23] Fix Quick ID removing edit message button","[1.0.3] Fixed EML button fails to append under Reply Button","[1.0.3] Fixed QID buttons fails to append to a correct place")),B("1.1",E("[1.1.0] Added Custom Username Color","[1.1.0] Added Custom Role Icon"),E("[1.1.0] Separated reply alert and custom mention to be their own thing")),B("1.2",null,E("[1.2] Removed EML due possibly harmful use case"))].reverse();const{ScrollView:qt,View:_,Text:j,TouchableOpacity:Z,TextInput:Qt,Pressable:Jt,Image:K,Animated:Yt,Component:jt}=u.General,{FormLabel:Zt,FormIcon:Kt,FormArrow:Wt,FormRow:I,FormSwitch:W,FormSwitchRow:Xt,FormSection:ea,FormDivider:$,FormInput:ta,FormRadioRow:aa,FormSliderRow:X}=u.Forms,ee=g.findByName("CustomColorPickerActionSheet");function Ue(){M.useProxy(r.storage);const e=r.storage.utils.replyAlert;return n.React.createElement(n.React.Fragment,null,n.React.createElement(I,{label:"Toggle Force Alert",subLabel:"When someone replying to your message with mention disabled, this option will force ping you",trailing:n.React.createElement(W,{value:e?.useReplyAlert||!1,onValueChange:function(a){e.useReplyAlert=a}})}),n.React.createElement($,null),n.React.createElement(I,{label:"Ignore self Reply",subLabel:"When replying to own message, do not ping",trailing:n.React.createElement(W,{value:e?.ignoreSelf||!1,onValueChange:function(a){e.ignoreSelf=a}})}))}function ke(){M.useProxy(r.storage);const e=r.storage.utils.replyAlert,[a,t]=n.React.useState(c.toDecimal(c.hexAlphaToPercent(e.colorAlpha)||100)),[o,l]=n.React.useState(c.toDecimal(c.hexAlphaToPercent(e.gutterAlpha)||100)),p=function(){return k(ee,{color:n.ReactNative.processColor(e?.customColor)||0,onSelect:function(m){const h=x(m);e.customColor=h,r.storage?.debug&&P.logger.log("Reply Alert BG Color","[Changed]",h)}})},f=function(){return k(ee,{color:n.ReactNative.processColor(e?.customColor)||0,onSelect:function(m){const h=x(m);e.gutterColor=h,r.storage?.debug&&P.logger.log("Reply Alert Gutter Color","[Changed]",h)}})};return n.React.createElement(n.React.Fragment,null,n.React.createElement(I,{label:"Preview",subLabel:"How it looks in the chat"}),n.React.createElement(_,{style:[{flexDirection:"row",height:80,width:"100%",overflow:"hidden",borderRadius:12,marginBottom:20,marginRight:10,marginLeft:10}]},n.React.createElement(_,{style:{width:"2%",backgroundColor:`${e?.gutterColor}${c.alphaToHex(c.toPercentage(o))}`}}),n.React.createElement(_,{style:{flex:1,backgroundColor:`${e?.customColor}${c.alphaToHex(c.toPercentage(a))}`,justifyContent:"center",alignItems:"center"}},n.React.createElement(j,{style:{fontSize:20,color:"#FFFFFF"}}," Example White Text "),n.React.createElement(j,{style:{fontSize:20,color:"#000000"}}," Example Black Text "))),n.React.createElement($,null),n.React.createElement(I,{label:"Background Color",subLabel:"Click to Update",onPress:p,trailing:n.React.createElement(Z,{onPress:p},n.React.createElement(K,{source:{uri:J},style:{width:128,height:128,borderRadius:10,backgroundColor:e?.customColor||"#000"}}))}),n.React.createElement($,null),n.React.createElement(I,{label:"Gutter Color",subLabel:"Click to Update",onPress:f,trailing:n.React.createElement(Z,{onPress:f},n.React.createElement(K,{source:{uri:J},style:{width:128,height:128,borderRadius:10,backgroundColor:e?.gutterColor||"#000"}}))}),n.React.createElement($,null),n.React.createElement(X,{label:`Background Color Alpha: ${c.toPercentage(a)}%`,value:a,style:{width:"90%"},onValueChange:function(m){t(Number(c.formatDecimal(m))),e.colorAlpha=c.alphaToHex(c.toPercentage(m))}}),n.React.createElement($,null),n.React.createElement(X,{label:`Gutter Color Alpha: ${c.toPercentage(o)}%`,value:o,style:{width:"90%"},onValueChange:function(m){l(Number(c.formatDecimal(m))),e.gutterAlpha=c.alphaToHex(c.toPercentage(m))}}))}const{FormRow:xe,FormSwitch:Le}=u.Forms;function _e(){return React.createElement(React.Fragment,null,React.createElement(xe,{label:"Add Save Image Button to Image ActionSheet",subLabel:"if Built-in Save Image gone",trailing:React.createElement(Le,{value:r.storage?.utils?.noshare?.addSaveImage||!1,onValueChange:function(e){r.storage.utils.noshare.addSaveImage=e}})}))}const{FormInput:Oe}=u.Forms;function Ve(){return React.createElement(React.Fragment,null,React.createElement(Oe,{title:"Name",keyboardType:"default",placeholder:"Angel",value:r.storage?.utils?.cactus?.name,onChange:function(e){return r.storage.utils.cactus.name=e.toString()}}))}const{FormRow:ze,FormSwitch:Ge,FormDivider:te}=u.Forms;function He(){M.useProxy(r.storage);const e=function(t,o,l){return{label:t,subLabel:o,key:l}},a=[e("Id","add Copy User Id","addID"),e("Mention","add Copy User Mention","addMention"),e("Id and Mention","add Copy User Id & Mention","addCombine")];return n.React.createElement(n.React.Fragment,null,a.map(function(t,o){return n.React.createElement(n.React.Fragment,null,n.React.createElement(ze,{label:t?.label||"Missing Label",subLabel:t?.subLabel,trailing:n.React.createElement(Ge,{value:r.storage?.utils?.quickid?.[t?.key]||!1,onValueChange:function(l){r.storage.utils.quickid[t.key]=l}})}),o!==a?.length-1&&n.React.createElement(te,null))}),n.React.createElement(te,null))}const qe=g.findByName("CustomColorPickerActionSheet"),{ScrollView:na,View:ra,Text:oa,TouchableOpacity:Qe,TextInput:la,Pressable:sa,Image:Je,Animated:ca,Component:ia}=u.General,{FormLabel:ua,FormIcon:Ye,FormArrow:da,FormRow:ae,FormSwitch:je,FormSwitchRow:ga,FormSection:fa,FormDivider:ne,FormInput:ma,FormRadioRow:ha}=u.Forms,re=[{id:"enableReply",label:"Patch reply",subLabel:"also replace username color in mentioned referenced message",icon:null,def:!1}];function Ze(){const e=r.storage?.utils?.customUsernameColor,a=function(){return k(qe,{color:n.ReactNative.processColor(e?.hex)||0,onSelect:function(t){const o=x(t);e.hex=o}})};return React.createElement(React.Fragment,null,React.createElement(ae,{label:"Color",subLabel:"Click to Update",onPress:a,trailing:React.createElement(Qe,{onPress:a},React.createElement(Je,{source:{uri:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mJsrQAAAgwBAJ9P6qYAAAAASUVORK5CYII="},style:{width:128,height:128,borderRadius:10,backgroundColor:e?.hex||"#000000"}}))}),React.createElement(ne,null),re?.map(function(t,o){return React.createElement(React.Fragment,null,React.createElement(ae,{label:t?.label,subLabel:t?.subLabel,leading:t?.icon&&React.createElement(Ye,{style:{opacity:1},source:s.getAssetIDByName(t?.icon)}),trailing:"id"in t?React.createElement(je,{value:r.storage?.utils?.customUsernameColor[t?.id]??t?.def,onValueChange:function(l){return r.storage.utils.customUsernameColor[t?.id]=l}}):void 0}),o!==re?.length-1&&React.createElement(ne,null))}))}const oe="https://cdn.discordapp.com/role-icons/1222207470714486825/bc3ef24c3f220155f90e55cc0cb0d0cf.png?size=512",{ScrollView:ba,View:Ra,Text:pa,TouchableOpacity:Ke,TextInput:ya,Pressable:Aa,Image:We,Animated:Ca,Component:Ea}=u.General,{FormLabel:Sa,FormIcon:Fa,FormArrow:wa,FormRow:Xe,FormSwitch:Ia,FormSwitchRow:$a,FormSection:va,FormDivider:le,FormInput:et,FormRadioRow:Ta}=u.Forms,se=[{id:"name",label:"Role Icon Name",keyType:"default",placeholder:"BlobCatSip",def:"BlobCatSip"},{id:"source",label:"Role Icon Image Url",keyType:"default",placeholder:"https://cdn.discordapp.com/role-icons/1222207470714486825/bc3ef24c3f220155f90e55cc0cb0d0cf.png?size=512",def:oe},{id:"size",label:"Size of the Image",keyType:"number",placeholder:"18",def:18}];function tt(){const e=r.storage?.utils?.customRoleIcon,a=function(){n.clipboard.setString("https://cdn.discordapp.com/role-icons/1222207470714486825/bc3ef24c3f220155f90e55cc0cb0d0cf.png?size=512"),S.showToast("Copied placeholder URL",s.getAssetIDByName("toast_copy_link"))};return React.createElement(React.Fragment,null,React.createElement(Xe,{label:"Icon Preview",trailing:React.createElement(Ke,{onPress:a},React.createElement(We,{source:{uri:e?.source||oe},style:{width:128,height:128,borderRadius:10}}))}),React.createElement(le,null),se?.map(function(t,o){return React.createElement(React.Fragment,null,React.createElement(et,{title:t.label,keyboardType:t?.keyType,placeholder:t?.placeholder,value:e[t?.id]??t?.def,onChange:function(l){return e[t?.id]=l.toString()}}),o!==se?.length-1&&React.createElement(le,null))}))}const{ScrollView:at,View:D,Text:Ma,TouchableOpacity:Na,TextInput:Ba,Pressable:Da,Image:Pa,Animated:Ua,Component:ka}=u.General,{FormLabel:xa,FormIcon:La,FormArrow:_a,FormRow:ce,FormSwitch:ie,FormSwitchRow:Oa,FormSection:ue,FormDivider:de,FormInput:Va,FormRadioRow:za}=u.Forms;function nt(){M.useProxy(r.storage);const e=function(t,o,l,p,f){return{id:t,title:o,label:l,subLabel:p,props:f}},a=[e("cactus","Cactus","Toggle uhhh.. something",null,Ve),e("notype","No Type","Toggle No Typings",null,null),e("quickid","QID","Toggle Quick ID Setting",null,He),e("noshare","No Share","Toggle No Share",null,_e),e("customUsernameColor","CUC","Toggle Custom Username Color",null,Ze),e("customRoleIcon","CRI","Toggle Custom Role Icon",null,tt),e("ralert","Reply Alert","Toggle Settings",null,Ue),e("customMention","Custom Mentions","Toggle Custom Mentions Settings",null,ke),e("removeDecor","I HATE AVATAR DECORATIONS","Toggle Remove Avatar Decoration",null,null)];return React.createElement(React.Fragment,null,React.createElement(at,null,React.createElement(D,{style:{borderRadius:10,backgroundColor:"rgba(0, 12, 46, 0.15)"}},React.createElement(ce,{label:"Debug",subLabel:"enable console logging",trailing:React.createElement(ie,{value:r.storage.debug,onValueChange:function(t){r.storage.debug=t}})}),React.createElement(de,null),a.map(function(t,o){return React.createElement(React.Fragment,null,React.createElement(ue,{title:t?.title},React.createElement(ce,{label:t?.label,subLabel:t?.subLabel,trailing:React.createElement(ie,{value:r.storage.toggle[t?.id],onValueChange:function(l){r.storage.toggle[t?.id]=l}})}),r.storage.toggle[t.id]&&t.props&&React.createElement(D,{style:{margin:5,padding:10,borderRadius:10,backgroundColor:"rgba(0, 0, 0, 0.15)"}},React.createElement(t.props,null))))})),React.createElement(de,null),L&&React.createElement(D,{style:{paddingBottom:36}},React.createElement(ue,{title:"Updates"},React.createElement(D,{style:{margin:5,padding:5,borderRadius:10,backgroundColor:"rgba(59, 30, 55, 0.15)"}},L.map(function(t,o){return React.createElement(Be,{change:t,index:o,totalIndex:L.length})}))))))}const rt=g.findByStoreName("UserStore");g.findByProps("getMessage","getMessages");const v=rt?.getCurrentUser?.()?.id;function ot(e){if(e.type=="MESSAGE_CREATE"){const a=e?.message?.referenced_message?.author?.id==v,t=e?.message?.mentions?.some(function(o){return o?.id===v});r.storage?.utils?.replyAlert?.useReplyAlert&&(a||t)&&(e?.message?.author?.id!=v?e.message.mentions.push({id:v}):r.storage?.utils?.replyAlert?.ignoreSelf==!1&&e.message.mentions.push({id:v}))}}function ge(e){const{gutterColor:a,customColor:t,gutterAlpha:o,colorAlpha:l}=r.storage?.utils?.replyAlert;if(r.storage?.toggle?.customMention&&e?.message?.mentioned){e.backgroundHighlight??(e.backgroundHighlight={});const p=Y(t,"#DAFFFF"),f=Y(a,"#121212");e.backgroundHighlight={backgroundColor:n.ReactNative.processColor(`${p}${l}`),gutterColor:n.ReactNative.processColor(`${f}${o}`)}}return e}function lt(){return R.before("dispatch",n.FluxDispatcher,function(e){let[a]=e;b.isEnabled&&ot(a)})}const{ActionSheetRow:fe}=g.findByProps("ActionSheetRow");function st(e,a,t,o){if(a=="MessageLongPressActionSheet"&&r.storage?.toggle?.quickid){const l=t?.message;if(!l)return;e.then(function(p){const f=R.after("default",p,function(m,h){n.React.useEffect(function(){return function(){f()}},[]);const d=Ee.findInReactTree(h,function(i){return i?.find?.(function(w){return w?.props?.label==n.i18n?.Messages?.MENTION})});if(!d)return h;const y=Math.max(d.findIndex(function(i){return i?.props?.label==n.i18n?.Messages?.MENTION}),d.length-1);r.storage.debug&&(console.log(d),console.log("Position => "+y));function A(i,w,Tt,Mt){return{label:i,sub:w,icon:Tt,callback:Mt}}let C=[];const{addID:z,addMention:G,addCombine:T}=r.storage?.utils?.quickid;z&&C.push(A("Copy User's Id","Result: <Some ID>","ic_copy_id",function(){o.hideActionSheet(),n.clipboard.setString(l?.author?.id??""),S.showToast("Copied User's ID to clipboard",s.getAssetIDByName("toast_copy_link"))})),G&&C.push(A("Copy User's Mention","Result: <Mention>","ic_copy_id",function(){o.hideActionSheet(),n.clipboard.setString(`<@${l?.author?.id??""}>`),S.showToast("Copied User's Mention to clipboard",s.getAssetIDByName("toast_copy_link"))})),T&&C.push(A("Copy User's Id and Mention","Result: <Some ID> <Mention>","ic_copy_id",function(){o.hideActionSheet(),n.clipboard.setString(`${l?.author?.id??""} <@${l?.author?.id??""}>`),S.showToast("Copied User to clipboard",s.getAssetIDByName("toast_copy_link"))})),C.reverse(),y>=0&&d.splice(y,1);for(const i of C){const w=n.React.createElement(n.React.Fragment,null,n.React.createElement(fe,{label:i?.label,subLabel:i?.sub,icon:i?.icon&&n.React.createElement(fe.Icon,{source:s.getAssetIDByName(i?.icon)}),onPress:i?.callback}));y>=0?d.splice(y,0,w):d.push(w)}})})}}const{downloadMediaAsset:ct}=g.findByProps("downloadMediaAsset"),{FormRow:me,FormIcon:he}=u.Forms;function it(e,a,t,o){r.storage?.toggle?.noshare&&a=="MediaShareActionSheet"&&e.then(function(l){const p=R.after("default",l,function(f,m){let[{syncer:h}]=f;n.React.useEffect(function(){return p()},[]);let d=h.sources[h.index.value];Array.isArray(d)&&(d=d[0]);const y=d.sourceURI??d.uri,A=m.props.children.props.children,C=A.findIndex(function(i){return i?.props?.label===n.i18n?.Messages?.SHARE||i?.props?.label==="Share"}),z=n.React.createElement(me,{label:"Copy Image Link",subLabel:"Added by Azzy Util",leading:n.React.createElement(he,{style:{opacity:1},source:s.getAssetIDByName("ic_message_copy")}),onPress:function(){o.hideActionSheet(),n.clipboard.setString(y),S.showToast("Link copied")}}),G=n.React.createElement(me,{label:"Save Image",subLabel:"Added by Azzy Util",leading:n.React.createElement(he,{style:{opacity:1},source:s.getAssetIDByName("ic_download_24px")}),onPress:function(){o.hideActionSheet(),ct(y,0),S.showToast("Downloading image",s.getAssetIDByName("toast_image_saved"))}}),T=[z];if(r.storage.utils.noshare.addSaveImage&&T.push(G),A)if(C>=0){A.splice(C,1);for(const i of T)A.splice(C,0,i)}else A.push(...T)})})}const O=g.findByProps("openLazy","hideActionSheet");function ut(){return R.before("openLazy",O,function(e){let[a,t,o]=e;b.isEnabled&&(st(a,t,o,O),it(a,t,o,O))})}const be=g.findByStoreName("UserStore");function dt(e){if(e?.message){let{hex:a,enableReply:t}=r.storage?.utils?.customUsernameColor;a??(a="#000"),t??(t=!1);const o=function(l){return a&&(l.usernameColor=n.ReactNative.processColor(a)),l};return r.storage?.debug&&console.log("[AZZYUTILS cuc.js]",e.message.authorId,e?.message?.referencedMessage?.message?.authorId),be?.getCurrentUser?.()?.id==e?.message?.authorId&&o(e?.message),t&&e?.message?.referencedMessage?.message&&be?.getCurrentUser?.()?.id==e?.message?.referencedMessage?.message?.authorId&&o(e?.message?.referencedMessage?.message),e}}const gt=g.findByStoreName("UserStore");function ft(e){if(e?.message){if(gt?.getCurrentUser?.()?.id==e?.message?.authorId){const a=r.storage?.utils?.customRoleIcon;let t={};!a?.name&&!a?.source&&!a?.size?t={name:"BlobCatSip",source:"https://cdn.discordapp.com/role-icons/1222207470714486825/bc3ef24c3f220155f90e55cc0cb0d0cf.png?size=512",alt:"Role icon, BlobCatSip",size:18}:(t.name=a.name,t.source=a.source,t.size=a.size,t.alt=`Role icon, ${a.name}`),e.message.roleIcon=t}return e}}const{DCDChatManager:Re}=n.ReactNative.NativeModules,mt=function(){return R.before("updateRows",Re,function(e){if(b.isEnabled){let a=JSON.parse(e[1]);return r.storage?.debug&&console.log("[AZZYUTILS update_rows.js] ========== updateRows rows =========="),a.forEach(function(t){r.storage?.debug&&console.log(t),ge(t),r.storage?.toggle?.customUsernameColor&&dt(t),r.storage?.toggle?.customRoleIcon&&ft(t)}),r.storage?.debug&&console.log("====================================="),e[1]=JSON.stringify(a),e[1]}})},ht=function(){return R.after("updateRows",Re,function(e){if(b.isEnabled){let a=JSON.parse(e[1]);return a.forEach(function(t){ge(t)}),e[1]=JSON.stringify(a),e[1]}})},pe=g.findByProps("startTyping"),bt=function(){return R.instead("startTyping",pe,function(){})},Rt=function(){return R.instead("stopTyping",pe,function(){})},ye=g.findByProps("startEditMessage"),pt=function(){return R.before("startEditMessage",ye,function(e){})},yt=function(){return R.before("editMessage",ye,function(e){})};function At(e){return e?.avatarDecorationData&&r.storage?.toggle?.removeDecor&&(e.avatarDecorationData=null),e}const Ct=g.findByStoreName("UserStore"),Et=function(){return R.after("getUser",Ct,function(e,a){b.isEnabled&&At(a)})},Ae=["Rawr~","Nyaa","Don't touch my tail!","Maawww! Nappy!","Awowooo","I can chase butterflies all day!","Cuddles?!","These ears pick up everything :3","Shiny things~","Belly rubs, yay","Am cute","Snuggles","Tails","Pawbs","Boxes, owo","Feeling cuddly today!","Feeling cute"];function St(e){if(r.storage?.toggle?.cactus&&e?.content?.length>25&&Pe(3)){const a=Math.floor(Math.random()*Ae.length);e.content=`${e?.content}

*${Ae[a]}*  - \`${r.storage?.utils?.cactus?.name||"Angel"}\``}}const Ft=g.findByProps("sendMessage","receiveMessage");function wt(){return R.before("sendMessage",Ft,function(e){b.isEnabled&&St(e[1])})}Q(r.storage,{toggle:{ctime:!1,ralert:!1,customMention:!1,notype:!1,quickid:!1,eml:!1,noshare:!1,removeDecor:!1,cactus:!1,customUsernameColor:!1,customRoleIcon:!1,customClan:!1},utils:{cactus:{name:""},quickid:{addID:!1,addMention:!1,addCombine:!1},replyAlert:{customColor:"#000",gutterColor:"#FFF",colorAlpha:"33",gutterAlpha:"33",useReplyAlert:!1,useCustomColor:!1,ignoreSelf:!1},eml:{logEdit:!1,editedMsg:[]},noshare:{addSaveImage:!1,addCopyImage:!1},customUsernameColor:{hex:"#FFFFFF",enableReply:!1},customRoleIcon:{name:"BlobCatSip",source:"https://cdn.discordapp.com/role-icons/1222207470714486825/bc3ef24c3f220155f90e55cc0cb0d0cf.png?size=512",size:18,showOthers:!1},customClan:{icon:"",tag:""}},debug:!1});let V=[],Ce;b.isEnabled=!1,V.push(ut,lt,mt,ht,pt,yt,Et,wt);const It=function(){return V.forEach(function(e){return e()})},$t=function(){r.storage.utils.eml.editedMsg.forEach(function(e){n.FluxDispatcher.dispatch({type:"MESSAGE_UPDATE",message:e,otherPluginBypass:!0})}),r.storage.utils.eml.editedMsg=[]};var vt={onLoad:function(){b.isEnabled=!0,r.storage?.toggle?.notype&&V.push(bt,Rt),Ce=It()?.catch(function(e){console.log("AZZYUTIL, Crash On Load"),console.log(e),Se.stopPlugin(r.id)})},onUnload:function(){b.isEnabled=!1,Ce(),$t()},settings:nt};return b.default=vt,Object.defineProperty(b,"__esModule",{value:!0}),b})({},vendetta.plugin,vendetta.storage,vendetta.metro,vendetta.metro.common,vendetta.ui,vendetta.ui.assets,vendetta.ui.components,vendetta,vendetta.ui.toasts,vendetta.patcher,vendetta.utils,vendetta.plugins);
