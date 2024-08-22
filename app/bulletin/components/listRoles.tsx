import React from 'react';

import { SheetRow } from '@/app/lib/types';
interface Props {
    Roles: string[];
    Schedule : SheetRow;
}

export default function listRoles(p : Props)
{  return (
    <>
    {p.Roles.map((key) => (
        <tr key={key}>
            <td className="text-sm w-1/3">{key.replace("_", " ")}</td>
            <td className="text-sm font-bold">{key == "CARETAKER" ? p.Schedule["CARETAKER1"] + " & " + p.Schedule["CARETAKER2"] : p.Schedule[key]}</td>
        </tr>
    ))}
    </> );
};
