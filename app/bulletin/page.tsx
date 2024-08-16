"use client"
//Google Sheet ID : 1UKdbu_cJuVVep7xZRWsBwLZqHoYQh_baH69Y-izttBE
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import data from './data.json';

// Define types
interface SheetRow {
  [key: string]: string;
}

interface GoogleSheetResponse {
  values: string[][];
}
const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_API_KEY; // Your Google Sheets API key
const SHEET_ID = '1UKdbu_cJuVVep7xZRWsBwLZqHoYQh_baH69Y-izttBE'; // Google Sheet ID from the URL
const SHEET_RANGE = 'SCHEDULES!A1:Q40'; // Specify the range you're interested in
const StartDate = formatDate(new Date('8/25/2024'));
console.log(StartDate);

const GoogleSheetDataToJson: React.FC = () => {
  const [jsonData, setJsonData] = useState<SheetRow[]>([]);

  // Function to filter data by DATE field
const filterDataByDate = (data: SheetRow[], date: Date): SheetRow[] => {

    return data.filter(row => row.Date == StartDate);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<GoogleSheetResponse>(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}?key=${GOOGLE_SHEETS_API_KEY}`
        );

        const rows = response.data.values;
        const jsonResult = convertToJSON(rows);
        
        setJsonData(jsonResult);
      } catch (error) {
        console.error('Error fetching or processing data from Google Sheets:', error);
      }
    };
   // setJsonData(filterDataByDate(data as SheetRow[],StartDate));
    fetchData();
  }, []);

  // Function to convert rows to JSON format
  const convertToJSON = (rows: string[][]): SheetRow[] => {
    if (!rows || rows.length === 0) return [];

    const headers = rows[0]; // First row as headers
    return rows.slice(1).map(row => {
      let jsonObject: SheetRow = {};
      row.forEach((cell, index) => {
        jsonObject[headers[index]] = cell;
      });
      return jsonObject;
    });
  };

  return (
    <div>
      <h1>Google Sheets Data in JSON</h1>
      <pre>{JSON.stringify(jsonData, null, 2)}</pre> {/* Pretty-print JSON */}
    </div>
  );
};

export default GoogleSheetDataToJson;