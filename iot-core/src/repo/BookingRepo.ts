import { appDataSource } from "./datasource";
import { Booking } from "@urbannaps/urbannaps-orm/build/entity/Booking";
import { IoTError } from '../util/error';

export class BookingRepo {
    public static async getBookingById(bookingId: string): Promise<Booking> {
        const booking = await appDataSource.getRepository(Booking).findOne({
            where: {
                id: bookingId
            }
        });

        if (!booking) {
            throw new IoTError('BOOKING_NOT_FOUND', `Booking Id ${bookingId} does not exists`, 404);
        }
        return booking;
    }

    public static async getActiveBookingForPod(podId: string): Promise<Booking | null> {
        const currentBooking = await appDataSource.getRepository(Booking)
            .createQueryBuilder("booking")
            .where("booking.pod_id = :podId", { podId })
            .andWhere("booking.is_active = :isActive", { isActive: true })
            .andWhere("COALESCE(booking.effactive_end_time, booking.end_time) >= NOW()")
            .getOne();

        return currentBooking;
    }

    public static async markBookingCompleted(booking: Booking, endTime: Date): Promise<Booking> {
        booking.effactive_end_time = endTime;
        booking.status = "completed";
        return appDataSource.manager.save(booking);
    }

    public static async markBookingInactive(booking: Booking): Promise<void> {
        booking.is_active = false;
        await appDataSource.manager.save(booking);
    }
}