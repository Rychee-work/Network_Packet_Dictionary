export async function onRequest(context) {
  const req = context.request;
  const url = new URL(req.url);

  const host = url.hostname;
  const targetHost = "packetdictionary.com";

  // 1) pages.dev -> custom domain
  if (host.endsWith(".pages.dev")) {
    url.hostname = targetHost;
    url.protocol = "https:"; // 念のため固定
    return Response.redirect(url.toString(), 301);
  }

  // 2) www -> apex (任意)
  if (host === `www.${targetHost}`) {
    url.hostname = targetHost;
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  // 3) それ以外は通常通り
  return context.next();
}
