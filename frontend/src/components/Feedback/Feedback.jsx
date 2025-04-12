import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./Feedback.css";
import { motion } from "framer-motion";

const FeedbackData = [
  {
    description:
      "The payment process with Grooviti was smooth and hassle-free. Everything went as expected, with no issues or delays. I appreciate the seamless experience and prompt confirmation. Well done!",
    name: "Omkar Yeote",
  },
  {
    description:
      "Booking tickets on Grooviti was really easy and smooth. The website is simple to use, and the registration process was quick. I got my ticket confirmation right away, which was great. Overall, it was a good experience.",
    name: "Shrevan Gadade",
  },
  {
    description:
      "It was a nice experience using the website. Everything worked smoothly, and I didn't face any issues while handling it.",
    name: "Khushi Agrawal",
  },
  {
    description:
      "I had a great experience while using Grooviti online ticket booking platform. It has a very good user interface and I suggest everyone to use this platform when you need to book the tickets for any events.",
    name: "Omkar Pawar",
  },
  {
    description:
      "Had a great experience in participating in Technovate. I was involved in events like Geek It Out by GFG where it was fun to be part of 3 interesting rounds and SolveX by ITSA which allowed me to showcase presentation skills. ",
    name: "Shreya Mane",
  },
  {
    description:
      "It was a great and seamless experience. Great work Team Grooviti, kudos to you!",
    name: "Yash Dhadge",
  },
];

const Feedback = () => {
  return (
    <section className="section__container">
      <h2>Feedback</h2>
      <h1>What our customers say</h1>
      <Swiper
        modules={[Pagination, Autoplay, Navigation, Keyboard]}
        spaceBetween={30}
        keyboard={{ enabled: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {FeedbackData.map((item, index) => (
          <SwiperSlide key={index}>
            <motion.div
              className="section__card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <span>
                <i className="ri-double-quotes-l"></i>
              </span>
              <p>{item.description}</p>
              <div className="rating">
                {Array(5)
                  .fill()
                  .map((_, i) => (
                    <i key={i} className="ri-star-fill"></i>
                  ))}
              </div>
              <h5>{item.name}</h5>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.section>
  );
};

export default Feedback;
