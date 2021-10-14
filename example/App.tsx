import React from "react";
import res from "./data";
import LayerRender from "../src";
import {doSomeThing} from "./something";
const data = doSomeThing(res);
function App() {
    return (
        <LayerRender
            data={data}
            mountCallback={(that) => {
                console.log(that)
            }}
            onMouseDown={(current => {
                console.log(current)
            })}
            goNext={() => {
                console.log("goNext");
            }}
            canvasWidth={864}
        />
    );
}

export default App;
