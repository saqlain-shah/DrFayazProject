import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchMonthlyEarnings } from "../Api/api.js";

export function DashboardBigChart() {
  const [monthlyEarnings, setMonthlyEarnings] = useState(
    new Array(12).fill({ month: "", earnings: 0 })
  );

  useEffect(() => {
    const getMonthlyData = async () => {
      try {
        const response = await fetchMonthlyEarnings();
        console.log("API Response:", response);

        if (!response || !Array.isArray(response.monthlyData)) {
          console.error("Invalid API response format:", response);
          return;
        }

        const earnings = new Array(12).fill(0).map((_, index) => ({
          month: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ][index],
          earnings: 0,
        }));

        response.monthlyData.forEach(({ month, totalEarnings }) => {
          if (typeof month === "number" && month >= 1 && month <= 12) {
            earnings[month - 1].earnings = Number(totalEarnings) || 0;
          }
        });

        console.log("Processed Earnings Data:", earnings);
        setMonthlyEarnings(earnings);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getMonthlyData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={monthlyEarnings}>
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#666" }} />
        <YAxis 
          tick={{ fontSize: 10, fill: "#666" }}
          tickFormatter={(value) => (value >= 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value}`)} 
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #ddd",
            padding: "5px",
            fontSize: "12px",
          }}
          formatter={(value) => {
            let formattedValue = value >= 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value}`;
            return [formattedValue, "Total"];
          }}
        />
        <Line
          type="monotone"
          dataKey="earnings"
          stroke="#66B5A3"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
