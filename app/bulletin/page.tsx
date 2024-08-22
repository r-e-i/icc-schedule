"use client"
//Google Sheet ID : 1UKdbu_cJuVVep7xZRWsBwLZqHoYQh_baH69Y-izttBE
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRef } from 'react';
import { SheetRow } from '@/app/lib/types';
import ListRoles from './components/listRoles';
import Title from './components/Title';
import { formatDate, filterDataByDate, filterDataByDateRange, wT } from './components/utils';
import Activities from './components/Activities';
import {Roles, RolesTitle, AnnouncementSplit} from './config';
import Announcement, { checkNumberOfAnnouncements } from './components/Announcements';

const Bulletin: React.FC = () => {
    const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const queryDate = queryParams?.get('date');
    const [jsonData, setJsonData] = useState<SheetRow[]>([]);
    const [thisSunday, setThisSunday] = useState<Date>(queryDate ? new Date(queryDate) : new Date());
//Fetch Data
    useEffect(() => {
        console.log("Fetching data from Google Sheet Schedule ...");
        axios.get('/api/bulletin/schedule').then(res => setJsonData(res.data)).catch(err => { alert(err); console.error(err);});
    }, []);
//Set to this Sunday
    if (thisSunday.getDay() != 0) {
        thisSunday.setDate(thisSunday.getDate() + (7 - thisSunday.getDay()));
    }
//Dates
    const lastMonday = new Date(thisSunday.getTime() - 6 * 24 * 60 * 60 * 1000);
    const nextSunday = new Date(thisSunday.getTime() + 7 * 24 * 60 * 60 * 1000);
    const SundayDate = formatDate(thisSunday);
    const NextSundayDate = formatDate(nextSunday);
//SCHEDULES
    const CurrentSundaySchedule = filterDataByDate(jsonData, SundayDate);
    const NextSundaySchedule = filterDataByDate(jsonData, NextSundayDate);
    const ActivitiesSchedule = filterDataByDateRange(jsonData, lastMonday, thisSunday);
    const ActivitiesScheduleNextWeek = filterDataByDateRange(jsonData, thisSunday, nextSunday);
    const NumberOfAnnouncements = checkNumberOfAnnouncements(CurrentSundaySchedule, 1, 6);
    if (!jsonData || !CurrentSundaySchedule) return <div>Loading from Google Sheet Schedule ...</div>;
    return (
            <div className="p-2">
                <div className="flex font-bold items-center space-x-2">
                {HeaderButton(thisSunday, setThisSunday)}
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
                            <Announcement schedule={CurrentSundaySchedule} />
                            # of Announcements: {NumberOfAnnouncements}
                        </div>
                    </div> 

    );
};

function HeaderButton(date: Date, setThisSunday: (date: Date) => void)
{
    return ( <>
    <button className="bg-gray-500 text-white rounded-lg p-2 m-1 font-bold drop-shadow-lg hover:bg-red-900" onClick={() => {
        if (typeof window !== 'undefined') {
            window.location.href = "./bulletin/view?date=" + date.toISOString();
        }
    }}>
        VIEW BULLETIN
    </button>
    <button className="bg-gray-500 text-white rounded-lg p-2 m-1 font-bold drop-shadow-lg hover:bg-red-900" onClick={() => {
        if (typeof window !== 'undefined') {
            window.location.href = "./bulletin/print?date=" + date.toISOString();
        }
    }}>
        PRINT BULLETIN
    </button>
    <div className=' bg-gray-500  text-white rounded-lg p-1.5 m-2 font-bold '>
    DATE <input className="w-[120px] text-black rounded-lg items-center font-bold" type="date" name="date" defaultValue={date.toLocaleDateString()}  onChange={e => setThisSunday(new Date(e.target.value))}/>
    </div>
    </>);
}
export default Bulletin;