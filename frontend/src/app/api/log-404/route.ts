import { NextRequest, NextResponse } from "next/server";

/** Заглушка: раньше писали в БД; при необходимости логируйте во внешний сервис */
export async function POST(_request: NextRequest) {
  return NextResponse.json({ ok: true });
}
