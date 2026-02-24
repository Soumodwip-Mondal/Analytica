/**
 * @param {Object} err - The error object from axios/fetch
 * @param {string} fallback - Fallback message if extraction fails
 * @returns {string} - Extracted error message
 */
export const extractErrorMessage = (err, fallback = 'An unexpected error occurred') => {
    const detail = err.response?.data?.detail

    if (Array.isArray(detail)) {
        // Handle FastAPI validation error arrays (e.g., [{msg: '...', ...}])
        return detail.map(d => d.msg || d).join(', ')
    }

    if (typeof detail === 'string') {
        return detail
    }

    return err.response?.data?.message || err.message || fallback
}
