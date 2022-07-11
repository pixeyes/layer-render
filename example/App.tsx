import { useEffect, useState } from "react";
import LayerRender, { doSomeThing, ControlType, CROP_TYPE } from "../src";
import relay from "./data";
import React from "react";
import Operation from "../src/Operation";
import CtrlSpace from "../src/RenderComponents/CtrlSpace";

export function crop(
  image: any,
  area: any,
  artboard_scale = 1
): Promise<string> {
  return new Promise((resolve) => {
    const dpr = artboard_scale;
    const top = area.y * dpr;
    const left = area.x * dpr;
    const width = area.w * dpr;
    const height = area.h * dpr;

    let canvas: any = null;
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.style.display = "none";
      document.body.appendChild(canvas);
    }
    canvas.width = area.w;
    canvas.height = area.h;

    const img = new Image();
    img.setAttribute("crossOrigin", "Anonymous");
    img.onload = () => {
      const context = canvas.getContext("2d");
      context.drawImage(img, left, top, width, height, 0, 0, area.w, area.h);
      const cropped = canvas.toDataURL(`image/png`);
      document.body.removeChild(canvas);
      resolve(cropped);
    };
    img.src = image;
  });
}

function App() {
  const [res, setRes] = useState();
  const [cropType, setCropType] = useState(CROP_TYPE.CLICK);
  const [scale, setScale] = useState(1);
  const [value, setValue] = useState("");

  const onChangeCropType = (cropType: CROP_TYPE) => {
    setCropType(cropType);
  };
  useEffect(() => {
    if (/jd.com/.test(window.location.hostname)) {
      fetch(
        "/v1/relay/api/page/info?unique_page_id=1235c74e-bdf4-48fe-932e-e3dc422ec3f1",
        {
          credentials: "include",
          mode: "cors",
          cache: "no-cache",
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((resp) => {
          const data = doSomeThing(resp.data);
          setRes(data);
        });
    } else {
      const data = doSomeThing(relay);
      setRes(data);
    }
  }, []);
  if (!res) return null;
  return (
    <>
      <CtrlSpace className="top">
        <ControlType cropType={cropType} onChangeCropType={onChangeCropType} />
        <Operation scale={scale} setScale={setScale} />
      </CtrlSpace>

      <LayerRender
        scale={scale}
        setScale={setScale}
        cropType={cropType}
        data={res}
        mountCallback={(that) => {
          console.log(that);
        }}
        onChange={(data) => {
          console.log(data);
          crop(
            data.url,
            {
              x: data.current.frame.x,
              y: data.current.frame.y,
              w: data.current.frame.width,
              h: data.current.frame.height,
            },
            data.artboard_scale
          ).then((res) => {
            console.log(res);
            setValue(res);
          });
        }}
      />
      {value && <img src={value} className="preview" />}
    </>
  );
}

export default App;
