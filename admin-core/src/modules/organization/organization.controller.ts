import { FastifyReply, FastifyRequest } from "fastify";
import { appDataSource } from "../../repo/datasource";
import { Organization } from "@urbannaps/urbannaps-orm";

export const getAllOrganizations = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const repo = appDataSource.getRepository(Organization);
        const orgs: any[] = await repo.query("SELECT * FROM organization");

        // Map to mockAdminData format expected by frontend
        const clients = orgs.map(org => {
            const metadata = org.metadata || {};
            return {
                id: org.id,
                name: org.title,
                brandingType: metadata.brandingType || "urban-naps",
                customTheme: metadata.customTheme || null,
                whitelistedDomains: metadata.whitelistedDomains || [],
                defaultRequiresEmailLogin: org.login_enabled === 1,
                defaultIsPaid: true,
                permissions: { 
                    canEditBranding: metadata.canEditBranding ?? true,
                    canOverrideLoginRules: metadata.canOverrideLoginRules ?? false,
                    canDefineNapPricing: metadata.canDefineNapPricing ?? true
                }
            };
        });

        reply.status(200).send({ status: { success: true }, data: clients });
    } catch (err: any) {
        reply.status(500).send({ status: { success: false, message: err.message } });
    }
};

export const updateOrganization = async (req: FastifyRequest<{ Params: { id: string }, Body: Partial<Organization> }>, reply: FastifyReply) => {
    try {
        const repo = appDataSource.getRepository(Organization);
        const org = await repo.findOne({ where: { id: req.params.id } });
        if (!org) return reply.status(404).send({ status: { success: false, message: "Not found" } });

        // If body contains frontend keys (brandingType, whitelistedDomains), wrap them in metadata
        const body: any = req.body;
        const updateData: any = { ...body };
        
        const metadataKeys = ['brandingType', 'customTheme', 'whitelistedDomains', 'canEditBranding', 'canOverrideLoginRules', 'canDefineNapPricing'];
        const currentMetadata = (org.metadata || {}) as any;
        
        let metadataUpdated = false;
        metadataKeys.forEach(key => {
            if (body[key] !== undefined) {
                currentMetadata[key] = body[key];
                delete updateData[key];
                metadataUpdated = true;
            }
        });

        if (metadataUpdated) {
            updateData.metadata = currentMetadata;
        }

        await repo.update(org.id, updateData);
        const updated = await repo.findOne({ where: { id: org.id } });
        reply.status(200).send({ status: { success: true }, data: updated });
    } catch (err: any) {
        reply.status(500).send({ status: { success: false, message: err.message } });
    }
};
export const createOrganization = async (req: FastifyRequest<{ Body: Partial<Organization> }>, reply: FastifyReply) => {
    try {
        const repo = appDataSource.getRepository(Organization);
        const org = repo.create({
            ...req.body,
            is_active: true
        });
        const saved = await repo.save(org);
        reply.status(201).send({ status: { success: true }, data: saved });
    } catch (err: any) {
        reply.status(500).send({ status: { success: false, message: err.message } });
    }
};

export const deleteOrganization = async (req: FastifyRequest<{ Params: { id: string }}>, reply: FastifyReply) => {
    try {
        const repo = appDataSource.getRepository(Organization);
        await repo.delete(req.params.id);
        reply.status(200).send({ status: { success: true } });
    } catch (err: any) {
        reply.status(500).send({ status: { success: false, message: err.message } });
    }
};
