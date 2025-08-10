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
        <div className="min-h-screen bg-gray-50">
            {/* <!-- Page 1 --> */}
            <div className="max-w-7xl mx-auto p-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="flex flex-col lg:flex-row">
                        {/* Main Service Info Section - First section */}
                        <div className="w-full p-4 lg:p-6">
                            <h1 className='text-lg lg:text-xl font-bold text-center mb-4'>{thisSunday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h1>
                            <div className="flex justify-center -mt-6 -mb-10">
                                <img className="h-[200px] lg:h-[240px] object-cover z-20" src="/images/Welcome ICC.png" alt="Welcome ICC" />
                            </div>
                            <img className="w-full h-[200px] lg:h-[240px] object-cover z-10 rounded-lg shadow-lg shadow-gray-500 -mb-6" src={CurrentSundaySchedule["PICTURE"]} alt="Service picture" />
                            <div className='text-center font-bold text-xl lg:text-2xl tracking-widest text-white z-40 drop-shadow-xl'>I N D O N E S I A N &nbsp; S E R V I C E</div>

                            <div className="text-center tracking-widest mt-4">THEMA KHOTBAH</div>
                            <div className="text-center font-bold text-lg lg:text-xl">{CurrentSundaySchedule["SERMON_TITLE_IND"]}</div>
                            <div className="text-center italic text-lg lg:text-xl -mt-1">{CurrentSundaySchedule["SERMON_TITLE_ENG"]}</div>
                            
                            <div className="text-center tracking-widest mt-4">PEMBACAAN ALKITAB</div>
                            <div className="text-center font-bold text-lg lg:text-xl -mt-1">{CurrentSundaySchedule["VERSE"]}</div>

                            <div className="text-center tracking-widest mt-4">PEMBICARA</div>
                            <div className="text-center font-bold text-lg lg:text-xl -mt-1">{CurrentSundaySchedule["SPEAKER"]}</div>

                            <div className="w-full h-auto bg-yellow-900 text-white object-cover z-10 rounded-lg shadow-md shadow-gray-500 mt-4">
                                <div className='text-center text-lg lg:text-xl tracking-widest bg-white bg-opacity-30 p-2'>H U B U N G I &nbsp; K A M I</div>
                                <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
                                    <div className='text-sm font-bold text-center sm:text-left'>4141 N MILLBROOK AVE<br />FRESNO, CA 93726<br />(559)500-8220</div>
                                    <div className='text-center text-sm font-bold'>http://iccfresno.org</div>
                                    <div className='text-sm text-center sm:text-right'>ZOOM ID <b>559 123 4567</b><br />PASSWORD <b>4141</b></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                </div>

                {/* <!-- Page 2 --> */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Worship Order Section */}
                        <div className="w-full lg:w-1/2 lg:border-r-2 p-4 lg:p-6">
                            <div className="flex justify-center mb-4">
                                <img className="h-[70px] object-cover" src="/images/Worship.png" />
                            </div>
                            <div className="flex flex-col text-center space-y-0.5 text-sm">
                                {wT("Doa Teduh", "DUDUK")}
                                {wT("Panggilan Beribadah", "BERDIRI")}
                                <div className='px-1'>
                                    <p className="mx-2 -mt-1 mb-2" style={{ lineHeight: "1.3em" }}>
                                        <b className="m-1">{CurrentSundaySchedule["WORSHIP_VERSE"]?.toUpperCase()} - </b>
                                        <i>{CurrentSundaySchedule["WORSHIP_VERSE_TEXT"]}</i>
                                    </p>
                                </div>
                                {wT("Lagu Pujian", "BERDIRI")}
                                {wT("Doa Pembukaan", "BERDIRI")}
                                {wT("Lagu Pujian", "DUDUK")}

                                {CurrentSundaySchedule["READING"]?.toLowerCase() !== "perjamuan kudus" && wT(CurrentSundaySchedule["READING"], "BERDIRI")}
                                {wT("Bible Reading", "BERDIRI")}
                                <div className="-mb-3"><span className="font-bold">{CurrentSundaySchedule["VERSE"]} </span> - <i>{CurrentSundaySchedule["SERMON_TITLE_IND"]}</i></div>
                                {wT("Lagu Pujian Sebelum Firman", "BERDIRI")}
                                {wT("Khotbah", "DUDUK")}
                                {CurrentSundaySchedule["READING"]?.toLowerCase() === "perjamuan kudus" && wT(CurrentSundaySchedule["READING"], "BERDIRI")}
                                {wT("Lagu Persembahan", "BERDIRI")}
                                {wT("Lagu Doksologi", "BERDIRI")}
                                {wT("Doa Berkat", "BERDIRI")}
                                {wT("Lagu Amin", "BERDIRI")}
                                {wT("Doa Teduh", "DUDUK")}
                            </div>
                            
                            <div className="flex justify-center mt-6 mb-4">
                                <img className="h-[70px] object-cover" src="/images/Announcement.png" />
                            </div>
                            <div className="px-2">
                                <ol className="list-decimal text-sm">
                                    <Announcement schedule={CurrentSundaySchedule} indexstart={1} indexend={NumberOfAnnouncements} />
                                </ol>
                            </div>
                        </div>

                        {/* Schedules Section */}
                        <div className="w-full lg:w-1/2 p-4 lg:p-6">
                            {/* Today's Service */}
                            <div className="w-full bg-yellow-700 text-white rounded-lg mb-4">
                                <div className='text-center text-sm lg:text-lg tracking-widest bg-white bg-opacity-30 p-2'>
                                    <b>IBADAH PAGI INI</b> | <small className="text-xs lg:text-sm">{thisSunday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()} at 10:30 AM</small>
                                </div>
                            </div>
                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-sm">
                                    <tbody>
                                        <ListRoles Roles={Roles} Schedule={CurrentSundaySchedule} />
                                    </tbody>
                                </table>
                            </div>

                            {/* Activities */}
                            <div className="w-full bg-yellow-800 text-white rounded-lg mb-4">
                                <div className='text-center text-sm lg:text-xl tracking-widest bg-white bg-opacity-30 p-2'>
                                    <b>AKTIFITAS</b>
                                </div>
                            </div>
                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-sm">
                                    <tbody>
                                        <Activities schedule={ActivitiesScheduleNextWeek} />
                                    </tbody>
                                </table>
                            </div>

                            {/* Next Week's Service */}
                            <div className="w-full bg-yellow-900 text-white rounded-lg mb-4">
                                <div className='text-center text-sm lg:text-lg tracking-widest bg-white bg-opacity-30 p-2'>
                                    <b>IBADAH MINGGU DEPAN</b> | <small className="text-xs lg:text-sm">{nextSunday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()} at 10:30 AM</small>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <tbody>
                                        <ListRoles Roles={Roles} Schedule={NextSundaySchedule} />
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sermon Notes Section - Moved to last */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Sermon Notes */}
                        <div className="w-full lg:w-1/2 lg:border-r-2 p-4 lg:p-6 flex flex-col justify-between">
                            
                            <div className="w-full">
                                <div className="w-full h-[120px] bg-gray-500 text-white object-cover z-10 rounded-lg shadow-md shadow-gray-500">
                                    <div className='text-center text-xl tracking-widest bg-white bg-opacity-30'>P E R S E M B A H A N</div>
                                    <div className="items-center p-2 text-center text-sm">
                                        Jemaat bisa memberikan persembahan dalam bentuk cash atau check (payable to <b>Immanuel community Church</b>) dengan memasukan ke drop box yg sudah tersedia atau kantong persembahan.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default Bulletin;