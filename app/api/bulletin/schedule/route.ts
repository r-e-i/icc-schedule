// app/api/data/route.js
import axios from 'axios';

interface GoogleSheetResponse {
    values: string[][];
}

interface SheetRow {
    [key: string]: string;
}
const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_API_KEY; // Your Google Sheets API key
const SHEET_ID = '1UKdbu_cJuVVep7xZRWsBwLZqHoYQh_baH69Y-izttBE'; // Google Sheet ID from the URL
const SHEET_NAME = 'SCHEDULES'; // Name of the sheet
const SHEET_RANGE = `${SHEET_NAME}!A1:AF200`; // Specify the range you're interested in

let cachedData: any = null;
let lastFetchTime = 0;

const CACHE_DURATION = 1000 * 60 * 10; // Cache duration: 10 minutes

export async function GET() {
  const currentTime = new Date().getTime();

  if (cachedData && (currentTime - lastFetchTime) < CACHE_DURATION) {
    console.log('Returning cached data');
    return new Response(JSON.stringify(cachedData), { status: 200 });
  }

  try {
    console.log('Fetching new data at', new Date().toLocaleTimeString());
    const response = await axios.get<GoogleSheetResponse>(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}?key=${GOOGLE_SHEETS_API_KEY}`
    );

    const rows = response.data.values;
    const cachedData = convertToJSON(rows);

    lastFetchTime = currentTime;
    return new Response(JSON.stringify(cachedData), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
  }
}

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