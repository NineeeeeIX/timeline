/* =========================================================
   DOM REFERENCES
   ========================================================= */

const timeline = document.getElementById("timeline");
const timelineTrack = document.getElementById("timeline-track");
const questionSection = document.getElementById("question");
const questionFeedback = document.getElementById("question-feedback");
const choice1 = document.getElementById("choice-1");
const choice2 = document.getElementById("choice-2");
const finalOverlay = document.getElementById("final-overlay");
const closeOverlay = document.getElementById("close-overlay");
const wrapper = document.getElementById("viewport-wrapper");
const introOverlay = document.getElementById("intro-overlay");
const introStartBtn = document.getElementById("intro-start");
const bgm = document.getElementById("bgm");
const volumeControl = document.getElementById("volume-control");
const volumeBtn = document.getElementById("volume-btn");
const volumeSlider = document.getElementById("volume-slider");

/* =========================================================
   WRONG-ANSWER MESSAGES — เพิ่มคำได้เรื่อยๆ ในอาร์เรย์นี้
   ========================================================= */

const wrongMessages = [
  "ลองคิดอีกที 🤔",
  "ไม่ใช่อันนั้นนะ 🙈",
  "ใจเย็นๆ แล้วคิดใหม่ 💭",
  "ผิดแล้ว ลองใหม่นะ 💕",
  "เกือบแล้ว ลองดูอีกที ✨",
  "อย่าเพิ่งยอมแพ้นะ 🌸",
];

let wrongMessageIndex = 0;

function getNextWrongMessage() {
  const msg = wrongMessages[wrongMessageIndex];
  wrongMessageIndex = (wrongMessageIndex + 1) % wrongMessages.length;
  return msg;
}

/* =========================================================
   INTRO OVERLAY & BGM
   ========================================================= */

bgm.volume = 0.3;
volumeSlider.value = 0.3;

// กดปุ่ม START → เล่นเสียง + fade intro ออก
introStartBtn.addEventListener("click", () => {
  bgm.play().catch(() => {}); // catch เผื่อ browser block

  introOverlay.classList.add("hide");

  // หลัง fade เสร็จ → ลบ overlay ออกจาก DOM + แสดงปุ่ม volume
  setTimeout(() => {
    introOverlay.remove();
    volumeControl.classList.add("visible");
  }, 1300);
});

// ปุ่ม Volume — toggle mute
volumeBtn.addEventListener("click", () => {
  bgm.muted = !bgm.muted;
  volumeBtn.textContent = bgm.muted ? "🔇" : "🔊";
});

// Slider — ปรับระดับเสียง
volumeSlider.addEventListener("input", () => {
  bgm.volume = parseFloat(volumeSlider.value);
  bgm.muted = bgm.volume === 0;
  volumeBtn.textContent = bgm.muted ? "🔇" : "🔊";
});

/* =========================================================
   RESPONSIVE CONFIG
   ========================================================= */

function getResponsiveConfig() {
  const w = window.innerWidth;
  if (w <= 400)
    return { eventWidth: 130, eventGap: 16, branchGap: 24, nextBtnWidth: 100 };
  if (w <= 768)
    return { eventWidth: 160, eventGap: 16, branchGap: 30, nextBtnWidth: 120 };
  if (w <= 1024)
    return { eventWidth: 200, eventGap: 20, branchGap: 40, nextBtnWidth: 150 };
  return { eventWidth: 300, eventGap: 30, branchGap: 80, nextBtnWidth: 180 };
}

const config = getResponsiveConfig();

/* =========================================================
   STATE MACHINE
   ========================================================= */

let currentYearIndex = 0;
let state = "VIEWING_YEAR";

function setState(newState) {
  state = newState;
  document.body.className =
    "state-" + newState.toLowerCase().replace(/_/g, "-");
}

/* =========================================================
   WORLD WIDTH
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
   BUILD TIMELINE — สร้าง Year Sections จาก timelineData
   ========================================================= */

const yearSections = [];

