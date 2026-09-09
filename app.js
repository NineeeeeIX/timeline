const timeline = document.getElementById("timeline");
const timelineTrack = document.getElementById("timeline-track");
const questionSection = document.getElementById("question");
const questionFeedback = document.getElementById("question-feedback");
const choice1 = document.getElementById("choice-1");
const choice2 = document.getElementById("choice-2");
const finalOverlay = document.getElementById("final-overlay");
const wrapper = document.getElementById("viewport-wrapper");

/* =========================================================
   RESPONSIVE CONFIG
   ========================================================= */

function getResponsiveConfig() {
  const w = window.innerWidth;
  if (w <= 400) {
    return { eventWidth: 130, eventGap: 16, branchGap: 24, nextBtnWidth: 100 };
  }
  if (w <= 768) {
    return { eventWidth: 160, eventGap: 16, branchGap: 30, nextBtnWidth: 120 };
  }
  if (w <= 1024) {
    return { eventWidth: 200, eventGap: 20, branchGap: 40, nextBtnWidth: 150 };
  }
  return { eventWidth: 300, eventGap: 30, branchGap: 80, nextBtnWidth: 180 };
}

const config = getResponsiveConfig();

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
  return (
    eventCount * config.eventWidth +
    config.nextBtnWidth +
    eventCount * config.eventGap
  );
}

const maxEventsWidth = Math.max(
  ...timelineData.map((d) => getEventsWidth(d.events.length)),
);

const outerEventDistance = config.branchGap + maxEventsWidth;
const worldWidth = Math.max(window.innerWidth, (outerEventDistance + 100) * 2);

timelineTrack.style.width = `${worldWidth}px`;
timeline.style.width = `${worldWidth}px`;
questionSection.style.width = `${worldWidth}px`;

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

  /* ปุ่ม "ดู" (ตามฝั่งรูปของแต่ละปี) */
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

    // รองรับทั้ง image (URL ImageKit) และ video (URL ImageKit)
    const mediaHTML = eventData.video
      ? `<video src="${eventData.video}" autoplay muted loop playsinline></video>`
      : `<img src="${eventData.image}" alt="${eventData.title}">`;

    // วันที่ — chip ซ้อนบนรูป/วิดีโอ (ถ้ามี date)
    const dateHTML = eventData.date
      ? `<span class="date-overlay">${eventData.date}</span>`
      : "";

    event.innerHTML = `
      <div class="event-media">
        ${mediaHTML}
        ${dateHTML}
      </div>
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

  const { viewBtn } = yearSections[index];

  /* เลื่อน track แนวตั้งด้วย GPU transform */
  timelineTrack.style.transform = `translateY(-${index * 100}vh)`;

  /* โฟกัสแนวนอนที่เส้น Timeline */
  wrapper.scrollTo({
    left: getCenterScrollPosition(),
    top: 0,
    behavior: "smooth",
  });

  /* แสดงปุ่ม "ดู" หลัง scroll เสร็จ */
  setTimeout(() => {
    viewBtn.classList.add("visible");
  }, 600);
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

  /* Nudge scroll ไปทางที่มี events เพื่อให้เห็นการ์ดแรก */
  const isLeft = section.classList.contains("left");
  const nudge = Math.min(
    config.eventWidth + config.branchGap,
    window.innerWidth * 0.35,
  );

  setTimeout(() => {
    if (state === "EXPLORING") {
      wrapper.scrollTo({
        left: isLeft
          ? getCenterScrollPosition() - nudge
          : getCenterScrollPosition() + nudge,
        top: 0,
        behavior: "smooth",
      });
    }
  }, 250);
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
    setTimeout(() => showYear(index + 1), 400);
  } else {
    /* ปีสุดท้าย → ไปคำถาม */
    setTimeout(() => {
      setState("QUESTION");
      timelineTrack.style.transform = `translateY(-${timelineData.length * 100}vh)`;
      wrapper.scrollTo({
        left: getCenterScrollPosition(),
        top: 0,
        behavior: "smooth",
      });
    }, 400);
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

  requestAnimationFrame(() => {
    questionFeedback.classList.add("shake");
  });
});

/* =========================================================
   ปิด Overlay → เลื่อนดูเว็ปได้อิสระ
   ========================================================= */

const closeOverlay = document.getElementById("close-overlay");

closeOverlay.addEventListener("click", () => {
  finalOverlay.classList.remove("show");
  finalOverlay.style.opacity = "";

  /* เข้า FREE mode — expand ทุกปี, เลื่อนได้อิสระ */
  setState("FREE");

  timelineTrack.style.transition = "none";
  timelineTrack.style.transform = "none";

  /* expand ทุก section ให้ดูได้หมด */
  yearSections.forEach(({ section }) => {
    section.classList.add("expanded");
  });

  wrapper.scrollTo({
    left: getCenterScrollPosition(),
    top: questionSection.offsetTop,
    behavior: "instant",
  });
});

/* =========================================================
   เริ่มต้น
   ========================================================= */

/* บังคับให้ refresh กลับไปบนสุดเสมอ */
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  setState("VIEWING_YEAR");
  timelineTrack.style.transform = "translateY(0px)";

  wrapper.scrollTo({
    left: getCenterScrollPosition(),
    top: 0,
    behavior: "instant",
  });

  /* แสดงปุ่ม "ดู" ของปีแรกหลัง load */
  setTimeout(() => {
    yearSections[0].viewBtn.classList.add("visible");
  }, 600);
});

window.addEventListener("resize", () => {
  if (state === "VIEWING_YEAR" || state === "QUESTION") {
    wrapper.scrollTo({
      left: getCenterScrollPosition(),
      top: 0,
      behavior: "instant",
    });
  }
});
