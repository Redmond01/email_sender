
import { NextResponse } from 'next/server';

import { prismadb } from '../../server/lib/dbconnection';
import { multipleEmail } from '../../server/lib/multipleemails';
import { modifyStringKeyToValue } from '../../helper/modifystringkeytovalue';




// export const GET = async (req: Request) => {
//     const findList = await prismadb.recipient.deleteMany();
//     console.log(findList)
//     return NextResponse.json({ msg: "hello" })
// }

export const POST = async (req: Request) => {
    const { data } = await req.json()
    try {

        const modifyDataReceived = modifyStringKeyToValue(data);

        const saveMultipleDetails = await multipleEmail(modifyDataReceived);

        const { message, status, skipped } = saveMultipleDetails;

        return NextResponse.json({ message: `${message} and ${skipped} details was skipped due to error in credentials or already existing in database`}, { status: status })

    } catch (e) {
        return NextResponse.json({ message: e }, { status: 500 })
    }
}