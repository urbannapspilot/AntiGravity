import { FastifyReply, FastifyRequest } from "fastify";
import { appDataSource } from "../../repo/datasource";

export const getDashboardMetrics = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const podCountObj = await appDataSource.query("SELECT COUNT(*) as cnt FROM pod WHERE is_active = 1");
        const clientCountObj = await appDataSource.query("SELECT COUNT(*) as cnt FROM organization WHERE is_active = 1");
        const bookingCountObj = await appDataSource.query("SELECT COUNT(*) as cnt FROM booking WHERE is_active = 1");

        const podCount = Number(podCountObj[0].cnt);
        const clientCount = Number(clientCountObj[0].cnt);
        const bookingsCount = Number(bookingCountObj[0].cnt);

        // Total minutes & avg session: calculated from actual start/end times in booking table
        const sessionStatsObj = await appDataSource.query(`
            SELECT 
                SUM(
                    TIMESTAMPDIFF(MINUTE, b.start_time, COALESCE(b.effactive_end_time, b.end_time))
                ) as total_minutes,
                AVG(
                    TIMESTAMPDIFF(MINUTE, b.start_time, COALESCE(b.effactive_end_time, b.end_time))
                ) as avg_minutes
            FROM booking b
            WHERE b.is_active = 1
              AND b.start_time IS NOT NULL
              AND COALESCE(b.effactive_end_time, b.end_time) IS NOT NULL
              AND TIMESTAMPDIFF(MINUTE, b.start_time, COALESCE(b.effactive_end_time, b.end_time)) > 0
              AND TIMESTAMPDIFF(MINUTE, b.start_time, COALESCE(b.effactive_end_time, b.end_time)) < 480
        `);
        const totalMinutes = Math.round(Number(sessionStatsObj[0]?.total_minutes || 0));
        const avgMinutes = Math.round(Number(sessionStatsObj[0]?.avg_minutes || 0));

        // Revenue: sum of plan discounted_amount via pod_plan mapping
        const revenueData = await appDataSource.query(`
            SELECT SUM(pl.discounted_amount) as total
            FROM booking b
            JOIN pod p ON b.pod_id = p.id
            JOIN pod_plan pp ON pp.pod_id = b.pod_id AND pp.is_active = 1
            JOIN plan pl ON pl.id = pp.plan_id AND pl.is_active = 1
            WHERE b.is_active = 1
        `);
        const totalRevenue = Number(revenueData[0]?.total || 0);

        // Weekly sessions trend (last 7 days)
        const weeklyUsage = await appDataSource.query(`
            SELECT 
                DATE_FORMAT(b.start_time, '%a') as dayName,
                COUNT(*) as count,
                SUM(TIMESTAMPDIFF(MINUTE, b.start_time, COALESCE(b.effactive_end_time, b.end_time))) as totalMins
            FROM booking b
            WHERE b.start_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
              AND b.is_active = 1
            GROUP BY DATE(b.start_time), DATE_FORMAT(b.start_time, '%a')
            ORDER BY DATE(b.start_time) ASC
        `);

        const chartData = weeklyUsage.map((w: any) => ({
            name: w.dayName,
            uses: Number(w.count),
            minutes: Math.round(Number(w.totalMins || 0))
        }));

        reply.status(200).send({
            status: { success: true },
            data: {
                metrics: {
                    totalPods: podCount,
                    totalClients: clientCount,
                    totalBookings: bookingsCount,
                    totalMinutes,
                    avgSession: avgMinutes,
                    revenue: totalRevenue
                },
                chartData: chartData.length > 0 ? chartData : [
                    { name: 'Mon', uses: 0, minutes: 0 },
                    { name: 'Tue', uses: 0, minutes: 0 },
                    { name: 'Wed', uses: 0, minutes: 0 },
                    { name: 'Thu', uses: 0, minutes: 0 },
                    { name: 'Fri', uses: 0, minutes: 0 },
                    { name: 'Sat', uses: 0, minutes: 0 },
                    { name: 'Sun', uses: 0, minutes: 0 }
                ]
            }
        });
    } catch (err: any) {
        console.error("Dashboard error:", err.message);
        reply.status(500).send({ status: { success: false, message: err.message } });
    }
};
