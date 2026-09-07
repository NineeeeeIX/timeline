const timeline = document.getElementById("timeline");

const EVENT_WIDTH = 300;
const EVENT_GAP = 30;
const BRANCH_GAP = 80;

/* =========================================================
   สร้าง Timeline
   ========================================================= */

timelineData.forEach((yearData, yearIndex) => {
  const isLeft = yearIndex % 2 === 0;

  /* -----------------------------------------------------
       Year Section
       ----------------------------------------------------- */

  const yearSection = document.createElement("section");

  yearSection.className = "year-section";

  if (isLeft) {
    yearSection.classList.add("left");
  } else {
    yearSection.classList.add("right");
  }

  /* -----------------------------------------------------
       Canvas
       ----------------------------------------------------- */

  const canvas = document.createElement("div");

  canvas.className = "year-canvas";

  /* -----------------------------------------------------
       Timeline Line
       ----------------------------------------------------- */

  const timelineLine = document.createElement("div");

  timelineLine.className = "timeline-line";

  /* -----------------------------------------------------
       Year Point
       ----------------------------------------------------- */

  const yearPoint = document.createElement("div");

  yearPoint.className = "year-point";

  yearPoint.innerHTML = `
        <span>${yearData.year}</span>
        <div class="year-dot"></div>
    `;

  /* -----------------------------------------------------
       Branch Line
       ----------------------------------------------------- */

  const branchLine = document.createElement("div");

  branchLine.className = "branch-line";

  /* -----------------------------------------------------
       Events
       ----------------------------------------------------- */

  const events = document.createElement("div");

  events.className = "events";

  yearData.events.forEach((eventData) => {
    const event = document.createElement("article");

    event.className = "event";

    event.innerHTML = `
            <img src="${eventData.image}" alt="${eventData.title}">

            <h2>${eventData.title}</h2>

            <p>${eventData.text}</p>
        `;

    events.appendChild(event);
  });

  /* -----------------------------------------------------
       คำนวณความกว้างของ Events
       ----------------------------------------------------- */

  const eventCount = yearData.events.length;

  const eventsWidth = eventCount * EVENT_WIDTH + (eventCount - 1) * EVENT_GAP;

  yearSection.dataset.eventsWidth = eventsWidth;

  /* -----------------------------------------------------
       กำหนดความกว้างให้ Canvas
       ----------------------------------------------------- */

  const canvasWidth = window.innerWidth / 2 + BRANCH_GAP + eventsWidth;

  canvas.style.width = `${canvasWidth}px`;

  canvas.style.setProperty("--events-width", `${eventsWidth}px`);

  canvas.style.setProperty("--branch-gap", `${BRANCH_GAP}px`);

  /* -----------------------------------------------------
       Next Button
       ----------------------------------------------------- */

  const nextButton = document.createElement("button");

  nextButton.className = "next-button";

  if (yearIndex === timelineData.length - 1) {
    nextButton.textContent = "ไปที่คำถาม";
  } else {
    nextButton.textContent = "ต่อไป";
  }

  /* -----------------------------------------------------
       ประกอบ Events
       ----------------------------------------------------- */

  canvas.appendChild(timelineLine);

  canvas.appendChild(yearPoint);

  canvas.appendChild(branchLine);

  canvas.appendChild(events);

  canvas.appendChild(nextButton);

  yearSection.appendChild(canvas);

  timeline.appendChild(yearSection);

  /* -----------------------------------------------------
       ตั้งตำแหน่งเริ่มต้นของการ Scroll
       ----------------------------------------------------- */

  if (isLeft) {
    requestAnimationFrame(() => {
      yearSection.scrollLeft =
        yearSection.scrollWidth - yearSection.clientWidth;
    });
  } else {
    yearSection.scrollLeft = 0;
  }

  /* -----------------------------------------------------
       ตรวจว่าดู Events ครบหรือยัง
       ----------------------------------------------------- */

  function checkScrollEnd() {
    const scrollLeft = yearSection.scrollLeft;

    const maxScroll = yearSection.scrollWidth - yearSection.clientWidth;

    /*
     * ฝั่งซ้าย
     *
     * ต้อง scroll ไปจนสุดซ้าย
     */

    if (isLeft) {
      if (scrollLeft <= 5) {
        nextButton.classList.add("show");
      } else {
        nextButton.classList.remove("show");
      }
    } else {
      /*
       * ฝั่งขวา
       *
       * ต้อง scroll ไปจนสุดขวา
       */
      if (scrollLeft >= maxScroll - 5) {
        nextButton.classList.add("show");
      } else {
        nextButton.classList.remove("show");
      }
    }
  }

  yearSection.addEventListener("scroll", checkScrollEnd);

  /* -----------------------------------------------------
       ปุ่ม Next
       ----------------------------------------------------- */

  nextButton.addEventListener("click", () => {
    if (yearIndex < timelineData.length - 1) {
      const nextSection = timeline.children[yearIndex + 1];

      const nextYearIsLeft = (yearIndex + 1) % 2 === 0;

      const nextEventsWidth = Number(nextSection.dataset.eventsWidth);

      /* กลับไปโฟกัส Timeline */

      if (nextYearIsLeft) {
        nextSection.scrollLeft =
          nextSection.scrollWidth - nextSection.clientWidth;
      } else {
        nextSection.scrollLeft = 0;
      }

      /* เลื่อนลงไปปีถัดไป */

      nextSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      const question = document.getElementById("question");

      question.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });

  /* -----------------------------------------------------
       ตรวจครั้งแรก
       ----------------------------------------------------- */

  checkScrollEnd();
});
