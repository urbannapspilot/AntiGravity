import { FastifyPluginAsync } from "fastify";
import { getAllPods, getPodById, updatePodConfig, createPod, deletePod } from "./pod.controller";

export const podRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', getAllPods);
  fastify.post('/', createPod);
  fastify.get('/:id', getPodById);
  fastify.put('/:id', updatePodConfig);
  fastify.delete('/:id', deletePod);
};
