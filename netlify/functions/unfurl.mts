import type { Config } from "@netlify/functions";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 Unfurl/1.0";
const MAX_IMAGE = 6 * 1024 * 1024;

function meta(html: string, keys: string[]): string {
  for (const key of keys) {
    const re = new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*>`, "i");
    const tag = html.match(re)?.[0];
    if (!tag) continue;
    const v = tag.match(/content=["']([^"']*)["']/i)?.[1];
    if (v) return decode(v.trim());
  }
  return "";
}
function decode(s: string) {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
}

export default async (req: Request) => {
  const target = new URL(req.url).searchParams.get("url") || "";
  let u: URL;
  try { u = new URL(/^https?:\/\//i.test(target) ? target : "https://" + target); } catch { return Response.json({ error: "Not a valid URL" }, { status: 400 }); }
  if (!/^https?:$/.test(u.protocol)) return Response.json({ error: "Only http(s) URLs" }, { status: 400 });

  let html = "";
  try {
    const r = await fetch(u, { headers: { "user-agent": UA, accept: "text/html,*/*" }, redirect: "follow", signal: AbortSignal.timeout(8000) });
    if (!r.ok) return Response.json({ error: `Site answered ${r.status}` }, { status: 502 });
    html = (await r.text()).slice(0, 600_000);
  } catch (e) { return Response.json({ error: "Could not reach that site" }, { status: 502 }); }

  const head = html.split(/<\/head>/i)[0] || html;
  const title = meta(head, ["og:title", "twitter:title"]) || decode(head.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || "");
  const description = meta(head, ["og:description", "twitter:description", "description"]);
  const siteName = meta(head, ["og:site_name"]) || u.hostname.replace(/^www\./, "");
  const canonical = meta(head, ["og:url"]);
  let domain = u.hostname.replace(/^www\./, "");
  try { if (canonical) domain = new URL(canonical).hostname.replace(/^www\./, ""); } catch {}
  const imageRaw = meta(head, ["og:image:secure_url", "og:image", "twitter:image", "twitter:image:src"]);

  let image: string | null = null, imageError: string | null = null;
  if (imageRaw) {
    try {
      const iu = new URL(imageRaw, u);
      const ir = await fetch(iu, { headers: { "user-agent": UA, accept: "image/*" }, redirect: "follow", signal: AbortSignal.timeout(8000) });
      const type = ir.headers.get("content-type")?.split(";")[0] || "image/jpeg";
      if (!ir.ok || !type.startsWith("image/")) imageError = `Image answered ${ir.status}`;
      else {
        const buf = Buffer.from(await ir.arrayBuffer());
        if (buf.length > MAX_IMAGE) imageError = "Image over 6 MB";
        else image = `data:${type};base64,${buf.toString("base64")}`;
      }
    } catch { imageError = "Could not fetch the image"; }
  }

  return Response.json({ url: u.href, title, description, siteName, domain, image, imageUrl: imageRaw || null, imageError },
    { headers: { "cache-control": "no-store" } });
};

export const config: Config = { path: "/api/unfurl" };
