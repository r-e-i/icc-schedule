export const dynamic = "force-dynamic";

interface GoogleSheetResponse {
    values: string[][];
}

interface SheetRow {
    [key: string]: string;
}

let cachedData: any = null;
let lastFetchTime = 0;

const CACHE_DURATION = 1000 * 60 * 10; // Cache duration: 10 minutes

export async function GET() { 
  const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_API_KEY; // Your Google Sheets API key
  const SHEET_ID = '1UKdbu_cJuVVep7xZRWsBwLZqHoYQh_baH69Y-izttBE'; // Google Sheet ID from the URL
  const SHEET_NAME = 'SCHEDULES'; // Name of the sheet
  const SHEET_RANGE = `${SHEET_NAME}!B:BF`; // Specify the range you're interested in

  const currentTime = new Date().getTime();

  if (cachedData && (currentTime - lastFetchTime) < CACHE_DURATION) {
    console.log('Returning cached data');
    return new Response(JSON.stringify(cachedData), { status: 200 });
  }

  if (!GOOGLE_SHEETS_API_KEY) {
    return new Response(JSON.stringify({ error: 'GOOGLE_API_KEY is not configured' }), { status: 500 });
  }

  try {
    console.log('Fetching new data at', new Date().toLocaleTimeString());
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}?key=${GOOGLE_SHEETS_API_KEY}`, { next: { revalidate: 10 } });
    const data: GoogleSheetResponse & { error?: { message?: string } } = await response.json();

    if (!response.ok) {
      console.error('Google Sheets API error:', data.error?.message || response.statusText);
      return new Response(
        JSON.stringify({ error: data.error?.message || 'Google Sheets API request failed' }),
        { status: response.status }
      );
    }

    const rows = data.values || [];
    console.log('Data fetched successfully:', rows.length, 'rows');
    cachedData = convertToJSON(rows);
    cachedData = cachedData.filter((row: { DATE: string | any[]; }) => row.DATE && row.DATE.length > 0);
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
            try {
          row.forEach((cell, index) => {
              jsonObject[headers[index]] = cell;
          });
            } catch (error) {
          console.error('Error converting row to JSON:', error);
            }
            return jsonObject;
        });
    };
