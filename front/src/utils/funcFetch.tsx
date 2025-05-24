import { vocaServerNeedAuth } from "./axiosInfo";

export const fetchWorkBookList = async () => {
  const token = sessionStorage.getItem("accessToken");

  const res = await vocaServerNeedAuth.get("/api/workbook", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
