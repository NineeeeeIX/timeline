const timeline = document.getElementById("timeline");

timelineData.forEach((yearData, yearIndex) => {

    const yearSection = document.createElement("section");
    yearSection.className = "year-section";

    const title = document.createElement("h1");
    title.textContent = yearData.year;

    const events = document.createElement("div");
    events.className = "events";

    yearData.events.forEach(eventData => {

        const event = document.createElement("article");
        event.className = "event";

        event.innerHTML = `
            <img src="${eventData.image}" alt="">
            <h2>${eventData.title}</h2>
            <p>${eventData.text}</p>
        `;

        events.appendChild(event);
    });

    const nextButton = document.createElement("button");
    nextButton.className = "next-button";
    nextButton.textContent = "ต่อไป";

    yearSection.appendChild(title);
    yearSection.appendChild(events);
    yearSection.appendChild(nextButton);

    timeline.appendChild(yearSection);
});