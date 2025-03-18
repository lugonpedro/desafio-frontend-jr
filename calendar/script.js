const eventosJSON = {
  eventos: [
    {
      nome: "Reunião de Planejamento",
      data_inicio: "2025-03-05T10:00",
      data_fim: "2025-03-05T11:30",
      cor: "#FF5733",
    },
    {
      nome: "Sprint Review",
      data_inicio: "2025-03-12T15:00",
      data_fim: "2025-03-12T16:00",
      cor: "#33B5FF",
    },
    {
      nome: "Treinamento de Frontend",
      data_inicio: "2025-03-18T09:00",
      data_fim: "2025-03-18T12:00",
      cor: "#FFC300",
    },
    {
      nome: "Lançamento de Funcionalidade",
      data_inicio: "2025-03-25T13:00",
      data_fim: "2025-03-25T14:00",
      cor: "#28A745",
    },
    {
      nome: "Hackathon Interno",
      data_inicio: "2025-04-03T08:00",
      data_fim: "2025-04-03T18:00",
      cor: "#9B59B6",
    },
    {
      nome: "Palestra de UX/UI",
      data_inicio: "2025-04-10T14:00",
      data_fim: "2025-04-10T16:00",
      cor: "#FF6F61",
    },
    {
      nome: "Reunião de Alinhamento de Produto",
      data_inicio: "2025-04-21T10:30",
      data_fim: "2025-04-21T11:30",
      cor: "#3498DB",
    },
    {
      nome: "Recesso de Feriado",
      data_inicio: "2025-05-01T00:00",
      data_fim: "2025-05-01T23:59",
      cor: "#F1C40F",
    },
    {
      nome: "Entrega de Projeto Alpha",
      data_inicio: "2025-05-15T09:00",
      data_fim: "2025-05-15T12:00",
      cor: "#1ABC9C",
    },
    {
      nome: "Avaliação Semestral",
      data_inicio: "2025-05-30T14:00",
      data_fim: "2025-05-30T16:00",
      cor: "#E74C3C",
    },
  ],
};

document.addEventListener("DOMContentLoaded", function () {
  // get first day of week
  let currentDate = new Date();
  let currentWeekStart = new Date(currentDate);

  const dayOfWeek = currentWeekStart.getDay();
  currentWeekStart.setDate(currentWeekStart.getDate() - dayOfWeek);

  renderCalendar();

  // buttons action
  document.querySelector(".prev-week").addEventListener("click", function () {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    renderCalendar();
  });

  document.querySelector(".next-week").addEventListener("click", function () {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    renderCalendar();
  });

  document
    .querySelector(".today-button")
    .addEventListener("click", function () {
      currentDate = new Date();
      currentWeekStart = new Date(currentDate);
      const dayOfWeek = currentWeekStart.getDay();
      currentWeekStart.setDate(currentWeekStart.getDate() - dayOfWeek);
      renderCalendar();

      scrollToCurrentTime();
    });

  function renderCalendar() {
    const calendarGrid = document.getElementById("calendar-grid");
    calendarGrid.innerHTML = "";

    // create time column
    const timeColumn = document.createElement("div");
    timeColumn.className = "time-column";

    // add time slots for day
    for (let hour = 0; hour < 24; hour++) {
      const timeSlot = document.createElement("div");
      timeSlot.className = "time-slot";
      timeSlot.textContent = `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`;
      timeColumn.appendChild(timeSlot);
    }

    calendarGrid.appendChild(timeColumn);

    // create day columns
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(currentWeekStart);
      dayDate.setDate(currentWeekStart.getDate() + i);

      const dayColumn = document.createElement("div");
      dayColumn.className = "day-column";
      dayColumn.dataset.date = formatDate(dayDate);

      const isCurrentDay = isSameDay(dayDate, new Date());

      // create day header
      const dayHeader = document.createElement("div");
      dayHeader.className = `day-header ${isCurrentDay ? "current-day" : ""}`;

      const monthName = dayDate.toLocaleString("en-US", {
        month: "short",
      });
      const dayNumber = document.createElement("div");
      dayNumber.className = "day-number";
      dayNumber.textContent = dayDate.getDate();

      const dayName = document.createElement("div");
      dayName.className = "day-name";
      dayName.textContent = dayDate.toLocaleString("en-US", {
        weekday: "short",
      });

      const monthElement = document.createElement("div");
      monthElement.style.color = isCurrentDay ? "#5856D6" : "#000";
      monthElement.textContent = monthName;

      dayHeader.appendChild(monthElement);
      dayHeader.appendChild(dayNumber);
      dayHeader.appendChild(dayName);
      dayColumn.appendChild(dayHeader);

      // create day cells for day
      for (let hour = 0; hour < 24; hour++) {
        const dayCell = document.createElement("div");
        dayCell.className = "day-cell";
        dayCell.dataset.hour = hour;
        dayColumn.appendChild(dayCell);
      }

      calendarGrid.appendChild(dayColumn);
    }

    // add current time line if the current week is being displayed
    const now = new Date();
    const weekStart = new Date(currentWeekStart);
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    if (now >= weekStart && now <= weekEnd) {
      const dayOfWeek = now.getDay();
      const hour = now.getHours();
      const minute = now.getMinutes();

      const dayColumn = calendarGrid.children[dayOfWeek + 1]; // +1 because the first column is the time column
      const hourIndex = hour;
      const dayCell = dayColumn.children[hourIndex + 1]; // +1 because the first child is the day header

      const percentage = (minute / 60) * 100;

      const timeLine = document.createElement("div");
      timeLine.className = "current-time-line";
      timeLine.style.top = `${percentage}%`;

      const timeLineDot = document.createElement("div");
      timeLineDot.className = "current-time-dot";

      timeLine.appendChild(timeLineDot);
      dayCell.appendChild(timeLine);

      setTimeout(scrollToCurrentTime, 100);
    }

    // add events to calendar
    if (eventosJSON && eventosJSON.eventos) {
      eventosJSON.eventos.forEach((evento) => {
        const startDate = new Date(evento.data_inicio);
        const endDate = new Date(evento.data_fim);

        if (isDateInWeek(startDate, currentWeekStart)) {
          const eventDay = startDate.getDay();
          const dayColumn = calendarGrid.children[eventDay + 1]; // +1 because the first column is the time column

          const startHour = startDate.getHours();
          const startMinute = startDate.getMinutes();
          const endHour = endDate.getHours();
          const endMinute = endDate.getMinutes();

          const startPosition = startHour * 60 + startMinute;
          const endPosition = endHour * 60 + endMinute;
          const duration = endPosition - startPosition;

          const eventElement = document.createElement("div");
          eventElement.className = "event";
          eventElement.textContent = evento.nome;
          eventElement.style.backgroundColor = evento.cor + "4D"; // add 4D for opacity

          eventElement.style.top = `${100 + startPosition}px`;
          eventElement.style.height = `${duration - 10}px`;
          eventElement.style.left = "5px";
          eventElement.style.right = "5px";

          dayColumn.appendChild(eventElement);
        }
      });
    }
  }

  function scrollToCurrentTime() {
    const now = new Date();
    const hour = now.getHours();

    // calculate scroll position (100px header + hour * 60px per hour - some offset to center)
    const scrollPosition = 100 + hour * 60 - 200;

    document.querySelector(".calendar-grid-container").scrollTop =
      scrollPosition;
  }

  function isSameDay(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function isDateInWeek(date, weekStart) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return date >= weekStart && date <= weekEnd;
  }
});
