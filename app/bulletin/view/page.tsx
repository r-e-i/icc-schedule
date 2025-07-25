"use client"
//Google Sheet ID : 1UKdbu_cJuVVep7xZRWsBwLZqHoYQh_baH69Y-izttBE
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { formatDate, filterDataByDate, filterDataByDateRange, wT } from '../components/utils';

import { SheetRow } from '@/app/lib/types';
import Activities from '../components/Activities';

// const formatDate = (date: Date, length: "long" | "short" = "short"): string => {
//     return date.toLocaleDateString('en-US', { weekday: length, month: length, day: 'numeric', year: 'numeric' });
// };


const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const queryDate = queryParams?.get('date');
var thisSunday = queryDate ? new Date(queryDate) : new Date();
if (thisSunday.getDay() != 0) {
    thisSunday.setDate(thisSunday.getDate() + (7 - thisSunday.getDay()));
}

// const Activities = [ 
//     { "title": "ENGLISH BIBLE STUDY", "date": new Date(thisSunday.getTime() + 4 * 24 * 60 * 60 * 1000) },
//     { "title": "INDONESIAN BIBLE STUDY", "date": new Date(thisSunday.getTime() + 5 * 24 * 60 * 60 * 1000) },
// ]

const nextSunday = new Date(thisSunday.getTime() + 7 * 24 * 60 * 60 * 1000);
const SundayDate = formatDate(thisSunday);
const NextSundayDate = formatDate(nextSunday);
const Roles = ["SPEAKER", "LITURGIST", "USHER", "OHP", "SOUND_SYSTEM", "TRANSLATOR", "LUNCH", "CARETAKER"]; //"ENGLISH_SPEAKER", "SUNDAY_SCHOOL", 

