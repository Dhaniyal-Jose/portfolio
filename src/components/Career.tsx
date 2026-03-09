import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Software Developer Intern</h4>
                <h5>Cognifyz Technologies</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Built console-based applications and implemented CRUD operations using
              basic programming concepts like loops, conditionals, debugging, and simple
              file handling while creating small utility programs.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Mobile App Development Intern</h4>
                <h5>Richinnovations</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Completed a hands-on internship focused on mobile app development, gaining
              practical experience in core programming concepts for mobile platforms,
              app frameworks, and deployment techniques for the Google Play Store / App Store.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Web Development Intern</h4>
                <h5>Keltron Knowledge</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Completed a foundational internship in Web Development gaining hands-on
              experience with HTML5, CSS Styling, Layouts, Responsive Design, and
              JavaScript basic scripting for dynamic webpage behaviour.
            </p>
          </div>

          {/* Academic Details Section Starts Here */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech in Computer Science</h4>
                <h5>St.Thomas Institute for Science and Technology<br />APJ Abdul Kalam Technological University</h5>
              </div>
              <h3>2022–2026</h3>
            </div>
            <p>
              Currently pursuing a Bachelor's degree in Computer Science and Engineering,
              building a strong foundation in core computer science principles, algorithms, and software development.
            </p>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Higher Secondary Education</h4>
                <h5>St.Antony's H S S, Mala, Thrissur</h5>
              </div>
              <h3>2019–2021</h3>
            </div>
            <p>
              Graduated with a strong academic record, achieving a percentage of <strong>95%</strong>.
            </p>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>High School Education (SSLC)</h4>
                <h5>St.Joseph E M H S S, Aloor, Thrissur</h5>
              </div>
              <h3>2019</h3>
            </div>
            <p>
              Completed secondary education with exceptional academic performance, securing a percentage of <strong>99%</strong>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Career;
