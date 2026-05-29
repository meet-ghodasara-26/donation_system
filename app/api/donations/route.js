import { NextResponse } from 'next/server';
import { getAllDonations, createDonation } from '../../../lib/db';

// ─── Gujarati detection ──────────────────────────────────────────────────────
// Gujarati Unicode block: U+0A80–U+0AFF
function isGujarati(text) {
  if (!text) return false;
  return /[\u0A80-\u0AFF]/.test(text);
}

// ─── Translation via Claude API ──────────────────────────────────────────────
/**
 * Translate name, city, message to Gujarati.
 * Skips the API call if every non-empty field is already in Gujarati.
 * Falls back to originals on any error — donation is never lost.
 */
async function translateToGujarati({ name, city, message }) {
  const fieldsToCheck = [name, city, message].filter(Boolean);
  const allGujarati =
    fieldsToCheck.length > 0 && fieldsToCheck.every(isGujarati);

  if (allGujarati) {
    return { nameGu: name, cityGu: city, messageGu: message };
  }

  try {
    const prompt = `Translate these fields to Gujarati script. Return ONLY a JSON object, no markdown, no explanation.

name: "${name}"
city: "${city}"
message: "${message || ''}"

Rules:
- If a field is already in Gujarati script, return it unchanged.
- Transliterate proper nouns (names, cities) phonetically into Gujarati script.
- Translate the message naturally into Gujarati.
- If message is empty, return empty string for "message".
- Return only: {"name":"...","city":"...","message":"..."}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) throw new Error(`Claude API ${response.status}`);

    const data = await response.json();
    const raw = data?.content?.[0]?.text?.trim() || '';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      nameGu:    parsed.name    || name,
      cityGu:    parsed.city    || city,
      messageGu: parsed.message || message,
    };
  } catch (err) {
    console.error('translateToGujarati failed, using originals:', err.message);
    return { nameGu: name, cityGu: city, messageGu: message };
  }
}

// ─── GET /api/donations ──────────────────────────────────────────────────────
export async function GET() {
  try {
    const donations = getAllDonations();
    return NextResponse.json({ success: true, data: donations });
  } catch (error) {
    console.error('GET /api/donations error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}

// ─── POST /api/donations ─────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.amount || !body.city) {
      return NextResponse.json(
        { success: false, message: 'Name, amount, and city are required' },
        { status: 400 }
      );
    }

    const amount = parseFloat(body.amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    const name    = body.name.trim();
    const city    = body.city.trim();
    const message = body.message ? body.message.trim() : '';

    // Translate to Gujarati (falls back gracefully on failure)
    const { nameGu, cityGu, messageGu } = await translateToGujarati({
      name, city, message,
    });

    // Persist to SQLite via the db layer
    const newDonation = createDonation({
      name,
      nameGu,
      city,
      cityGu,
      message,
      messageGu,
      amount,
      date:         new Date().toISOString(),
      profileImage: body.profileImage || null,
    });

    return NextResponse.json({
      success: true,
      message: 'Donation saved successfully',
      data:    newDonation,
    });
  } catch (error) {
    console.error('POST /api/donations error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
