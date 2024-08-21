import { NextApiRequest, NextApiResponse } from 'next';
export const dynamic = "force-dynamic";
const currentDate = new Date();
const currentDateTime = currentDate.toISOString();

console.log(currentDateTime);
export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const currentDate = new Date();
    const currentDateTime = currentDate.toISOString();

    return new Response(JSON.stringify(currentDateTime), { status: 200 });
}