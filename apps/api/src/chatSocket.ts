import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import type { Socket } from "socket.io";
import { verifyAccessToken } from "./auth.js";
import { ChatConversation } from "./models/ChatConversation.js";
import { ChatMessage } from "./models/ChatMessage.js";
import { sequelize } from "./db.js";

function safeTrim(v: unknown, max: number) {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return "";
  return s.length > max ? s.slice(0, max) : s;
}

function convRoom(id: string) {
  return `conv:${id}`;
}

export function createSocketServer(server: HttpServer, origins: string[]) {
  console.log("Creating socket server with origins:", origins);

  const io = new Server(server, {
    cors: {
      origin: origins.length ? origins : ["http://localhost:3000", "http://localhost:3001"],
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ["websocket", "polling"] // Allow both transports
  });

  console.log("Socket server created successfully with transports: websocket, polling");

  // Store io instance globally for access in routes
  (global as any).io = io;

  // Log connection attempts
  io.on("connection", (socket) => {
    console.log("Main socket connected:", socket.id, "from:", socket.handshake.address);
  });

  // Admin chat namespace (JWT required)
  const adminNs = io.of('/admin-chat');
  console.log("Admin namespace created");

  adminNs.use((socket, next) => {
    console.log("Admin namespace middleware called for socket:", socket.id);
    const token = safeTrim((socket.handshake as any)?.auth?.token, 2000);
    if (!token) {
      console.log("Admin socket rejected - no token");
      return next(new Error("Unauthorized"));
    }
    try {
      const payload = verifyAccessToken(token);
      (socket.data as any).user = payload;
      console.log("Admin socket authenticated successfully:", socket.id);
      return next();
    } catch (err) {
      console.log("Admin socket authentication failed:", err);
      return next(new Error("Unauthorized"));
    }
  });

  // Public chat namespace (unauthenticated)
  io.on("connection", (socket) => {
    // No conversation until user sends first message
    socket.on("chat:init", async (payload: any) => {
      const visitorId = safeTrim(payload?.visitorId, 80);
      if (!visitorId || visitorId.length < 10) {
        socket.emit("chat:error", { error: "Invalid visitorId" });
        return;
      }
      socket.data.visitorId = visitorId;

      const name = safeTrim(payload?.name, 200) || null;
      const phone = safeTrim(payload?.phone, 32) || null;
      const page = safeTrim(payload?.page, 300) || null;

      // Restore existing conversation (and its history) for this visitor, regardless of status.
      const conversation = await ChatConversation.findOne({ where: { visitorId } });
      if (!conversation) {
        socket.emit("chat:ready", { conversation: null, messages: [] });
        return;
      }

      // Backfill profile fields if newly provided and not set yet; always refresh last-known page.
      const patch: any = {};
      if (name && !conversation.name) patch.name = name;
      if (phone && !conversation.phone) patch.phone = phone;
      if (page) patch.page = page;
      if (Object.keys(patch).length) await conversation.update(patch);

      socket.data.conversationId = conversation.id;
      socket.join(convRoom(conversation.id));

      const messages = await ChatMessage.findAll({
        where: { conversationId: conversation.id },
        order: [["createdAt", "ASC"]],
        limit: 200
      });
      socket.emit("chat:ready", {
        conversation: {
          id: conversation.id,
          visitorId: conversation.visitorId,
          name: conversation.name,
          phone: conversation.phone,
          email: conversation.email,
          status: conversation.status,
          createdAt: conversation.createdAt
        },
        messages: messages.map((m) => ({
          id: m.id,
          conversationId: m.conversationId,
          sender: m.sender,
          text: m.text,
          createdAt: m.createdAt
        }))
      });
    });

    socket.on("chat:send", async (payload: any) => {
      const conversationId = safeTrim(payload?.conversationId, 60);
      const visitorId = safeTrim(payload?.visitorId, 80) || (socket.data.visitorId as string);
      const text = safeTrim(payload?.text, 2000);
      const name = safeTrim(payload?.name, 200) || null;
      const phone = safeTrim(payload?.phone, 32) || null;
      const page = safeTrim(payload?.page, 300) || null;
      if (!text) return;

      let conversation: InstanceType<typeof ChatConversation> | null = null;
      let isNewConversation = false;
      let wasReopened = false;

      if (conversationId) {
        const bound = socket.data.conversationId;
        if (bound && bound !== conversationId) return;
        conversation = await ChatConversation.findByPk(conversationId);
        // Reopen the same thread if it was closed — we keep history and continue.
        if (conversation && conversation.status !== "OPEN") {
          await conversation.update({ status: "OPEN" } as any);
          wasReopened = true;
        }
      } else if (visitorId && visitorId.length >= 10) {
        const result = await sequelize.transaction(async (t) => {
          const existing = await ChatConversation.findOne({ where: { visitorId }, transaction: t });
          if (existing) {
            const reopened = existing.status !== "OPEN";
            const patch: any = {};
            if (reopened) patch.status = "OPEN";
            if (name && !existing.name) patch.name = name;
            if (phone && !existing.phone) patch.phone = phone;
            if (page) patch.page = page;
            if (Object.keys(patch).length) await existing.update(patch, { transaction: t });
            return { conversation: existing, isNew: false, reopened };
          }
          const created = await ChatConversation.create(
            {
              visitorId,
              name,
              phone,
              email: null,
              page,
              status: "OPEN",
              lastMessageAt: null
            } as any,
            { transaction: t }
          );
          return { conversation: created, isNew: true, reopened: false };
        });
        const r = result as { conversation: InstanceType<typeof ChatConversation>; isNew: boolean; reopened: boolean };
        conversation = r.conversation;
        isNewConversation = r.isNew;
        wasReopened = r.reopened;
      }

      if (!conversation || conversation.status !== "OPEN") return;

      const cid = conversation.id;
      const created = await sequelize.transaction(async (t) => {
        const msg = await ChatMessage.create(
          { conversationId: cid, sender: "USER", text } as any,
          { transaction: t }
        );
        await conversation!.update(
          {
            lastMessageAt: new Date(),
            unreadCount: (conversation!.unreadCount || 0) + 1
          } as any,
          { transaction: t }
        );
        return msg;
      });

      const dto = { id: created.id, conversationId: cid, sender: created.sender, text: created.text, createdAt: created.createdAt };

      socket.data.conversationId = cid;
      socket.join(convRoom(cid));

      const messages = await ChatMessage.findAll({
        where: { conversationId: cid },
        order: [["createdAt", "ASC"]],
        limit: 200
      });
      socket.emit("chat:ready", {
        conversation: {
          id: conversation.id,
          visitorId: conversation.visitorId,
          name: conversation.name,
          phone: conversation.phone,
          email: conversation.email,
          status: conversation.status,
          createdAt: conversation.createdAt
        },
        messages: messages.map((m) => ({
          id: m.id,
          conversationId: m.conversationId,
          sender: m.sender,
          text: m.text,
          createdAt: m.createdAt
        }))
      });

      if (isNewConversation) {
        adminNs.emit("admin:conversation_new", {
          id: conversation.id,
          visitorId: conversation.visitorId,
          name: conversation.name,
          phone: conversation.phone,
          email: conversation.email,
          page: conversation.page,
          status: conversation.status,
          lastMessageAt: conversation.lastMessageAt,
          unreadCount: conversation.unreadCount,
          createdAt: conversation.createdAt,
          lastMessage: { id: created.id, sender: "USER", text: created.text, createdAt: created.createdAt }
        });
      } else if (wasReopened) {
        // Thread continued after being closed: tell admins it's open again, and the user widget.
        adminNs.emit("admin:conversation_update", { id: conversation.id, status: "OPEN" });
        io.to(convRoom(conversation.id)).emit("chat:status", { conversationId: conversation.id, status: "OPEN" });
        adminNs.to(convRoom(conversation.id)).emit("chat:status", { conversationId: conversation.id, status: "OPEN" });
      }

      io.to(convRoom(cid)).emit("chat:message", dto);
      adminNs.to(convRoom(cid)).emit("chat:message", dto);
      adminNs.emit("admin:new_message", {
        conversationId: cid,
        message: dto,
        unreadCount: conversation.unreadCount
      });
    });
  });

  adminNs.on("connection", (socket: Socket) => {
    console.log("Admin socket connected:", socket.id);

    socket.on("admin:list", async () => {
      console.log("Admin list requested");
      const conversations = await ChatConversation.findAll({
        order: [["lastMessageAt", "DESC"], ["updatedAt", "DESC"]],
        limit: 100
      });
      const ids = conversations.map((c) => c.id);
      const lastMsgs = ids.length
        ? await ChatMessage.findAll({
          where: { conversationId: ids as any },
          order: [["createdAt", "DESC"]],
          limit: 500
        })
        : [];
      const lastByConv = new Map<string, ChatMessage>();
      for (const m of lastMsgs) {
        if (!lastByConv.has(m.conversationId)) lastByConv.set(m.conversationId, m);
      }

      socket.emit(
        "admin:list",
        conversations.map((c) => {
          const last = lastByConv.get(c.id);
          return {
            id: c.id,
            visitorId: c.visitorId,
            name: c.name,
            phone: c.phone,
            email: c.email,
            status: c.status,
            unreadCount: c.unreadCount,
            lastMessageAt: c.lastMessageAt,
            createdAt: c.createdAt,
            lastMessage: last
              ? { sender: last.sender, text: last.text, createdAt: last.createdAt, id: last.id }
              : null
          };
        })
      );
    });

    socket.on("admin:join", async (payload: any) => {
      const conversationId = safeTrim(payload?.conversationId, 60);
      if (!conversationId) return;
      socket.join(convRoom(conversationId));

      const conv = await ChatConversation.findByPk(conversationId);
      if (conv && conv.unreadCount > 0) {
        await conv.update({ unreadCount: 0 } as any);
        adminNs.emit("admin:conversation_update", { id: conv.id, unreadCount: 0 });
      }

      const messages = await ChatMessage.findAll({ where: { conversationId }, order: [["createdAt", "ASC"]], limit: 500 });
      socket.emit(
        "admin:messages",
        messages.map((m) => ({ id: m.id, conversationId: m.conversationId, sender: m.sender, text: m.text, createdAt: m.createdAt }))
      );
    });

    socket.on("admin:send", async (payload: any) => {
      const conversationId = safeTrim(payload?.conversationId, 60);
      const text = safeTrim(payload?.text, 2000);
      if (!conversationId || !text) return;
      const conversation = await ChatConversation.findByPk(conversationId);
      if (!conversation || conversation.status !== "OPEN") return;

      const created = await sequelize.transaction(async (t) => {
        const msg = await ChatMessage.create(
          {
            conversationId,
            sender: "ADMIN",
            text
          } as any,
          { transaction: t }
        );
        await conversation.update({ lastMessageAt: new Date(), unreadCount: 0 } as any, { transaction: t });
        return msg;
      });

      const dto = { id: created.id, conversationId, sender: created.sender, text: created.text, createdAt: created.createdAt };
      // Send to user (public namespace) first so widget shows it
      io.to(convRoom(conversationId)).emit("chat:message", dto);
      // Send to admin panel (so admin sees own message and list updates)
      adminNs.to(convRoom(conversationId)).emit("chat:message", dto);
      adminNs.emit("admin:new_message", { conversationId, message: dto, unreadCount: 0 });
    });

    socket.on("admin:set_status", async (payload: any) => {
      const conversationId = safeTrim(payload?.conversationId, 60);
      const status = safeTrim(payload?.status, 20).toUpperCase();
      if (!conversationId) return;
      const conv = await ChatConversation.findByPk(conversationId);
      if (!conv) return;

      // History is preserved: closing only flags the conversation. The client can write
      // again later and the same thread reopens (see chat:send). Use "Очистить" / admin:reset
      // for explicit deletion.
      const nextStatus = status === "CLOSED" ? "CLOSED" : "OPEN";
      await conv.update({ status: nextStatus } as any);

      adminNs.emit("admin:conversation_update", { id: conv.id, status: conv.status, unreadCount: conv.unreadCount });
      io.to(convRoom(conv.id)).emit("chat:status", { conversationId: conv.id, status: conv.status });
      adminNs.to(convRoom(conv.id)).emit("chat:status", { conversationId: conv.id, status: conv.status });
    });

    // Service request notifications
    socket.on("admin:listen_service_requests", () => {
      socket.join("admin_service_requests");
    });

    socket.on("admin:reset", async (payload: any) => {
      const conversationId = safeTrim(payload?.conversationId, 60);
      if (!conversationId) return;

      const conv = await ChatConversation.findByPk(conversationId);
      if (!conv) return;

      const convId = conv.id;
      await sequelize.transaction(async (t) => {
        await ChatMessage.destroy({ where: { conversationId }, transaction: t });
        await conv.destroy({ transaction: t });
      });

      // Admin UIs: remove from list
      adminNs.emit("admin:conversation_reset", { id: convId });

      // Tell connected user widget(s) to clear local state
      io.to(convRoom(conversationId)).emit("chat:ready", { conversation: null, messages: [] });
    });
  });

  return io;
}

