import { useEffect, useState } from "react";
import LayerRender, { doSomeThing } from "../src";
import relay from './data'

function App() {
  const [res, setRes] = useState();
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
    }else {
        const data = doSomeThing(relay);
        setRes(data);
    }
  }, []);
  if (!res) return null;
  return (
    <LayerRender
      data={res}
      mountCallback={(that) => {
        console.log(that);
      }}
      canvasWidth={1264}
      onChange={(data) => {
        console.log(data);
      }}
    />
  );
}

export default App;
