import { FastifyPluginAsync } from "fastify";
import { getAllOrganizations, updateOrganization, createOrganization, deleteOrganization } from "./organization.controller";

export const organizationRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', getAllOrganizations);
  fastify.post('/', createOrganization);
  fastify.put('/:id', updateOrganization);
  fastify.delete('/:id', deleteOrganization);
};
