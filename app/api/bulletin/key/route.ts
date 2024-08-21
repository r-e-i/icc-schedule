export async function GET() {
    const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_API_KEY; // Your Google Sheets API key
    const SHEET_ID = '1UKdbu_cJuVVep7xZRWsBwLZqHoYQh_baH69Y-izttBE'; // Google Sheet ID from the URL
    const SHEET_NAME = 'SCHEDULES'; // Name of the sheet
    const SHEET_RANGE = `${SHEET_NAME}!A1:AF200`; // Specify the range you're interested in
    const currentTime = new Date().getTime();
    console.log(`${currentTime} - https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}?key=${GOOGLE_SHEETS_API_KEY}`);
    return new Response(`${currentTime} - ${GOOGLE_SHEETS_API_KEY}`, { status: 200 });
}
