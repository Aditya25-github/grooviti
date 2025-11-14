import { useState } from "react";
import "./NewsletterSignup.css";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribed with:", email);
  };

  return (
    <div className="newsletter-container">
      <h1>
        Be the first to attend the next big event <br />
        <span className="highlight">—powered by Grooviti.</span>
      </h1>
      <p>
        Discover and book amazing events effortlessly. Grooviti is the easiest way to host, manage, and attend events seamlessly. Join our community and get notified.
      </p>

      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="email"
          placeholder="Your Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Get Notified</button>
      </form>

      <div className="joined-section">
        <div className="avatars">
          <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="User1" />
          <img src="https://randomuser.me/api/portraits/men/46.jpg" alt="User2" />
          <img src="https://randomuser.me/api/portraits/women/47.jpg" alt="User3" />
        </div>
        <span>Thousands already signed up</span>
      </div>
    </div>
  );
};

export default NewsletterSignup;
