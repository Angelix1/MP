(function(exports,metro,patcher,plugin,assets,toasts,storage,components,common,ui){'use strict';function emoji(text) {
  const emojis = "\u{1F604} \u{1F603} \u{1F600} \u{1F60A} \u263A \u{1F609} \u{1F60D} \u{1F618} \u{1F61A} \u{1F617} \u{1F619} \u{1F61C} \u{1F61D} \u{1F61B} \u{1F633} \u{1F601} \u{1F614} \u{1F60C} \u{1F612} \u{1F61E} \u{1F623} \u{1F622} \u{1F602} \u{1F62D} \u{1F62A} \u{1F625} \u{1F630} \u{1F605} \u{1F613} \u{1F629} \u{1F62B} \u{1F628} \u{1F631} \u{1F620} \u{1F621} \u{1F624} \u{1F616} \u{1F606} \u{1F60B} \u{1F637} \u{1F60E} \u{1F634} \u{1F635} \u{1F632} \u{1F61F} \u{1F626} \u{1F627} \u{1F608} \u{1F47F} \u{1F62E} \u{1F62C} \u{1F610} \u{1F615} \u{1F62F} \u{1F636} \u{1F607} \u{1F60F} \u{1F611} \u{1F472} \u{1F473} \u{1F46E} \u{1F477} \u{1F482} \u{1F476} \u{1F466} \u{1F467} \u{1F468} \u{1F469} \u{1F474} \u{1F475} \u{1F471} \u{1F47C} \u{1F478} \u{1F63A} \u{1F638} \u{1F63B} \u{1F63D} \u{1F63C} \u{1F640} \u{1F63F} \u{1F639} \u{1F63E} \u{1F479} \u{1F47A} \u{1F648} \u{1F649} \u{1F64A} \u{1F480} \u{1F47D} \u{1F4A9} \u{1F525} \u2728 \u{1F31F} \u{1F4AB} \u{1F4A5} \u{1F4A2} \u{1F4A6} \u{1F4A7} \u{1F4A4} \u{1F4A8} \u{1F442} \u{1F440} \u{1F443} \u{1F445} \u{1F444} \u{1F44D} \u{1F44E} \u{1F44C} \u{1F44A} \u270A \u270C \u{1F44B} \u270B \u{1F450} \u{1F446} \u{1F447} \u{1F449} \u{1F448} \u{1F64C} \u{1F64F} \u261D \u{1F44F} \u{1F4AA} \u{1F6B6} \u{1F3C3} \u{1F483} \u{1F46B} \u{1F46A} \u{1F46C} \u{1F46D} \u{1F48F} \u{1F491} \u{1F46F} \u{1F646} \u{1F645} \u{1F481} \u{1F64B} \u{1F486} \u{1F487} \u{1F485} \u{1F470} \u{1F64E} \u{1F64D} \u{1F647} \u{1F3A9} \u{1F451} \u{1F452} \u{1F45F} \u{1F45E} \u{1F461} \u{1F460} \u{1F462} \u{1F455} \u{1F454} \u{1F45A} \u{1F457} \u{1F3BD} \u{1F456} \u{1F458} \u{1F459} \u{1F4BC} \u{1F45C} \u{1F45D} \u{1F45B} \u{1F453} \u{1F380} \u{1F302} \u{1F484} \u{1F49B} \u{1F499} \u{1F49C} \u{1F49A} \u2764 \u{1F494} \u{1F497} \u{1F493} \u{1F495} \u{1F496} \u{1F49E} \u{1F498} \u{1F48C} \u{1F48B} \u{1F48D} \u{1F48E} \u{1F464} \u{1F465} \u{1F4AC} \u{1F463} \u{1F4AD} \u{1F436} \u{1F43A} \u{1F431} \u{1F42D} \u{1F439} \u{1F430} \u{1F438} \u{1F42F} \u{1F428} \u{1F43B} \u{1F437} \u{1F43D} \u{1F42E} \u{1F417} \u{1F435} \u{1F412} \u{1F434} \u{1F411} \u{1F418} \u{1F43C} \u{1F427} \u{1F426} \u{1F424} \u{1F425} \u{1F423} \u{1F414} \u{1F40D} \u{1F422} \u{1F41B} \u{1F41D} \u{1F41C} \u{1F41E} \u{1F40C} \u{1F419} \u{1F41A} \u{1F420} \u{1F41F} \u{1F42C} \u{1F433} \u{1F40B} \u{1F404} \u{1F40F} \u{1F400} \u{1F403} \u{1F405} \u{1F407} \u{1F409} \u{1F40E} \u{1F410} \u{1F413} \u{1F415} \u{1F416} \u{1F401} \u{1F402} \u{1F432} \u{1F421} \u{1F40A} \u{1F42B} \u{1F42A} \u{1F406} \u{1F408} \u{1F429} \u{1F43E} \u{1F490} \u{1F338} \u{1F337} \u{1F340} \u{1F339} \u{1F33B} \u{1F33A} \u{1F341} \u{1F343} \u{1F342} \u{1F33F} \u{1F33E} \u{1F344} \u{1F335} \u{1F334} \u{1F332} \u{1F333} \u{1F330} \u{1F331} \u{1F33C} \u{1F310} \u{1F31E} \u{1F31D} \u{1F31A} \u{1F311} \u{1F312} \u{1F313} \u{1F314} \u{1F315} \u{1F316} \u{1F317} \u{1F318} \u{1F31C} \u{1F31B} \u{1F319} \u{1F30D} \u{1F30E} \u{1F30F} \u{1F30B} \u{1F30C} \u{1F320} \u2B50 \u2600 \u26C5 \u2601 \u26A1 \u2614 \u2744 \u26C4 \u{1F300} \u{1F301} \u{1F308} \u{1F30A} \u{1F38D} \u{1F49D} \u{1F38E} \u{1F392} \u{1F393} \u{1F38F} \u{1F386} \u{1F387} \u{1F390} \u{1F391} \u{1F383} \u{1F47B} \u{1F385} \u{1F384} \u{1F381} \u{1F38B} \u{1F389} \u{1F38A} \u{1F388} \u{1F38C} \u{1F52E} \u{1F3A5} \u{1F4F7} \u{1F4F9} \u{1F4FC} \u{1F4BF} \u{1F4C0} \u{1F4BD} \u{1F4BE} \u{1F4BB} \u{1F4F1} \u260E \u{1F4DE} \u{1F4DF} \u{1F4E0} \u{1F4E1} \u{1F4FA} \u{1F4FB} \u{1F50A} \u{1F509} \u{1F508} \u{1F507} \u{1F514} \u{1F515} \u{1F4E2} \u{1F4E3} \u23F3 \u231B \u23F0 \u231A \u{1F513} \u{1F512} \u{1F50F} \u{1F510} \u{1F511} \u{1F50E} \u{1F4A1} \u{1F526} \u{1F506} \u{1F505} \u{1F50C} \u{1F50B} \u{1F50D} \u{1F6C1} \u{1F6C0} \u{1F6BF} \u{1F6BD} \u{1F527} \u{1F529} \u{1F528} \u{1F6AA} \u{1F6AC} \u{1F4A3} \u{1F52B} \u{1F52A} \u{1F48A} \u{1F489} \u{1F4B0} \u{1F4B4} \u{1F4B5} \u{1F4B7} \u{1F4B6} \u{1F4B3} \u{1F4B8} \u{1F4F2} \u{1F4E7} \u{1F4E5} \u{1F4E4} \u2709 \u{1F4E9} \u{1F4E8} \u{1F4EF} \u{1F4EB} \u{1F4EA} \u{1F4EC} \u{1F4ED} \u{1F4EE} \u{1F4E6} \u{1F4DD} \u{1F4C4} \u{1F4C3} \u{1F4D1} \u{1F4CA} \u{1F4C8} \u{1F4C9} \u{1F4DC} \u{1F4CB} \u{1F4C5} \u{1F4C6} \u{1F4C7} \u{1F4C1} \u{1F4C2} \u2702 \u{1F4CC} \u{1F4CE} \u2712 \u270F \u{1F4CF} \u{1F4D0} \u{1F4D5} \u{1F4D7} \u{1F4D8} \u{1F4D9} \u{1F4D3} \u{1F4D4} \u{1F4D2} \u{1F4DA} \u{1F4D6} \u{1F516} \u{1F4DB} \u{1F52C} \u{1F52D} \u{1F4F0} \u{1F3A8} \u{1F3AC} \u{1F3A4} \u{1F3A7} \u{1F3BC} \u{1F3B5} \u{1F3B6} \u{1F3B9} \u{1F3BB} \u{1F3BA} \u{1F3B7} \u{1F3B8} \u{1F47E} \u{1F3AE} \u{1F0CF} \u{1F3B4} \u{1F004} \u{1F3B2} \u{1F3AF} \u{1F3C8} \u{1F3C0} \u26BD \u26BE \u{1F3BE} \u{1F3B1} \u{1F3C9} \u{1F3B3} \u26F3 \u{1F6B5} \u{1F6B4} \u{1F3C1} \u{1F3C7} \u{1F3C6} \u{1F3BF} \u{1F3C2} \u{1F3CA} \u{1F3C4} \u{1F3A3} \u2615 \u{1F375} \u{1F376} \u{1F37C} \u{1F37A} \u{1F37B} \u{1F378} \u{1F379} \u{1F377} \u{1F374} \u{1F355} \u{1F354} \u{1F35F} \u{1F357} \u{1F356} \u{1F35D} \u{1F35B} \u{1F364} \u{1F371} \u{1F363} \u{1F365} \u{1F359} \u{1F358} \u{1F35A} \u{1F35C} \u{1F372} \u{1F362} \u{1F361} \u{1F373} \u{1F35E} \u{1F369} \u{1F36E} \u{1F366} \u{1F368} \u{1F367} \u{1F382} \u{1F370} \u{1F36A} \u{1F36B} \u{1F36C} \u{1F36D} \u{1F36F} \u{1F34E} \u{1F34F} \u{1F34A} \u{1F34B} \u{1F352} \u{1F347} \u{1F349} \u{1F353} \u{1F351} \u{1F348} \u{1F34C} \u{1F350} \u{1F34D} \u{1F360} \u{1F346} \u{1F345} \u{1F33D} \u{1F3E0} \u{1F3E1} \u{1F3EB} \u{1F3E2} \u{1F3E3} \u{1F3E5} \u{1F3E6} \u{1F3EA} \u{1F3E9} \u{1F3E8} \u{1F492} \u26EA \u{1F3EC} \u{1F3E4} \u{1F307} \u{1F306} \u{1F3EF} \u{1F3F0} \u26FA \u{1F3ED} \u{1F5FC} \u{1F5FE} \u{1F5FB} \u{1F304} \u{1F305} \u{1F303} \u{1F5FD} \u{1F309} \u{1F3A0} \u{1F3A1} \u26F2 \u{1F3A2} \u{1F6A2} \u26F5 \u{1F6A4} \u{1F6A3} \u2693 \u{1F680} \u2708 \u{1F4BA} \u{1F681} \u{1F682} \u{1F68A} \u{1F689} \u{1F69E} \u{1F686} \u{1F684} \u{1F685} \u{1F688} \u{1F687} \u{1F69D} \u{1F68B} \u{1F683} \u{1F68E} \u{1F68C} \u{1F68D} \u{1F699} \u{1F698} \u{1F697} \u{1F695} \u{1F696} \u{1F69B} \u{1F69A} \u{1F6A8} \u{1F693} \u{1F694} \u{1F692} \u{1F691} \u{1F690} \u{1F6B2} \u{1F6A1} \u{1F69F} \u{1F6A0} \u{1F69C} \u{1F488} \u{1F68F} \u{1F3AB} \u{1F6A6} \u{1F6A5} \u26A0 \u{1F6A7} \u{1F530} \u26FD \u{1F3EE} \u{1F3B0} \u2668 \u{1F5FF} \u{1F3AA} \u{1F3AD} \u{1F4CD} \u{1F6A9} \u2B06 \u2B07 \u2B05 \u27A1 \u{1F520} \u{1F521} \u{1F524} \u2197 \u2196 \u2198 \u2199 \u2194 \u2195 \u{1F504} \u25C0 \u25B6 \u{1F53C} \u{1F53D} \u21A9 \u21AA \u2139 \u23EA \u23E9 \u23EB \u23EC \u2935 \u2934 \u{1F197} \u{1F500} \u{1F501} \u{1F502} \u{1F195} \u{1F199} \u{1F192} \u{1F193} \u{1F196} \u{1F4F6} \u{1F3A6} \u{1F201} \u{1F22F} \u{1F233} \u{1F235} \u{1F234} \u{1F232} \u{1F250} \u{1F239} \u{1F23A} \u{1F236} \u{1F21A} \u{1F6BB} \u{1F6B9} \u{1F6BA} \u{1F6BC} \u{1F6BE} \u{1F6B0} \u{1F6AE} \u{1F17F} \u267F \u{1F6AD} \u{1F237} \u{1F238} \u{1F202} \u24C2 \u{1F6C2} \u{1F6C4} \u{1F6C5} \u{1F6C3} \u{1F251} \u3299 \u3297 \u{1F191} \u{1F198} \u{1F194} \u{1F6AB} \u{1F51E} \u{1F4F5} \u{1F6AF} \u{1F6B1} \u{1F6B3} \u{1F6B7} \u{1F6B8} \u26D4 \u2733 \u2747 \u274E \u2705 \u2734 \u{1F49F} \u{1F19A} \u{1F4F3} \u{1F4F4} \u{1F170} \u{1F171} \u{1F18E} \u{1F17E} \u{1F4A0} \u27BF \u267B \u2648 \u2649 \u264A \u264B \u264C \u264D \u264E \u264F \u2650 \u2651 \u2652 \u2653 \u26CE \u{1F52F} \u{1F3E7} \u{1F4B9} \u{1F4B2} \u{1F4B1} \xA9 \xAE \u2122 \u303D \u3030 \u{1F51D} \u{1F51A} \u{1F519} \u{1F51B} \u{1F51C} \u274C \u2B55 \u2757 \u2753 \u2755 \u2754 \u{1F503} \u{1F55B} \u{1F567} \u{1F550} \u{1F55C} \u{1F551} \u{1F55D} \u{1F552} \u{1F55E} \u{1F553} \u{1F55F} \u{1F554} \u{1F560} \u{1F555} \u{1F556} \u{1F557} \u{1F558} \u{1F559} \u{1F55A} \u{1F561} \u{1F562} \u{1F563} \u{1F564} \u{1F565} \u{1F566} \u2716 \u2795 \u2796 \u2797 \u2660 \u2665 \u2663 \u2666 \u{1F4AE} \u{1F4AF} \u2714 \u2611 \u{1F518} \u{1F517} \u27B0 \u{1F531} \u{1F532} \u{1F533} \u25FC \u25FB \u25FE \u25FD \u25AA \u25AB \u{1F53A} \u2B1C \u2B1B \u26AB \u26AA \u{1F534} \u{1F535} \u{1F53B} \u{1F536} \u{1F537} \u{1F538} \u{1F539}";
  const punctuationMarks = [
    ".",
    ",",
    ";",
    ":",
    "!",
    "?"
  ];
  const split = emojis.split(" ");
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += text[i];
    if (punctuationMarks.includes(text[i])) {
      const randomEmoji = split[Math.floor(Math.random() * split.length)];
      result += randomEmoji;
    }
  }
  return result;
}function toLeetSpeak(text) {
  const leetMap = {
    "a": "4",
    "A": "4",
    "b": "8",
    "B": "8",
    "e": "3",
    "E": "3",
    "g": "6",
    "G": "6",
    "l": "1",
    "L": "1",
    "o": "0",
    "O": "0",
    "s": "5",
    "S": "5",
    "t": "7",
    "T": "7"
  };
  let leetText = "";
  for (let char of text) {
    leetText += leetMap[char] || char;
  }
  return leetText;
}function mockingSpongeBobSpeak(text) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += Math.random() < 0.5 ? text[i].toLowerCase() : text[i].toUpperCase();
  }
  return result;
}const endings = [
  "rawr x3",
  "OwO",
  "UwU",
  "o.O",
  "-.-",
  ">w<",
  "(\u2445\u02D8\uA4B3\u02D8)",
  "(\uA20D\u1D17\uA20D)",
  "(\u02D8\u03C9\u02D8)",
  "(U \u1D55 U\u2741)",
  "\u03C3\u03C9\u03C3",
  "\xF2\u03C9\xF3",
  "(///\u02EC///\u273F)",
  "(U \uFE4F U)",
  "( \u0361o \u03C9 \u0361o )",
  "\u0298w\u0298",
  ":3",
  ":3",
  ":3",
  "XD",
  "nyaa~~",
  "mya",
  ">_<",
  "\u{1F633}",
  "\u{1F97A}",
  "\u{1F633}\u{1F633}\u{1F633}",
  "rawr",
  "^^",
  "^^;;",
  "(\u02C6 \uFECC \u02C6)\u2661",
  "^\u2022\uFECC\u2022^",
  "/(^\u2022\u03C9\u2022^)",
  "(\u273Fo\u03C9o)"
];
const replacements = [
  [
    "small",
    "smol"
  ],
  [
    "cute",
    "kawaii"
  ],
  [
    "fluff",
    "floof"
  ],
  [
    "love",
    "luv"
  ],
  [
    "stupid",
    "baka"
  ],
  [
    "what",
    "nani"
  ],
  [
    "meow",
    "nya"
  ],
  [
    "hello",
    "hewwo"
  ]
];
const isOneCharacterString = function(str) {
  return str.split("").every(function(char) {
    return char === str[0];
  });
};
function selectRandomElement(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
function replaceString(inputString) {
  let replaced = false;
  for (const replacement of replacements) {
    const regex = new RegExp(`\\b${replacement[0]}\\b`, "gi");
    if (regex.test(inputString)) {
      inputString = inputString.replace(regex, replacement[1]);
      replaced = true;
    }
  }
  return replaced ? inputString : false;
}
function uwuify(message) {
  const rule = /\S+|\s+/g;
  const words = message.match(rule);
  let answer = "";
  if (words === null)
    return "";
  for (let i = 0; i < words.length; i++) {
    if (isOneCharacterString(words[i]) || words[i].startsWith("https://")) {
      answer += words[i];
      continue;
    }
    if (!replaceString(words[i])) {
      answer += words[i].replace(/n(?=[aeo])/g, "ny").replace(/l|r/g, "w");
    } else
      answer += replaceString(words[i]);
  }
  answer += " " + selectRandomElement(endings);
  return answer;
}
function uwuifyArray(arr) {
  const newArr = [
    ...arr
  ];
  newArr.forEach(function(item, index) {
    if (Array.isArray(item)) {
      newArr[index] = uwuifyArray(item);
    } else if (typeof item === "string") {
      newArr[index] = uwuify(item);
    }
  });
  return newArr;
}var uwu=/*#__PURE__*/Object.freeze({__proto__:null,replaceString:replaceString,selectRandomElement:selectRandomElement,uwuify:uwuify,uwuifyArray:uwuifyArray});function zalgofied(string) {
  if (!string)
    return null;
  const obj = {
    a: "\u{1D5BA}",
    b: "\u{1D68B}",
    c: "\u{1D68C}",
    d: "\u{1D68D}",
    e: "\u{1D68E}",
    f: "\u{1D68F}",
    g: "\u{1D690}",
    h: "\u{1D691}",
    i: "\u{1D692}",
    j: "\u{1D693}",
    k: "\u{1D694}",
    l: "\u{1D695}",
    m: "\u{1D696}",
    n: "\u{1D697}",
    o: "\u{1D5C8}",
    p: "\u{1D699}",
    q: "\u{1D69A}",
    r: "\u{1D69B}",
    s: "\u{1D69C}",
    t: "\u{1D69D}",
    u: "\u{1D5CE}",
    v: "\u{1D69F}",
    w: "\u{1D6A0}",
    x: "\u{1D6A1}",
    y: "\u{1D6A2}",
    z: "\u{1D6A3}"
  };
  for (const char in obj) {
    string = string.split(char).join(obj[char]);
  }
  return string;
}const transform = {
  emojify: emoji,
  leetify: toLeetSpeak,
  spongify: mockingSpongeBobSpeak,
  uwu,
  zalgofy: zalgofied
};const regexPatterns = [
  "((http|https):\\/\\/)?([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:\\/~+#-]*[\\w@?^=%&\\/~+#-])?",
  "<?:?(?:(a):)?(w{2,32}):(d{17,19})?>?",
  "<@!?(?<id>\\d{17,20})>",
  "<@!?(?<id>\\d{17,20})>",
  "<#(?<id>\\d{17,20})>",
  "<@&(?<id>\\d{17,20})>",
  "<(?<animated>a)?:(?<name>\\w{2,32}):(?<id>\\d{17,20})>",
  "<:(?<name>\\w{2,32}):(?<id>\\d{17,20})>",
  "<t:(?<timestamp>-?\\d{1,13})(:(?<style>[DFRTdft]))?>",
  "<t:(?<timestamp>-?\\d{1,13})>",
  "<t:(?<timestamp>-?\\d{1,13}):(?<style>[DFRTdft])>",
  "<id:\\w+>",
  "@(everyone|here)"
];
function processText(inputString, regexArray) {
  const resultArray = [];
  let remainingText = inputString;
  function createObj(text, match) {
    return {
      match,
      text
    };
  }
  regexArray.forEach(function(regex) {
    const regexWithFlags = new RegExp(regex, "u");
    let match = regexWithFlags.exec(remainingText);
    while (match !== null) {
      const matchIndex = match.index;
      const matchedString = match[0];
      const beforeMatch = remainingText.substring(0, matchIndex);
      const afterMatch = remainingText.substring(matchIndex + matchedString.length);
      resultArray.push(createObj(beforeMatch, false), createObj(matchedString, true));
      remainingText = afterMatch;
      match = regexWithFlags.exec(remainingText);
    }
  });
  if (remainingText.length > 0) {
    resultArray.push(createObj(remainingText, false));
  }
  return resultArray;
}
function modifyText(arrayOfProcessedText, joiner, innerFunction) {
  const temp = [];
  for (const strObj of arrayOfProcessedText) {
    if (!(strObj === null || strObj === void 0 ? void 0 : strObj.match) && (strObj === null || strObj === void 0 ? void 0 : strObj.text)) {
      temp.push(innerFunction(strObj === null || strObj === void 0 ? void 0 : strObj.text));
    } else {
      temp.push(strObj === null || strObj === void 0 ? void 0 : strObj.text);
    }
  }
  return temp.join(joiner || "");
}const Messages = metro.findByProps("sendMessage", "receiveMessage");
function chatThing() {
  return patcher.before("sendMessage", Messages, function(args) {
    const ENM = {
      "emoji": transform.emojify,
      "leet": transform.leetify,
      "spongebob": transform.spongify,
      "uwu": transform.uwu.uwuify,
      "zalgo": transform.zalgofy
    };
    if ((plugin.storage === null || plugin.storage === void 0 ? void 0 : plugin.storage.type) && ENM[plugin.storage === null || plugin.storage === void 0 ? void 0 : plugin.storage.type]) {
      const splitters = processText(args[1].content, regexPatterns);
      const modifiedCode = modifyText(splitters, "", ENM[plugin.storage.type]);
      args[1].content = modifiedCode;
    }
  });
}const { ScrollView: ScrollView$1, View: View$1, Text: Text$1, TouchableOpacity: TouchableOpacity$1, TextInput: TextInput$1, Image: Image$1, Animated: Animated$1 } = components.General;
const { FormLabel: FormLabel$1, FormIcon: FormIcon$1, FormArrow: FormArrow$1, FormRow: FormRow$1, FormSwitch: FormSwitch$1, FormSwitchRow: FormSwitchRow$1, FormSection: FormSection$1, FormDivider: FormDivider$1, FormInput: FormInput$1 } = components.Forms;
const current = assets.getAssetIDByName("ic_radio_square_checked_24px");
const older = assets.getAssetIDByName("ic_radio_square_24px");
const info = assets.getAssetIDByName("ic_information_24px");
assets.getAssetIDByName("ic_info");
const newStuff = assets.getAssetIDByName("premium_sparkles");
const updatedStuff = assets.getAssetIDByName("ic_sync_24px");
const fixStuff = assets.getAssetIDByName("ic_progress_wrench_24px");
const styles = common.stylesheet.createThemedStyleSheet({
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
function addIcon$1(icon) {
  return /* @__PURE__ */ common.React.createElement(FormIcon$1, {
    style: {
      opacity: 1
    },
    source: icon
  });
}
function ChangeRow(param) {
  let { change, index, totalIndex } = param;
  var _change_new, _change_updated, _change_fix;
  const [isOpen, setOpen] = common.React.useState(false);
  common.React.useState(false);
  function createSubRow(arr, label, subLabel, icon) {
    return /* @__PURE__ */ common.React.createElement(View$1, null, /* @__PURE__ */ common.React.createElement(FormRow$1, {
      label: label || "No Section",
      subLabel: subLabel || null,
      leading: icon && addIcon$1(icon),
      style: [
        styles.textHeader
      ]
    }), arr.map(function(x, i) {
      return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$1, {
        label: x,
        style: [
          styles.textBody,
          styles.rowLabel,
          styles.border
        ]
      }));
    }));
  }
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(components.ErrorBoundary, null, /* @__PURE__ */ common.React.createElement(FormRow$1, {
    label: change === null || change === void 0 ? void 0 : change.version,
    leading: index == 0 ? addIcon$1(current) : addIcon$1(older),
    trailing: addIcon$1(info),
    onPress: function() {
      setOpen(!isOpen);
    }
  }), isOpen && /* @__PURE__ */ common.React.createElement(View$1, {
    style: [
      styles.versionBG,
      styles.border
    ]
  }, (change === null || change === void 0 ? void 0 : (_change_new = change.new) === null || _change_new === void 0 ? void 0 : _change_new.length) > 0 && createSubRow(change.new, "New", "New stuffies", newStuff), (change === null || change === void 0 ? void 0 : (_change_updated = change.updated) === null || _change_updated === void 0 ? void 0 : _change_updated.length) > 0 && createSubRow(change.updated, "Changes", "Update things", updatedStuff), (change === null || change === void 0 ? void 0 : (_change_fix = change.fix) === null || _change_fix === void 0 ? void 0 : _change_fix.length) > 0 && createSubRow(change.fix, "Fixes", "Me hate borken things", fixStuff)), index == totalIndex.length - 1 ? void 0 : /* @__PURE__ */ common.React.createElement(FormDivider$1, null)));
}function createList(version, a, u, f) {
  return {
    version,
    new: a,
    updated: u,
    fix: f
  };
}
function ma() {
  for (var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++) {
    a[_key] = arguments[_key];
  }
  return [
    ...a
  ];
}
const update = [
  createList("1.0.0", ma("Created the Plugin"), null, null),
  createList("1.0.1", ma("Updates Sections"), null, ma("Excludes links, emoji, timestamp, and mentions"))
];
var updates = update.reverse();var _findByProps;
const { ActionSheetTitleHeader, ActionSheetCloseButton } = metro.findByProps("ActionSheetTitleHeader");
const { BottomSheetFlatList } = metro.findByProps("BottomSheetScrollView");
const LazyActionSheet = metro.findByProps("hideActionSheet");
const ActionSheet = ((_findByProps = metro.findByProps("ActionSheet")) === null || _findByProps === void 0 ? void 0 : _findByProps.ActionSheet) ?? metro.find(function(m) {
  var _m_render;
  return ((_m_render = m.render) === null || _m_render === void 0 ? void 0 : _m_render.name) === "ActionSheet";
});
const useIsFocused = metro.findByName("useIsFocused");
const { ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated } = components.General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput } = components.Forms;
function createDT(id, label, subLabel) {
  return {
    id,
    label,
    subLabel
  };
}
const dataTypes = [
  createDT("emoji", "Emojify your messages", "Replace punctuations with random emoji"),
  createDT("leet", "Speak Leet", "Speak like Leet"),
  createDT("spongebob", "SPonGeBoB MocK", "Mockeryyyy"),
  createDT("uwu", "UwUify your messages", "UvU"),
  createDT("zalgo", "Zalgofied your messages", "Self-explanatory"),
  createDT("unset", "Disable", null)
];
const NameTypes = {
  emoji: "Emojify",
  leet: "LEET Speak",
  spongebob: "Mocking SpongeBob Speak",
  uwu: "UwUify",
  zalgo: "Zalgofy",
  unset: "Disabled"
};
const enabled = assets.getAssetIDByName("ic_radio_square_checked_24px");
const disabled = assets.getAssetIDByName("ic_radio_square_24px");
const wrench = assets.getAssetIDByName("ic_progress_wrench_24px");
function addIcon(icon) {
  return /* @__PURE__ */ React.createElement(FormIcon, {
    style: {
      opacity: 1
    },
    source: icon
  });
}
function settingPage() {
  storage.useProxy(plugin.storage);
  useIsFocused();
  function CreateRow(param) {
    let { data } = param;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow, {
      label: (data === null || data === void 0 ? void 0 : data.label) || "Placeholder Title",
      subLabel: (data === null || data === void 0 ? void 0 : data.subLabel) || null,
      disabled: (data === null || data === void 0 ? void 0 : data.id) == (plugin.storage === null || plugin.storage === void 0 ? void 0 : plugin.storage.type) || false,
      leading: (data === null || data === void 0 ? void 0 : data.id) == (plugin.storage === null || plugin.storage === void 0 ? void 0 : plugin.storage.type) ? addIcon(enabled) : addIcon(disabled),
      onPress: function(ctx) {
        if ((data === null || data === void 0 ? void 0 : data.id) == "unset") {
          plugin.storage.type = null;
        } else {
          plugin.storage.type = data.id;
        }
        LazyActionSheet.hideActionSheet();
      }
    }));
  }
  const BFM = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ActionSheet, {
    scrollable: true
  }, /* @__PURE__ */ React.createElement(components.ErrorBoundary, null, /* @__PURE__ */ React.createElement(ActionSheetTitleHeader, {
    title: "Changing Modification Types",
    leading: /* @__PURE__ */ React.createElement(FormIcon, {
      style: {
        opacity: 1
      },
      source: assets.getAssetIDByName("ic_category_16px"),
      disableColor: true
    }),
    trailing: /* @__PURE__ */ React.createElement(ActionSheetCloseButton, {
      onPress: function() {
        return LazyActionSheet.hideActionSheet();
      }
    })
  }), /* @__PURE__ */ React.createElement(BottomSheetFlatList, {
    style: {
      flex: 1
    },
    contentContainerStyle: {
      paddingBottom: 24
    },
    data: dataTypes,
    renderItem: function(param) {
      let { item } = param;
      return /* @__PURE__ */ React.createElement(CreateRow, {
        data: item
      });
    },
    ItemSeparatorComponent: FormDivider,
    keyExtractor: function(x) {
      return x.id;
    }
  }))));
  const openMT = function() {
    LazyActionSheet.openLazy(Promise.resolve({
      default: function() {
        return BFM;
      }
    }), "show");
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ScrollView, null, /* @__PURE__ */ React.createElement(View, {
    style: {
      margin: 5,
      padding: 10,
      borderRadius: 10,
      backgroundColor: "rgba(0, 0, 0, 0.15)"
    }
  }, /* @__PURE__ */ React.createElement(FormSection, {
    title: "Plugin Settings"
  }, /* @__PURE__ */ React.createElement(FormRow, {
    label: `Type: ${(plugin.storage === null || plugin.storage === void 0 ? void 0 : plugin.storage.type) ? NameTypes[plugin.storage === null || plugin.storage === void 0 ? void 0 : plugin.storage.type] ? NameTypes[plugin.storage === null || plugin.storage === void 0 ? void 0 : plugin.storage.type] : plugin.storage === null || plugin.storage === void 0 ? void 0 : plugin.storage.type : "Disabled"}`,
    subLabel: "Modify how the messages changes",
    onPress: openMT,
    leading: /* @__PURE__ */ React.createElement(FormIcon, {
      style: {
        opacity: 1
      },
      source: wrench
    })
  }), /* @__PURE__ */ React.createElement(FormDivider, null)), updates && /* @__PURE__ */ React.createElement(FormSection, {
    title: "Updates"
  }, /* @__PURE__ */ React.createElement(View, {
    style: {
      margin: 5,
      padding: 5,
      borderRadius: 10,
      backgroundColor: "rgba(0, 0, 0, 0.3)"
    }
  }, updates.map(function(data, index) {
    return /* @__PURE__ */ React.createElement(ChangeRow, {
      change: data,
      index,
      totalIndex: updates.length
    });
  }))))));
}metro.findByProps("openLazy", "hideActionSheet");
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
}makeDefaults(plugin.storage, {
  type: "unset"
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
};exports.default=index;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({},vendetta.metro,vendetta.patcher,vendetta.plugin,vendetta.ui.assets,vendetta.ui.toasts,vendetta.storage,vendetta.ui.components,vendetta.metro.common,vendetta.ui);