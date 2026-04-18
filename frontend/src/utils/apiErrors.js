export function getErrorMessage(err, fallback) {
  const detail = err.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail[0]?.msg || fallback;
  }

  if (typeof detail === "object" && detail?.message) {
    return detail.message;
  }

  return detail || fallback;
}

export function isFeatureLockedError(err) {
  const detail = err.response?.data?.detail;
  return err.response?.status === 402 && !!detail;
}
