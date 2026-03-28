import { FastifyReply, FastifyRequest } from "fastify";
import { appDataSource } from "../../repo/datasource";
import { Location } from "@urbannaps/urbannaps-orm";

export const getLocations = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const locations = await appDataSource.getRepository(Location).find({
            order: { created_at: "DESC" }
        });
        
        // Map organization_id to clientId for frontend compatibility
        const mappedLocations = locations.map(loc => ({
            ...loc,
            clientId: loc.organization_id 
        }));
        
        reply.status(200).send({
            status: { success: true },
            data: mappedLocations
        });

    } catch (err: any) {
        reply.status(500).send({ status: { success: false, message: err.message } });
    }
};

export const createLocation = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const body: any = req.body;
        const locationRepo = appDataSource.getRepository(Location);
        
        const newLoc = new Location().build({
            name: body.name,
            organization_id: body.clientId || body.organization_id
        });
        
        const savedLoc = await locationRepo.save(newLoc);
        
        reply.status(200).send({ status: { success: true }, data: savedLoc });
    } catch (e: any) {
        reply.status(500).send({ status: { success: false, message: e.message } });
    }
};
