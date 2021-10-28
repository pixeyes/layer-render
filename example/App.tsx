import React, { useEffect, useState } from "react";
import LayerRender, { doSomeThing } from "../src";

function App() {
  const [res, setRes] = useState();
  useEffect(() => {
    fetch(
      "/v1/relay/api/page/info?unique_page_id=9a83fa5b-acc5-4468-a4c4-dd386ad192a5",
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
  }, []);
  if (!res) return null;
  return (
    <LayerRender
      data={res}
      mountCallback={(that) => {
        console.log(that);
      }}
      goNext={() => {
        console.log("goNext");
      }}
      canvasWidth={1264}
      onChange={(data => {
          console.log(data)
      })}
    />
  );
}

export default App;
