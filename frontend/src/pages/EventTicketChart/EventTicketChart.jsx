import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import "./EventTicketChart.css"; // Import the CSS file

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const EventTicketChart = () => {
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [eventTableData, setEventTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalConfirmedTickets, setTotalConfirmedTickets] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://grooviti-backend.onrender.com/api/booking/event-stats"
        );
        console.log("API Response:", response.data);

        if (response.data.success && response.data.data) {
          const eventStats = response.data.data;
          console.log("Event Stats:", eventStats);

          const labels = Object.keys(eventStats);

          if (labels.length === 0) {
            setError("No booking data available.");
            setLoading(false);
            return;
          }

          const confirmedData = labels.map(
            (event) => eventStats[event]?.confirmed || 0
          );
          const pendingData = labels.map(
            (event) => eventStats[event]?.pending || 0
          );

          setBarChartData({
            labels,
            datasets: [
              {
                label: "Confirmed Tickets",
                data: confirmedData,
                backgroundColor: "#2E5894",
              },
              {
                label: "Pending Tickets",
                data: pendingData,
                backgroundColor: "#BCC6E0",
              },
            ],
          });

          const confirmedBookings = labels.map(
            (event) => eventStats[event]?.confirmed || 0
          );

          const totalConfirmed = confirmedBookings.reduce((a, b) => a + b, 0);
          setTotalConfirmedTickets(totalConfirmed);

          // const dynamicColors = labels.map(
          //   (_, i) => `hsl(${i * 50}, 70%, 50%)`
          // );

          const customColors = [
            "#f8b48f", // Red-Orange
            "#f69d63", // Green
            "#f4874c", // Blue
            "#f3702a", // Yellow
            "#ec5a03", // Dark Red
            "#ca4d06", // Purple
            "#a84009", // Light Green
            "#873307", // Purple
            "#650625", // Light Green
            "#431903", // Purple
          ];

          setPieChartData({
            labels,
            datasets: [
              {
                label: "Confirmed Bookings",
                data: confirmedBookings,
                backgroundColor: customColors,
              },
            ],
          });

          const tableData = labels.map((event) => ({
            eventName: event,
            confirmed: eventStats[event]?.confirmed || 0,
            pending: eventStats[event]?.pending || 0,
          }));
          setEventTableData(tableData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch booking data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const centerTextPlugin = {
    id: "centerText",
    beforeDraw(chart) {
      const { width, height, ctx } = chart;
      ctx.save();
      ctx.font = "bold 16px Arial";
      ctx.fillStyle = "black"; // Text color
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const text = `Total: ${totalConfirmedTickets}`;
      const textX = width / 2;

      const cutoutPercentage = chart.config.options.cutout || "40%"; // Default to 50%
      const cutoutRadius = (parseInt(cutoutPercentage) / 100) * (height / 2);
      const textY = height / 2 - cutoutRadius / 3; // Move up slightly for better centering

      ctx.fillText(text, textX, textY);
      ctx.restore();
    },
  };

  return (
    <div className="chart-container">
      <h2>Event Ticket Sales For Technovate</h2>

      {loading && <p>Loading data...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <>
          <div className="charts-wrapper">
            {barChartData && (
              <div className="chart-box bar-chart">
                <Bar
                  data={barChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: {
                          usePointStyle: true,
                        },
                      },
                    },
                    elements: {
                      bar: {
                        borderRadius: 4,
                      },
                    },
                    scales: {
                      x: {
                        barThickness: "flex",
                        categoryPercentage: 0.7,
                        barPercentage: 0.9,
                      },
                    },
                  }}
                />
              </div>
            )}

            {pieChartData && (
              <div className="chart-box pie-chart">
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "70%", // Makes it a donut chart by cutting out the center
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                      tooltip: {
                        callbacks: {
                          label: (tooltipItem) => {
                            const label =
                              pieChartData.labels[tooltipItem.dataIndex];
                            const value =
                              pieChartData.datasets[0].data[
                                tooltipItem.dataIndex
                              ];
                            return `${label}: ${value} tickets`;
                          },
                        },
                      },
                    },
                  }}
                  plugins={[centerTextPlugin]} // Register the plugin
                />
              </div>
            )}
          </div>

          <h2 className="table-heading">Detailed Ticket Sales</h2>
          <div className="table-wrapper">
            <table className="event-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Confirmed Tickets</th>
                  <th>Pending Tickets</th>
                </tr>
              </thead>
              <tbody>
                {eventTableData.map((event, index) => (
                  <tr key={index} className={index % 2 === 0 ? "even-row" : ""}>
                    <td>{event.eventName}</td>
                    <td>{event.confirmed}</td>
                    <td>{event.pending}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="total-tickets">
            Total Tickets Sold: {totalConfirmedTickets}
          </h3>
        </>
      )}
    </div>
  );
};

export default EventTicketChart;
