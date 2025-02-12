"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHash = void 0;
const crypto_1 = __importDefault(require("crypto"));
const createHash = () => {
    // Or using SHA-256 with a random string
    const randomHash = crypto_1.default
        .createHash("sha256")
        .update(crypto_1.default.randomBytes(20).toString("hex"))
        .digest("hex");
    return randomHash;
};
exports.createHash = createHash;
