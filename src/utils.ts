export function J(e: any, t: any) {
  let n, o, i, a, c;
  return (
    (n = !1),
    (e.centerX = e.x + e.width / 2),
    (e.centerY = e.y + e.height / 2),
    (t.centerX = t.x + t.width / 2),
    (t.centerY = t.y + t.height / 2),
    (e.halfWidth = e.width / 2),
    (e.halfHeight = e.height / 2),
    (t.halfWidth = t.width / 2),
    (t.halfHeight = t.height / 2),
    (a = e.centerX - t.centerX),
    (c = e.centerY - t.centerY),
    (o = e.halfWidth + t.halfWidth),
    (i = e.halfHeight + t.halfHeight),
    (n = Math.abs(a) < o && Math.abs(c) < i),
    n
  );
}
export function normalizr(t: any) {
  // eslint-disable-next-line prefer-rest-params
  const e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
      i = "group" === t.type;
  return (
      (!i || (i && t.image) || (i && t.children && t.children.length > 1)) &&
      e.push(t),
      Array.isArray(t.children) &&
      (t.children.some(function (t:any) {
        return t.hasOwnProperty("index");
      }) &&
      t.children.sort(function (t:any, e:any) {
        return t.index > e.index ? 1 : t.index < e.index ? -1 : 0;
      }),
          t.children.forEach(function (t:any) {
            // @ts-ignore
            normalizr(t, e);
          })),
          e
  );
}

function H(t:any, e:any) {
  let i,
    n,
    a,
    s,
    o = !1;
  return (
    (a = t.centerX - e.centerX),
    (s = t.centerY - e.centerY),
    (i = t.halfWidth + e.halfWidth),
    (n = t.halfHeight + e.halfHeight),
    (o = Math.abs(a) < i && Math.abs(s) < n),
    o
  );
}
export const getLayersByPosition = function (
  validLayers: any[],
  t:any,
  findAll?: boolean
) {
  const n = {
    x: t.x,
    y: t.y,
    width: 1,
    height: 1,
    halfWidth: 0.5,
    halfHeight: 0.5,
    centerX: t.x + 0.5,
    centerY: t.y + 0.5,
  };
  const a = [];
  for (let s = validLayers.length - 1; s >= 0; s--) {
    const r = validLayers[s];
    if (H(n, r._rect)) {
      if (!findAll) return r;
      a.push(r);
    }
  }
  return findAll ? a : null;
};

export const getLayersByAI = function (validLayers: any[], point:any) {
  const a = [];
  for (const validLayer of validLayers) {
    console.log(validLayer);
    if (
      point.y >= validLayer.frame.y &&
      point.y <= validLayer.frame.y + validLayer.frame.height
    ) {
      a.push(validLayer);
    }
  }
  return a;
};

/**
 * 鼠标滚轮
 */
export const WHEEL_SCALE_STEP = 0.05;
/**
 * 按钮缩放
 */
export const ZOOM_SCALE_STEP = 0.25;

export const MAX_SCALE = 4;

export const MIN_SCALE = 0.25;
/**
 * 左右自由移动需要保留的宽度
 */
export const WHEEL_HOLD = 300;

export const SCALE_STEPS = [25, 50, 100, 150, 200, 400];

export const zoomInNext = (currentScale: number) => {
  const intScale = 100 * currentScale;
  const index = SCALE_STEPS.findIndex((t) => t === intScale);
  let nextIndex = index + 1;
  if (nextIndex >= SCALE_STEPS.length) {
    nextIndex = index;
  }
  nextIndex = Math.min(nextIndex, SCALE_STEPS.length - 1);
  return SCALE_STEPS[nextIndex] / 100;
};

export const zoomOutNext = (currentScale: number) => {
  const intScale = 100 * currentScale;
  const index = SCALE_STEPS.findIndex((t) => t === intScale);
  let nextIndex = index - 1;
  if (nextIndex < 0) {
    nextIndex = index;
  }
  return SCALE_STEPS[nextIndex] / 100;
};
