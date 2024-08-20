"use client"
//Google Sheet ID : 1UKdbu_cJuVVep7xZRWsBwLZqHoYQh_baH69Y-izttBE
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
// Define types
interface SheetRow {
    [key: string]: string;
}

interface GoogleSheetResponse {
    values: string[][];
}
const formatDate = (date: Date, length: "long" | "short" = "short"): string => {
    return date.toLocaleDateString('en-US', { weekday: length, month: length, day: 'numeric', year: 'numeric' });
};

const GOOGLE_SHEETS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // Your Google Sheets API key
const SHEET_ID = '1UKdbu_cJuVVep7xZRWsBwLZqHoYQh_baH69Y-izttBE'; // Google Sheet ID from the URL
const SHEET_NAME = 'SCHEDULES'; // Name of the sheet
const SHEET_RANGE = `${SHEET_NAME}!A1:AF200`; // Specify the range you're interested in
const QUERY = "SELECT * WHERE A = date '2024-08-18'"; // SQL query to get data from Google Sheets  A >= date '2024-08-10' AND A <= date '2024-08-20'

const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const queryDate = queryParams?.get('date');
var thisSunday = queryDate ? new Date(queryDate) : new Date();
if (thisSunday.getDay() != 0) {
    thisSunday.setDate(thisSunday.getDate() + (7 - thisSunday.getDay()));
}

console.log(thisSunday);

const Activities = [ 
    { "title": "ENGLISH BIBLE STUDY", "date": new Date(thisSunday.getTime() + 4 * 24 * 60 * 60 * 1000) },
    { "title": "INDONESIAN BIBLE STUDY", "date": new Date(thisSunday.getTime() + 5 * 24 * 60 * 60 * 1000) },
]

const nextSunday = new Date(thisSunday.getTime() + 7 * 24 * 60 * 60 * 1000);
const SundayDate = formatDate(thisSunday);
const NextSundayDate = formatDate(nextSunday);

const Roles = ["INDONESIAN_SPEAKER", "ENGLISH_SPEAKER", "LITURGIST", "USHER", "SUNDAY_SCHOOL", "OHP", "SOUND_SYSTEM", "TRANSLATOR", "LUNCH", "CARETAKER"];

