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
    // To do.

    return new Response("Not implemented", { status: 501 });
  }
};


/*
todo: 
- add a route to handle the upload
- connect r2 bucket with env variables
- everything else
*/

export {
worker_default as default
};