const Bulletin: React.FC = () => {
    const contentToPrint = useRef(null);
    const [jsonData, setJsonData] = useState<SheetRow[]>([]);

    const handlePrint = useReactToPrint({
        documentTitle: "ICC Bulletin",
        removeAfterPrint: true,
    });
    // Function to filter data by DATE field
    const filterDataByDate = (data: SheetRow[], date: string): SheetRow => {
        return data.filter(row => row.DATE == date)[0];
    };
    const ActivitiesScheduleNextWeek = filterDataByDateRange(jsonData, thisSunday, nextSunday);
    
    useEffect(() => {
        console.log("Fetching data from Google Sheet Schedule ...");
        axios.get('/api/bulletin/schedule').then(res => setJsonData(res.data)).catch(err => { alert(err); console.error(err);});
    }, []);

    const CurrentSundaySchedule = filterDataByDate(jsonData, SundayDate);
    const NextSundaySchedule = filterDataByDate(jsonData, NextSundayDate);

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

                    <div className="w-full p-1">
                        <h1 className='text-lg font-bold text-center'>{thisSunday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h1>
                        <div className="flex justify-center -mt-6 -mb-10">
                            <img className="h-[220px] object-cover z-20 " src="/images/Welcome ICC.png" alt="random" />
                        </div>
                        <img className="w-full h-[220px] object-cover z-10 rounded-lg shadow-lg shadow-gray-500 -mb-6" src={CurrentSundaySchedule["PICTURE"]} alt="MISSING PICTURE - please add picture address / URL to picture column on google sheet" />
                        <div className='text-center font-bold text-2xl tracking-widest text-white z-40 drop-shadow-xl'>        S U N D A Y &nbsp; S E R V I C E</div>

                        <div className="text-center tracking-widest mt-2">THEMA KHOTBAH</div>
                        <div className="text-center font-bold text-xl">{CurrentSundaySchedule["SERMON_TITLE_IND"]}</div>
                        <div className="text-center italic text-xl -mt-1">{CurrentSundaySchedule["SERMON_TITLE_ENG"]}</div>
                        <div className="text-center tracking-widest mt-2">PEMBACAAN ALKITAB</div>
                        <div className="text-center font-bold text-xl -mt-1">{CurrentSundaySchedule["VERSE"]}</div>

                        <div className="text-center tracking-widest mt-2">PEMBICARA</div>
                        <div className="text-center font-bold text-xl -mt-1">{CurrentSundaySchedule["SPEAKER"]}</div>

                        <div className="w-full h-[120px] bg-yellow-900 text-white object-cover z-10 rounded-lg shadow-md shadow-gray-500 mt-2">
                            <div className='text-center text-xl tracking-widest bg-white bg-opacity-30 p-1'>        H U B U N G I &nbsp; K A M I</div>
                            <div className="flex justify-between items-center p-2">
                                <div className='flex text-sm font-bold'>4141 N MILLBROOK AVE<br />FRESNO, CA 93726<br />(559)500-8220</div>
                                <div className='text-center text-sm font-bold '>http://iccfresno.org</div>
                                <div className='text-sm '>ZOOM ID <b>559 123 4567</b><br />PASSWORD <b>4141</b></div>
                            </div>
                        </div>


                    </div>
                </div>                    
                <div className="w-full border-r-2 p-1">
                        <div className="flex justify-center">
                            <img className="h-[70px] object-cover -mb-1" src="/images/Worship.png" />
                        </div>
                        <div className="flex flex-col text-center space-y-0.5 text-sm">
                             {wT("Doa Teduh", "DUDUK")}
                                                        {wT("Panggilan Beribadah", "BERDIRI")}
                                                        <div className='px-1'>
                                                            <b className="-mt-2">{CurrentSundaySchedule["WORSHIP_VERSE"]}</b>
                                                            <p className="text-xs italic mx-10 -mt-1 mb-2">{CurrentSundaySchedule["WORSHIP_VERSE_TEXT"]}</p>
                                                        </div>
                                                        {wT("Lagu Pujian", "BERDIRI")}
                                                        {wT("Doa Pembukaan", "BERDIRI")}
                                                        {wT("Lagu Pujian", "DUDUK")}
                                                        {wT(CurrentSundaySchedule["READING"], "BERDIRI")}
                                                        <i>Anak anak sekolah minggu dipersilakan masuk ke kelasnya masing masing</i>
                                                        {wT("Bible Reading", "BERDIRI")}
                                                        <div className="font-bold -mb-3">{CurrentSundaySchedule["VERSE"]}</div>
                                                        <p className="italic mx-10 -mt-1">{CurrentSundaySchedule["SERMON_TITLE_IND"]}</p>
                                                        {wT("Lagu Pujian", "BERDIRI")}
                                                        {wT("Khotbah", "DUDUK")}
                                                        {wT("Lagu Doksologi", "BERDIRI")}
                                                        {wT("Doa Berkat", "BERDIRI")}
                                                        {wT("Lagu Amin", "BERDIRI")}
                                                        {wT("Doa Teduh", "DUDUK")}
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
                    <div className="w-full p-1">
                        <div className="w-full bg-yellow-700 text-white object-cover z-10 rounded-lg m-1 ">
                            <div className='text-center text-lg tracking-widest bg-white bg-opacity-30'>  <b> IBADAH PAGI INI </b> | <small>{thisSunday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()} pukul 10:30 pagi</small></div>
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
                            <Activities schedule={ActivitiesScheduleNextWeek} />
                            </tbody>
                        </table>
                        <div className="w-full bg-yellow-900 text-white object-cover z-10 rounded-lg m-1 ">
                            <div className='text-center text-lg tracking-widest bg-white bg-opacity-30'>  <b> IBADAH MINGGU DEPAN </b> | <small>{nextSunday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()} pukul 10:30 pagi</small></div>
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
                    <div className="w-full border-r-2 p-1">
                        <img src="/images/SermonNotes.png" className="h-[50px] object-cover" />
                        {Array.from({ length: 13 }).map((_, index) => (
                            <div key={index} className="w-full h-10 p-3">
                                <div key={index} className="w-full border-b-2 h-10 p-3"> &nbsp; </div>
                            </div>
                        ))}
                        <div className="w-full p-3 mt-8">
                            <div className="w-full h-[120px] bg-gray-500 text-white object-cover z-10 rounded-lg shadow-md shadow-gray-500">
                                <div className='text-center text-xl tracking-widest bg-white bg-opacity-30'>       P E R S E M B A H A N</div>
                                <div className="items-center p-2 text-center text-sm">
                                    Jemaat bisa memberikan persembahan: <br>
                                    </br>1. Menulis Drop Box yang sudah tersedia. 
                                    <br></br>2. Menulis cek yang ditunjukan kepada : <b>Immanuel Community Church in Fresno.</b>. Mohon ditulis secara lengkap. 

                                </div>
                            </div>
                        </div>
                    </div>
            </div>

    );
};

export default Bulletin;