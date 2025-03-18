import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import { renderCalendar } from "../script.js";

describe("Calendar Tests", () => {
  let eventosJSON;
  let dom;

  beforeAll(() => {
    const html = fs.readFileSync(
      path.resolve(__dirname, "../index.html"),
      "utf8"
    );
    dom = new JSDOM(html);

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

  test("must render calendar", () => {
    document.body.innerHTML = dom.window.document.body.innerHTML;

    renderCalendar(eventosJSON.eventos, new Date("2025-03-18T15:00:00"));

    const calendarGrid = document.getElementById("calendar-grid");
    expect(calendarGrid).not.toBeNull();

    const dayColumns = document.querySelectorAll(".day-column");
    expect(dayColumns.length).toBe(7);
  });
});
