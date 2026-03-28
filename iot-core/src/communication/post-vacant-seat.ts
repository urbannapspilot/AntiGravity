import { Pod } from "@urbannaps/urbannaps-orm";
import { BookingRepo } from "../repo/BookingRepo";
import { IoTError } from "../util/error";

export async function handlePostVacantSeat(pod: Pod): Promise<void> {
  const currentBooking = await BookingRepo.getActiveBookingForPod(pod.id);
  try {
    if (currentBooking) {
      await BookingRepo.markBookingCompleted(currentBooking, new Date());
    }
  }
  catch (error) {
    throw IoTError.handleCatch(error);
  }
}