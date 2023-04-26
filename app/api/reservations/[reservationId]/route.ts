import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  reservationId?: string;
}
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const curentUser = await getCurrentUser();

  if (!curentUser) {
    return NextResponse.error();
  }

  const { reservationId } = params;

  if (!reservationId || typeof reservationId !== "string") {
    throw new Error("Invalid ID");
  }

  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId,
      OR: [{ userId: curentUser.id }, { listing: { userId: curentUser.id } }],
    },
  });

  return NextResponse.json(reservation);
}
