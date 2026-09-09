const timelineData = [
  {
    year: 2022,
    events: [
      {
        // รูปภาพ: ใส่ URL ImageKit ใน image | วิดีโอ: ใส่ใน video
        image: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo4.jpg",
        date: "12 ม.ค. 2565",   // ใส่ date เพื่อแสดง chip บนรูป, ไม่ใส่ก็ไม่แสดง
        title: "เหตุการณ์ที่ 1",
        text: "คำอธิบายของเหตุการณ์ที่ 1",
      },
      {
        image: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo4.jpg",
        date: "15 มี.ค. 2565",
        title: "เหตุการณ์ที่ 2",
        text: "คำอธิบายของเหตุการณ์ที่ 2",
      },
      {
        video: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo4.jpg",
        title: "เหตุการณ์ที่ 3",
        text: "คำอธิบายของเหตุการณ์ที่ 3",
      },
      {
        // วิธีที่ 2 — วิดีโอ: ใส่ URL ImageKit ใน video แทน image
        video: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo4.jpg",
        title: "เหตุการณ์ที่ 4",
        text: "คำอธิบายของเหตุการณ์ที่ 4",
      },
      {
        image: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo4.jpg",
        title: "เหตุการณ์ที่ 5",
        text: "คำอธิบายของเหตุการณ์ที่ 5",
      },
      {
        video: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/video2.mp4",
        title: "เหตุการณ์ที่ 6",
        text: "คำอธิบายของเหตุการณ์ที่ 6",
      },
    ],
  },

  {
    year: 2023,
    events: [
      {
        image: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo5.jpg",
        title: "เหตุการณ์ที่ 1",
        text: "คำอธิบายของเหตุการณ์ที่ 1",
      },
      {
        image: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo6.jpg",
        title: "เหตุการณ์ที่ 2",
        text: "คำอธิบายของเหตุการณ์ที่ 2",
      },
      {
        video: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/video3.mp4",
        title: "เหตุการณ์ที่ 3",
        text: "คำอธิบายของเหตุการณ์ที่ 3",
      },
      {
        image: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo7.jpg",
        title: "เหตุการณ์ที่ 4",
        text: "คำอธิบายของเหตุการณ์ที่ 4",
      },
      {
        image: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo8.jpg",
        title: "เหตุการณ์ที่ 5",
        text: "คำอธิบายของเหตุการณ์ที่ 5",
      },
      {
        image: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo9.jpg",
        title: "เหตุการณ์ที่ 6",
        text: "คำอธิบายของเหตุการณ์ที่ 6",
      },
    ],
  },

  {
    year: 2024,
    events: [
      {
        image: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo10.jpg",
        title: "เหตุการณ์ที่ 1",
        text: "คำอธิบายของเหตุการณ์ที่ 1",
      },
      {
        image: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo11.jpg",
        title: "เหตุการณ์ที่ 2",
        text: "คำอธิบายของเหตุการณ์ที่ 2",
      },
      {
        video: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/video4.mp4",
        title: "เหตุการณ์ที่ 3",
        text: "คำอธิบายของเหตุการณ์ที่ 3",
      },
      {
        image: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo12.jpg",
        title: "เหตุการณ์ที่ 4",
        text: "คำอธิบายของเหตุการณ์ที่ 4",
      },
    ],
  },

  {
    year: 2025,
    events: [
      {
        image: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo13.jpg",
        title: "เหตุการณ์ที่ 1",
        text: "คำอธิบายของเหตุการณ์ที่ 1",
      },
      {
        image: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo14.jpg",
        title: "เหตุการณ์ที่ 2",
        text: "คำอธิบายของเหตุการณ์ที่ 2",
      },
      {
        image: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo15.jpg",
        title: "เหตุการณ์ที่ 3",
        text: "คำอธิบายของเหตุการณ์ที่ 3",
      },
      {
        video: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/video5.mp4",
        title: "เหตุการณ์ที่ 4",
        text: "คำอธิบายของเหตุการณ์ที่ 4",
      },
    ],
  },

  {
    year: 2026,
    events: [
      {
        image: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo16.jpg",
        title: "เหตุการณ์ที่ 1",
        text: "คำอธิบายของเหตุการณ์ที่ 1",
      },
      {
        image: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo17.jpg",
        title: "เหตุการณ์ที่ 2",
        text: "คำอธิบายของเหตุการณ์ที่ 2",
      },
      {
        image: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo18.jpg",
        title: "เหตุการณ์ที่ 3",
        text: "คำอธิบายของเหตุการณ์ที่ 3",
      },
      {
        image: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/photo19.jpg",
        title: "เหตุการณ์ที่ 4",
        text: "คำอธิบายของเหตุการณ์ที่ 4",
      },
      {
        video: "https://ik.imagekit.io/YOUR_ID/YOUR_FOLDER/video6.mp4",
        title: "เหตุการณ์ที่ 5",
        text: "คำอธิบายของเหตุการณ์ที่ 5",
      },
    ],
  },
];