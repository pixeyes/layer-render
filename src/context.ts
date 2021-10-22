import React from "react";

interface IContext {
  colorType: string;
  onChangeColorType:(colorType: string) => void
}

const Context = React.createContext<IContext>({
  colorType: "HEX",
  onChangeColorType:() => {

  }
});

export default Context;
