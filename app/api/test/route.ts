import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
const currentDate = new Date();
const currentDateTime = currentDate.toISOString();

console.log(currentDateTime);
export async function GET(request: NextRequest) { 
    const {searchParams} = new URL(request.url);
    const name = searchParams.get("name");
    const currentDate = new Date();
    const currentDateTime = currentDate.toISOString();

    return new Response(JSON.stringify({name, currentDateTime}), { status: 200 });
}
