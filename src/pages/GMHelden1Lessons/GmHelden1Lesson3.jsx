import React from "react";
import VideoPlayer from "../../WebsiteElements/ImagesAndVideos/VideoPlayer.jsx";

import TestVideo from "../../Video/Schatkist_Boek_en_Verblindend_Licht.mp4";

export default function GmHelden1Lesson3() {
  return (
    <VideoPlayer
      src={TestVideo}
      poster="https://www.w3schools.com/html/img_the_sunset.jpg"
      title="GmHelden1Lesson3"
      width="50%"
    />

  );
}