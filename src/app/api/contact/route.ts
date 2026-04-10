import { prisma } from '../../lib/prisma';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    let { name, email, phone, program, message, source } = data || {};

    if (!message && source === 'cta') {
      message = 'Programme pack request (CTA)';
    }

    if (!name || !email || !message) {
      return Response.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        program,
        message,
        source: source || 'contact',
      },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Contact enquiry error:', error);
    return Response.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
  }
}
