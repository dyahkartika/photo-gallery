import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/photos");
  };

  return (
    <>
      <div className="home">
        <section className="secHome">
          <p style={{ fontSize: "40px" }} className="textHome">
            Keep all your memories here and show others
          </p>
          <button className="home-btn" onClick={handleNavigate}>
          Go to Photos
        </button>
        </section>
        <img src="img/landing.png" alt="home-pic" className="home-pic" />
      </div>
    </>
  );
};

export default Home;
