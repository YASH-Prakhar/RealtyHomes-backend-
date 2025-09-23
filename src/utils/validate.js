// Validation utility functions
exports.validateRegistration = (data) => {
  if (!data.name || !data.email || !data.password) {
    return { error: "Name, Email, and Password are required." };
  }
  if (data.role === "broker" && (!data.agency_name || !data.license_number)) {
    return {
      error: "Agency Name and License Number are required for brokers.",
    };
  }
  return { error: null };
};