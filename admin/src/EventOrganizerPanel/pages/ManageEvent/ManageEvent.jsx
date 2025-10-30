import React, { useEffect, useState } from "react";
import { Card, Spin, Alert, Typography, Row, Col, Avatar } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
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
  const [activeCard, setActiveCard] = useState(null); // "fresher" | "halloween" | null

  // Fresher states
  const [fCandidates, setFCandidates] = useState([]);
  const [fWinners, setFWinners] = useState({});
  const [fLoading, setFLoading] = useState(false);
  const [fError, setFError] = useState(null);

  // Halloween states
  const [hCandidates, setHCandidates] = useState([]);
  const [hWinners, setHWinners] = useState({});
  const [hLoading, setHLoading] = useState(false);
  const [hError, setHError] = useState(null);

  const [width, height] = useWindowSize();

  // Load Fresher results when active
  useEffect(() => {
    if (activeCard !== "fresher") return;
    let cancelled = false;
    (async () => {
      try {
        setFLoading(true);
        const [candRes, winRes] = await Promise.all([
          fetch(`${url}/api/pccoer/fresher-party/candidates`),
          fetch(`${url}/api/pccoer/fresher-party/winners`),
        ]);
        if (!candRes.ok || !winRes.ok)
          throw new Error("Failed to fetch Fresher results");
        const candidatesData = await candRes.json();
        const winnersData = await winRes.json();
        if (!cancelled) {
          setFCandidates(candidatesData);
          setFWinners(winnersData);
          setFError(null);
        }
      } catch (err) {
        if (!cancelled) setFError("Could not load Fresher results.");
        // eslint-disable-next-line no-console
        console.error("Fresher Fetch Error:", err);
      } finally {
        if (!cancelled) setFLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeCard, url]);

  // Load Halloween results when active
  useEffect(() => {
    if (activeCard !== "halloween") return;
    let cancelled = false;
    (async () => {
      try {
        setHLoading(true);
        const [candRes, winRes] = await Promise.all([
          fetch(`${url}/api/pccoer/halloween/candidates`),
          fetch(`${url}/api/pccoer/halloween/winners`),
        ]);
        if (!candRes.ok || !winRes.ok)
          throw new Error("Failed to fetch Halloween results");
        const candidatesData = await candRes.json();
        const winnersData = await winRes.json();
        if (!cancelled) {
          setHCandidates(candidatesData.data || []);
          setHWinners(winnersData);
          setHError(null);
        }
      } catch (err) {
        if (!cancelled) setHError("Could not load Halloween results.");
        // eslint-disable-next-line no-console
        console.error("Halloween Fetch Error:", err);
      } finally {
        if (!cancelled) setHLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeCard, url]);

  const fresherChartData = fCandidates.map((c) => ({
    name: c.name,
    votes: c.votes,
    category: getFresherLabel(c.category),
    image: c.image,
    fill: fresherColors[c.category] || "#9ca3af",
  }));

  const halloweenChartData = hCandidates.map((c) => ({
    name: c.name,
    votes: c.votes,
    category: getHalloweenLabel(c.category),
    image: c.image,
    fill: halloweenColors[c.category] || "#9ca3af",
  }));

  return (
    <div
      className="results-page"
      style={{ maxWidth: 900, margin: "32px auto", padding: "24px 16px" }}
    >
      {/* Top title */}
      <Title
        level={2}
        style={{
          textAlign: "center",
          marginBottom: 16,
          color: "#000000",
          fontSize: "33px",
          fontWeight: 700,
          fontFamily: "'Poppins', 'Segoe UI', sans-serif",
        }}
      >
        Manage Event Results
      </Title>

      {/* Two clickable cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Card
            hoverable
            onClick={() =>
              setActiveCard((prev) => (prev === "fresher" ? null : "fresher"))
            }
            style={{
              border:
                activeCard === "fresher"
                  ? "2px solid #4a6cf7"
                  : "1px solid #f0f0f0",
            }}
            title="Fresher Party"
            extra={<span style={{ color: "#888" }}>Mr & Ms Fresher</span>}
          >
            <Text>
              Click to {activeCard === "fresher" ? "hide" : "view"} Fresher
              results
            </Text>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            hoverable
            onClick={() =>
              setActiveCard((prev) =>
                prev === "halloween" ? null : "halloween"
              )
            }
            style={{
              border:
                activeCard === "halloween"
                  ? "2px solid #7349AC"
                  : "1px solid #f0f0f0",
            }}
            title="Halloween Costume Contest"
            extra={<span style={{ color: "#888" }}>3 Categories</span>}
          >
            <Text>
              Click to {activeCard === "halloween" ? "hide" : "view"} Halloween
              results
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Confetti when winners loaded for the active section */}
      {activeCard === "fresher" && fWinners.mr && fWinners.mrs && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={250}
          recycle={false}
        />
      )}
      {activeCard === "halloween" &&
        (hWinners.bestDressed ||
          hWinners.famousCharacter ||
          hWinners.bestDuo) && (
          <Confetti
            width={width}
            height={height}
            numberOfPieces={250}
            recycle={false}
          />
        )}

      {/* Fresher details */}
      {activeCard === "fresher" && (
        <>
          {fLoading ? (
            <Spin
              tip="Loading results..."
              size="large"
              style={{ display: "block", margin: "80px auto" }}
            />
          ) : fError ? (
            <Alert message={fError} type="error" showIcon />
          ) : (
            <>
              <Title level={3} style={{ marginTop: 12, marginBottom: 8 }}>
                Fresher Party Results
              </Title>
              <Row gutter={[24, 24]} className="winner-section">
                {[
                  { key: "mr", label: "Mr. Fresher" },
                  { key: "mrs", label: "Ms. Fresher" },
                ].map(({ key, label }) => {
                  const winner = fWinners[key];
                  return (
                    <Col key={key}>
                      <Card bordered={false} className="winner-card">
                        <div className="winner-header">{label}</div>
                        {winner ? (
                          <>
                            <img src={winner.image} className="winner-avatar" />
                            <div className="winner-name">{winner.name}</div>
                            <div className="winner-dept">
                              Department: {winner.department}
                            </div>
                            <div className="winner-votes">
                              Votes: {winner.votes}
                            </div>
                          </>
                        ) : (
                          <Text>No winner in this category yet.</Text>
                        )}
                      </Card>
                    </Col>
                  );
                })}
              </Row>

              <Card
                style={{
                  marginTop: 16,
                  background: "#fcfcfc",
                  boxShadow: "0 2px 16px 2px rgba(44,128,254,0.03)",
                }}
              >
                <Title level={4} style={{ marginBottom: 20 }}>
                  Vote Distribution Chart
                </Title>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={fresherChartData}
                    layout="vertical"
                    margin={{ right: 0 }}
                  >
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="name" type="category" width={90} />
                    <Tooltip formatter={(val) => [val, "Votes"]} />
                    <Legend />
                    <Bar
                      dataKey="votes"
                      name="Votes"
                      isAnimationActive
                      radius={[0, 10, 10, 0]}
                    >
                      {fresherChartData.map((entry, index) => (
                        <Cell key={`f-cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </>
          )}
        </>
      )}

      {/* Halloween details */}
      {activeCard === "halloween" && (
        <>
          {hLoading ? (
            <Spin
              tip="Loading results..."
              size="large"
              style={{ display: "block", margin: "80px auto" }}
            />
          ) : hError ? (
            <Alert message={hError} type="error" showIcon />
          ) : (
            <>
              <Title level={3} style={{ marginTop: 12, marginBottom: 8 }}>
                Halloween Results
              </Title>
              <Row gutter={[24, 24]} className="winner-section">
                {[
                  { key: "bestDressed", label: "Best Dressed" },
                  { key: "famousCharacter", label: "Most Famous Character" },
                  { key: "bestDuo", label: "Best Duo" },
                ].map(({ key, label }) => {
                  const winner = hWinners[key];
                  return (
                    <Col key={key}>
                      <Card bordered={false} className="winner-card">
                        <div className="winner-header">{label}</div>
                        {winner ? (
                          <>
                            <img src={winner.image} className="winner-avatar" />
                            <div className="winner-name">{winner.name}</div>
                            {winner.meta && (
                              <div className="winner-dept">{winner.meta}</div>
                            )}
                            <div className="winner-votes">
                              Votes: {winner.votes}
                            </div>
                          </>
                        ) : (
                          <Text>No winner in this category yet.</Text>
                        )}
                      </Card>
                    </Col>
                  );
                })}
              </Row>

              <Card
                style={{
                  marginTop: 16,
                  background: "#fcfcfc",
                  boxShadow: "0 2px 16px 2px rgba(44,128,254,0.03)",
                }}
              >
                <Title level={4} style={{ marginBottom: 20 }}>
                  Vote Distribution Chart
                </Title>
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart
                    data={halloweenChartData}
                    layout="vertical"
                    margin={{ right: 0 }}
                  >
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="name" type="category" width={110} />
                    <Tooltip
                      formatter={(val, _name, props) => [
                        val,
                        props.payload.category,
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="votes"
                      name="Votes"
                      isAnimationActive
                      radius={[0, 10, 10, 0]}
                    >
                      {halloweenChartData.map((entry, index) => (
                        <Cell key={`h-cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ManageEvent;
