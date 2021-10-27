export const toUnit = (obj: any, px: any = null, scale = 1) => {
  if (typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      if (key !== "value") {
        if (value == null ||
            value === 0 ||
            (typeof value === "number" && isNaN(value))){
          console.log(obj)
          obj[key] = 0;
        }else {
          obj[key] = toUnit(value, px, scale);
        }
      }
    }
    return obj;
  }
  // @ts-ignore
  const c = (Math.floor(100 * obj) / 100).toFixed(2) * scale;
  return px ? c + px : c;
};

export const toNoScalePx = (value: any) => {
  return toUnit(value, "", 1);
};

export const computeShowMarginTopStyle = (current:any, hoverItem:any) => {
  let left, height, top;
  //const { current, hoverLayer: hoverItem } = this.state;
  if (hoverItem.y >= current.y + current.height || hoverItem.y === current.y) {
    /*this.setState({
      top: null,
    });*/
    return null;
  }

  top = Math.min(current.y, hoverItem.y + hoverItem.height);
  if (hoverItem.y + hoverItem.height > current.y) {
    top = Math.min(current.y, hoverItem.y);
  }

  if (hoverItem.x + hoverItem.width === current.x) {
    left = current.x;
  } else if (current.x + current.width === hoverItem.x) {
    left = hoverItem.x;
  } else {
    left = current.x + current.width / 2;

    if (
      hoverItem.x >= current.x &&
      hoverItem.x + hoverItem.width <= current.x + current.width
    ) {
      left = hoverItem.x + hoverItem.width / 2;
    } else if (hoverItem.x <= current.x) {
      if (hoverItem.x + hoverItem.width > current.x) {
        left = (hoverItem.x + hoverItem.width - current.x) / 2 + current.x;
      }
      left = Math.min(current.x + current.width / 2, left);
    } else {
      if (hoverItem.x + hoverItem.width > current.x + current.width) {
        if (hoverItem.x < current.x + current.width) {
          left = (current.x + current.width - hoverItem.x) / 2 + hoverItem.x;
        }
      }
    }
  }

  if (top < current.y) {
    height = current.y - top;
  } else if (top === current.y) {
    height = hoverItem.y - top;
    left = hoverItem.x + hoverItem.width / 2;
  }
  // @ts-ignore
  if (height < 1) {
    /*this.setState({
      top: { display: "none" },
    });*/
    return null;
  }
  /*this.setState({
    top: { left, height, top, value: toUnit(height) },
  });*/
  //this.marginInfo.top = {left, height, top, value:toUnit(height)}
  /*if (top === hoverItem.y) {
    //处理压线
    top += 1;
    // @ts-ignore
    height -= 1;
  }
  // @ts-ignore
  height -= 1;*/
  return toNoScalePx({ left, height, top, value: height });
};

export const computeShowMarginBottomStyle = (current:any, hoverItem:any) => {
  let left, height, top;

  if (
    !current ||
    !hoverItem ||
    hoverItem.y + hoverItem.height <= current.y ||
    hoverItem.y === current.y + current.height
  ) {
    /* this.setState({
       bottom: null,
     });*/
    return null;
  }

  if (hoverItem.y > current.y + current.height) {
    top = current.y + current.height;
  } else {
    top = Math.min(current.y + current.height, hoverItem.y + hoverItem.height);
  }

  if (top >= current.y + current.height) {
    height = hoverItem.y - top;
    if (
      hoverItem.y + hoverItem.height > current.y + current.height &&
      hoverItem.y < current.y + current.height
    ) {
      height = hoverItem.y + hoverItem.height - top;
    }
  } else {
    height = current.y + current.height - top;
  }

  if (height < 1) {
    /*this.setState({
      bottom: null,
    });*/
    return null;
    //return {display:'none'}
  }

  if (current.x + current.width === hoverItem.x) {
    left = hoverItem.x;
  } else if (hoverItem.x + hoverItem.width === current.x) {
    left = current.x;
  } else {
    left = current.x + current.width / 2;
    if (
      hoverItem.x >= current.x &&
      hoverItem.x + hoverItem.width <= current.x + current.width
    ) {
      left = hoverItem.x + hoverItem.width / 2;
    } else if (hoverItem.x <= current.x) {
      if (hoverItem.x + hoverItem.width > current.x) {
        left = (hoverItem.x + hoverItem.width - current.x) / 2 + current.x;
      } else if (hoverItem.y + hoverItem.height < current.y + current.height) {
        left = hoverItem.x + hoverItem.width / 2;
      }
      left = Math.min(current.x + current.width / 2, left);
    } else {
      if (hoverItem.x + hoverItem.width > current.x + current.width) {
        if (hoverItem.x < current.x + current.width) {
          left = (current.x + current.width - hoverItem.x) / 2 + hoverItem.x;
        } else if (
          hoverItem.y + hoverItem.height <
          current.y + current.height
        ) {
          left = hoverItem.x + hoverItem.width / 2;
        }
      }
    }
  }
  /* this.setState({
     bottom: this.toRatioPX({ left, height, top, value: toUnit(height) }),
   });*/

  //还有一点小瑕疵，有些情况还是会压线 暂时不处理
  /*if (top + height === hoverItem.y + hoverItem.height) {
    //处理压线
    height -= 1;
  }
  if (left >= hoverItem.x && left <= hoverItem.x + hoverItem.width) {
    height -= 1;
  }*/
  /*this.setState({
bottom: this.toReatioPX({ left, height, top }),
});*/
  //this.marginInfo.bottom.height = height
  return toNoScalePx({ left, height, top, value: height });
};

