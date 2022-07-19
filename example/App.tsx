import { useEffect, useState } from "react";
import LayerRender, { doSomeThing } from "../src";
import relay from "./data";
import React from "react";
import Operation from "../src/Operation";
import CtrlSpace from "../src/RenderComponents/CtrlSpace";
import { Button } from "antd";

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
const ids = ['fe354ba4-3d1a-494f-a360-0dbf3eaa617b','61c605f2-3a5a-475d-bfe2-fb86ab2c369c','b4f25656-5da8-444a-bf70-65c687243ef1','1235c74e-bdf4-48fe-932e-e3dc422ec3f1']
function App() {
  const [res, setRes] = useState<any>(null);
  const [scale, setScale] = useState(1);
  const [value, setValue] = useState("");
  const [count, setCount] = useState(0);

  const onChangeId = () =>{
    const temp = count>=ids.length-1?0:count+1
    setCount(temp)
    fetchData(ids[temp])
  }
  const fetchData = async (id:string) => {
    if (/jd.com/.test(window.location.hostname)) {
      fetch(
        "/v1/relay/api/page/info?unique_page_id="+id,
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
  }
  useEffect(() => {
    fetchData(ids[count])
  }, []);
  if (!res) return null;
  return (
    <>
      <CtrlSpace className="top">
        <Button onClick={onChangeId}>切换</Button>
        <Operation scale={scale} setScale={setScale} />
      </CtrlSpace>

      <LayerRender
        scale={scale}
        setScale={setScale}
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
            res!.artboard_scale!
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
