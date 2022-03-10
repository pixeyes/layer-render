import { useEffect, useState } from "react";
import LayerRender, { doSomeThing, ControlType, CROP_TYPE } from "../src";
import relay from "./data";
import React from "react";
function App() {
  const [res, setRes] = useState();
  const [cropType, setCropType] = useState(CROP_TYPE.CLICK);
  const onChangeCropType = (cropType: CROP_TYPE) => {
    setCropType(cropType);
  };
  useEffect(() => {
    if (/jd.com/.test(window.location.hostname)) {
      fetch(
        "/v1/relay/api/page/info?unique_page_id=9296a740-cfb0-4534-8226-1ca9d687da7c",
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
      <ControlType cropType={cropType} onChangeCropType={onChangeCropType} />
      <LayerRender
        cropType={cropType}
        data={res}
        mountCallback={(that) => {
          console.log(that);
        }}
        canvasWidth={1264}
        onChange={(data) => {
          console.log(data);
        }}
      />
    </>
  );
}

export default App;
