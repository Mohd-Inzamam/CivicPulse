const cache = new Map()

export async function geocodeLocation(locationText) {
    if (!locationText?.trim()) return null

    const key = locationText.trim().toLowerCase()
    if (cache.has(key)) return cache.get(key)

    try {
        const encoded = encodeURIComponent(locationText.trim())
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
            { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        if (data?.length > 0) {
            const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
            cache.set(key, coords)
            return coords
        }
    } catch {
        // silently fail
    }

    cache.set(key, null)
    return null
}

export function fallbackCoords(baseCoords, index) {
    const spread = 0.05
    const angle = (index * 137.5 * Math.PI) / 180
    return {
        lat: baseCoords.lat + Math.cos(angle) * spread * (0.5 + Math.random() * 0.5),
        lng: baseCoords.lng + Math.sin(angle) * spread * (0.5 + Math.random() * 0.5)
    }
}