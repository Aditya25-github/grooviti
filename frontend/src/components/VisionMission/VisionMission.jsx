import "./VisionMission.css";

export default function VisionMission() {
  return (
    <section className="vm-section" aria-labelledby="vm-heading">
      <div className="vm-container">
        {/* Vision */}
        <article className="vm-item" tabIndex="0" aria-labelledby="vm-title-vision">
          <figure className="vm-icon-wrap" aria-hidden="true">
            <img src="/images/vision.png" alt="" className="vm-icon" />
          </figure>

          <h3 id="vm-title-vision" className="vm-title">Vision</h3>

          <p className="vm-text">
            To inspire and connect communities through unforgettable events,
            creating lasting memories and fostering cultural exchange.
          </p>
        </article>

        {/* Divider */}
        <div className="vm-divider" aria-hidden="true"></div>

        {/* Mission */}
        <article className="vm-item" tabIndex="0" aria-labelledby="vm-title-mission">
          <figure className="vm-icon-wrap" aria-hidden="true">
            <img src="/images/mission.png" alt="" className="vm-icon" />
          </figure>

          <h3 id="vm-title-mission" className="vm-title">Mission</h3>

          <p className="vm-text">
            To deliver exceptional event experiences by combining creativity,
            innovation, and community engagement for a lasting positive impact.
          </p>
        </article>
      </div>
    </section>
  );
}
