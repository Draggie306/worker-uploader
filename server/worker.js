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

async function handleRequest(request) {
    if (request.method === "POST") {
      const url = new URL(request.url);
      if (url.pathname === "/upload") {
        // upload it to the bucket
        return await handleUpload(request, env);
      }
    }
    return new Response("Not found! :(", { status: 404 });
  }

  async function handleUpload(request) {
    const formData = await request.formData();
    const file = formData.get("file");
    const reader = file.stream().getReader();
    const bucket = new Bucket(env.BUCKET_NAME);
    const writer = bucket.file(file.name).createWriteStream();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      writer.write(value);
    }
    writer.end();
    return new Response("Uploaded!", { status: 200 });
  }


/*
todo: 
- add a route to handle the upload
- connect r2 bucket with env variables
- everything else
*/

export {
worker_default as default
};

