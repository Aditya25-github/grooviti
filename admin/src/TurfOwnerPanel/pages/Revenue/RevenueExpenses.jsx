import React, { useState } from "react";
import styles from "./RevenueExpenses.module.css";
import {
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
  FaFilter,
  FaChartLine,
  FaMoneyBillWave,
  FaCreditCard,
} from "react-icons/fa";

const RevenueExpenses = () => {
  const [timePeriod, setTimePeriod] = useState("Monthly");
  const [dateRange, setDateRange] = useState("dd/mm/yyyy");

  // Mock financial data
  const [financialData] = useState({
    monthly: {
      revenue: 124500,
      revenueChange: 15.2,
      expenses: 45200,
      expensesChange: -5.3,
      quarterly: {
        revenue: 352800,
        revenueChange: 8.7,
        expenses: 128600,
        expensesChange: 3.1,
      },
      yearly: {
        revenue: 1489200,
        revenueChange: 22.1,
        expenses: 514400,
        expensesChange: 7.8,
      },
    },
  });

  const [revenueBreakdown] = useState([
    {
      source: "Turf Bookings",
      amount: 98400,
      percentage: 79,
      color: "#10b981",
    },
    {
      source: "Equipment Rental",
      amount: 18200,
      percentage: 15,
      color: "#3b82f6",
    },
    {
      source: "Membership Fees",
      amount: 7900,
      percentage: 6,
      color: "#8b5cf6",
    },
  ]);

  const [expensesBreakdown] = useState([
    {
      category: "Maintenance",
      amount: 25000,
      percentage: 55,
      color: "#ef4444",
    },
    { category: "Utilities", amount: 12800, percentage: 28, color: "#f59e0b" },
    {
      category: "Staff Salaries",
      amount: 6800,
      percentage: 15,
      color: "#6b7280",
    },
  ]);

  const [monthlyTrends] = useState([
    { month: "Jan", revenue: 95000, expenses: 42000 },
    { month: "Feb", revenue: 108000, expenses: 38000 },
    { month: "Mar", revenue: 115000, expenses: 45000 },
    { month: "Apr", revenue: 132000, expenses: 48000 },
    { month: "May", revenue: 124500, expenses: 45200 },
  ]);

  const [revenueVsExpenses] = useState([
    { period: "Q1 2024", revenue: 318000, expenses: 125000 },
    { period: "Q2 2024", revenue: 356000, expenses: 138000 },
    { period: "Q3 2024", revenue: 342000, expenses: 142000 },
    { period: "Q4 2024", revenue: 352800, expenses: 128600 },
  ]);

  const maxRevenue = Math.max(...monthlyTrends.map((d) => d.revenue));
  const maxExpense = Math.max(...monthlyTrends.map((d) => d.expenses));
  const maxAmount = Math.max(maxRevenue, maxExpense);

  const maxRevenueVsExpense = Math.max(
    ...revenueVsExpenses.flatMap((d) => [d.revenue, d.expenses])
  );

  const handleExportData = () => {
    console.log("Exporting financial data");
    alert("Financial data exported successfully!");
  };

  const getChangeIcon = (change) => {
    return change > 0 ? <FaArrowUp /> : <FaArrowDown />;
  };

  const getChangeClass = (change) => {
    return change > 0 ? styles.positive : styles.negative;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Revenue & Expenses</h1>
          <p className={styles.description}>
            Monitor your financial performance and track expenses
          </p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={handleExportData} className={styles.exportBtn}>
            <FaDownload className={styles.btnIcon} />
            Export Data
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controlsSection}>
        <div className={styles.timePeriodControl}>
          <label className={styles.controlLabel}>Time Period:</label>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className={styles.controlSelect}
          >
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        <div className={styles.dateRangeControl}>
          <label className={styles.controlLabel}>Date Range:</label>
          <div className={styles.dateInputWrapper}>
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className={styles.dateInput}
              placeholder="dd/mm/yyyy"
            />
            <FaCalendarAlt className={styles.dateIcon} />
          </div>
          <span className={styles.dateTo}>to</span>
          <div className={styles.dateInputWrapper}>
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className={styles.dateInput}
              placeholder="dd/mm/yyyy"
            />
            <FaCalendarAlt className={styles.dateIcon} />
          </div>
        </div>

        <button className={styles.applyFilterBtn}>
          <FaFilter className={styles.btnIcon} />
          Apply Filter
        </button>
      </div>

      {/* Revenue Summary */}
      <div className={styles.summarySection}>
        <h2 className={styles.sectionTitle}>Revenue Summary</h2>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.cardHeader}>
              <FaChartLine className={styles.cardIcon} />
              <div
                className={`${styles.changeIndicator} ${getChangeClass(
                  financialData.monthly.revenueChange
                )}`}
              >
                {getChangeIcon(financialData.monthly.revenueChange)}
                {Math.abs(financialData.monthly.revenueChange)}%
                <span className={styles.changeLabel}>vs last month</span>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardValue}>
                ₹{financialData.monthly.revenue.toLocaleString()}
              </div>
              <div className={styles.cardLabel}>Monthly Revenue</div>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.cardHeader}>
              <FaChartLine className={styles.cardIcon} />
              <div
                className={`${styles.changeIndicator} ${getChangeClass(
                  financialData.monthly.quarterly.revenueChange
                )}`}
              >
                {getChangeIcon(financialData.monthly.quarterly.revenueChange)}
                {Math.abs(financialData.monthly.quarterly.revenueChange)}%
                <span className={styles.changeLabel}>vs last quarter</span>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardValue}>
                ₹{financialData.monthly.quarterly.revenue.toLocaleString()}
              </div>
              <div className={styles.cardLabel}>Quarterly Revenue</div>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.cardHeader}>
              <FaChartLine className={styles.cardIcon} />
              <div
                className={`${styles.changeIndicator} ${getChangeClass(
                  financialData.monthly.yearly.revenueChange
                )}`}
              >
                {getChangeIcon(financialData.monthly.yearly.revenueChange)}
                {Math.abs(financialData.monthly.yearly.revenueChange)}%
                <span className={styles.changeLabel}>vs last year</span>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardValue}>
                ₹{financialData.monthly.yearly.revenue.toLocaleString()}
              </div>
              <div className={styles.cardLabel}>Yearly Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Summary */}
      <div className={styles.summarySection}>
        <h2 className={styles.sectionTitle}>Expenses Summary</h2>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.cardHeader}>
              <FaMoneyBillWave className={styles.cardIcon} />
              <div
                className={`${styles.changeIndicator} ${getChangeClass(
                  financialData.monthly.expensesChange
                )}`}
              >
                {getChangeIcon(financialData.monthly.expensesChange)}
                {Math.abs(financialData.monthly.expensesChange)}%
                <span className={styles.changeLabel}>vs last month</span>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardValue}>
                ₹{financialData.monthly.expenses.toLocaleString()}
              </div>
              <div className={styles.cardLabel}>Monthly Expenses</div>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.cardHeader}>
              <FaMoneyBillWave className={styles.cardIcon} />
              <div
                className={`${styles.changeIndicator} ${getChangeClass(
                  financialData.monthly.quarterly.expensesChange
                )}`}
              >
                {getChangeIcon(financialData.monthly.quarterly.expensesChange)}
                {Math.abs(financialData.monthly.quarterly.expensesChange)}%
                <span className={styles.changeLabel}>vs last quarter</span>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardValue}>
                ₹{financialData.monthly.quarterly.expenses.toLocaleString()}
              </div>
              <div className={styles.cardLabel}>Quarterly Expenses</div>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.cardHeader}>
              <FaMoneyBillWave className={styles.cardIcon} />
              <div
                className={`${styles.changeIndicator} ${getChangeClass(
                  financialData.monthly.yearly.expensesChange
                )}`}
              >
                {getChangeIcon(financialData.monthly.yearly.expensesChange)}
                {Math.abs(financialData.monthly.yearly.expensesChange)}%
                <span className={styles.changeLabel}>vs last year</span>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardValue}>
                ₹{financialData.monthly.yearly.expenses.toLocaleString()}
              </div>
              <div className={styles.cardLabel}>Yearly Expenses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue vs Expenses Comparison */}
      <div className={styles.comparisonSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Revenue vs Expenses Comparison
          </h2>
          <div className={styles.chartTabs}>
            <button className={`${styles.chartTab} ${styles.activeTab}`}>
              Revenue
            </button>
            <button className={styles.chartTab}>Expenses</button>
            <button className={styles.chartTab}>Profit</button>
          </div>
        </div>

        <div className={styles.chartContainer}>
          <div className={styles.barChart}>
            {revenueVsExpenses.map((data, index) => (
              <div key={index} className={styles.barGroup}>
                <div className={styles.barWrapper}>
                  <div
                    className={styles.revenueBar}
                    style={{
                      height: `${(data.revenue / maxRevenueVsExpense) * 200}px`,
                    }}
                  >
                    <div className={styles.barValue}>
                      ₹{(data.revenue / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <div
                    className={styles.expenseBar}
                    style={{
                      height: `${
                        (data.expenses / maxRevenueVsExpense) * 200
                      }px`,
                    }}
                  >
                    <div className={styles.barValue}>
                      ₹{(data.expenses / 1000).toFixed(0)}k
                    </div>
                  </div>
                </div>
                <div className={styles.barLabel}>{data.period}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breakdown Sections */}
      <div className={styles.breakdownSection}>
        <div className={styles.revenueBreakdown}>
          <h2 className={styles.sectionTitle}>Revenue Breakdown</h2>
          <div className={styles.breakdownList}>
            {revenueBreakdown.map((item, index) => (
              <div key={index} className={styles.breakdownItem}>
                <div className={styles.itemInfo}>
                  <div
                    className={styles.itemColor}
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className={styles.itemName}>{item.source}</span>
                </div>
                <div className={styles.itemAmount}>
                  ₹{item.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.expensesBreakdown}>
          <h2 className={styles.sectionTitle}>Expenses Breakdown</h2>
          <div className={styles.breakdownList}>
            {expensesBreakdown.map((item, index) => (
              <div key={index} className={styles.breakdownItem}>
                <div className={styles.itemInfo}>
                  <div
                    className={styles.itemColor}
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className={styles.itemName}>{item.category}</span>
                </div>
                <div className={styles.itemAmount}>
                  ₹{item.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends Chart */}
      <div className={styles.trendsSection}>
        <h2 className={styles.sectionTitle}>Monthly Trends</h2>
        <div className={styles.lineChart}>
          <svg className={styles.chartSvg} viewBox="0 0 600 300">
            <defs>
              <linearGradient
                id="revenueGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="expenseGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Revenue Line */}
            <polyline
              fill="url(#revenueGradient)"
              stroke="#10b981"
              strokeWidth="3"
              points={monthlyTrends
                .map(
                  (data, index) =>
                    `${(index / (monthlyTrends.length - 1)) * 550 + 25},${
                      280 - (data.revenue / maxAmount) * 200
                    }`
                )
                .join(" ")}
            />

            {/* Expense Line */}
            <polyline
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              points={monthlyTrends
                .map(
                  (data, index) =>
                    `${(index / (monthlyTrends.length - 1)) * 550 + 25},${
                      280 - (data.expenses / maxAmount) * 200
                    }`
                )
                .join(" ")}
            />

            {/* Revenue Points */}
            {monthlyTrends.map((data, index) => (
              <circle
                key={`revenue-${index}`}
                cx={(index / (monthlyTrends.length - 1)) * 550 + 25}
                cy={280 - (data.revenue / maxAmount) * 200}
                r="5"
                fill="#10b981"
              />
            ))}

            {/* Expense Points */}
            {monthlyTrends.map((data, index) => (
              <circle
                key={`expense-${index}`}
                cx={(index / (monthlyTrends.length - 1)) * 550 + 25}
                cy={280 - (data.expenses / maxAmount) * 200}
                r="5"
                fill="#ef4444"
              />
            ))}
          </svg>

          <div className={styles.chartLabels}>
            {monthlyTrends.map((data, index) => (
              <span key={index} className={styles.chartLabel}>
                {data.month}
              </span>
            ))}
          </div>

          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: "#10b981" }}
              ></div>
              <span>Revenue</span>
            </div>
            <div className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: "#ef4444" }}
              ></div>
              <span>Expenses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueExpenses;
