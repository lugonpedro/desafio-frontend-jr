import fs from "fs";
import path from "path";

describe("Event Tests", () => {
  let eventosJSON = {};

  beforeAll(() => {
    try {
      const data = fs.readFileSync(
        path.resolve(__dirname, "../eventos.json"),
        "utf8"
      );
      eventosJSON = JSON.parse(data);
    } catch (error) {
      console.error("Erro:", error);
    }
  });
  test("must get events in json", () => {
    expect(eventosJSON.eventos).toHaveLength(10);
    expect(eventosJSON.eventos[0].nome).toBe("Reunião de Planejamento");
  });
});
