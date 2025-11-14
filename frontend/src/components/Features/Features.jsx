import "./Features.css"

const Features = () => {
  return (
    <div className="bento-container">
      <div className="bento-wrapper">
        <div className="sectioon-header">
          <h2 className="main-tittle">Why Choose Grooviti?</h2>
          <p className="main-subtittle">Discover what makes us the ultimate destination for unforgettable experiences</p>
        </div>

        <div className="bento-grid">
          {/* Event Hosting & Booking */}
          <div className="bento-card event-hosting">
            <div className="card-flip-inner">
              {/* Front Side - Only heading and tagline */}
              <div className="card-front">
                <div className="card-content">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <h3 className="card-title">Event Hosting & Booking</h3>
                  <p className="card-subtitle">"Groove it! Book it! Live it!"</p>
                </div>
              </div>
              {/* Back Side - Only content description */}
              <div className="card-back">
                <div className="card-content">
                  <p className="card-description">
                    Host events, sell tickets, and discover exciting gatherings — all in one place. From concerts to
                    college fests, Grooviti makes event creation and booking seamless.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sports Page - Turf Booking */}
          <div className="bento-card sports-page">
            <div className="card-flip-inner">
              <div className="card-front">
                <div className="card-content">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </div>
                  <h3 className="card-title">Sports Page – Turf Booking & Play Together</h3>
                  <p className="card-subtitle">"Not just events — we play too."</p>
                </div>
              </div>
              <div className="card-back">
                <div className="card-content">
                  <p className="card-description">
                    Reserve turfs for your favorite sport and team up with others using the "Play Together" feature.
                    Whether it's football or badminton, Grooviti brings sports enthusiasts together.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Communities Section */}
          <div className="bento-card communities">
            <div className="card-flip-inner">
              <div className="card-front">
                <div className="card-content">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87" />
                      <path d="M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  </div>
                  <h3 className="card-title">Communities Section</h3>
                  <p className="card-subtitle">"Because events are better when shared."</p>
                </div>
              </div>
              <div className="card-back">
                <div className="card-content">
                  <p className="card-description">
                    Grooviti's Communities act like a mini social circle where users can connect around events,
                    colleges, or interests. Join or create communities, post updates, share photos and videos, and chat
                    in real-time. With interactive galleries and live discussions, it's the perfect space to stay
                    connected before, during, and after events.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Panel */}
          <div className="bento-card admin-panel">
            <div className="card-flip-inner">
              <div className="card-front">
                <div className="card-content">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <path d="M9 9h6v6H9z" />
                    </svg>
                  </div>
                  <h3 className="card-title">Admin Panel</h3>
                  <p className="card-subtitle">"Control at your fingertips."</p>
                </div>
              </div>
              <div className="card-back">
                <div className="card-content">
                  <p className="card-description">
                    Admins get full control with tools to manage events, users, and communities. Pin posts, moderate
                    content, and keep everything organized with an intuitive dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications & Updates */}
          <div className="bento-card notifications">
            <div className="card-flip-inner">
              <div className="card-front">
                <div className="card-content">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 01-3.46 0" />
                    </svg>
                  </div>
                  <h3 className="card-title">Notifications & Updates</h3>
                  <p className="card-subtitle">"Stay in the loop."</p>
                </div>
              </div>
              <div className="card-back">
                <div className="card-content">
                  <p className="card-description">
                    Stay informed with real-time alerts for bookings, chat replies, event changes, and more — delivered
                    via in-app and email notifications.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Chat */}
          <div className="bento-card real-time-chat">
            <div className="card-flip-inner">
              <div className="card-front">
                <div className="card-content">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                  </div>
                  <h3 className="card-title">Real-Time Chat</h3>
                  <p className="card-subtitle">"Connect instantly."</p>
                </div>
              </div>
              <div className="card-back">
                <div className="card-content">
                  <p className="card-description">
                    Every community and event comes with its own live chat. Users can send messages, ask questions, or
                    coordinate activities — all with instant updates powered by WebSockets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features
