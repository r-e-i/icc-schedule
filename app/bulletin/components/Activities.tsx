import { SheetRow } from '@/app/lib/types';
import { formatDate } from './utils';


interface props {
    schedule: SheetRow[];
}
export default function Activities(p : props) {
return (
    p.schedule.map(function(r) {
    return (
        <tr key={r.DATE}>
            <td className="text-sm w-1/3  align-top">{r.CHURCH_SERVICE}</td>
            <td className="text-sm align-top "><b>{formatDate(new Date(r.DATE),"long")} at {r.TIME} </b>
            <br />at <b>{r.LOCATION} </b> by <b>{r.ENGLISH_SPEAKER}{r.INDONESIAN_SPEAKER}</b>

            </td>
        </tr> );
    }
            
            )
);
}
