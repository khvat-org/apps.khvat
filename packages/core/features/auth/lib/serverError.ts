export const commonAuthError = (status: number, code?: string): string | undefined => {
  switch (code) {
    case "region_unavailable":
      return "serverUnavailable";
    case "too_many_requests":
      return "tooManyRequests";
    case "email_taken_other_region":
      return "emailTakenOtherRegion";
  }
  if (status === 429) return "tooManyRequests";
  if (status >= 500) return "serverUnavailable";
  return undefined;
};
