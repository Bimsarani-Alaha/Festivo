import React, { useState, ChangeEvent } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  LineChart,
  Line,
} from "recharts";

interface ExcelRow {
  [key: string]: string | number | boolean | null;
}

const genAI = new GoogleGenerativeAI("AIzaSyB8VJFjnn9lbw28RpV2A09qa_cxi-RyiIU");

const ChatComponent: React.FC = () => {
  const [response, setResponse] = useState<string>("");
  const [excelData, setExcelData] = useState<ExcelRow[] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleExcelUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(sheet, {
        raw: false,
        dateNF: "yyyy-mm-dd",
      }) as ExcelRow[];

      const monthMap: {
        [month: string]: {
          Birthday: number;
          Proposal: number;
          GenderReveal: number;
          Revenue: number;
          Basic: number;
          Premium: number;
          Luxury: number;
        };
      } = {};

      jsonData.forEach((row) => {
        const dateStr = row["Date"] as string;
        const dateObj = new Date(dateStr);
        const month = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;

        if (!monthMap[month]) {
          monthMap[month] = {
            Birthday: 0,
            Proposal: 0,
            GenderReveal: 0,
            Revenue: 0,
            Basic: 0,
            Premium: 0,
            Luxury: 0,
          };
        }

        monthMap[month].Birthday += Number(row["Birthday"] || 0);
        monthMap[month].Proposal += Number(row["Proposal"] || 0);
        monthMap[month].GenderReveal += Number(row["Gender Reveal"] || 0);
        monthMap[month].Revenue += Number(row["Revenue"] || 0);
        monthMap[month].Basic += Number(row["Basic"] || 0);
        monthMap[month].Premium += Number(row["Premium"] || 0);
        monthMap[month].Luxury += Number(row["Luxury"] || 0);
      });

      const dataByMonth = Object.entries(monthMap).map(([month, values]) => ({
        Month: month,
        ...values,
      }));

      setExcelData(dataByMonth);
      console.log("Grouped by month:", dataByMonth);
    };

    reader.readAsBinaryString(file);
  };

  const handleAnalyze = async () => {
    if (!selectedDate) {
      setResponse("Please select a date first.");
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const context = excelData
        ? `Here is the Excel sales data:\n${JSON.stringify(excelData, null, 2)}`
        : "No data uploaded.";

      const prompt = `${context}\n\nBased on this data, predict what would likely be the most successful or highest-sales event on ${selectedDate}.no need any explain just give the event.i have small data set so it no need to accuaracy`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setResponse(text);
    } catch (err) {
      console.error("Gemini error:", err);
      setResponse("An error occurred while processing your request.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Sales Event Predictor (Gemini + Excel)</h2>

      <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} />

      <div style={{ marginTop: 10 }}>
        <label>Select a date: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <button onClick={handleAnalyze} style={{ marginTop: 10 }}>
        Analyze
      </button>

      <div style={{ marginTop: 20 }}>
        <strong>Prediction:</strong>
        <p>{response}</p>
      </div>

      {excelData && (
        <div style={{ marginTop: 40 }}>
          <h3>Event Counts Per Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={excelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Birthday" fill="#8884d8" />
              <Bar dataKey="Proposal" fill="#82ca9d" />
              <Bar dataKey="GenderReveal" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {excelData && (
        <div style={{ marginTop: 40 }}>
          <h3>Total Revenue by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={excelData}
                dataKey="Revenue"
                nameKey="Month"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {excelData && (
        <div style={{ marginTop: 40 }}>
          <h3>Monthly Total by Package Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={excelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Basic" stroke="#8884d8" />
              <Line type="monotone" dataKey="Premium" stroke="#82ca9d" />
              <Line type="monotone" dataKey="Luxury" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
