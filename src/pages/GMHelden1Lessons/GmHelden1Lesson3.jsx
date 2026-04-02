import React from "react";
import VideoPlayer from "../../WebsiteElements/ImagesAndVideos/VideoPlayer.jsx";

import TestVideo from "../../Video/Schatkist_Boek_en_Verblindend_Licht.mp4";
import TestVideo2 from "../../Video/How to Pronounce Mayonnaise - PronunciationManual (1080p, h264).mp4";
import TestVideo3 from "../../Video/tiktok_detechhelden_7623069450027224353.mp4";

export default function GmHelden1Lesson3() {
  return (
    <>
      <VideoPlayer
        src={TestVideo}
        poster="https://www.w3schools.com/html/img_the_sunset.jpg"
        title="GmHelden1Lesson3"
        width="50%"
      />

      <VideoPlayer
        src={TestVideo2}
        poster="https://www.w3schools.com/html/img_the_sunset.jpg"
        title="GmHelden1Lesson3"
        width="75%"
      />

      <VideoPlayer
        src={TestVideo3}
        poster="https://www.w3schools.com/html/img_the_sunset.jpg"
        title="GmHelden1Lesson3"
        width="100%"
      />
    </>
  );
}