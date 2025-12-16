import { describe, it, expect } from "vitest";
import { compressImages } from "../src/index.js";

describe("compressImages", () => {
    it("should reject invalid directories", async () => {
        await expect(
            compressImages({ input: "/noexistent" })
        ).rejects.toThrow();
    });
});
