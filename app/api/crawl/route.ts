import { NextResponse } from "next/server";
import Parse from '@/app/libs/parse-server';
import axios from "axios";
import { Env } from "@/app/consts/env";

export async function GET(request: Request) {

  try {
    const res = await axios.post(`${Env.API}/create-schedule`, {
      id: 'manh-nhu-ky',
      url: 'https://truyenfull.vn/manh-nhu-ky/',
      startDate: '2024-03-20:00:00:00',
      step: 2,
      createVideoAt: 18 * 60 * 60 * 1000,
      uploadVideoAt: ((24 + 10) * 60 * 60 * 1000)
    });
    return new NextResponse(JSON.stringify({data: res.data}), {
      status: 200
    });
  }
  catch (err) {

    return new NextResponse(JSON.stringify({ message: 'Create Schedule Error!!!', err }), {
      status: 400
    });
  }
}

export async function POST(request: Request) {
  return new NextResponse(JSON.stringify({ message: 'Hello 111' }), {
    status: 200
  });
}