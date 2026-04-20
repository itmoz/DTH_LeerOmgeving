export function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";

    req.on("data", chunk => {
      data += chunk;
    });

    req.on("end", () => {
      try {
        const parsed = JSON.parse(data || "{}");
        resolve(parsed);
      } catch (err) {
        console.error("JSON parse error:", err);
        resolve({});
      }
    });

    req.on("error", reject);
  });
}