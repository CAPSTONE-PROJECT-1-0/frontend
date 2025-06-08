/**
 * API functions for history-related operations
 */

import { request } from "http"

/**
 * Fetch user's food analysis history
 * @param {Function} authenticatedFetch - Authenticated fetch function from auth context
 * @param {Object} user - User object with id
 * @returns {Promise<Array>} - Array of history items
 */
export async function fetchAnalysisHistory(authenticatedFetch, user) {
  try {


    if (!user || !user.id) {
      console.warn("User or user ID not available:", user)
      return []
    }

    const response = await authenticatedFetch(
      `https://becapstone-npc01011309-tu16d9a1.leapcell.dev/upload-history/user/${user.id}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    // console.log({t: await response.text()})
    if (!response.ok) {
      if (response.status === 404) {
        // User belum memiliki history, return array kosong
        
        console.log("No history found for user")
        return []
      }

      const errorText = await response.text()
      console.error("API Error:", response.status, errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    // Berdasarkan controller backend, data ada di result.data
    if (result.status === "success" && result.data) {
      return Array.isArray(result.data) ? result.data : [result.data]
    }

    // Fallback jika format berbeda
    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error("Error fetching history:", error)

    // Jangan throw error, return empty array untuk UX yang lebih baik
    if (error.message.includes("User ID is required")) {
      console.warn("User ID is required for fetching history")
    }

    return []
  }
}

/**
 * Save analysis result to history
 * @param {Function} authenticatedFetch - Authenticated fetch function from auth context
 * @param {Object} user - User object
 * @param {Object} analysisData - Analysis result data
 * @returns {Promise<Object>} - Saved history item
 */
export async function saveAnalysisToHistory(authenticatedFetch, user, analysisData) {
  try {
    if (!user) {
      throw new Error("User is required")
    }

    const payload = {
      name: user.name,
      email: user.email,
      imageUrl: analysisData.imageUrl || null,
      analysisResult: JSON.stringify(analysisData.result),
      recommendation: JSON.stringify(analysisData.recommendations || []),
    }

    const response = await authenticatedFetch("https://becapstone-npc01011309-tu16d9a1.leapcell.dev/upload-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error("Error saving analysis to history:", error)
    throw error
  }
}

/**
 * Format history data for display
 * @param {Object} item - History item from API
 * @param {number} index - Index of the item
 * @returns {Object} - Formatted history item
 */
export function formatHistoryItem(item, index) {
  // Parse analysisResult jika berupa string JSON
  let analysisResult = null
  if (item.analysisResult) {
    try {
      analysisResult = typeof item.analysisResult === "string" ? JSON.parse(item.analysisResult) : item.analysisResult
    } catch (error) {
      console.warn("Failed to parse analysisResult:", error)
    }
  }

  return {
    id: item.id || `history-${index}`,
    name: analysisResult?.label || analysisResult?.food_name || item.food_name || `Makanan #${index + 1}`,
    imageUrl: item.imageUrl || item.image_url || item.image || null,
    status:
      analysisResult?.nutrition_status === "Seimbang" || analysisResult?.status === "healthy" ? "healthy" : "attention",
    confidence: analysisResult?.confidence ? Math.round(analysisResult.confidence * 100) : null,
    calories: analysisResult?.nutrition?.kalori || analysisResult?.calories || item.calories || null,
    date: item.createdAt || item.created_at || item.date || null,
    nutrition: {
      protein: analysisResult?.nutrition?.protein || analysisResult?.protein || item.protein || null,
      carbs: analysisResult?.nutrition?.karbohidrat || analysisResult?.carbs || item.carbs || null,
      fat: analysisResult?.nutrition?.lemak || analysisResult?.fat || item.fat || null,
    },
    rawData: item, // Keep original data for debugging
  }
}
