"use client"
//Google Sheet ID : 1UKdbu_cJuVVep7xZRWsBwLZqHoYQh_baH69Y-izttBE
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { SheetRow } from '@/app/lib/types';
import ListRoles from './components/listRoles';
import Title from './components/Title';
import { formatDate } from './components/utils';
import Activities from './components/Activities';
const Roles = ["INDONESIAN_SPEAKER", "ENGLISH_SPEAKER", "LITURGIST", "USHER", "SUNDAY_SCHOOL", "OHP", "SOUND_SYSTEM", "TRANSLATOR", "LUNCH", "CARETAKER"];

const Bulletin: React.FC = () => {
    const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const contentToPrint = useRef(null);
    const queryDate = queryParams?.get('date');
    const [jsonData, setJsonData] = useState<SheetRow[]>([]);
    const [thisSunday, setThisSunday] = useState<Date>(queryDate ? new Date(queryDate) : new Date());

    useEffect(() => {
        console.log("Fetching data from Google Sheet Schedule ...");
        axios.get('/api/bulletin/schedule').then(res => setJsonData(res.data)).catch(err => { alert(err); console.error(err);});
    }, []);

    if (thisSunday.getDay() != 0) {
        thisSunday.setDate(thisSunday.getDate() + (7 - thisSunday.getDay()));
    }
    
    const lastMonday = new Date(thisSunday.getTime() - 6 * 24 * 60 * 60 * 1000);
    const nextSunday = new Date(thisSunday.getTime() + 7 * 24 * 60 * 60 * 1000);
    const SundayDate = formatDate(thisSunday);
    const NextSundayDate = formatDate(nextSunday);

    // Function to filter data by DATE field
    const filterDataByDate = (data: SheetRow[], date: string): SheetRow => {
        return data.filter(row => row.DATE == date)[0];
    };
    const filterDataByDateRange = (data: SheetRow[], startDate: Date, endDate: Date): SheetRow[] => {
        return data.filter(row => 
        { var cDate = new Date(row.DATE); 
            return (cDate >= new Date(startDate) && cDate < new Date(endDate.getTime() - 24 * 60 * 60 * 1000)); 
        });
    }


    const CurrentSundaySchedule = filterDataByDate(jsonData, SundayDate);
    const NextSundaySchedule = filterDataByDate(jsonData, NextSundayDate);
    const ActivitiesSchedule = filterDataByDateRange(jsonData, lastMonday, thisSunday);
    const ActivitiesScheduleNextWeek = filterDataByDateRange(jsonData, thisSunday, nextSunday);
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
                    <button className="bg-gray-500 text-white rounded-lg p-2 m-1 font-bold drop-shadow-lg hover:bg-red-900" onClick={() => {
                    if (typeof window !== 'undefined') {
                        window.location.href = "./bulletin/view?date=" + thisSunday.toISOString();
                    }
                }}>
                    VIEW BULLETIN
                </button>
                <button className="bg-gray-500 text-white rounded-lg p-2 m-1 font-bold drop-shadow-lg hover:bg-red-900" onClick={() => {
                    if (typeof window !== 'undefined') {
                        window.location.href = "./bulletin/print?date=" + thisSunday.toISOString();
                    }
                }}>
                    PRINT BULLETIN
                </button>
                <div className=' bg-gray-500  text-white rounded-lg p-1.5 m-2 font-bold '>
                DATE <input className="w-[120px] text-black rounded-lg items-center font-bold" type="date" name="date" defaultValue={thisSunday.toLocaleDateString()}  onChange={e => setThisSunday(new Date(e.target.value))}/>
                </div>
                </div>

                        <Title><b>IMMANUEL COMMUNITY CHURCH OF FRESNO SCHEDULE </b><br/> {formatDate(lastMonday,"long")} - {formatDate(nextSunday,"long")} </Title>
                        <Title><div>ACTIVITIES</div></Title>
                        <table className="w-full mx-3 mt-2">
                            <tbody>
                                <Activities schedule={ActivitiesSchedule} />
                            </tbody>
                        </table>
                        <Title><div>SUNDAY SERVICE {formatDate(thisSunday,"long")}</div></Title>
                        <table className="w-full mx-3 mt-2">
                            <tbody>
                                <ListRoles Roles={Roles} Schedule={CurrentSundaySchedule} />
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
<Title> <b> NEXT WEEK </b> | <small>{nextSunday.toLocaleDateString('en-US', { weekday:'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()} at 10:30 AM</small>
</Title> 
                       <table className="w-full mx-3 mt-2">
                            <tbody>
                                <ListRoles Roles={Roles} Schedule={NextSundaySchedule} />
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