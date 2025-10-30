import React, { useEffect, useState } from "react";
import { 
  Card, 
  Spin, 
  Alert, 
  Typography, 
  Row, 
  Col, 
  Empty, 
  Button, 
  Modal,
  Statistic,
  Tag,
  Progress,
  Divider
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line
} from "recharts";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { 
  TrophyOutlined, 
  FireOutlined, 
  EyeOutlined, 
  CrownOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
  BarChartOutlined,
  SoundOutlined
} from "@ant-design/icons";
import "./ManageEvent.css";

const { Title, Text } = Typography;

const fresherColors = { Mr: "#f98d6f", Mrs: "#ffcc98" };
const halloweenColors = {
  bestDressed: "#7349AC",
  famousCharacter: "#EB6123",
  bestDuo: "#16a34a",
};

const getFresherLabel = (cat) => (cat === "Mr" ? "Mr. Fresher" : "Ms. Fresher");
const getHalloweenLabel = (cat) =>
  cat === "bestDressed"
    ? "Best Dressed"
    : cat === "famousCharacter"
    ? "Most Famous Character"
    : "Best Duo";

const ManageEvent = ({ url }) => {
  const [activeCard, setActiveCard] = useState(null);
  const [fCandidates, setFCandidates] = useState([]);
  const [fWinners, setFWinners] = useState({});
  const [fLoading, setFLoading] = useState(false);
  const [fError, setFError] = useState(null);
  const [hCandidates, setHCandidates] = useState([]);
  const [hWinners, setHWinners] = useState({});
  const [hLoading, setHLoading] = useState(false);
  const [hError, setHError] = useState(null);
  const [width, height] = useWindowSize();

  // Enhanced state management with individual confetti tracking
  const [revealedFresher, setRevealedFresher] = useState({ mr: false, mrs: false });
  const [revealedHalloween, setRevealedHalloween] = useState({
    bestDressed: false,
    famousCharacter: false,
    bestDuo: false,
  });
  
  // Individual confetti states for each winner
  const [activeConfetti, setActiveConfetti] = useState(null);
  const [announcementSound, setAnnouncementSound] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const [voteHistory, setVoteHistory] = useState([]);

  // Audio for winner announcement
  useEffect(() => {
    const audio = new Audio('/sounds/winner-announcement.mp3');
    setAnnouncementSound(audio);
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  // Reset reveals when switching events
  useEffect(() => {
    if (activeCard === "fresher") {
      setRevealedFresher({ mr: false, mrs: false });
      setActiveConfetti(null);
    } else if (activeCard === "halloween") {
      setRevealedHalloween({ bestDressed: false, famousCharacter: false, bestDuo: false });
      setActiveConfetti(null);
    }
  }, [activeCard]);

  // Enhanced data fetching with statistics
  useEffect(() => {
    if (activeCard !== "fresher") return;
    let cancelled = false;
    (async () => {
      try {
        setFLoading(true);
        const [candRes, winRes, statsRes] = await Promise.all([
          fetch(`${url}/api/pccoer/fresher-party/candidates`),
          fetch(`${url}/api/pccoer/fresher-party/winners`),
          fetch(`${url}/api/pccoer/fresher-party/stats`),
        ]);
        
        if (!candRes.ok || !winRes.ok) throw new Error("Failed to fetch Fresher results");
        
        const candidatesData = await candRes.json();
        const winnersData = await winRes.json();
        const statsData = statsRes.ok ? await statsRes.json() : null;

        if (!cancelled) {
          setFCandidates(candidatesData);
          setFWinners(winnersData);
          setTotalVotes(statsData?.totalVotes || candidatesData.reduce((sum, c) => sum + c.votes, 0));
          setVoteHistory(statsData?.voteHistory || []);
          setFError(null);
        }
      } catch (err) {
        if (!cancelled) setFError("Could not load Fresher results.");
        console.error("Fresher Fetch Error:", err);
      } finally {
        if (!cancelled) setFLoading(false);
      }
    })();
    return () => (cancelled = true);
  }, [activeCard, url]);

  useEffect(() => {
    if (activeCard !== "halloween") return;
    let cancelled = false;
    (async () => {
      try {
        setHLoading(true);
        const [candRes, winRes, statsRes] = await Promise.all([
          fetch(`${url}/api/pccoer/halloween/candidates`),
          fetch(`${url}/api/pccoer/halloween/winners`),
          fetch(`${url}/api/pccoer/halloween/stats`),
        ]);
        
        if (!candRes.ok || !winRes.ok) throw new Error("Failed to fetch Halloween results");
        
        const candidatesData = await candRes.json();
        const winnersData = await winRes.json();
        const statsData = statsRes.ok ? await statsRes.json() : null;

        if (!cancelled) {
          setHCandidates(candidatesData.data || []);
          setHWinners(winnersData);
          setTotalVotes(statsData?.totalVotes || (candidatesData.data || []).reduce((sum, c) => sum + c.votes, 0));
          setVoteHistory(statsData?.voteHistory || []);
          setHError(null);
        }
      } catch (err) {
        if (!cancelled) setHError("Could not load Halloween results.");
        console.error("Halloween Fetch Error:", err);
      } finally {
        if (!cancelled) setHLoading(false);
      }
    })();
    return () => (cancelled = true);
  }, [activeCard, url]);

  // Enhanced chart data with rankings
  const fresherChartData = fCandidates
    .map((c, index) => ({
      name: c.name,
      votes: c.votes,
      category: getFresherLabel(c.category),
      image: c.image,
      fill: fresherColors[c.category] || "#9ca3af",
      rank: index + 1,
      percentage: totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : 0,
    }))
    .sort((a, b) => b.votes - a.votes);

  const halloweenChartData = hCandidates
    .map((c, index) => ({
      name: c.name,
      votes: c.votes,
      category: getHalloweenLabel(c.category),
      image: c.image,
      fill: halloweenColors[c.category] || "#9ca3af",
      rank: index + 1,
      percentage: totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : 0,
    }))
    .sort((a, b) => b.votes - a.votes);

  // Enhanced reveal functions with individual confetti
  const handleRevealFresher = async (key) => {
    setRevealedFresher((prev) => ({ ...prev, [key]: true }));
    setActiveConfetti(`fresher-${key}`);
    
    if (announcementSound) {
      try {
        await announcementSound.play();
      } catch (err) {
        console.log("Audio play failed:", err);
      }
    }
    
    setTimeout(() => setActiveConfetti(null), 5000);
  };

  const handleRevealHalloween = async (key) => {
    setRevealedHalloween((prev) => ({ ...prev, [key]: true }));
    setActiveConfetti(`halloween-${key}`);
    
    if (announcementSound) {
      try {
        await announcementSound.play();
      } catch (err) {
        console.log("Audio play failed:", err);
      }
    }
    
    setTimeout(() => setActiveConfetti(null), 5000);
  };

  // Reveal all winners with sequential confetti
  const revealAllWinners = () => {
    if (activeCard === "fresher") {
      setRevealedFresher({ mr: true, mrs: true });
      setActiveConfetti('all');
      setTimeout(() => setActiveConfetti(null), 6000);
    } else if (activeCard === "halloween") {
      setRevealedHalloween({ bestDressed: true, famousCharacter: true, bestDuo: true });
      setActiveConfetti('all');
      setTimeout(() => setActiveConfetti(null), 6000);
    }
  };

  // Enhanced statistics data
  const getEventStats = () => {
    const candidates = activeCard === "fresher" ? fCandidates : hCandidates;
    const totalCandidates = candidates.length;
    
    return {
      totalCandidates,
      totalVotes,
      voteDistribution: candidates.map(c => ({
        name: c.name,
        votes: c.votes,
        percentage: totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : 0,
      })),
    };
  };

  const stats = getEventStats();

  return (
    <div className={`results-page ${activeCard === "halloween" ? "halloween-theme" : ""}`}>
      {/* Full-screen Floating Halloween Elements */}
      {activeCard === "halloween" && (
        <div className="halloween-decorations">
          <div className="floating-pumpkin pumpkin-1">🎃</div>
          <div className="floating-pumpkin pumpkin-2">👻</div>
          <div className="floating-pumpkin pumpkin-3">🦇</div>
          <div className="floating-pumpkin pumpkin-4">🕷️</div>
          <div className="floating-pumpkin pumpkin-5">💀</div>
          <div className="floating-pumpkin pumpkin-6">🕸️</div>
        </div>
      )}

      {/* Enhanced Header Section */}
      <div className="results-header">
        <Title level={2} className="results-title">
          {activeCard === "halloween" ? "👻 Spooky Results 🎃" : "🏆 Event Results Dashboard"}
        </Title>
        
        {activeCard && (
          <div className="header-actions">
            <Button 
              icon={<BarChartOutlined />}
              onClick={() => setShowStatsModal(true)}
              className="stats-btn"
            >
              View Statistics
            </Button>
            <Button 
              icon={<SoundOutlined />}
              onClick={revealAllWinners}
              type="primary"
              className="reveal-all-btn"
            >
              Reveal All Winners
            </Button>
          </div>
        )}
      </div>

      {/* Quick Stats Bar */}
      {activeCard && (
        <Row gutter={[16, 16]} className="quick-stats">
          <Col xs={12} sm={12} lg={12}>
            <Card size="small" className="stat-card">
              <Statistic
                title="Total Candidates"
                value={stats.totalCandidates}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} lg={12}>
            <Card size="small" className="stat-card">
              <Statistic
                title="Total Votes"
                value={totalVotes}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Event Selection Cards */}
      <Row gutter={[16, 16]} className="event-selector">
        <Col xs={24} sm={12}>
          <Card
            hoverable
            onClick={() => setActiveCard((prev) => (prev === "fresher" ? null : "fresher"))}
            className={`event-card ${activeCard === "fresher" ? "active-fresher" : ""}`}
          >
            <div className="event-card-content">
              <div className="event-icon-wrapper">
                <TrophyOutlined className="event-icon" />
              </div>
              <div className="event-info">
                <Title level={4} className="event-card-title">Fresher Party</Title>
                <Text type="secondary" className="event-subtitle">Mr & Ms Fresher Competition</Text>
                <div className="event-meta">
                  <Tag icon={<UserOutlined />} color="blue" className="event-tag">{fCandidates.length} Candidates</Tag>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card
            hoverable
            onClick={() => setActiveCard((prev) => (prev === "halloween" ? null : "halloween"))}
            className={`event-card ${activeCard === "halloween" ? "active-halloween" : ""}`}
          >
            <div className="event-card-content">
              <div className="event-icon-wrapper">
                <FireOutlined className="event-icon halloween-fire" />
              </div>
              <div className="event-info">
                <Title level={4} className="event-card-title">Halloween Contest</Title>
                <Text type="secondary" className="event-subtitle">3 Spooky Categories</Text>
                <div className="event-meta">
                  <Tag icon={<UserOutlined />} color="orange" className="event-tag">{hCandidates.length} Candidates</Tag>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Full Page Confetti Coverage */}
      {activeConfetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9999,
          overflow: 'visible'
        }}>
          <Confetti 
            width={width} 
            height={height}
            numberOfPieces={activeConfetti === 'all' ? 800 : 500} 
            recycle={false}
            gravity={0.3}
            initialVelocityY={25}
            initialVelocityX={5}
            wind={0.01}
            friction={0.99}
            opacity={1}
            tweenDuration={5000}
            colors={activeCard === "halloween" 
              ? ['#7349AC', '#EB6123', '#16a34a', '#ff6b00', '#000000', '#ff8c00', '#ffa500', '#ff1493', '#9c27b0']
              : ['#f98d6f', '#ffcc98', '#ffd700', '#ff6b00', '#ffffff', '#ffeb3b', '#ff9800', '#e91e63']
            }
          />
        </div>
      )}

      {/* Fresher Results */}
      {activeCard === "fresher" && (
        <div className="results-content">
          {fLoading ? (
            <div className="loading-container">
              <Spin tip="Loading fresher results..." size="large" />
            </div>
          ) : fError ? (
            <Alert message={fError} type="error" showIcon />
          ) : (
            <>
              <div className="section-header">
                <Title level={3} className="section-title">
                  <CrownOutlined /> Fresher Party Results
                </Title>
                <Text type="secondary">Celebrating our newest talents</Text>
              </div>

              <Row gutter={[16, 16]} className="winner-section">
                {[
                  { key: "mr", label: "Mr. Fresher", color: "#f98d6f", icon: "👑" },
                  { key: "mrs", label: "Ms. Fresher", color: "#ffcc98", icon: "👑" },
                ].map(({ key, label, color, icon }) => {
                  const winner = fWinners[key];
                  const isRevealed = revealedFresher[key];
                  
                  return (
                    <Col xs={24} sm={12} lg={12} key={key}>
                      <Card 
                        bordered={false} 
                        className={`winner-card ${isRevealed ? 'revealed' : ''}`} 
                        style={{ borderTop: `4px solid ${color}` }}
                      >
                        <div className="winner-header">
                          <span className="winner-crown">{icon}</span>
                          {label}
                        </div>
                        {winner ? (
                          isRevealed ? (
                            <div className="winner-content winner-reveal-animation">
                              <div className="winner-avatar-container">
                                <img src={winner.image} alt={winner.name} className="winner-avatar" />
                                <div className="winner-badge">Winner</div>
                              </div>
                              <div className="winner-details">
                                <div className="winner-name">{winner.name}</div>
                                <div className="winner-dept">{winner.department}</div>
                                <div className="winner-votes">
                                  <TrophyOutlined /> {winner.votes} Votes
                                  <span className="vote-percentage">
                                    ({((winner.votes / totalVotes) * 100).toFixed(1)}%)
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="winner-content mystery-content">
                              <div className="mystery-box">
                                <div className="mystery-icon">🎁</div>
                                <div className="mystery-text">Winner Hidden</div>
                                <div className="mystery-subtext">Ready for the big reveal?</div>
                              </div>
                              <Button 
                                type="primary" 
                                icon={<EyeOutlined />}
                                onClick={() => handleRevealFresher(key)}
                                className="reveal-btn"
                                size="large"
                              >
                                Reveal Winner
                              </Button>
                            </div>
                          )
                        ) : (
                          <Empty description="No winner declared yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                      </Card>
                    </Col>
                  );
                })}
              </Row>

              <Card className="chart-card" title={
                <span>
                  <BarChartOutlined /> Vote Distribution Analysis
                </span>
              }>
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={16}>
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={fresherChartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                          <XAxis type="number" allowDecimals={false} />
                          <YAxis dataKey="name" type="category" width={120} />
                          <Tooltip 
                            formatter={(val, name, props) => [
                              `${val} votes (${props.payload.percentage}%)`, 
                              "Votes"
                            ]}
                          />
                          <Legend />
                          <Bar dataKey="votes" name="Votes" isAnimationActive radius={[0, 8, 8, 0]}>
                            {fresherChartData.map((entry, index) => (
                              <Cell key={`f-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Col>
                  <Col xs={24} lg={8}>
                    <div className="chart-sidebar">
                      <Title level={5}>Top Performers</Title>
                      {fresherChartData.slice(0, 5).map((candidate, index) => (
                        <div key={index} className="top-performer">
                          <div className="performer-rank">#{index + 1}</div>
                          <div className="performer-info">
                            <div className="performer-name">{candidate.name}</div>
                            <div className="performer-votes">{candidate.votes} votes</div>
                          </div>
                          <Progress 
                            percent={parseFloat(candidate.percentage)} 
                            size="small" 
                            showInfo={false}
                          />
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Halloween Results */}
      {activeCard === "halloween" && (
        <div className="results-content">
          {hLoading ? (
            <div className="loading-container">
              <Spin tip="Loading spooky results..." size="large" />
            </div>
          ) : hError ? (
            <Alert message={hError} type="error" showIcon />
          ) : (
            <>
              <div className="section-header">
                <Title level={3} className="section-title halloween-section-title">
                  🎃 Halloween Contest Results 🎃
                </Title>
                <Text type="secondary" className="halloween-subtitle">
                  The spookiest night of the year!
                </Text>
              </div>

              <Row gutter={[16, 16]} className="winner-section">
                {[
                  { key: "bestDressed", label: "Best Dressed", color: "#7349AC"},
                  { key: "famousCharacter", label: "Most Famous Character", color: "#EB6123"},
                  { key: "bestDuo", label: "Best Duo", color: "#16a34a"},
                ].map(({ key, label, color, emoji }) => {
                  const winner = hWinners[key];
                  const isRevealed = revealedHalloween[key];
                  
                  return (
                    <Col xs={24} sm={12} lg={8} key={key}>
                      <Card 
                        bordered={false} 
                        className={`winner-card ${isRevealed ? 'revealed' : ''}`}
                        style={{ borderTop: `4px solid ${color}` }}
                      >
                        <div className="winner-header">
                          {emoji} {label} {emoji}
                        </div>
                        {winner ? (
                          isRevealed ? (
                            <div className="winner-content winner-reveal-animation">
                              <div className="winner-avatar-container">
                                <img src={winner.image} alt={winner.name} className="winner-avatar" />
                                <div className="winner-badge">Winner</div>
                              </div>
                              <div className="winner-details">
                                <div className="winner-name">{winner.name}</div>
                                {winner.meta && <div className="winner-dept">{winner.meta}</div>}
                                <div className="winner-votes">
                                  <TrophyOutlined /> {winner.votes} Votes
                                  <span className="vote-percentage">
                                    ({((winner.votes / totalVotes) * 100).toFixed(1)}%)
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="winner-content mystery-content">
                              <div className="mystery-box">
                                <div className="mystery-icon">🎃</div>
                                <div className="mystery-text">Spooky Surprise</div>
                                <div className="mystery-subtext">Click to reveal!</div>
                              </div>
                              <Button 
                                type="primary" 
                                icon={<EyeOutlined />}
                                onClick={() => handleRevealHalloween(key)}
                                className="reveal-btn"
                                size="large"
                              >
                                Reveal Winner
                              </Button>
                            </div>
                          )
                        ) : (
                          <Empty description="No winner declared yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                      </Card>
                    </Col>
                  );
                })}
              </Row>

              <Card className="chart-card" title={
                <span>
                  <BarChartOutlined /> Vote Distribution Analysis
                </span>
              }>
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={16}>
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={halloweenChartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                          <XAxis type="number" allowDecimals={false} />
                          <YAxis dataKey="name" type="category" width={120} />
                          <Tooltip 
                            formatter={(val, name, props) => [
                              `${val} votes (${props.payload.percentage}%)`, 
                              props.payload.category
                            ]}
                          />
                          <Legend />
                          <Bar dataKey="votes" name="Votes" isAnimationActive radius={[0, 8, 8, 0]}>
                            {halloweenChartData.map((entry, index) => (
                              <Cell key={`h-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Col>
                  <Col xs={24} lg={8}>
                    <div className="chart-sidebar">
                      <Title level={5}>Top Performers</Title>
                      {halloweenChartData.slice(0, 5).map((candidate, index) => (
                        <div key={index} className="top-performer">
                          <div className="performer-rank">#{index + 1}</div>
                          <div className="performer-info">
                            <div className="performer-name">{candidate.name}</div>
                            <div className="performer-votes">{candidate.votes} votes</div>
                          </div>
                          <Progress 
                            percent={parseFloat(candidate.percentage)} 
                            size="small" 
                            showInfo={false}
                            strokeColor={candidate.fill}
                          />
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Statistics Modal */}
      <Modal
        title={<span><BarChartOutlined /> Event Statistics</span>}
        open={showStatsModal}
        onCancel={() => setShowStatsModal(false)}
        footer={null}
        width={800}
        className="stats-modal"
      >
        {activeCard && (
          <div className="stats-content">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="Vote Distribution" size="small">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={stats.voteDistribution}
                        dataKey="votes"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {stats.voteDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={activeCard === 'fresher' ? fresherColors[entry.category] : halloweenColors[entry.category]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Voting Timeline" size="small">
                  {voteHistory.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={voteHistory}>
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="votes" stroke="#ff6b00" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <Empty description="No timeline data available" />
                  )}
                </Card>
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Statistic title="Total Candidates" value={stats.totalCandidates} prefix={<UserOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic title="Total Votes" value={totalVotes} prefix={<TeamOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="Average Votes" 
                  value={totalVotes > 0 ? (totalVotes / stats.totalCandidates).toFixed(1) : 0} 
                  prefix={<StarOutlined />} 
                />
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageEvent;