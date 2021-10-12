import * as React from "react";
import { Font } from "./Property";
import { ColorItem } from "./ColorProperty";
import { ALIGN, VerticalAlignment } from "./constants";

interface FontPropertyProps {
  font: Font;
}

const FontProperty: React.FC<FontPropertyProps> = ({ font }) => {
  return (
    <div className="property-font group">
      <div className="property-font-item">
        <ul>
          {font?.family && (
            <li>
              <div className="l">字体</div>
              <div title="PingFangSC" className="r text">
                {font.family}
              </div>
            </li>
          )}
          <li>
            <div className="l">字重</div>
            <div className="r text">{font.style}</div>
          </li>
          <li>
            <div className="l">字号</div>
            <div className="r text">{font.size}px</div>
          </li>
          <li>
            <ColorItem color={font.color} />
          </li>
          <li style={{ height: "auto", flexWrap: "wrap" }}>
            <div className="l">对齐</div>
            <div title="左对齐" className="r text">
              {ALIGN[font.align]}
            </div>
            <div
              title="垂直顶对齐"
              className="r text"
              style={{ marginLeft: 16 }}
            >
              {VerticalAlignment[font.verticalAlignment]}
            </div>
          </li>

          <li style={{ height: 88, flexWrap: "wrap" }}>
            <div className="l">空间</div>
            <div data-title="字间距" title="0" className="r text">
              字间距 {font.spacing}
            </div>
            <div
              data-title="行间距"
              title="32pt"
              className="r text"
              style={{ marginLeft: 16 }}
            >
              行间距 {font.lineHeight}px
            </div>
            <div
              data-title="段落"
              title="0"
              className="r text"
              style={{
                marginLeft: 52,
                marginTop: 16,
                width: "50%",
                flex: "1 0 auto",
              }}
            >
              段落 {font.paragraphSpacing}
            </div>
          </li>
          <li className="autoHeight">
            <div className="l">内容</div>
            <div title={font.content} className="r text text-content">
              <span>{font.content}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FontProperty;
