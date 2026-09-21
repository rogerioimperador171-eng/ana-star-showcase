// Meta Pixel (Facebook Pixel) — código oficial de instalação.
// Mantido aqui para que a mesma cópia seja usada no <head> e no <noscript>.

export const META_PIXEL_ID = "1585362203170969";

/** JavaScript inline do Meta Pixel (vai dentro de um <script> no <head>). */
export const META_PIXEL_SCRIPT = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
`.trim();

/** URL da imagem de fallback para quem está sem JavaScript. */
export const META_PIXEL_NOSCRIPT_SRC = `https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`;
