import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <a
          className="about-portrait"
          href="/images/dhaniyal-jose-profile.jpg"
          aria-label="View Dhaniyal Jose's professional portrait"
        >
          <img
            src="/images/dhaniyal-jose-profile.jpg"
            alt="Dhaniyal Jose - Professional Portrait"
            width="1254"
            height="1254"
            loading="lazy"
            decoding="async"
          />
        </a>
        <h3 className="title">About Me</h3>
        <p className="para">
          With a passion for web, mobile app and software development, I have hands-on
          experience in HTML, CSS, JavaScript, Flutter and Python. I envision creating innovative
          digital solutions that enhance user experiences. Experienced in project
          management and problem solving, I strive to excel in the tech industry with
          creativity and dedication.
        </p>
      </div>
    </div>
  );
};

export default About;
