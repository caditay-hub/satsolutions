import type { Request } from "express";

import { AuditLog, type AuditEntity } from "./models/AuditLog.js";



export async function writeAudit(params: {

  req: Request;

  actorUserId?: string | null;

  action: string;

  entityType: AuditEntity;

  entityId?: string | null;

  meta?: unknown;

}) {

  const { req, actorUserId = null, action, entityType, entityId = null, meta = null } = params;

  const ip = req.ip ?? null;

  const userAgent = typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : null;



  await AuditLog.create({ actorUserId, action, entityType, entityId, ip, userAgent, meta, createdAt: new Date() } as any);

}



