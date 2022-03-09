import React from "react";
import { ART_SIZE } from "./constants/unit";

export interface IContext {
  colorType: string;
  onChangeColorType: (colorType: string) => void;
  artSize: ART_SIZE | null | undefined;
}

const Context = React.createContext<IContext>({
  colorType: "hex",
  onChangeColorType: () => {},
  artSize: null,
});

export default Context;
