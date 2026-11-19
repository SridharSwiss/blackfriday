import { SourceAgent } from "./source-agent.mjs";

class TestAgent extends SourceAgent {
  constructor() {
    super({
      name: "Test",
      baseUrl: "https://example.com",
      dealPathPatterns: ["/test"],
      selectors: { name: "h1" },
    };
  }

  async extractDealUrls(html) {
    return ["https://example.com/test"];
  }

  async extractDealFields(html, url) {
    return { name: "Test", price: 100, was: 100, percent: 0, until: "2026-12-31", note: "Test" };
  }

async function runAllSources() {
  const agents = [new (require('./sources/preispirat.mjs').PreispiratAgent)()];
  const results = await runAllSources();
  console.log("Results:", results.length);
  return results;
}

runAllSources();