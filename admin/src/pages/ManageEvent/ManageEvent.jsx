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
import { CrownOutlined } from "@ant-design/icons";
import "./ManageEvent.css";

const { Title, Text } = Typography;

const categoryColors = {
  Mr: "#4386f4",
  Mrs: "#f441a5",
};

const getCategoryLabel = (cat) =>
  cat === "Mr" ? "Mr. Fresher" : "Ms. Fresher";

// ✅ Accept `url` as prop like in AddCandidate
const ManageEvent = ({ url }) => {
  const [candidates, setCandidates] = useState([]);
  const [winners, setWinners] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, [url]); // Re-run if url changes

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
      style={{ maxWidth: 900, margin: "32px auto", padding: 24 }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: 16 }}>
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
          <Row gutter={24} style={{ marginBottom: 32 }}>
            {["mr", "mrs"].map((key) => {
              const winner = winners[key];
              return (
                <Col xs={24} md={12} key={key}>
                  <Card
                    bordered={false}
                    style={{
                      background:
                        key === "mr"
                          ? "linear-gradient(90deg, #e3f0ff 0%, #b2c9ff 100%)"
                          : "linear-gradient(90deg, #fff0f6 0%, #ffb2c9 100%)",
                      textAlign: "center",
                      boxShadow: "0 2px 18px 2px rgba(64,128,254,0.08)",
                    }}
                  >
                    <CrownOutlined
                      style={{
                        fontSize: 28,
                        color: categoryColors[winner?.category || "Mr"],
                      }}
                    />
                    <Title level={4} style={{ margin: "15px 0 5px 0" }}>
                      {key === "mr"
                        ? "Mr. Fresher Winner"
                        : "Ms. Fresher Winner"}
                    </Title>
                    {winner ? (
                      <>
                        <Avatar
                          src={winner.image}
                          size={84}
                          style={{ margin: "12px auto" }}
                        />
                        <Text
                          style={{
                            display: "block",
                            fontSize: 18,
                            fontWeight: 600,
                          }}
                        >
                          {winner.name}
                        </Text>
                        <div style={{ fontSize: 16, color: "#383838" }}>
                          Votes: <b>{winner.votes}</b>
                        </div>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          Department: {winner.department}
                        </Text>
                      </>
                    ) : (
                      <Text>No winner in this category yet.</Text>
                    )}
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* Vote Distribution Chart */}
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
                margin={{ left: 32 }}
              >
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={130} />
                <Tooltip formatter={(val) => [val, "Votes"]} />
                <Legend />
                <Bar dataKey="votes" name="Votes" isAnimationActive>
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
