// const state = {
//   unitTypes: [
//     {
//       platform: "iOS",
//       unit: "pt",
//       fontUnit: "pt",
//       ratio: 2,
//       picType: "svg",
//     },
//     {
//       platform: "Android",
//       unit: "dp",
//       fontUnit: "sp",
//       ratio: 2,
//       picType: "svg",
//     },
//     {
//       platform: "Web",
//       unit: "px",
//       fontUnit: "px",
//       ratio: 1,
//       picType: "svg",
//     },
//     {
//       platform: "像素",
//       unit: "px",
//       fontUnit: "px",
//       ratio: 1,
//       picType: "svg",
//     },
//   ],
//   currentProject: null,
//   message: { className: "", max: 3 },
//   docSetType: 0,
//   artSizeVal: { platform: "Web", unit: "px" },
//   iosCodeFrame: "Objective-C",
//   sliceFormat: "PNG",
// };
export type ART_SIZE = {
  platform: "iOS" | "Android" | "Web" | "像素";
  unit: "pt" | "dp" | "px"|"rem";
  fontUnit: "pt" | "sp" | "px"|"rem";
  ratio: 1|2;
  picType: "svg";
  leftTip: any;
  name: string;
  selected: boolean;
  clstag: string;
};
export const artSizeList: ART_SIZE[] = [
  {
    platform: "iOS",
    unit: "pt",
    fontUnit: "pt",
    ratio: 2,
    picType: "svg",
    leftTip: {
      type: "icon",
      icon: "//s1-relay.360buyimg.com/relay/release/platform/web/img/ios_platform_icon.ee53ffd5.svg",
    },
    name: "iOS/pt（上传默认单位）",
    selected: true,
    clstag: "h|keycount|web_page_equipment|2",
  },
  {
    platform: "Android",
    unit: "dp",
    fontUnit: "sp",
    ratio: 2,
    picType: "svg",
    leftTip: {
      type: "icon",
      icon: "//s1-relay.360buyimg.com/relay/release/platform/web/img/android_platform_icon.80ba33c0.svg",
    },
    name: "Android/dp",
    selected: false,
    clstag: "h|keycount|web_page_equipment|3",
  },
  {
    platform: "Web",
    unit: "px",
    fontUnit: "px",
    ratio: 1,
    picType: "svg",
    leftTip: {
      type: "icon",
      icon: "//s1-relay.360buyimg.com/relay/release/platform/web/img/pc_platform_icon.ded3b163.svg",
    },
    name: "Web/px",
    selected: false,
    clstag: "h|keycount|web_page_equipment|4",
  },
  {
    platform: "像素",
    unit: "px",
    fontUnit: "px",
    ratio: 1,
    picType: "svg",
    leftTip: {
      type: "icon",
      icon: "//s1-relay.360buyimg.com/relay/release/platform/web/img/other_platform_icon.08f4efc5.svg",
    },
    name: "像素/px",
    selected: false,
    clstag: "h|keycount|web_page_equipment|5",
  },
];