const GoogleSheetDataToJson: React.FC = () => {
    const contentToPrint = useRef(null);
    const [jsonData, setJsonData] = useState<SheetRow[]>([]);

    const handlePrint = useReactToPrint({
        documentTitle: "ICC Bulletin",
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        removeAfterPrint: true,
    });
    // Function to filter data by DATE field
    const filterDataByDate = (data: SheetRow[], date: string): SheetRow => {
        return data.filter(row => row.DATE == date)[0];
    };

    useEffect(() => {
        const fetchDataWithQuery = async () => {
            try {
                const response = await axios.get<GoogleSheetResponse>(
                    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tq=${encodeURIComponent(QUERY)}&sheet=${SHEET_NAME}&key=${GOOGLE_SHEETS_API_KEY}`
                );
                if (response.status !== 200) {
                    alert('Error fetching data from Google Sheets' + response.status);
                    return;
                }
                const data = response.data as any;
                const jsonData = JSON.parse(data.substring(47).slice(0, -2));
                const rows = jsonData.table.rows.map((row: any) =>
                    row.c.map((cell: any) => (cell ? cell.v : ''))
                );

                const jsonResult = convertToJSON(rows);
                console.log(CurrentSundaySchedule);
                // setJsonData(filterDataByDate(jsonResult, StartDate));
            } catch (error) {
                console.error('Error fetching or processing data from Google Sheets:', error);
            }
        }

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
        // setJsonData(data as SheetRow[]);
         fetchData();

    }, []);

    const CurrentSundaySchedule = filterDataByDate(jsonData, SundayDate);
    const NextSundaySchedule = filterDataByDate(jsonData, NextSundayDate);

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

    const wT = (title: string, text: string) => {
        if (title) return (
            <div className="text-center text-sm">
                <span className="tracking-widest">{title.toUpperCase()}</span>
                <span className='text-xs bg-yellow-700 font-bold rounded text-white p-0.5 m-0.5'>{text}</span>
            </div>
        ); else { return null; }
    }
                {/*  <div>
                 <h1 className="flex text-3xl font-bold justify-between items-center">
                ICC Bulletin {formatDate(thisSunday)}
                <button className="bg-gray-500 text-white rounded-lg p-1 m-2 font-bold" onClick={() => {
                    handlePrint(null, () => contentToPrint.current);
                }}>
                    PRINT
                </button>
            </h1> */}


    if (!jsonData || !CurrentSundaySchedule) return <div>Loading from Google Sheet Schedule ...</div>;
    return (
            <div ref={contentToPrint}>
            {/* <!-- Page 1 --> */}
                <div className="page bg-white border-white  mx-auto p-3 flex overflow-hidden">
                    <div className="w-1/2 border-r-2 p-1">
                        <img src="/images/SermonNotes.png" className="h-[50px] object-cover" />
                        {Array.from({ length: 13 }).map((_, index) => (
                            <div key={index} className="w-full h-10 p-3">
                                <div key={index} className="w-full border-b-2 h-10 p-3"> &nbsp; </div>
                            </div>
                        ))}
                        <div className="w-full p-3 mt-8">
                            <div className="w-full h-[120px] bg-gray-500 text-white object-cover z-10 rounded-lg shadow-md shadow-gray-500">
                                <div className='text-center text-xl tracking-widest bg-white bg-opacity-30'>        G I V E</div>
                                <div className="items-center p-2 text-center text-sm">
                                    There are two ways to give to Immanuel Community Church. You can send your check to ICC Treasurer and/or by giving today by using the Drop Box in the lobby.
                                    <br></br>Please write in full to: <b>Immanuel Community Church in Fresno.</b>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 p-1">
                        <h1 className='text-lg font-bold text-center'>{thisSunday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h1>
                        <div className="flex justify-center -mt-6 -mb-10">
                            <img className="h-[220px] object-cover z-20 " src="/images/Welcome ICC.png" alt="random" />
                        </div>
                        <img className="w-full h-[220px] object-cover z-10 rounded-lg shadow-lg shadow-gray-500 -mb-6" src={CurrentSundaySchedule["PICTURE"]} alt="MISSING PICTURE - please add picture address / URL to picture column on google sheet" />
                        <div className='text-center font-bold text-2xl tracking-widest text-white z-40 drop-shadow-xl'>        S U N D A Y &nbsp; S E R V I C E</div>

                        <div className="text-center tracking-widest mt-2">THEMA KHOTBAH / SERMON TITLE</div>
                        <div className="text-center font-bold text-xl">{CurrentSundaySchedule["SERMON_TITLE_IND"]}</div>
                        <div className="text-center italic text-xl -mt-1">{CurrentSundaySchedule["SERMON_TITLE_ENG"]}</div>
                        <div className="text-center tracking-widest mt-2">PEMBACAAN AKITAB / BIBLE READING </div>
                        <div className="text-center font-bold text-xl -mt-1">{CurrentSundaySchedule["VERSE"]}</div>

                        <div className="text-center tracking-widest mt-2">PEMBICARA / SPEAKER </div>
                        <div className="text-center font-bold text-xl -mt-1">{CurrentSundaySchedule["INDONESIAN_SPEAKER"]}</div>

                        <div className="w-full h-[120px] bg-yellow-900 text-white object-cover z-10 rounded-lg shadow-md shadow-gray-500 mt-2">
                            <div className='text-center text-xl tracking-widest bg-white bg-opacity-30 p-1'>        C O N N E C T  &nbsp; W I T H  &nbsp; U S</div>
                            <div className="flex justify-between items-center p-2">
                                <div className='flex text-sm font-bold'>4141 N MILLBROOK AVE<br />FRESNO, CA 93726<br />(559)500-8220</div>
                                <div className='text-center text-sm font-bold '>http://iccfresno.org</div>
                                <div className='text-sm '>ZOOM ID <b>559 123 4567</b><br />PASSWORD <b>4141</b></div>
                            </div>
                        </div>


                    </div>
                </div>

                {/* <!-- Page 2 --> */}
                <div className="page bg-white mx-auto p-4 flex">
                    <div className="w-1/2 border-r-2 p-1">
                        <div className="flex justify-center">
                            <img className="h-[70px] object-cover -mb-1" src="/images/Worship.png" />
                        </div>
                        <div className="flex flex-col text-center space-y-0.5 text-sm">
                            {wT("Solemn Prayer", "SIT")}
                            {wT("Call to Worship", "STAND")}
                            <div className='px-1'>
                                <b className="-mt-2">{CurrentSundaySchedule["WORSHIP_VERSE"]}</b>
                                <p className="text-xs italic mx-10 -mt-1 mb-2">{CurrentSundaySchedule["WORSHIP_VERSE_TEXT"]}</p>
                            </div>
                            {wT("Hymn in Praise", "STAND")}
                            {wT("Opening Prayer", "STAND")}
                            {wT("Hymn in Praise", "STAND/SIT")}
                            {wT(CurrentSundaySchedule["READING"], "STAND")}
                            <i>Sunday School may go into the classes</i>
                            {wT("Bible Reading", "STAND")}
                            <div className="font-bold -mb-3">{CurrentSundaySchedule["VERSE"]}</div>
                            <p className="italic mx-10 -mt-1">{CurrentSundaySchedule["SERMON_TITLE_IND"]}</p>
                            {wT("Hymn in Praise", "STAND")}
                            {wT("Sermon", "SIT")}
                            {wT("Doxology", "STAND")}
                            {wT("Benediction", "STAND")}
                            {wT("Amen", "STAND")}
                            {wT("Solemn Prayer", "STAND")}
                        </div>
                        <div className="flex justify-center">
                            <img className="h-[70px] object-cover" src="/images/Announcement.png" />
                        </div>
                        <div className="px-6">
                            <ol className="list-decimal text-xs">
                                {Array.from({ length: 6 }).map((_, index) => { 
                                    const content = CurrentSundaySchedule[`ANNOUNCEMENT${index + 1}`];
                                    const englishContent = CurrentSundaySchedule[`ANNOUNCEMENT${index + 1}_ENG`];
                                    if (content) return (
                                        <li key={index}>{content}
                                        {(englishContent) && <><br/><i>{englishContent}</i></>}
                                        </li> 
                                    )
                                } )}
                            </ol>
                        </div>
                    </div>
                    {/* Second Column */}
                    <div className="w-1/2 p-1">
                        <div className="w-full bg-yellow-700 text-white object-cover z-10 rounded-lg m-1 ">
                            <div className='text-center text-lg tracking-widest bg-white bg-opacity-30'>  <b> TODAY&apos;S SERVICE </b> | <small>{thisSunday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()} at 10:30 AM</small></div>
                        </div>
                        <table className="w-full mx-3 mt-2">
                            <tbody>
                                {Roles.map((key) => (
                                    <tr key={key}>
                                        <td className="text-sm w-1/3">{key.replace("_", " ")}</td>
                                        <td className="text-sm font-bold">{key == "CARETAKER" ? CurrentSundaySchedule["CARETAKER1"] + " & " + CurrentSundaySchedule["CARETAKER2"] : CurrentSundaySchedule[key]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="w-full bg-yellow-800 text-white object-cover z-10 rounded-lg m-1 ">
                            <div className='text-center text-xl tracking-widest bg-white bg-opacity-30'>  <b> ACTIVITIES </b> </div>
                        </div>
                        <table className="w-full mx-3 mt-2">
                            <tbody>
                                {Activities.map(function({title,date}) {
                                var activity = filterDataByDate(jsonData, date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
                                return (
                                    <tr key={title}>
                                        <td className="text-sm w-1/3  align-top">{title}</td>
                                        <td className="text-sm align-top "><b>{formatDate(date,"long")} at {activity["TIME"]} </b>
                                        <br />at <b>{activity["LOCATION"]} </b> by <b>{activity["ENGLISH_SPEAKER"]}{activity["INDONESIAN_SPEAKER"]}</b>

                                        </td>
                                    </tr> );
                                }
                                
                                )}
                            </tbody>
                        </table>
                        <div className="w-full bg-yellow-900 text-white object-cover z-10 rounded-lg m-1 ">
                            <div className='text-center text-lg tracking-widest bg-white bg-opacity-30'>  <b> SUNDAY SERVICE </b> | <small>{nextSunday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()} at 10:30 AM</small></div>
                        </div>
                        <table className="w-full mx-3 mt-2">
                            <tbody>
                                {Roles.map((key) => (
                                    <tr key={key}>
                                        <td className="text-sm w-1/3">{key.replace("_", " ")}</td>
                                        <td className="text-sm font-bold">{key == "CARETAKER" ? NextSundaySchedule["CARETAKER1"] + " & " + NextSundaySchedule["CARETAKER2"] : NextSundaySchedule[key]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div> 
            </div>
        </div>

    );
};

export default GoogleSheetDataToJson;