    // Function to filter data by DATE field

import { SheetRow } from "@/app/lib/types";

    export const filterDataByDate = (data: SheetRow[], date: string): SheetRow => {
        return data.filter(row => row.DATE == date)[0];
    };
    export const filterDataByDateRange = (data: SheetRow[], startDate: Date, endDate: Date): SheetRow[] => {
        return data.filter(row => 
        { var cDate = new Date(row.DATE); 
            return (cDate >= new Date(startDate) && cDate < new Date(endDate.getTime() - 24 * 60 * 60 * 1000)); 
        });
    }

export function formatDate(date: Date, length: "long" | "short" = "short"): string
{
    return date.toLocaleDateString('en-US', { weekday: length, month: length, day: 'numeric', year: 'numeric' });
};

    export const wT = (title: string, text: string) => {
        if (title) return (
            <div className="text-center text-sm font-semibold">
                <span className="tracking-widest">{title.toUpperCase()}</span>
                <span
                    className={`text-xs font-bold rounded text-white p-0.5 m-0.5 ${
                        text.toLowerCase() === "duduk" ? "bg-gray-700" : "bg-yellow-700"
                    }`}
                >
                    {text}
                </span>
            </div>
        ); else { return null; }
    }