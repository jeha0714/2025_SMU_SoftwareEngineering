import { vocaServerNeedAuth } from "./axiosInfo";

export const fetchWorkBookList = async () => {
  const token = sessionStorage.getItem("accessToken");

  const res = await vocaServerNeedAuth.get("/api/workbook", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchWorkBookMode = async (id: string | undefined) => {
  const token = sessionStorage.getItem("accessToken");

  const res = await vocaServerNeedAuth.get(`/api/workbook/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(res);
  return res.data;
};

export const createWorkbook = async (workbookData: {
  title: string;
  description: string;
  category: string;
}) => {
  const token = sessionStorage.getItem("accessToken");
  console.log(workbookData);
  const res = await vocaServerNeedAuth.post(
    "/api/workbook/create-gpt",
    workbookData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
