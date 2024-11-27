const getTrackingService = async (
  serviceNumber: string,
  serviceCode: string
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/portal/tracking?service_number=${serviceNumber}&service_code=${serviceCode}`
    );
    const res = await response.json();
    return res;
  } catch (error) {
    throw error;
  }
};

export default { getTrackingService };
