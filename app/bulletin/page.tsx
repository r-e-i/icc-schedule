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
    
    if (!jsonData || !CurrentSundaySchedule) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="text-gray-700 font-medium">Loading from Google Sheet Schedule...</span>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header Controls */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-wrap gap-4 items-center justify-center">
                        {HeaderButton(thisSunday, setThisSunday)}
                    </div>
                </div>

                {/* Main Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        IMMANUEL COMMUNITY CHURCH                         OF FRESNO SCHEDULE
                    </h1>
                    <p className="text-lg text-gray-600 bg-white rounded-full px-6 py-2 inline-block shadow-md">
                        {formatDate(lastMonday,"long")} - {formatDate(nextSunday,"long")}
                    </p>
                </div>

                {/* Activities Section */}
                <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4">
                        <h3 className="text-xl font-bold text-center tracking-wide">ACTIVITIES</h3>
                    </div>
                    <div className="p-6">
                        <table className="w-full">
                            <tbody>
                                <Activities schedule={ActivitiesSchedule} />
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sunday Service Section */}
                <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
                        <h3 className="text-xl font-bold text-center tracking-wide">
                            SUNDAY SERVICE - {formatDate(thisSunday,"long")}
                        </h3>
                    </div>
                    <div className="p-6">
                        <table className="w-full">
                            <tbody>
                                <ListRoles Roles={Roles} Schedule={CurrentSundaySchedule} />
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Next Week Activities */}
                <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4">
                        <h3 className="text-xl font-bold text-center tracking-wide">NEXT WEEK ACTIVITIES</h3>
                    </div>
                    <div className="p-6">
                        <table className="w-full">
                            <tbody>
                                <Activities schedule={ActivitiesScheduleNextWeek} />
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Next Week Service */}
                <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4">
                        <h3 className="text-xl font-bold text-center tracking-wide">
                            NEXT WEEK - {nextSunday.toLocaleDateString('en-US', { weekday:'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()} at 10:30 AM
                        </h3>
                    </div>
                    <div className="p-6">
                        <table className="w-full">
                            <tbody>
                                <ListRoles Roles={Roles} Schedule={NextSundaySchedule} />
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Announcements Section */}
                <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white p-4">
                        <h3 className="text-xl font-bold text-center tracking-wide">ANNOUNCEMENTS</h3>
                    </div>
                    <div className="p-6">
                        <Announcement schedule={CurrentSundaySchedule} />
                        <div className="mt-4 text-sm text-gray-500 text-center">
                            Number of Announcements: {NumberOfAnnouncements}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-400 text-sm mt-8">
                    <div className="mb-2">Version r.2</div>
                    <div className="space-y-1">
                        <div>Build Date: {process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString().split('T')[0]}</div>
                        <div>Commit: {process.env.NEXT_PUBLIC_COMMIT_SHA?.substring(0, 7) || "unknown"}</div>
                        <div>Commit Date: {process.env.NEXT_PUBLIC_COMMIT_DATE || "unknown"}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function HeaderButton(date: Date, setThisSunday: (date: Date) => void) {
    return (
        <>
            <button 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
                onClick={() => {
                    if (typeof window !== 'undefined') {
                        window.location.href = "./bulletin/view?date=" + date.toISOString();
                    }
                }}
            >
                📋 VIEW BULLETIN
            </button>
            
            <button 
                className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-3 font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
                onClick={() => {
                    if (typeof window !== 'undefined') {
                        window.location.href = "./bulletin/print?date=" + date.toISOString();
                    }
                }}
            >
                🖨️ PRINT BULLETIN
            </button>
            
            <div className="bg-gray-700 text-white rounded-xl px-4 py-3 font-semibold shadow-lg flex items-center space-x-3">
                <span className="text-sm font-medium text-white">📅 DATE</span>
                <input 
                    className="w-36 text-gray-800 bg-white rounded-lg px-3 py-1 font-medium border-2 border-gray-200 focus:border-blue-400 focus:outline-none transition-colors duration-200" 
                    type="date" 
                    name="date" 
                    defaultValue={date.toISOString().split('T')[0]}  
                    onChange={e => setThisSunday(new Date(e.target.value))}
                />
            </div>
        </>
    );
}

export default Bulletin;