const crypto = require("crypto");

const createHash = () => {
  // Or using SHA-256 with a random string
  const randomHash = crypto
    .createHash("sha256")
    .update(crypto.randomBytes(20).toString("hex"))
    .digest("hex");
  return randomHash;
};

module.exports = {
  createHash,
};
