import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-me">
      <div className="about-me-text">
        <h2>About Me</h2>
        <p>
          Hello there! I'm LUNAR, and I'm a passionate photographer with a
          journey that began in 2015. Photography isn't just a profession for
          me; it's a profound love affair that allows me to capture the beauty
          of people and their moments.
        </p>
        <p>
          My mission is to provide you with high-quality, artistic photographs
          that not only capture your special moments but also surprise you with
          their depth and emotion. Whether it's a wedding, a family gathering, a
          portrait session, or any significant event in your life, I'm dedicated
          to creating images that tell your unique story.
        </p>
        <p>
          I firmly believe that the essence of photography lies in those
          fleeting, unscripted moments - the genuine laughter, the shared
          glances, and the raw emotions. It's my goal to seize these moments,
          preserving them for you to relive and cherish forever.
        </p>
        <p>
          Let's collaborate to capture your life's most beautiful chapters
          through the lens. Contact me today, and let's embark on this
          photographic journey together.
        </p>
      </div>
      <div className="about-me-image">
        <img src="/images/MAT_6767.jpg" alt="Me" />
      </div>
    </div>
  );
}

export default About;
