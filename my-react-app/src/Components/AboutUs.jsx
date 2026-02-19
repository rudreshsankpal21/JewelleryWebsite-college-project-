import React from "react";
import '../styles/About.css'

const AboutUs = () => {
  return (
    <div className="container">
      <div className="about-left">
        <div className="about-title">
          <h1>About Us</h1>
        </div>
        <div className="about-description">
          <p>
            When the highly reputable Shree Laxmi Jewellers and Giriraj
            Jewellers come together, Shree Gajlaxmi Jewellers Private Limited is
            born! Recently launched at Chandan Nagar in east Pune, Shree
            Gajlaxmi Jewellers Private Limited is built on a 30-year legacy of
            trust and customer confidence.
          </p>

          <p>
            The glittering 5500 sq.ft. Gajlaxmi Jewellers showroom is a treasure
            trove of spectacular traditional jewellery for the Maharashtrian
            bride, and alluring silver, gold and diamond jewellery for the
            contemporary, cosmopolitan woman.
          </p>

          <p>
            Shree Gajlaxmi Jewellers Private Limited offers an unbelievable
            range and exquisite styles in varying budgets to win the heart of
            every woman, young and young-at-heart. Every piece at Shree Gajlaxmi
            Jewellers Private Limited is artistically designed and meticulously
            crafted to create a masterpiece that blends style with substance,
            novelty with timelessness. Complementing the offerings is Shree
            Gajlaxmi's polite, transparent service, and uncompromising quality
            that is trusted by thousands of discerning customers.
          </p>

          <p>
            We invite you to come, explore our world of breath-taking beauty.
            Welcome to Shree Gajlaxmi Jewellers Private Limited.
          </p>
        </div>
      </div>
      <div className="about-right">
        <img src="./src/assets/about-right.png" alt="" />
      </div>
    </div>
  );
};

export default AboutUs;
