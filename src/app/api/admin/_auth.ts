import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export type AdminRole = 'viewer' | 'admin' | 'super_admin';

export type AdminSession = {
  user: {
    id: string;
    name: string;
    email: string;
    role: AdminRole;
  } | null;
  role: AdminRole;
  isSuper: boolean;
};

const roleOrder: Record<AdminRole, number> = {
  viewer: 1,
  admin: 2,
  super_admin: 3,
};

function unauthorized(message = 'Unauthorized') {
  return Response.json({ ok: false, error: message }, { status: 401 });
}

function forbidden(message = 'Insufficient permissions') {
  return Response.json({ ok: false, error: message }, { status: 403 });
}

export function hasRequiredRole(userRole: AdminRole, requiredRole: AdminRole) {
  return roleOrder[userRole] >= roleOrder[requiredRole];
}

export async function authorizeAdmin(
  request: Request,
  requiredRole: AdminRole = 'viewer'
): Promise<{ ok: true; session: AdminSession } | { ok: false; response: Response }> {
  const token = request.headers.get('x-admin-token')?.trim();

  if (!token) {
    return { ok: false, response: unauthorized('Missing admin token') };
  }

  const envToken = process.env.ADMIN_TOKEN;
  if (envToken && token === envToken) {
    const session: AdminSession = {
      user: null,
      role: 'super_admin',
      isSuper: true,
    };
    if (!hasRequiredRole(session.role, requiredRole)) {
      return { ok: false, response: forbidden() };
    }
    return { ok: true, session };
  }

  const adminUser = await prisma.adminUser.findFirst({
    where: { token, isActive: true },
  });

  if (!adminUser) {
    return { ok: false, response: unauthorized() };
  }

  const role = ['viewer', 'admin', 'super_admin'].includes(adminUser.role)
    ? (adminUser.role as AdminRole)
    : 'viewer';
  if (!hasRequiredRole(role, requiredRole)) {
    return { ok: false, response: forbidden() };
  }

  return {
    ok: true,
    session: {
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role,
      },
      role,
      isSuper: role === 'super_admin',
    },
  };
}

export function generateAdminToken() {
  return `adm_${crypto.randomBytes(18).toString('hex')}`;
}

export async function logActivity(options: {
  session: AdminSession;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Prisma.JsonObject;
}) {
  const { session, action, entityType, entityId, metadata } = options;
  const actorName = session.user?.name || 'Super Admin';
  const actorRole = session.role;
  const actorId = session.user?.id ?? null;

  await prisma.activityLog.create({
    data: {
      actorId,
      actorName,
      actorRole,
      action,
      entityType,
      entityId,
      metadata: metadata ?? undefined,
    },
  });
}
