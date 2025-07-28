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

const categoryColors = {
  Mr: "#f98d6f",
  Mrs: "#ffcc98",
};

const getCategoryLabel = (cat) =>
  cat === "Mr" ? "Mr. Fresher" : "Ms. Fresher";

const ManageEvent = ({ url }) => {
  const [candidates, setCandidates] = useState([]);
  const [winners, setWinners] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [width, height] = useWindowSize();

  useEffect(() => {
    async function fetchResults() {
      try {
        const [candRes, winRes] = await Promise.all([
          fetch(`${url}/api/pccoer/fresher-party/candidates`),
          fetch(`${url}/api/pccoer/fresher-party/winners`),
        ]);
        if (!candRes.ok || !winRes.ok)
          throw new Error("Failed to fetch results");

        const candidatesData = await candRes.json();
        const winnersData = await winRes.json();
        setCandidates(candidatesData);
        setWinners(winnersData);
        setError(null);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Could not load election results.");
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [url]);

  const chartData = candidates.map((c) => ({
    name: c.name,
    votes: c.votes,
    category: getCategoryLabel(c.category),
    image: c.image,
    fill: categoryColors[c.category],
  }));

  return (
    <div
      className="results-page"
      style={{ maxWidth: 900, margin: "32px auto", padding: "24px 16px" }}
    >
      {/* 🎉 Confetti on winner load */}
      {winners.mr && winners.mrs && (
        <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />
      )}

      <Title
  level={2}
  style={{
    textAlign: "center",
    marginBottom: 16,
    color: "#000000", // Black text
    fontSize: "33px",
    fontWeight: 700,
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  }}
>
  Fresher Party Results
</Title>


      {loading ? (
        <Spin
          tip="Loading results..."
          size="large"
          style={{ display: "block", margin: "80px auto" }}
        />
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <>
          {/* Winners */}
          <Row gutter={[24, 24]} className="winner-section">
            {[
              { key: "mr", label: "Mr. Fresher" },
              { key: "mrs", label: "Ms. Fresher" },
            ].map(({ key, label }) => {
              const winner = winners[key];

              return (
                <Col key={key}>
                  <Card bordered={false} className="winner-card">
                    <div className="winner-header">{label}</div>
                    {winner ? (
                      <>
                        <img
                          src={winner.image}
                          className="winner-avatar"
                        />
                        <div className="winner-name">{winner.name}</div>
                        <div className="winner-dept">
                          Department: {winner.department}
                        </div>
                        <div className="winner-votes">Votes: {winner.votes}</div>
                      </>
                    ) : (
                      <Text>No winner in this category yet.</Text>
                    )}
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* Vote Chart */}
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
                data={chartData}
                layout="vertical"
                margin={{right: 0 }}
              >
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={90} />
                <Tooltip formatter={(val) => [val, "Votes"]} />
                <Legend />
                <Bar dataKey="votes" name="Votes" isAnimationActive radius={[0, 10, 10, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  );
};

export default ManageEvent;
