import { FastifyReply, FastifyRequest } from "fastify";
import { appDataSource } from "../../repo/datasource";

// Lightweight main sessions endpoint - returns empty arrays fast so frontend doesn't block
export const getSessionState = async (req: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send({
        status: { success: true },
        data: {
            activeSessions: [],
            upcomingBookings: [],
            pastSessions: []
        }
    });
};

// Dedicated per-client booking history endpoint - fetches real data from booking table
export const getClientHistory = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
        const clientId = req.params.id;
        
        const bookings = await appDataSource.query(`
            SELECT 
                b.id as booking_id, 
                b.start_time, 
                b.end_time, 
                b.effactive_end_time,
                b.status as booking_status,
                b.pod_id as podId,
                p.organization_id as clientId,
                p.title as pod_name,
                s.email,
                pl.duration as planDuration,
                pl.plan_name as plan_name
            FROM booking b
            JOIN pod p ON b.pod_id = p.id
            LEFT JOIN pod_plan pp ON pp.pod_id = b.pod_id AND pp.is_active = 1
            LEFT JOIN plan pl ON pl.id = pp.plan_id AND pl.is_active = 1
            LEFT JOIN session s ON b.session_id = s.id
            WHERE p.organization_id = ?
            GROUP BY b.id
            ORDER BY b.start_time DESC 
            LIMIT 500
        `, [clientId]);

        const sessions = bookings.map((b: any) => {
            const start = new Date(b.start_time).getTime();
            const end = b.effactive_end_time 
                ? new Date(b.effactive_end_time).getTime() 
                : new Date(b.end_time).getTime();
            const duration = Math.floor((end - start) / 60000);
            const napMinutes = duration > 0 ? duration : (Number(b.planDuration) || 30);

            return {
                id: b.booking_id,
                status: b.booking_status === 'pending' ? 'completed' : (b.booking_status || 'completed'),
                startTime: b.start_time,
                endTime: b.effactive_end_time || b.end_time,
                terminatedAt: b.effactive_end_time || b.end_time,
                email: b.email || null,
                podId: b.podId,
                podName: b.pod_name,
                clientId: b.clientId,
                planName: b.plan_name || `${napMinutes} Min Nap`,
                durationMinutes: napMinutes,
                price: napMinutes * 0.5
            };
        });

        reply.status(200).send({ status: { success: true }, data: sessions });
    } catch (err: any) {
        console.error("Client history error:", err.message);
        reply.status(500).send({ status: { success: false, message: err.message } });
    }
};
