/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// red-glade-16e4/worker.js
var worker_default = {
  async fetch(request, env) {
    return await handleRequest(request, env);
  }
};

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request, env) {
  if (request.method === "POST") {
    const url = new URL(request.url);
    if (url.pathname === "/upload") {
      return await handleUpload(request, env);
    }
  }
  if (request.method === "OPTIONS") {
    return handleOptions(request);
  }
  return new Response("Not found", { status: 404 });
}

function handleOptions(request) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400"
    }
  });
}

async function handleUpload(request, env) {
  // I have no idea how this works, but it does.

  if (!env || !env.photos) {
    console.error("Environment variable photos is not defined or not accessible");
    return new Response(JSON.stringify({ message: "Internal Server Error: Environment variable photos is not defined or not accessible" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  const formData = await request.formData();
  const images = formData.getAll("images");
  if (!images.length) {
    return new Response(JSON.stringify({ message: "No images uploaded" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
  
  const promises = images.map(async (image) => {
    const blob = await image.arrayBuffer();
    const key = `images/${image.name}`;
    await env.photos.put(key, blob);
    return key;
  });
  const keys = await Promise.all(promises);
  return new Response(JSON.stringify({ message: "Upload successful", keys }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
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

