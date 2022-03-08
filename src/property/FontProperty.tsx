import * as React from "react";
import { Font } from "./Property";
import { ALIGN, VerticalAlignment } from "./constants";
import { useContext } from "react";
import Context from "../context";
import { toUnitFont } from "../utils";
import {Basic, Color, Divider, Row} from "@pixeyes/property";

interface FontPropertyProps {
  font: Font;
}

const FontProperty: React.FC<FontPropertyProps> = ({ font }) => {
  const { artSize } = useContext(Context);
  return (
    <>
      <Divider />
      <Row>
        {font?.family && (
          <Basic type="block" title="字体" content={font.family} />
        )}
      </Row>
      <Row>
        <Basic title="字号" content={toUnitFont(font.size, artSize!)} />
        <Basic title="字重" content={font.style} />

        <Basic title="水平对齐" content={ALIGN[font.align]} />
        <Basic
          title="垂直对齐"
          content={VerticalAlignment[font.verticalAlignment]}
        />
      </Row>
      <Row>
        <Color color={font.color} placement="bottomLeft" />
      </Row>
      <Row>
        <Basic title="字间距" content={font.spacing} />
        <Basic title="行间距" content={font.lineHeight + artSize!.fontUnit} />
        <Basic title="段落" content={font.paragraphSpacing + ""} />
        <Basic type="block" title="内容" content={font.content} />
      </Row>
    </>
  );
};

export default FontProperty;
