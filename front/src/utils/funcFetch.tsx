import { umcServerNeedAuth, umcServerNoAuth } from "./axiosInfo";

// get data which current log user's data
export const fecthUser = async () => {
  const { data } = await umcServerNeedAuth.get("/v1/users/me");

  return data;
};

export const fetchLpList = async (order: string) => {
  const { data } = await umcServerNoAuth.get("/v1/lps", {
    params: {
      order: order,
      limit: "100",
    },
  });

  return data;
};

export const fetchLpDetail = async (Lpid: string) => {
  const { data } = await umcServerNoAuth.get(`/v1/lps/${Lpid}`);

  return data;
};
