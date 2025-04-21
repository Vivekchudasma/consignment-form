export const fetchLocations = async () => {
  return {
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
  };
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
