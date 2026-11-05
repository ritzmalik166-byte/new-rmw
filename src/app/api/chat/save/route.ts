import { saveConversations } from "@/lib/saveConversations";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const result = saveConversations(data.messages);
        if (!result) {
            return NextResponse.json(
                { success: false, message: "Failed to save conversation" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result,
        }, {
            status: 201
        });

    } catch (error) {
        console.log("Internal Server Error In Saving User Conversations! ", error);
        return NextResponse.json({ message: "Internal server error!" }, { status: 500 })
    }
}