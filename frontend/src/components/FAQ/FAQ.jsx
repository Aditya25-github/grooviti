import React, { useState } from "react";
import "./FAQ.css";
import { FaQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

const categories = ["General", "Pricing", "Management"];

const faqs = [
  {
    category: "General",
    question: "What is Grooviti?",
    answer:
      "Grooviti is a user-friendly platform for event listing and ticketing. It allows individuals and organizations to host events hassle-free, manage RSVPs, and sell tickets online. Whether you're organizing a workshop, concert, or private gathering, Grooviti makes event management simple and efficient.",
  },
  {
    category: "Pricing",
    question: "Is there a fee for listing my event on Grooviti?",
    answer:
      "Listing your event on Grooviti is free. However, if you choose to sell tickets, a small service fee may apply per transaction. This helps us maintain the platform and provide seamless services.",
  },
  {
    category: "Management",
    question: "Can I track ticket sales and attendee information?",
    answer:
      "Yes! Grooviti offers an intuitive dashboard where you can track ticket sales, monitor attendee details, and manage check-ins — all in real time.",
  },
  {
    category: "Management",
    question:
      "What should I do if I encounter issues during event setup or management?",
    answer: (
      <>
        If you face any issues while setting up or managing your event, our
        support team is here to help. You can reach out through the in-platform
        support chat or email us at{" "}
        <a
          href="https://grooviti.com/ContactUs"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://grooviti.com/contact
        </a>{" "}
        for prompt assistance.
      </>
    ),
  },
  {
    category: "Management",
    question: "How does Grooviti handle event cancellations or refunds?",
    answer:
      "In case of cancellations, organizers can notify attendees and issue refunds directly through the platform. Refund policies are set by the event host, and Grooviti facilitates the process securely.",
  },
  {
    category: "Management",
    question: "How can I promote my event through Grooviti?",
    answer:
      "Grooviti provides tools to help promote your event, including shareable links, social media integration, and featured listings. You can also boost visibility by opting for promotional packages.",
  },
  {
    category: "General",
    question: "Are there any restrictions on the types of events I can host?",
    answer:
      "While Grooviti supports a wide range of events, we do not allow events that promote hate, violence, or illegal activity. All events must comply with our community guidelines and local laws.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("General");

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <div className="faq-container">
      <h2 className="faq-title">Frequently Asked Questions</h2>

      <div className="faq-categories">
        {categories.map((cat, i) => (
          <button
            key={i}
            className={`faq-category-btn ${
              selectedCategory === cat ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="faq-list">
        {filteredFaqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button className="faq-question" onClick={() => toggleFAQ(index)}>
              <span>
                <FaQuestionCircle className="icon" /> {faq.question}
              </span>
              {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {activeIndex === index && (
              <p className="faq-answer">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
