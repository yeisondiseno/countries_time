import { describe, expect, test } from "bun:test";

import { serializeJsonLd } from "./serialize-json-ld";

describe("serializeJsonLd", () => {
  test("escapes script breakout characters", () => {
    const payload = { text: "</script><script>alert(1)</script>" };
    const serialized = serializeJsonLd(payload);

    expect(serialized).not.toContain("</script>");
    expect(serialized).toContain("\\u003c/script\\u003e");
  });
});