export const computeShowMarginRightStyle = (current:any, hoverItem:any) => {
  let left, width, top;

  if (
    !current ||
    !hoverItem ||
    hoverItem.x + hoverItem.width === current.x + current.width ||
    hoverItem.x + hoverItem.width <= current.x ||
    current.x + current.width === hoverItem.x
  ) {
    /*this.setState({
      right: null
    });*/
    return null;
  }

  top = current.y + current.height / 2;

  if (
    hoverItem.y >= current.y &&
    hoverItem.y + hoverItem.height <= current.y + current.height
  ) {
    top = hoverItem.y + hoverItem.height / 2;
  } else if (hoverItem.y <= current.y) {
    if (
      current.y === hoverItem.y + hoverItem.height &&
      hoverItem.x > current.x + current.width
    ) {
      top = current.y;
    } else if (hoverItem.x + hoverItem.width < current.x + current.width) {
      top = hoverItem.y + hoverItem.height / 2;
    } else {
      if (hoverItem.y + hoverItem.height > current.y) {
        top = (hoverItem.y + hoverItem.height - current.y) / 2 + current.y;
      } else if (
        hoverItem.x > current.x &&
        hoverItem.x + hoverItem.width > current.x + current.width
      ) {
        top = current.y + current.height / 2;
      }
      top = Math.min(current.y + current.height / 2, top);
    }
  } else {
    if (hoverItem.y + hoverItem.height > current.y + current.height) {
      if (hoverItem.y < current.y + current.height) {
        top = (current.y + current.height - hoverItem.y) / 2 + hoverItem.y;
      } else if (hoverItem.x + hoverItem.width > current.x + current.width) {
        top = current.y + current.height / 2;
      } else {
        top = hoverItem.y + hoverItem.height / 2;
      }
    }
  }

  left = current.x + current.width;
  width = hoverItem.x - (current.x + current.width);

  if (left > hoverItem.x + hoverItem.width) {
    width = left - (hoverItem.x + hoverItem.width);
    left = hoverItem.x + hoverItem.width;
  }

  if (width <= 0) {
    width = hoverItem.x + hoverItem.width - (current.x + current.width);
  }
  /*    this.setState({
        right: this.toRatioPX({ left, width, top, value: toUnit(width) })
      });*/

  //width -= 1;
  /*this.setState({
right: this.toReatioPX({ left, width, top }),
});*/
  return toNoScalePx({ left, width, top, value: width });
};

export const computeShowMarginLeftStyle = (current:any, hoverItem:any) => {
  let left, width, top;

  if (
    !current ||
    !hoverItem ||
    hoverItem.x === current.x ||
    hoverItem.x >= current.x + current.width ||
    hoverItem.x + hoverItem.width === current.x
  ) {
    /*this.setState({
      left: null
    });*/
    return null;
    //return {display:'none'}
  }

  top = current.y + current.height / 2;

  if (
    hoverItem.y >= current.y &&
    hoverItem.y + hoverItem.height <= current.y + current.height
  ) {
    top = hoverItem.y + hoverItem.height / 2;
  } else if (hoverItem.y <= current.y) {
    // 底顶一致，但左右分离
    if (
      current.y === hoverItem.y + hoverItem.height &&
      hoverItem.x + hoverItem.width < current.x
    ) {
      top = current.y;
    } else {
      if (hoverItem.y + hoverItem.height > current.y) {
        top = (hoverItem.y + hoverItem.height - current.y) / 2 + current.y;
      } else if (hoverItem.x > current.x) {
        top = hoverItem.y + hoverItem.height / 2;
      }
      top = Math.min(current.y + current.height / 2, top);
    }
  } else {
    if (
      hoverItem.y === current.y + current.height &&
      current.x > hoverItem.x + hoverItem.width
    ) {
      top = hoverItem.y;
    } else {
      if (hoverItem.y + hoverItem.height > current.y + current.height) {
        if (hoverItem.y < current.y + current.height) {
          top = (current.y + current.height - hoverItem.y) / 2 + hoverItem.y;
        } else if (hoverItem.x > current.x) {
          top = hoverItem.y + hoverItem.height / 2;
        }
      }
    }
  }

  left = hoverItem.x + hoverItem.width;
  if (left >= current.x) {
    left = hoverItem.x;
  }

  if (left > current.x) {
    width = left - current.x;
    left -= width;
  } else {
    width = current.x - left;
  }
  /*this.setState({
    left: this.toRatioPX({ left, width, top, value: toUnit(width) })
  });*/

  //width -= 1;
  /*this.setState({
left: this.toReatioPX({ left, width, top }),
});*/
  return toNoScalePx({ left, width, top, value: width });
};
