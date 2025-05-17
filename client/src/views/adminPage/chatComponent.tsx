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
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  Chip
} from "@mui/material";
import { 
  CloudUpload, 
  BarChart3 as BarChartIcon,  // BarChart was renamed to BarChart3
  CalendarCheck,  // Replacement for EventNote
  LineChart as Timeline,  // Replacement for Timeline
  Activity as Analytics  // Replacement for Analytics
} from "lucide-react";

interface ExcelRow {
  [key: string]: string | number | boolean | null;
}

const genAI = new GoogleGenerativeAI("AIzaSyB8VJFjnn9lbw28RpV2A09qa_cxi-RyiIU");

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f5f7",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        },
      },
    },
  },
});

const ChatComponent: React.FC = () => {
  const [response, setResponse] = useState<string>("");
  const [excelData, setExcelData] = useState<ExcelRow[] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleExcelUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
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
        setFileUploaded(true);
        console.log("Grouped by month:", dataByMonth);
      } catch (err) {
        console.error("Error processing Excel file:", err);
        setError("Failed to process Excel file. Please ensure it's in the correct format.");
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setLoading(false);
      setError("Error reading file");
    };

    reader.readAsBinaryString(file);
  };

  const handleAnalyze = async () => {
    if (!selectedDate) {
      setError("Please select a date first.");
      return;
    }

    if (!excelData) {
      setError("Please upload Excel data first.");
      return;
    }

    setLoading(true);
    setError(null);

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
      setError("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" elevation={0} color="transparent" sx={{ backgroundColor: "white" }}>
          <Toolbar>
            <Analytics size={28} color="#3f51b5" />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2, fontWeight: "bold" }}>
              Sales Event Predictor
            </Typography>
            <Chip label="Powered by Festivo" color="primary" variant="outlined" />
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
            <Box sx={{ width: { xs: "100%", md: "30%" } }}>
              <Paper elevation={0} sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CloudUpload size={20} /> Data Input
                </Typography>
                
                <Stack spacing={3}>
                  <Box>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<CloudUpload />}
                      sx={{ p: 1.5, borderStyle: 'dashed' }}
                    >
                      Upload Excel File
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        hidden
                        onChange={handleExcelUpload}
                      />
                    </Button>
                    {fileName && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        File: {fileName}
                      </Typography>
                    )}
                  </Box>
                
                  <TextField
                    label="Select Event Date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                
                  <Button
                    variant="contained"
                    onClick={handleAnalyze}
                    disabled={loading || !fileUploaded || !selectedDate}
                    fullWidth
                    sx={{ p: 1.5 }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Predict Best Event"}
                  </Button>
                
                  {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  )}
                </Stack>
              </Paper>
            </Box>
            
            <Box sx={{ width: { xs: "100%", md: "70%" } }}>
              <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarCheck size={20} /> Prediction Result
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {response ? (
                  <Box sx={{ p: 2, bgcolor: '#f7f9fc', borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                      {response}
                    </Typography>
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    Your prediction will appear here after analysis
                  </Typography>
                )}
              </Paper>
              
              {excelData && (
                <Paper elevation={0} sx={{ p: 3 }}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BarChartIcon size={20} /> Event Counts Per Month
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={excelData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="Month" />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                        />
                        <Legend />
                        <Bar dataKey="Birthday" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Proposal" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="GenderReveal" fill="#ffc658" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                  
                  <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
                    <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Timeline size={20} /> Monthly Package Trends
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={excelData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="Month" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="Basic" stroke="#8884d8" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                          <Line type="monotone" dataKey="Premium" stroke="#82ca9d" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                          <Line type="monotone" dataKey="Luxury" stroke="#ffc658" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                    
                    <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BarChartIcon size={20} /> Revenue Distribution
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
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
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </Stack>
                </Paper>
              )}
            </Box>
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ChatComponent;