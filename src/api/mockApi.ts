export const fetchLocations = () => {
  return new Promise<{ data: { locations: string[] } }>((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          locations: [
            "Perth",
            "Sydney",
            "Melbourne",
            "Brisbane",
            "Adelaide",
            "Darwin",
            "Hobart",
            "Canberra",
          ],
        },
      });
    }, 1000);
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const submitConsignment = async (data: any) => {
  return {
    data: {
      consignmentId: `CNS-${Date.now()}-${Math.floor(
        Math.random() * 9000 + 1000
      )}`,
      ...data,
    },
  };
};
