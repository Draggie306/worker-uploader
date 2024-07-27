/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request, env) {
  return await handleUpload(request, env);
}

async function handleUpload(request, env) {
  const formData = await request.formData();
  const images = formData.getAll("images");
  
  const blob = await image.arrayBuffer();
  const key = `images/${image.name}`;
  await env.photos.put(key, blob);

  return new Response("Done", { status: 200 });
}

export {
worker_default as default
};

