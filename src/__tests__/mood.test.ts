import { moodFromDamage, getMoodTheme, deriveLessons, buildSubtitle } from "@/lib/mood";

describe("moodFromDamage", () => {
  it("returns 'calm' for values 0–2", () => {
    expect(moodFromDamage(0)).toBe("calm");
    expect(moodFromDamage(2)).toBe("calm");
  });

  it("returns 'reflective' for values 3–5", () => {
    expect(moodFromDamage(3)).toBe("reflective");
    expect(moodFromDamage(5)).toBe("reflective");
  });

  it("returns 'spicy' for values 6–8", () => {
    expect(moodFromDamage(6)).toBe("spicy");
    expect(moodFromDamage(8)).toBe("spicy");
  });

  it("returns 'nuclear' for values 9–10", () => {
    expect(moodFromDamage(9)).toBe("nuclear");
    expect(moodFromDamage(10)).toBe("nuclear");
  });
});

describe("getMoodTheme", () => {
  it("returns a theme object with required fields", () => {
    const theme = getMoodTheme("calm");
    expect(theme).toHaveProperty("preset", "calm");
    expect(theme).toHaveProperty("label");
    expect(theme).toHaveProperty("accent");
    expect(theme).toHaveProperty("accentLight");
    expect(theme).toHaveProperty("mascot");
    expect(theme).toHaveProperty("closingLine");
  });

  it("returns correct mascot for each mood", () => {
    expect(getMoodTheme("calm").mascot).toBe("calm");
    expect(getMoodTheme("reflective").mascot).toBe("side-eye");
    expect(getMoodTheme("spicy").mascot).toBe("dead-inside");
    expect(getMoodTheme("nuclear").mascot).toBe("dead-inside");
  });
});

describe("deriveLessons", () => {
  it("returns at least 2 lessons", () => {
    const lessons = deriveLessons(1, 0);
    expect(lessons.length).toBeGreaterThanOrEqual(2);
  });

  it("includes 'Ignored red flags (never again)' for high emotional damage", () => {
    const lessons = deriveLessons(8, 0);
    expect(lessons).toContain("Ignored red flags (never again)");
  });
});

describe("buildSubtitle", () => {
  it("formats months < 12 correctly", () => {
    expect(buildSubtitle(6, 0)).toContain("6 months invested");
  });

  it("formats months >= 12 with years", () => {
    const result = buildSubtitle(18, 5000);
    expect(result).toContain("1 year");
    expect(result).toContain("6 mo");
    expect(result).toContain("₹5,000");
  });

  it("always ends with 'No refund'", () => {
    expect(buildSubtitle(1, 0)).toContain("No refund");
  });
});
