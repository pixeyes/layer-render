import React from "react";
import res from "./data";
import LayerRender from "../src";
import {doSomeThing} from "./something";
const data = doSomeThing(res);
function App() {
    return (
        <LayerRender
            data={data}
            goNext={() => {
                console.log("goNext");
            }}
        />
    );
}

export default App;
