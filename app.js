const timeline = document.getElementById("timeline");
const question = document.getElementById("question");

/* =========================================================
   CONFIG
   ========================================================= */

const EVENT_WIDTH = 300;
const EVENT_GAP = 30;
const BRANCH_GAP = 80;

/* =========================================================
   คำนวณความกว้างของ Events
   ========================================================= */

function getEventsWidth(eventCount) {
  return eventCount * EVENT_WIDTH + (eventCount - 1) * EVENT_GAP;
}

/* =========================================================
   คำนวณความกว้างของโลกทั้งหมด
   ========================================================= */

const maxEventsWidth = Math.max(
  ...timelineData.map((yearData) => getEventsWidth(yearData.events.length)),
);

const worldWidth = Math.max(
  window.innerWidth * 2,
  maxEventsWidth + window.innerWidth + BRANCH_GAP * 2,
);

timeline.style.width = `${worldWidth}px`;

/* =========================================================
   สร้าง Timeline Sections
   ========================================================= */

timelineData.forEach((yearData, yearIndex) => {
  const yearSection = document.createElement("section");
  yearSection.className = "year-section";
  yearSection.style.width = `${worldWidth}px`;

  /* สลับซ้าย / ขวา */
  const isLeft = yearIndex % 2 === 0;
  yearSection.classList.add(isLeft ? "left" : "right");

  /* Year Badge บนเส้น Timeline */
  const yearBadge = document.createElement("div");
  yearBadge.className = "year-badge";
  yearBadge.innerHTML = `<span>${yearData.year}</span><div class="year-dot"></div>`;

  /* Branch Line */
  const branchLine = document.createElement("div");
  branchLine.className = "branch-line";

  /* Events */
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

  /* Next Button */
  const nextButton = document.createElement("button");
  nextButton.className = "next-button";
  nextButton.textContent =
    yearIndex === timelineData.length - 1 ? "ไปที่คำถาม" : "ต่อไป";

  nextButton.addEventListener("click", () => {
    const sections = timeline.querySelectorAll(".year-section");
    if (yearIndex < sections.length - 1) {
      const nextSection = sections[yearIndex + 1];
      window.scrollTo({
        left: getCenterScrollPosition(),
        top: nextSection.offsetTop,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        left: 0,
        top: question.offsetTop,
        behavior: "smooth",
      });
    }
  });

  /* ประกอบ Section */
  yearSection.appendChild(yearBadge);
  yearSection.appendChild(branchLine);
  yearSection.appendChild(events);
  yearSection.appendChild(nextButton);

  timeline.appendChild(yearSection);
});

/* =========================================================
   ตำแหน่งกลางของ Timeline
   ========================================================= */

function getCenterScrollPosition() {
  const viewportWidth = window.innerWidth;
  return (worldWidth - viewportWidth) / 2;
}

/* =========================================================
   เริ่มต้น
   ========================================================= */

window.addEventListener("load", () => {
  window.scrollTo({
    left: getCenterScrollPosition(),
    top: 0,
    behavior: "instant",
  });
});

