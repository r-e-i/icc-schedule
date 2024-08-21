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

const formatDate = (date: Date, length: "long" | "short" = "short"): string => {
    return date.toLocaleDateString('en-US', { weekday: length, month: length, day: 'numeric', year: 'numeric' });
};


const Roles = ["INDONESIAN_SPEAKER", "ENGLISH_SPEAKER", "LITURGIST", "USHER", "SUNDAY_SCHOOL", "OHP", "SOUND_SYSTEM", "TRANSLATOR", "LUNCH", "CARETAKER"];

const Bulletin: React.FC = () => {
    const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const contentToPrint = useRef(null);
    const queryDate = queryParams?.get('date');
    const [jsonData, setJsonData] = useState<SheetRow[]>([]);

    const [thisSunday, setThisSunday] = useState<Date>(queryDate ? new Date(queryDate) : new Date());

    if (thisSunday.getDay() != 0) {
        thisSunday.setDate(thisSunday.getDate() + (7 - thisSunday.getDay()));
    }
    
    const Activities = [ 
        { "title": "ENGLISH BIBLE STUDY", "date": new Date(thisSunday.getTime() + (4-7) * 24 * 60 * 60 * 1000) },
        { "title": "INDONESIAN BIBLE STUDY", "date": new Date(thisSunday.getTime() + (5-7) * 24 * 60 * 60 * 1000) },
    ]

    const nextSunday = new Date(thisSunday.getTime() + 7 * 24 * 60 * 60 * 1000);
const SundayDate = formatDate(thisSunday);
const NextSundayDate = formatDate(nextSunday);

    const handlePrint = useReactToPrint({
        documentTitle: "ICC Bulletin",
        removeAfterPrint: true,
    });
    // Function to filter data by DATE field
    const filterDataByDate = (data: SheetRow[], date: string): SheetRow => {
        return data.filter(row => row.DATE == date)[0];
    };

    useEffect(() => {
        console.log("Fetching data from Google Sheet Schedule ...");
        axios.get('/api/bulletin/schedule').then(res => setJsonData(res.data)).catch(err => { alert(err); console.error(err);});
    }, []);

    const CurrentSundaySchedule = filterDataByDate(jsonData, SundayDate);
    const NextSundaySchedule = filterDataByDate(jsonData, NextSundayDate);

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
            <div ref={contentToPrint} className="p-4">
                <div className="flex font-bold items-center space-x-2">
                    <button className="bg-gray-500 text-white rounded-lg p-1 m-2 font-bold" onClick={() => {
                    if (typeof window !== 'undefined') {
                        window.location.href = "./bulletin/print?date=" + thisSunday.toISOString();
                    }
                }}>
                    VIEW BULLETIN
                </button>
                DATE <input className="w-[120px] bg-gray-500 text-white rounded-lg items-center font-bold" type="date" name="date" onChange={e => setThisSunday(new Date(e.target.value))}/>
                </div>
                        <div className="w-full bg-yellow-800 text-white object-cover z-10 rounded-lg m-1 ">
                            <div className='text-center text-xl tracking-widest bg-white/50 font-bold'>  IMMANUEL COMMUNITY CHURCH OF FRESNO SCHEDULE | Sunday, {thisSunday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                        </div>

                        <table className="w-full mx-3 mt-2">

                            <tbody>
                                <tr>
                                    <td className="text-sm w-1/3">THEMA KHOTBAH / SERMON TITLE</td>
                                    <td className="text-sm font-bold">{CurrentSundaySchedule["SERMON_TITLE_IND"]}<br/>{CurrentSundaySchedule["SERMON_TITLE_ENG"]}</td>
                                </tr>
                                <tr>
                                    <td className="text-sm w-1/3">PEMBACAAN AKITAB / BIBLE READING</td>
                                    <td className="text-sm font-bold">{CurrentSundaySchedule["VERSE"]} </td>
                                </tr>
                                <tr>
                                    <td className="text-sm w-1/3">CALL TO WORSHIP</td>
                                    <td className="text-sm font-bold">{CurrentSundaySchedule["WORSHIP_VERSE"]} {CurrentSundaySchedule["WORSHIP_VERSE_TEXT"]}</td>
                                </tr>
                            </tbody>
                        </table>


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
                            <div className='text-center text-lg tracking-widest bg-white bg-opacity-30'>  <b> NEXT WEEK </b> | <small>{nextSunday.toLocaleDateString('en-US', { weekday:'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()} at 10:30 AM</small></div>
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
                        <div className="w-full bg-yellow-900 text-white object-cover z-10 rounded-lg m-1 ">
                            <div className='text-center text-lg tracking-widest bg-white bg-opacity-30'>  <b> ANNOUNCEMENT </b></div>
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

    );
};

export default Bulletin;