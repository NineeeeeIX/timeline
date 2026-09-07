const timeline = document.getElementById("timeline");

timelineData.forEach((yearData, yearIndex) => {

    // สร้าง section ของแต่ละปี
    const yearSection = document.createElement("section");
    yearSection.className = "year-section";

    // สลับซ้าย / ขวา
    if (yearIndex % 2 === 0) {
        yearSection.classList.add("left");
    } else {
        yearSection.classList.add("right");
    }

    // เส้น Timeline
    const timelineLine = document.createElement("div");
    timelineLine.className = "timeline-line";

    // จุดและชื่อปี
    const yearPoint = document.createElement("div");
    yearPoint.className = "year-point";
    yearPoint.textContent = yearData.year;

    // เส้นแขนที่ยื่นออกจาก Timeline
    const branchLine = document.createElement("div");
    branchLine.className = "branch-line";

    // Container ของเหตุการณ์
    const events = document.createElement("div");
    events.className = "events";

    // สร้าง Event แต่ละอัน
    yearData.events.forEach(eventData => {

        const event = document.createElement("article");
        event.className = "event";

        event.innerHTML = `
            <img src="${eventData.image}" alt="${eventData.title}">
            <h2>${eventData.title}</h2>
            <p>${eventData.text}</p>
        `;

        events.appendChild(event);
    });

    // ปุ่มต่อไป
    const nextButton = document.createElement("button");
    nextButton.className = "next-button";
    nextButton.textContent = "ต่อไป";

    // ถ้าเป็นปีสุดท้าย ให้เปลี่ยนข้อความ
    if (yearIndex === timelineData.length - 1) {
        nextButton.textContent = "ไปที่คำถาม";
    }

    // เมื่อกดปุ่ม
    nextButton.addEventListener("click", () => {

        if (yearIndex < timelineData.length - 1) {

            const nextSection =
                timeline.children[yearIndex + 1];

            nextSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        } else {

            const question =
                document.getElementById("question");

            question.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    });

    // ประกอบทุกอย่างเข้าด้วยกัน
    yearSection.appendChild(timelineLine);
    yearSection.appendChild(branchLine);
    yearSection.appendChild(yearPoint);
    yearSection.appendChild(events);
    yearSection.appendChild(nextButton);

    timeline.appendChild(yearSection);
});