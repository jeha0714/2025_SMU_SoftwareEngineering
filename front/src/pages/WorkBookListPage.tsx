import React, { useEffect, useState } from 'react';
import axios from 'axios';

type WorkBook = {
  id: number;
  title: string;
  description: string;
  category: string;
  creatorName: string;
};

type WorkbookListProps = {
  wrong?: boolean;
};

const WorkbookList: React.FC<WorkbookListProps> = ({ wrong = false }) => {
  const [workbooks, setWorkbooks] = useState<WorkBook[]>([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("accessToken");


  useEffect(() => {
    const url = wrong
        ? 'http://localhost:8080/api/workbook?type=wrong'
        : 'http://localhost:8080/api/workbook';

    axios
      .get(url,{
          headers: {
          Authorization: `Bearer ${token}`
        }
      }
      )
      .then((response) => {
        console.log(response.data);
        setWorkbooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('단어장 목록을 불러오는 중 오류 발생:', error);
        setLoading(false);
      });
  }, [wrong]);

  if (loading) return <div className="p-4 text-gray-600">불러오는 중...</div>;

  return (
    <div className="p-6 overflow-x-auto">
      <div className="flex flex-nowrap gap-4">
        {workbooks.map((workbook) => (
          <div
            key={workbook.id}
            className="min-w-[300px] flex-shrink-0 border rounded-xl shadow p-4 bg-white hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold text-blue-700 mb-2">{workbook.title}</h2>
            <p className="text-gray-700 mb-1">{workbook.description}</p>
            <p className="text-sm text-gray-500">카테고리: {workbook.category}</p>
            <p className="text-sm text-gray-500">작성자: {workbook.creatorName}</p>
            <button
              className="mt-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => {
                const url = wrong
                  ? `http://localhost:5173/wrongworkbooks/${workbook.id}`
                  : `/workbooks/${workbook.id}`;
                window.location.href = url;
              }}
            >
              자세히 보기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkbookList;
