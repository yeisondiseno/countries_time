import { describe, expect, test } from "bun:test";
import { sanitizeInputChange, sanitizeUserHtml } from "./sanitize";

describe("sanitizeInputValue", () => {
  test("strips HTML tags from search text", () => {
    expect(
      sanitizeInputChange('<img src=x onerror="alert(1)">es', "search"),
    ).toBe("es");
  });

  test("removes control characters", () => {
    expect(sanitizeInputChange("a\u0000b", "text")).toBe("ab");
  });

  test("limits search length", () => {
    expect(sanitizeInputChange("x".repeat(250), "search")).toHaveLength(200);
  });

  test("strips script markup from date via sanitize-html", () => {
    expect(
      sanitizeInputChange("2026-05-21<script>alert(1)</script>", "date"),
    ).toBe("2026-05-21");
  });

  test("keeps only date characters", () => {
    expect(sanitizeInputChange("2026-05-21abc", "date")).toBe("2026-05-21");
  });

  test("keeps only time characters", () => {
    expect(sanitizeInputChange("14:30\x07", "time")).toBe("14:30");
  });
});

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
