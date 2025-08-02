import { SheetRow } from '@/app/lib/types';
import { formatDate } from './utils';


interface props {
    schedule: SheetRow;
    indexstart?: number; 
    indexend?: number;
}
export default function Announcement(p: props)
{
    const start = p.indexstart || 1;
    const end = p.indexend || 6;
    return (
        <>
        <ol className="list-decimal text-sm" start={start}>
        {Array.from({ length: end - start + 1 }).map((_, index) => { 
            const content = p.schedule[`ANNOUNCEMENT${index + start}`];
            const englishContent = p.schedule[`ANNOUNCEMENT${index + start}_ENG`];
            if (content) return (
                <li key={index}>{content}
                {(englishContent) && <><br/><i>{englishContent}</i></>}
                </li> 
            )
        } )}
        </ol>
        </>
    );
}

export function checkNumberOfAnnouncements(schedule: SheetRow, start: number, end: number): number
{
    if (schedule == null) return 0;
    for (let i = start; i <= end; i++)
    {
        if (!schedule.hasOwnProperty(`ANNOUNCEMENT${i}`)) return i-1;
    }
    return 0;
}