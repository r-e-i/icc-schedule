"use client"
//Google Sheet ID : 1UKdbu_cJuVVep7xZRWsBwLZqHoYQh_baH69Y-izttBE
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { SheetRow } from '@/app/lib/types';
import ListRoles from '../components/listRoles';
import Title from '../components/Title';
import { formatDate, filterDataByDate, filterDataByDateRange, wT } from '../components/utils';
import Activities from '../components/Activities';
import {Roles, RolesTitle, AnnouncementSplit} from '../config';
import Announcement, { checkNumberOfAnnouncements } from '../components/Announcements';

const Bulletin: React.FC = () => {
    const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const queryDate = queryParams?.get('date');
    const [jsonData, setJsonData] = useState<SheetRow[]>([]);
    const [thisSunday, setThisSunday] = useState<Date>(queryDate ? new Date(queryDate) : new Date());
//Fetch Data
    useEffect(() => {
        console.log("Fetching data from Google Sheet Schedule ...");
        axios.get('/api/bulletin/schedule').then(res => setJsonData(res.data)).catch(err => { alert(err); console.error(err);});
        setTimeout(() => { window.print();   }, 2000);
        }, []);
//Set to this Sunday
    if (thisSunday.getDay() != 0) {
        thisSunday.setDate(thisSunday.getDate() + (7 - thisSunday.getDay()));
    }
//Dates
       const nextSunday = new Date(thisSunday.getTime() + 7 * 24 * 60 * 60 * 1000);
    const SundayDate = formatDate(thisSunday);
    const NextSundayDate = formatDate(nextSunday);
//SCHEDULES
    const CurrentSundaySchedule = filterDataByDate(jsonData, SundayDate);
    const NextSundaySchedule = filterDataByDate(jsonData, NextSundayDate);
    const ActivitiesScheduleNextWeek = filterDataByDateRange(jsonData, thisSunday, nextSunday);
    const NumberOfAnnouncements = checkNumberOfAnnouncements(CurrentSundaySchedule, 1, 6);
    const NumberOfSermonNotes = NumberOfAnnouncements > AnnouncementSplit ? 12 - (NumberOfAnnouncements-AnnouncementSplit) : 13;
    if (!jsonData || !CurrentSundaySchedule) return <div>Loading from Google Sheet Schedule ...</div>;
    return (
            <div>
            {/* <!-- Page 1 --> */}
                <div className="page bg-white border-white  mx-auto p-3 flex overflow-hidden">
                    <div className="w-1/2 border-r-2 p-1 flex flex-col justify-between">
                    <div>
                        <img src="/images/SermonNotes.png" className="h-[50px] object-cover" />
                        {Array.from({ length: NumberOfSermonNotes }).map((_, index) => (
                            <div key={index} className="w-full h-10 p-3">
                                <div key={index} className="w-full border-b-2 h-10 p-3"> &nbsp; </div>
                            </div>
                        ))}
                     { NumberOfAnnouncements > 3 && 
                        <div className="w-full px-3 mt-5 ">
                           <div className="font-bold">A N N O U N C E M E N T <small><i>Continued from previous page</i></small></div>
                           <div className='px-4'> 
                            <Announcement schedule={CurrentSundaySchedule} indexstart={4} indexend={NumberOfAnnouncements} />
                            </div>
                        </div>
                            }
                    </div>
                        <div className="w-full px-3">
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
                        <div className="text-center tracking-widest mt-2">PEMBACAAN ALKITAB / BIBLE READING </div>
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
                            <Announcement schedule={CurrentSundaySchedule} indexstart={1} indexend={3} />
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
                        <div className="w-full bg-yellow-900 text-white object-cover z-10 rounded-lg m-1 ">
                            <div className='text-center text-lg tracking-widest bg-white bg-opacity-30'>  <b> SUNDAY SERVICE </b> | <small>{nextSunday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()} at 10:30 AM</small></div>
                        </div>
                        <table className="w-full mx-3 mt-2">
                            <tbody>
                            <ListRoles Roles={Roles} Schedule={NextSundaySchedule} />
                            </tbody>
                        </table>
                    </div> 
            </div>
        </div>

    );
};

export default Bulletin;