import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const MODEL = 'llama-3.1-8b-instant'

// ─── shared Groq call helper ─────────────────────────────────────────────────
async function callGroq({ system, user, maxTokens = 400, temperature = 0.2, json = true }) {
    const completion = await groq.chat.completions.create({
        model: MODEL,
        temperature,
        max_tokens: maxTokens,
        messages: [
            { role: 'system', content: system },
            { role: 'user', content: user }
        ]
    })

    const raw = completion.choices[0]?.message?.content ?? ''
    const cleaned = raw.replace(/```json|```/g, '').trim()

    if (!json) return cleaned

    try {
        return JSON.parse(cleaned)
    } catch {
        return null
    }
}

// ─── 1. Smart category + priority suggestion ─────────────────────────────────
export async function suggestCategoryAndPriority({ title, description }) {
    const fallback = { category: '', priority: 'Medium', confidence: 'low', reasoning: '' }

    try {
        const result = await callGroq({
            system: `You are a civic issue classifier. Classify civic complaints into categories and priority levels.
Always respond with valid JSON only — no markdown, no explanation.`,
            user: `Classify this civic issue and return JSON with exactly these fields:
{
  "category": one of ["Road", "Electricity", "Water", "Garbage", "Other"],
  "priority": one of ["Low", "Medium", "High", "Critical"],
  "confidence": one of ["high", "medium", "low"],
  "reasoning": "one sentence explaining the classification"
}

Title: ${title}
Description: ${description}`
        })

        if (!result?.category || !result?.priority) return fallback

        const validCategories = ['Road', 'Electricity', 'Water', 'Garbage', 'Other']
        const validPriorities = ['Low', 'Medium', 'High', 'Critical']

        return {
            category: validCategories.includes(result.category) ? result.category : '',
            priority: validPriorities.includes(result.priority) ? result.priority : 'Medium',
            confidence: result.confidence || 'low',
            reasoning: result.reasoning || ''
        }
    } catch (err) {
        console.error('AI category suggestion error:', err.message)
        return fallback
    }
}

// ─── 2. Duplicate detection ──────────────────────────────────────────────────
export async function detectDuplicates({ title, description, existingIssues }) {
    const fallback = { isDuplicate: false, similarIssues: [], confidence: 'low' }

    if (!existingIssues?.length) return fallback

    try {
        const issuesSummary = existingIssues
            .slice(0, 10) // only check the most recent 10 to keep prompt tight
            .map((i, idx) => `[${idx + 1}] ID:${i._id} | "${i.title}" | ${i.category} | ${i.status} | ${i.location}`)
            .join('\n')

        const result = await callGroq({
            system: `You are a civic issue deduplication assistant. Detect if a new issue is a duplicate of existing ones.
Respond with valid JSON only — no markdown, no explanation.`,
            user: `New issue:
Title: "${title}"
Description: "${description}"

Existing open issues:
${issuesSummary}

Return JSON with exactly these fields:
{
  "isDuplicate": true or false,
  "similarIssues": [array of index numbers (1-based) that are similar or duplicate, empty if none],
  "confidence": one of ["high", "medium", "low"],
  "reason": "one sentence explanation"
}`,
            maxTokens: 300
        })

        if (!result) return fallback

        // Map index back to actual issue IDs
        const similar = (result.similarIssues || [])
            .filter(idx => typeof idx === 'number' && idx >= 1 && idx <= existingIssues.length)
            .map(idx => ({
                _id: existingIssues[idx - 1]._id,
                title: existingIssues[idx - 1].title,
                status: existingIssues[idx - 1].status,
                location: existingIssues[idx - 1].location
            }))

        return {
            isDuplicate: !!result.isDuplicate && similar.length > 0,
            similarIssues: similar,
            confidence: result.confidence || 'low',
            reason: result.reason || ''
        }
    } catch (err) {
        console.error('AI duplicate detection error:', err.message)
        return fallback
    }
}

// ─── 3. Admin civic insight ──────────────────────────────────────────────────
export async function generateCivicInsight({ total, open, inProgress, resolved, closed, categoryBreakdown, avgResolutionDays }) {
    const fallback = 'Keep monitoring issue trends and prioritise long-standing open cases for faster community impact.'

    try {
        const categoryStr = Object.entries(categoryBreakdown || {})
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ')

        const result = await callGroq({
            system: `You are a civic data analyst giving an admin a brief, data-driven insight about their platform's performance.
Be specific, direct, and actionable. 2-3 sentences max. No bullet points. Plain text only.`,
            user: `Civic platform stats:
Total issues: ${total}
Open: ${open} | In Progress: ${inProgress} | Resolved: ${resolved} | Closed: ${closed}
Category breakdown: ${categoryStr || 'N/A'}
Average resolution time: ${avgResolutionDays ? avgResolutionDays + ' days' : 'N/A'}

Give one specific insight about the current state and one concrete action the admin should take.`,
            json: false,
            maxTokens: 120,
            temperature: 0.6
        })

        return result?.trim() || fallback
    } catch (err) {
        console.error('AI civic insight error:', err.message)
        return fallback
    }
}

// ─── 4. Admin response suggestion ───────────────────────────────────────────
export async function suggestAdminResponse({ issueTitle, issueCategory, issueLocation, newStatus }) {
    const fallback = `Thank you for your patience. We have updated the status of your reported issue to "${newStatus}". Our team is committed to resolving community concerns efficiently.`

    try {
        const result = await callGroq({
            system: `You are a professional civic authority writing public responses to citizen issue reports.
Write formal, empathetic, and action-oriented responses. Be concise — 2-3 sentences max. Plain text only.`,
            user: `Write a professional public response for this status update:

Issue: "${issueTitle}"
Category: ${issueCategory || 'General'}
Location: ${issueLocation || 'reported location'}
New Status: ${newStatus}

The response should acknowledge the citizen, explain what the status change means, and set expectations.`,
            json: false,
            maxTokens: 100,
            temperature: 0.5
        })

        return result?.trim() || fallback
    } catch (err) {
        console.error('AI response suggestion error:', err.message)
        return fallback
    }
}