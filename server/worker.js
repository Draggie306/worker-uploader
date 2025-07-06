// red-glade-16e4/worker.js
var worker_default = {
  async fetch(request, env) {
    return await handleRequest(request, env);
  }
};
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
async function handleUpload(request, env) {
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
  try {
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
    
    try {
      console.log("sending discord webhook")
      await send_webook_request(`${keys[0]}`, images.length)
    } catch (e) {
      console.error(e);
      null;
    }

    return new Response(JSON.stringify({ message: "Upload successful", keys }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}

/**
 * Sends a link to the resource uploaded to a Discord webhook.
 * @param {string} file_key
 * @param {number} num_msgs
 */
async function send_webook_request(file_key, num_msgs) {
  const discord_webhook_url = env.DISCORD_WEBHOOK_URL;

  // Assets may have spaces so use markdown formatting.
  var full_url = new URL(`${env.BASE_DEV_R2_URL}/${file_key}`).href;

  // Ternary operator for grammar
  var webhook_payload_content = num_msgs == 1 ? `1 new asset has been uploaded @here to the storage bucket, R2 preview url: [${file_key}](${full_url})` : `${num_msgs} assets have been uploaded @here to the storage bucket, R2 preview url: [${file_key}](${full_url})`

  // console.log(webhook_payload_content);

  let result = await fetch(discord_webhook_url,
    {
      // Set Discord's expected values...
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },

      // ...and the actual content.
      body: JSON.stringify({
        username: 'New Uploaded Media',
        content: webhook_payload_content,
      })
    }
  )

  // View this in the Worker -> Real-time logs.
  console.log(`discord response: ${result.status}, ${result.text()}`);
}


export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
