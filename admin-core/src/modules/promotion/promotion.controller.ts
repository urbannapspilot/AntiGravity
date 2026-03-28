import { FastifyReply, FastifyRequest } from "fastify";
import { appDataSource } from "../../repo/datasource";
import { Promotion } from "@urbannaps/urbannaps-orm";

export const getPromotions = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const promotions = await appDataSource.getRepository(Promotion).find({
            order: { created_at: "DESC" }
        });
        
        reply.status(200).send({
            status: { success: true },
            data: promotions
        });
    } catch (err: any) {
        reply.status(500).send({ status: { success: false, message: err.message } });
    }
};

export const createPromotion = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const body: any = req.body;
        const promoRepo = appDataSource.getRepository(Promotion);
        
        const newPromo = new Promotion().build({
            code: body.code,
            organization_id: body.clientId || body.organization_id, // Map JS 'clientId' to DB 'organization_id'
            discountType: body.discountType,
            discountValue: Number(body.discountValue),
            active: true,
            maxUses: Number(body.maxUses || 100),
            currentUses: 0,
            minimumSpend: Number(body.minimumSpend || 0),
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            description: body.description || "",
            redemptionStrategy: body.redemptionStrategy || "global",
            generatedCodes: []
        });

        const savedPromo = await promoRepo.save(newPromo);

        // Remap to mock expected id style for frontend
        const dto = { ...savedPromo, clientId: savedPromo.organization_id };
        
        reply.status(200).send({ status: { success: true }, data: dto });
    } catch (e: any) {
        reply.status(500).send({ status: { success: false, message: e.message } });
    }
};
