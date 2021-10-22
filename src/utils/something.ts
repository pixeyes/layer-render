import { normalizr } from "../utils";

export default function doSomeThing(res: any) {
  const t = res;
  let c: any = null;
  try {
    t.name = decodeURIComponent(t.name);
    t.width *= 1;
    t.height *= 1;

    c = t;
    try {
      const e: any = {};
      if (
        ("web" !== c.platform
          ? (e.info = JSON.parse(c.data))
          : (e.info = [
              {
                name: t.unique_page.name,
                width: t.width,
                height: t.height,
                top: 0,
                left: 0,
              },
            ]),
        2 === c.data_version)
      ) {
        e.layer = JSON.parse(JSON.stringify(e.info));
        e.info = normalizr(JSON.parse(JSON.stringify(e.info)));
      }

      e.info.map(function (t: any, e: any) {
        t.idx = e
          //(t.artboard_scale = res.artboard_scale),
          t.hasOwnProperty("image") && (t.image.id = e)
      });
      c.data = e;
    } catch (u) {
      console.log(u);
    }
  } catch (e) {
    c = null;
  }
  return c;
}
