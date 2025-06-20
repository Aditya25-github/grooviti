// src/components/EventFAQs.jsx
import React, { useState } from "react";
import "./EventFAQs.css";

const EventFAQs = ({ faqs = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="event-faqs">
      <h3>Frequently Asked Questions</h3>
      {faqs.length === 0 ? (
        <p>No FAQs added for this event.</p>
      ) : (
        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`faq-item ${openIndex === idx ? "open" : ""}`}
            >
              <div className="faq-question" onClick={() => toggle(idx)}>
                <span>{faq.question}</span>
                <span className="arrow">{openIndex === idx ? "▲" : "▼"}</span>
              </div>
              {openIndex === idx && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventFAQs;