timelineData.forEach((yearData, yearIndex) => {
  /* ----- Section ----- */
  const yearSection = document.createElement("section");
  yearSection.className = "year-section";
  yearSection.style.width = `${worldWidth}px`;
  yearSection.classList.add(yearIndex % 2 === 0 ? "left" : "right");

  /* ----- Year Badge ----- */
  const yearBadge = document.createElement("div");
  yearBadge.className = "year-badge";
  yearBadge.innerHTML = `
    <span>${yearData.year}</span>
    <div class="year-dot"></div>
  `;

  /* ----- Story Button ----- */
  const viewBtn = document.createElement("button");
  viewBtn.className = "view-btn";
  viewBtn.textContent = "Story";

  /* ----- Branch Line ----- */
  const branchLine = document.createElement("div");
  branchLine.className = "branch-line";

  /* ----- Events Container ----- */
  const events = document.createElement("div");
  events.className = "events";

  yearData.events.forEach((eventData) => {
    const event = document.createElement("article");
    event.className = "event";

    // รองรับทั้ง image และ video
    const mediaHTML = eventData.video
      ? `<video src="${eventData.video}" autoplay muted loop playsinline></video>`
      : `<img src="${eventData.image}" alt="${eventData.title}">`;

    // date chip (optional)
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

  /* ----- Next / Question Button ----- */
  const nextButton = document.createElement("button");
  nextButton.className = "next-button";
  nextButton.textContent =
    yearIndex === timelineData.length - 1 ? "Question" : "Next";
  events.appendChild(nextButton);

  /* ----- Event Listeners ----- */
  viewBtn.addEventListener("click", () => expandYear(yearIndex));
  nextButton.addEventListener("click", () => goToNext(yearIndex));

  /* ----- Assemble ----- */
  yearSection.append(yearBadge, viewBtn, branchLine, events);
  timeline.appendChild(yearSection);

  yearSections.push({ section: yearSection, viewBtn, events, branchLine });
});

/* =========================================================
   SCROLL HELPERS
   ========================================================= */

function getCenterScrollPosition() {
  return (worldWidth - window.innerWidth) / 2;
}

function scrollToCenter(behavior = "smooth") {
  wrapper.scrollTo({ left: getCenterScrollPosition(), top: 0, behavior });
}

/* =========================================================
   SHOW YEAR — โฟกัสที่เส้น Timeline
   ========================================================= */

function showYear(index) {
  currentYearIndex = index;
  setState("VIEWING_YEAR");

  // เลื่อน track แนวตั้งด้วย GPU transform
  timelineTrack.style.transform = `translateY(-${index * 100}vh)`;
  scrollToCenter();

  // แสดงปุ่ม Story หลัง scroll เสร็จ
  setTimeout(() => {
    yearSections[index].viewBtn.classList.add("visible");
  }, 600);
}

/* =========================================================
   EXPAND YEAR — กระจายรูป + stagger animation
   ========================================================= */

function expandYear(index) {
  setState("EXPLORING");

  const { section, viewBtn, events } = yearSections[index];

  viewBtn.classList.remove("visible");
  section.classList.add("expanded");

  // Staggered delay — การ์ดทยอยโผล่ทีละใบ
  Array.from(events.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.12}s`;
  });

  // Nudge scroll ไปทางที่มี events เพื่อให้เห็นการ์ดแรก
  const isLeft = section.classList.contains("left");
  const nudge = Math.min(
    config.eventWidth + config.branchGap,
    window.innerWidth * 0.35,
  );

  setTimeout(() => {
    if (state !== "EXPLORING") return;
    wrapper.scrollTo({
      left: isLeft
        ? getCenterScrollPosition() - nudge
        : getCenterScrollPosition() + nudge,
      top: 0,
      behavior: "smooth",
    });
  }, 250);
}

/* =========================================================
   GO TO NEXT — ยุบปีปัจจุบัน แล้วไปปีถัดไป / ไปคำถาม
   ========================================================= */

function collapseYear(index) {
  const { section, events } = yearSections[index];
  // Reset transition delay → ยุบพร้อมกันทันที
  Array.from(events.children).forEach((child) => {
    child.style.transitionDelay = "0s";
  });
  section.classList.remove("expanded");
}

function goToNext(index) {
  collapseYear(index);

  if (index < timelineData.length - 1) {
    setTimeout(() => showYear(index + 1), 400);
  } else {
    // ปีสุดท้าย → ไปคำถาม
    setTimeout(() => {
      setState("QUESTION");
      timelineTrack.style.transform = `translateY(-${timelineData.length * 100}vh)`;
      scrollToCenter();
    }, 400);
  }
}

/* =========================================================
   QUESTION — ตัวเลือก
   ========================================================= */

// ตัวเลือก 1 = ถูกต้อง
choice1.addEventListener("click", () => {
  if (state !== "QUESTION") return;

  questionFeedback.textContent = "";
  setState("FINISHED");

  // แสดง overlay รูปใหญ่
  finalOverlay.classList.add("show");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      finalOverlay.style.opacity = "1";
    });
  });
});

// ตัวเลือก 2 = ผิด → หมุนเวียนข้อความจาก wrongMessages
choice2.addEventListener("click", () => {
  if (state !== "QUESTION") return;

  questionFeedback.textContent = getNextWrongMessage();
  questionFeedback.classList.remove("shake");

  requestAnimationFrame(() => {
    questionFeedback.classList.add("shake");
  });
});

/* =========================================================
   FINAL OVERLAY — ปิด + เข้า FREE mode
   ========================================================= */

closeOverlay.addEventListener("click", () => {
  finalOverlay.classList.remove("show");
  finalOverlay.style.opacity = "";

  setState("FREE");

  timelineTrack.style.transition = "none";
  timelineTrack.style.transform = "none";

  // expand ทุก section ให้ดูได้หมด
  yearSections.forEach(({ section }) => section.classList.add("expanded"));

  wrapper.scrollTo({
    left: getCenterScrollPosition(),
    top: questionSection.offsetTop,
    behavior: "instant",
  });
});

/* =========================================================
   INIT
   ========================================================= */

// บังคับให้ refresh กลับไปบนสุดเสมอ
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  setState("VIEWING_YEAR");
  timelineTrack.style.transform = "translateY(0px)";
  scrollToCenter("instant");

  // แสดงปุ่ม Story ของปีแรกหลัง load
  setTimeout(() => {
    yearSections[0].viewBtn.classList.add("visible");
  }, 600);
});

window.addEventListener("resize", () => {
  if (state === "VIEWING_YEAR" || state === "QUESTION") {
    scrollToCenter("instant");
  }
});
