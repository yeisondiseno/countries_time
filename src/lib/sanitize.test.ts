import { describe, expect, test } from "bun:test";
import { sanitizeUserHtml } from "./sanitize";

describe("sanitizeUserHtml", () => {
  test("strips scripts and event handlers", () => {
    const dirty =
      '<p onclick="alert(1)"><script>x</script><a href="javascript:evil()">lnk</a><b>b</b></p>';
    const clean = sanitizeUserHtml(dirty);
    expect(clean).not.toContain("<script>");
    expect(clean).not.toContain("onclick");
    expect(clean).not.toContain("javascript:");
    expect(clean).toContain("<b>");
    expect(clean).toContain("nofollow");
  });
});
