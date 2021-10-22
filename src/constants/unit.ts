const state = {
  unitTypes: [
    {
      platform: "iOS",
      unit: "pt",
      fontUnit: "pt",
      ratio: 2,
      picType: "svg",
    },
    {
      platform: "Android",
      unit: "dp",
      fontUnit: "sp",
      ratio: 2,
      picType: "svg",
    },
    {
      platform: "Web",
      unit: "px",
      fontUnit: "px",
      ratio: 1,
      picType: "svg",
    },
    {
      platform: "像素",
      unit: "px",
      fontUnit: "px",
      ratio: 1,
      picType: "svg",
    },
  ],
  currentProject: null,
  message: { className: "", max: 3 },
  docSetType: 0,
  artSizeVal: { platform: "Web", unit: "px" },
  iosCodeFrame: "Objective-C",
  sliceFormat: "PNG",
};
