import { Link } from "react-router-dom";
import "./Home.css";


import image3 from "../assets/image3.jpg"; // change to .png if needed

const Home = () => {
  return (
    <div className="home">
      

      {/* Hero Image */}
      <section className="hero-section">
        <img src={image3} alt="Date Night" className="hero-image" />
      </section>

      {/* Hero Text */}
      <section className="hero-content">
        <p className="tagline">
          ONE PLAN · ONE APP · 0 STRESS
        </p>

        <h1 className="hero-title">
          Plan a day for
          <br />
          your loved ones.
        </h1>

        <p className="hero-subtitle">
          Where long-distance feels short.
        </p>

        <Link to="/activities">
          <button className="hero-btn">Plan a date</button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
