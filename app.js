const timeline = document.getElementById("timeline");
const questionSection = document.getElementById("question");
const questionFeedback = document.getElementById("question-feedback");
const choice1 = document.getElementById("choice-1");
const choice2 = document.getElementById("choice-2");
const finalOverlay = document.getElementById("final-overlay");

/* =========================================================
   CONFIG
   ========================================================= */

const EVENT_WIDTH = 300;
const EVENT_GAP = 30;
const BRANCH_GAP = 80;
const NEXT_BTN_WIDTH = 180;

/* =========================================================
   STATE
   ========================================================= */

let currentYearIndex = 0;
let state = "VIEWING_YEAR";

function setState(newState) {
  state = newState;
  document.body.className =
    "state-" + newState.toLowerCase().replace(/_/g, "-");
}

/* =========================================================
   คำนวณความกว้าง
   ========================================================= */

function getEventsWidth(eventCount) {
  return eventCount * EVENT_WIDTH + NEXT_BTN_WIDTH + eventCount * EVENT_GAP;
}

const maxEventsWidth = Math.max(
  ...timelineData.map((d) => getEventsWidth(d.events.length)),
);

const outerEventDistance = BRANCH_GAP + maxEventsWidth;
const worldWidth = Math.max(window.innerWidth, (outerEventDistance + 150) * 2);

timeline.style.width = `${worldWidth}px`;

/* =========================================================
   สร้าง Year Sections
   ========================================================= */

const yearSections = [];

timelineData.forEach((yearData, yearIndex) => {
  const yearSection = document.createElement("section");
  yearSection.className = "year-section";
  yearSection.style.width = `${worldWidth}px`;

  /* สลับซ้าย / ขวา */
  const isLeft = yearIndex % 2 === 0;
  yearSection.classList.add(isLeft ? "left" : "right");

  /* Year Badge */
  const yearBadge = document.createElement("div");
  yearBadge.className = "year-badge";
  yearBadge.innerHTML = `
    <span>${yearData.year}</span>
    <div class="year-dot"></div>
  `;

  /* ปุ่ม "ดู" (ข้างซ้ายของเลขปี) */
  const viewBtn = document.createElement("button");
  viewBtn.className = "view-btn";
  viewBtn.textContent = "ดู";

  /* Branch Line */
  const branchLine = document.createElement("div");
  branchLine.className = "branch-line";

  /* Events Container */
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

  /* ปุ่ม "ต่อไป" (ต่อจากรูปสุดท้าย) */
  const nextButton = document.createElement("button");
  nextButton.className = "next-button";
  nextButton.textContent =
    yearIndex === timelineData.length - 1 ? "ไปที่คำถาม" : "ต่อไป";
  events.appendChild(nextButton);

  /* ----- Event Listeners ----- */

  viewBtn.addEventListener("click", () => expandYear(yearIndex));
  nextButton.addEventListener("click", () => goToNext(yearIndex));

  /* ----- ประกอบ Section ----- */

  yearSection.appendChild(yearBadge);
  yearSection.appendChild(viewBtn);
  yearSection.appendChild(branchLine);
  yearSection.appendChild(events);

  timeline.appendChild(yearSection);

  yearSections.push({ section: yearSection, viewBtn, events, branchLine });
});

/* =========================================================
   ตำแหน่งกลางของ Timeline
   ========================================================= */

function getCenterScrollPosition() {
  return (worldWidth - window.innerWidth) / 2;
}

/* =========================================================
   แสดงปี — โฟกัสที่เส้น Timeline
   ========================================================= */

function showYear(index) {
  currentYearIndex = index;
  setState("VIEWING_YEAR");

  const { section, viewBtn } = yearSections[index];

  window.scrollTo({
    left: getCenterScrollPosition(),
    top: section.offsetTop,
    behavior: "smooth",
  });

  /* แสดงปุ่ม "ดู" หลัง scroll เสร็จ */
  setTimeout(() => {
    viewBtn.classList.add("visible");
  }, 700);
}

/* =========================================================
   กระจายรูป — Animation
   ========================================================= */

function expandYear(index) {
  setState("EXPLORING");

  const { section, viewBtn, events } = yearSections[index];

  /* ซ่อนปุ่ม "ดู" */
  viewBtn.classList.remove("visible");

  /* กระจายรูป + branch line */
  section.classList.add("expanded");

  /* Staggered delay — การ์ดทยอยโผล่ทีละใบ */
  const children = events.children;
  for (let i = 0; i < children.length; i++) {
    children[i].style.transitionDelay = `${i * 0.12}s`;
  }
}

/* =========================================================
   ไปปีถัดไป / ไปคำถาม
   ========================================================= */

function goToNext(index) {
  const { section, events } = yearSections[index];

  /* Reset delay → collapse ทันที */
  const children = events.children;
  for (let i = 0; i < children.length; i++) {
    children[i].style.transitionDelay = "0s";
  }

  /* ยุบรูปกลับ */
  section.classList.remove("expanded");

  if (index < timelineData.length - 1) {
    /* ไปปีถัดไป */
    setTimeout(() => showYear(index + 1), 500);
  } else {
    /* ปีสุดท้าย → ไปคำถาม */
    setTimeout(() => {
      setState("QUESTION");
      window.scrollTo({
        left: 0,
        top: questionSection.offsetTop,
        behavior: "smooth",
      });
    }, 500);
  }
}

/* =========================================================
   คำถาม — ล็อกคำตอบ
   ========================================================= */

/* ตัวเลือก 1 = ถูกต้อง */
choice1.addEventListener("click", () => {
  if (state !== "QUESTION") return;

  questionFeedback.textContent = "";
  setState("FINISHED");

  /* แสดง overlay รูปใหญ่ */
  finalOverlay.classList.add("show");

  /* fade-in ด้วย rAF เพื่อให้ transition ทำงาน */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      finalOverlay.style.opacity = "1";
    });
  });
});

/* ตัวเลือก 2 = ผิด */
choice2.addEventListener("click", () => {
  if (state !== "QUESTION") return;

  questionFeedback.textContent = "ลองคิดอีกที 🤔";
  questionFeedback.classList.remove("shake");

  /* rAF เพื่อ restart animation */
  requestAnimationFrame(() => {
    questionFeedback.classList.add("shake");
  });
});

/* =========================================================
   เริ่มต้น
   ========================================================= */

window.addEventListener("load", () => {
  setState("VIEWING_YEAR");

  window.scrollTo({
    left: getCenterScrollPosition(),
    top: 0,
    behavior: "instant",
  });

  /* แสดงปุ่ม "ดู" ของปีแรกหลัง load */
  setTimeout(() => {
    yearSections[0].viewBtn.classList.add("visible");
  }, 600);
});
