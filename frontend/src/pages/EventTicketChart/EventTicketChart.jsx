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
          "http://grooviti-backend.onrender.com/api/booking/event-stats"
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
                backgroundColor: "green",
              },
              {
                label: "Pending Tickets",
                data: pendingData,
                backgroundColor: "red",
              },
            ],
          });

          const confirmedBookings = labels.map(
            (event) => eventStats[event]?.confirmed || 0
          );

          const totalConfirmed = confirmedBookings.reduce((a, b) => a + b, 0);
          setTotalConfirmedTickets(totalConfirmed);

          const dynamicColors = labels.map(
            (_, i) => `hsl(${i * 50}, 70%, 50%)`
          );

          setPieChartData({
            labels,
            datasets: [
              {
                label: "Confirmed Bookings",
                data: confirmedBookings,
                backgroundColor: dynamicColors,
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

  return (
    <div className="chart-container">
      <h2>Event Ticket Sales</h2>

      {loading && <p>Loading data...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <>
          <div className="charts-wrapper">
            {barChartData && (
              <div className="chart-box">
                <Bar data={barChartData} />
              </div>
            )}

            {pieChartData && (
              <div className="chart-box pie-chart">
                <Pie
                  data={pieChartData}
                  options={{
                    maintainAspectRatio: false,
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
