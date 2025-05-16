import React from "react";
import "./HomePage.css";
import { FaSearch, FaUserTie, FaRegLightbulb } from "react-icons/fa";
import { MdHowToReg } from "react-icons/md";

const features = [
  {
    icon: <FaSearch className="feature-icon" />,
    title: "Advanced Job Matching",
    description: "Get job recommendations based on your profile, skills, and preferences."
  },
  {
    icon: <FaUserTie className="feature-icon" />,
    title: "Customized Profiles",
    description: "Create tailored profiles for job seekers and recruiters for more relevant results."
  },
  {
    icon: <FaRegLightbulb className="feature-icon" />,
    title: "Smart Suggestions",
    description: "AI-driven suggestions to keep your job search efficient and up-to-date."
  }
];

const steps = [
  {
    icon: <MdHowToReg className="step-icon" />,
    title: "Sign Up",
    description: "Create an account as a Job Seeker or Job Poster."
  },
  {
    icon: <FaUserTie className="step-icon" />,
    title: "Complete Your Profile",
    description: "Fill in your skills, experience, or job requirements."
  },
  {
    icon: <FaSearch className="step-icon" />,
    title: "Explore & Apply",
    description: "Get matched jobs or candidates and start connecting!"
  }
];

const HomePage = () => {
  return (
    <main className="home-wrapper">
      <div className="home-container2">
        <header className="home-header gradient-background">
          <h1>Job Recommendation System</h1>
          <p>Your smart assistant to find the perfect job match!</p>
        </header>

        <section className="features-section">
          <h2>Why Choose Us?</h2>
          <div className="features">
            {features.map((feature, index) => (
              <div className="feature-card colorful-card" key={index}>
                {feature.icon}
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="how-it-works-section">
          <h2>How to Use</h2>
          <div className="steps">
            {steps.map((step, index) => (
              <div className="step vibrant-step" key={index}>
                {step.icon}
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
