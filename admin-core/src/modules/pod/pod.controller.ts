import { FastifyReply, FastifyRequest } from "fastify";
import { appDataSource } from "../../repo/datasource";
import { Pod } from "@urbannaps/urbannaps-orm";

export const getAllPods = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const repo = appDataSource.getRepository(Pod);
        const pods: any[] = await repo.query(`
            SELECT p.*, o.title as org_name
            FROM pod p
            LEFT JOIN organization o ON p.organization_id = o.id
        `);

        // Fetch all plans to associate them efficiently
        const allPodPlans = await appDataSource.query(`
            SELECT pp.pod_id, pl.duration, pl.discounted_amount as price
            FROM pod_plan pp
            JOIN plan pl ON pp.plan_id = pl.id
            WHERE pp.is_active = 1 AND pl.is_active = 1
        `);

        const mappedPods = pods.map((p) => {
            const podPlans = allPodPlans.filter((pl: any) => pl.pod_id === p.id);
            
            // Fallback if no plans defined in DB, so UI doesn't break
            const napOptions = podPlans.length > 0 
                ? podPlans.map((pl: any) => ({ durationMinutes: Number(pl.duration), price: Number(pl.price) }))
                : [
                    { durationMinutes: 30, price: 15 },
                    { durationMinutes: 60, price: 25 }
                ];

            return {
                id: p.id,
                type: p.type || "Sleep Pod",
                clientId: p.organization_id || null,
                locationId: p.location_id || "loc-1", // Using physical column if it exists or fallback
                name: p.title || p.thing_name || p.slug || 'Unknown Pod',
                overrides: { 
                    requiresEmailLogin: p.metadata?.requiresEmailLogin ?? null, 
                    isPaid: p.metadata?.isPaid ?? true, 
                    allowAdvanceBooking: true 
                },
                napOptions
            };
        });

        reply.status(200).send({ status: { success: true }, data: mappedPods });
    } catch (err: any) {
        reply.status(500).send({ status: { success: false, message: err.message } });
    }
};

export const getPodById = async (req: FastifyRequest<{ Params: { id: string }}>, reply: FastifyReply) => {
    try {
        const repo = appDataSource.getRepository(Pod);
        const pod = await repo.findOne({ where: { id: req.params.id } });
        reply.status(200).send({ status: { success: true }, data: pod });
    } catch (err: any) {
        reply.status(500).send({ status: { success: false, message: err.message } });
    }
};

export const updatePodConfig = async (req: FastifyRequest<{ Params: { id: string }, Body: Partial<Pod>}>, reply: FastifyReply) => {
    try {
        const repo = appDataSource.getRepository(Pod);
        await repo.update(req.params.id, req.body);
        const updated = await repo.findOne({ where: { id: req.params.id } });
        reply.status(200).send({ status: { success: true }, data: updated });
    } catch (err: any) {
        reply.status(500).send({ status: { success: false, message: err.message } });
    }
}
export const createPod = async (req: FastifyRequest<{ Body: Partial<Pod> }>, reply: FastifyReply) => {
    try {
        const repo = appDataSource.getRepository(Pod);
        const pod = repo.create({
            ...req.body,
            is_active: true
        });
        const saved = await repo.save(pod);
        reply.status(201).send({ status: { success: true }, data: saved });
    } catch (err: any) {
        reply.status(500).send({ status: { success: false, message: err.message } });
    }
};

export const deletePod = async (req: FastifyRequest<{ Params: { id: string }}>, reply: FastifyReply) => {
    try {
        const repo = appDataSource.getRepository(Pod);
        await repo.delete(req.params.id);
        reply.status(200).send({ status: { success: true } });
    } catch (err: any) {
        reply.status(500).send({ status: { success: false, message: err.message } });
    }
};
