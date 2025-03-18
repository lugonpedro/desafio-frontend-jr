import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import { renderCalendar, clickableButtons } from "../script.js";

describe("Calendar Tests", () => {
  let eventosJSON;
  let dom;

  beforeAll(() => {
    const html = fs.readFileSync(
      path.resolve(__dirname, "../index.html"),
      "utf8",
    );
    dom = new JSDOM(html);

    try {
      const data = fs.readFileSync(
        path.resolve(__dirname, "../eventos.json"),
        "utf8",
      );
      eventosJSON = JSON.parse(data);
    } catch (error) {
      console.error("Erro:", error);
    }
  });

  describe("when rendering calendar", () => {
    test("must render days, hours and event", () => {
      document.body.outerHTML = dom.window.document.body.outerHTML;
      const date = new Date("2025-03-05T10:00:00");

      renderCalendar(eventosJSON.eventos, date);

      const calendarGrid = document.getElementById("calendar-grid");
      expect(calendarGrid).not.toBeNull();

      const dayColumns = document.querySelectorAll(".day-column");
      expect(dayColumns.length).toBe(7);

      const timeColumns = document.querySelectorAll(".time-slot");
      expect(timeColumns.length).toBe(24);

      const events = document.getElementsByClassName("event");
      expect(events.length).toBe(1);
      expect(events[0].textContent).toBe("Reunião de Planejamento");
    });
  });

  describe("when clicking buttons", () => {
    test("must go to previous week", () => {
      document.body.outerHTML = dom.window.document.body.outerHTML;
      const date = new Date("2025-03-18T15:00:00");
      const currentDate = new Date();

      renderCalendar(eventosJSON.eventos, date);
      clickableButtons(eventosJSON.eventos, date, currentDate);

      const dayHeader = document.querySelector(".day-header");
      const monthName = dayHeader.firstChild.textContent;
      const dayNumber = dayHeader.querySelector(".day-number").textContent;
      expect(monthName).toBe("Mar");
      expect(dayNumber).toBe("18");

      const button = document.querySelector(".prev-week");
      button.click();
      expect(button).not.toBeNull();

      const dayHeaderAfter = document.querySelector(".day-header");
      const monthNameAfter = dayHeaderAfter.firstChild.textContent;
      const dayNumberAfter =
        dayHeaderAfter.querySelector(".day-number").textContent;
      expect(monthNameAfter).toBe("Mar");
      expect(dayNumberAfter).toBe("11");
    });

    test("must go to next week", () => {
      document.body.outerHTML = dom.window.document.body.outerHTML;
      const date = new Date("2025-03-30T15:00:00");
      const currentDate = new Date();

      renderCalendar(eventosJSON.eventos, date);
      clickableButtons(eventosJSON.eventos, date, currentDate);

      const dayHeader = document.querySelector(".day-header");
      const monthName = dayHeader.firstChild.textContent;
      const dayNumber = dayHeader.querySelector(".day-number").textContent;
      expect(monthName).toBe("Mar");
      expect(dayNumber).toBe("30");

      const button = document.querySelector(".next-week");
      button.click();
      expect(button).not.toBeNull();

      const dayHeaderAfter = document.querySelector(".day-header");
      const monthNameAfter = dayHeaderAfter.firstChild.textContent;
      const dayNumberAfter =
        dayHeaderAfter.querySelector(".day-number").textContent;
      expect(monthNameAfter).toBe("Apr");
      expect(dayNumberAfter).toBe("6");
    });

    test("must go to this week", () => {
      document.body.outerHTML = dom.window.document.body.outerHTML;
      const date = new Date("2020-01-01T15:00:00");
      const currentDate = new Date();

      renderCalendar(eventosJSON.eventos, date);
      clickableButtons(eventosJSON.eventos, date, currentDate);

      const dayHeader = document.querySelector(".day-header");
      const monthName = dayHeader.firstChild.textContent;
      const dayNumber = dayHeader.querySelector(".day-number").textContent;
      expect(monthName).toBe("Jan");
      expect(dayNumber).toBe("1");

      const button = document.querySelector(".today-button");
      button.click();
      expect(button).not.toBeNull();

      const today = new Date();
      const dayOfWeek = today.getDay();
      const sunday = new Date(today);
      sunday.setDate(today.getDate() - dayOfWeek);

      const dayHeaderAfter = document.querySelector(".day-header");
      const monthNameAfter = dayHeaderAfter.firstChild.textContent;
      const dayNumberAfter =
        dayHeaderAfter.querySelector(".day-number").textContent;
      const expectedMonthName = sunday.toLocaleString("en-US", {
        month: "short",
      });
      const expectedDayNumber = sunday.getDate().toString();
      expect(monthNameAfter).toBe(expectedMonthName);
      expect(dayNumberAfter).toBe(expectedDayNumber);
    });
  });
});
