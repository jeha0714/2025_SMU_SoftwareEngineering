import { useState, useEffect, useRef } from "react";
import { Edit3, Trash2, Plus, X, Save, AlertTriangle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWorkBookMode } from "../utils/funcFetch";
import { vocaServerNeedAuth } from "../utils/axiosInfo";
import { useToast } from "../context/ToastContext";

type Word = {
  wordId: number | null;
  content: string;
  meaning: string;
  partOfSpeech: string;
};

type WorkBook = {
  id: number;
  title: string;
  description: string;
  category: string;
  creatorName: string;
  wrong: boolean;
  wordList: Word[];
};

const ModifyWorkBook = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Fetch workbook data
  const { data: fetchedWorkbook, isLoading } = useQuery<WorkBook>({
    queryKey: ["workbook", id],
    queryFn: () => fetchWorkBookMode(id),
    enabled: !!id,
  });

  // 로컬 상태로 workbook 데이터 관리
  const [workbook, setWorkbook] = useState<WorkBook | null>(null);

  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showDescModal, setShowDescModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteWorkbookModal, setShowDeleteWorkbookModal] = useState(false);
  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [deleteWordIndex, setDeleteWordIndex] = useState<number | null>(null);
  const [addWordError, setAddWordError] = useState<string>("");

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editingWordIndex, setEditingWordIndex] = useState<number | null>(null);
  const [editingWord, setEditingWord] = useState<Word>({
    wordId: null,
    content: "",
    meaning: "",
    partOfSpeech: "noun",
  });

  // Refs for focusing each modal
  const titleModalRef = useRef<HTMLDivElement>(null);
  const descModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);
  const deleteWorkbookModalRef = useRef<HTMLDivElement>(null);
  const addWordModalRef = useRef<HTMLDivElement>(null);

  // fetchedWorkbook이 변경될 때마다 로컬 상태 업데이트
  useEffect(() => {
    if (fetchedWorkbook) {
      setWorkbook(fetchedWorkbook);
      setEditTitle(fetchedWorkbook.title);
      setEditDescription(fetchedWorkbook.description);
    }
  }, [fetchedWorkbook]);

  // Focus modals when they open
  useEffect(() => {
    if (showTitleModal && titleModalRef.current) {
      titleModalRef.current.focus();
    }
  }, [showTitleModal]);

  useEffect(() => {
    if (showDescModal && descModalRef.current) {
      descModalRef.current.focus();
    }
  }, [showDescModal]);

  useEffect(() => {
    if (showDeleteModal && deleteModalRef.current) {
      deleteModalRef.current.focus();
    }
  }, [showDeleteModal]);

  useEffect(() => {
    if (showDeleteWorkbookModal && deleteWorkbookModalRef.current) {
      deleteWorkbookModalRef.current.focus();
    }
  }, [showDeleteWorkbookModal]);

  useEffect(() => {
    if (showAddWordModal && addWordModalRef.current) {
      addWordModalRef.current.focus();
    }
  }, [showAddWordModal]);

  const handleTitleSave = () => {
    if (!workbook) return;

    // 로컬 상태 즉시 업데이트
    setWorkbook((prev) => (prev ? { ...prev, title: editTitle } : null));
    setShowTitleModal(false);

    // TODO: API 호출 구현
    // 실제 API 호출 시에는 여기서 서버에 업데이트 요청
  };

  const handleDescSave = () => {
    if (!workbook) return;

    // 로컬 상태 즉시 업데이트
    setWorkbook((prev) =>
      prev ? { ...prev, description: editDescription } : null
    );
    setShowDescModal(false);

    // TODO: API 호출 구현
    // 실제 API 호출 시에는 여기서 서버에 업데이트 요청
  };

  const handleWordEdit = (index: number) => {
    if (!workbook) return;
    setEditingWordIndex(index);
    setEditingWord(workbook.wordList[index]);
  };

  const handleWordSave = () => {
    if (!workbook || editingWordIndex === null) return;

    // 로컬 상태 즉시 업데이트
    const updatedWordList = [...workbook.wordList];
    updatedWordList[editingWordIndex] = editingWord;

    setWorkbook((prev) =>
      prev ? { ...prev, wordList: updatedWordList } : null
    );
    showToast("단어 수정에 성공하셨습니다!", "success");
    setEditingWordIndex(null);

    // TODO: API 호출 구현
    // 실제 API 호출 시에는 여기서 서버에 업데이트 요청
  };

  const handleWordDelete = (index: number) => {
    setDeleteWordIndex(index);
    setShowDeleteModal(true);
  };

  const confirmWordDelete = () => {
    if (!workbook || deleteWordIndex === null) return;

    // 로컬 상태에서 단어 삭제
    const updatedWordList = workbook.wordList.filter(
      (_, index) => index !== deleteWordIndex
    );
    setWorkbook((prev) =>
      prev ? { ...prev, wordList: updatedWordList } : null
    );

    setShowDeleteModal(false);
    setDeleteWordIndex(null);
    showToast("단어가 삭제되었습니다.", "success");

    // TODO: API 호출 구현
    // 실제 API 호출 시에는 여기서 서버에 삭제 요청
  };

  const handleAddWord = () => {
    if (!workbook) return;
    const newWord: Word = {
      wordId: null,
      content: "",
      meaning: "",
      partOfSpeech: "noun",
    };
    setEditingWord(newWord);
    setShowAddWordModal(true);
    setAddWordError("");
  };

  const handleAddWordSave = () => {
    if (!workbook) return;

    // 입력값 검증
    const wordContent = editingWord.content.trim();
    const wordMeaning = editingWord.meaning.trim();

    // 영어 소문자와 공백만 허용하는 정규식
    const englishAndSpaceRegex = /^[a-z\s]*$/;
    // 한글과 공백만 허용하는 정규식
    const koreanAndSpaceRegex = /^[가-힣\s]*$/;

    if (!wordContent || !wordMeaning) {
      setAddWordError("단어와 의미를 모두 입력해주세요.");
      return;
    }

    if (!englishAndSpaceRegex.test(wordContent)) {
      setAddWordError("단어는 영어 소문자와 공백만 입력 가능합니다.");
      return;
    }

    if (!koreanAndSpaceRegex.test(wordMeaning)) {
      setAddWordError("의미는 한글과 공백만 입력 가능합니다.");
      return;
    }

    if (wordContent === "" || wordMeaning === "") {
      setAddWordError("단어와 의미는 공백만으로 이루어질 수 없습니다.");
      return;
    }

    // 로컬 상태에 새 단어 추가
    const updatedWordList = [...workbook.wordList, editingWord];
    setWorkbook((prev) =>
      prev ? { ...prev, wordList: updatedWordList } : null
    );

    setShowAddWordModal(false);
    setEditingWord({
      wordId: null,
      content: "",
      meaning: "",
      partOfSpeech: "noun",
    });
    setAddWordError("");
    showToast("단어 추가에 성공했습니다.", "success");
  };

  const handleComplete = async () => {
    if (!workbook || !id) return;

    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await vocaServerNeedAuth.put(
        `/api/workbook/${id}`,
        {
          id: workbook.id,
          title: workbook.title,
          description: workbook.description,
          category: workbook.category,
          wordList: workbook.wordList.map((word) => ({
            wordId: word.wordId,
            content: word.content,
            meaning: word.meaning,
            partOfSpeech: word.partOfSpeech,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Invalidate and refetch the workbook data
        await queryClient.invalidateQueries({ queryKey: ["workbook", id] });
        await queryClient.invalidateQueries({ queryKey: ["workbooks"] });
        showToast("수정이 완료되었습니다.", "success");
        navigate(`/`);
      } else {
        showToast("본인이 만든 단어장만 수정 및 삭제할 수 있습니다.", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("본인이 만든 단어장만 수정 및 삭제할 수 있습니다.", "error");
    }
  };

  const handleDeleteWorkbook = async () => {
    if (!id) return;
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await vocaServerNeedAuth.delete(`/api/workbook/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        showToast("단어장 삭제가 완료되었습니다.", "success");
        await queryClient.invalidateQueries({ queryKey: ["workbooks"] });
        navigate("/");
      } else {
        showToast("본인이 만든 단어장만 수정 및 삭제할 수 있습니다.", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("본인이 만든 단어장만 수정 및 삭제할 수 있습니다.", "error");
    }
    setShowDeleteWorkbookModal(false);
  };

  if (isLoading || !workbook) {
    return (
      <div className="h-full bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto h-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 h-full flex flex-col">
          {/* Header */}
          <div className="flex-none">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              단어장 수정
            </h1>
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-700">
                  단어장 제목
                </span>
                <button
                  onClick={() => setShowTitleModal(true)}
                  className="text-purple-600 hover:bg-purple-100 p-2 rounded-lg transition-colors"
                >
                  <Edit3 size={16} />
                </button>
              </div>
              <p className="text-gray-600 font-medium">{workbook.title}</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-700">
                  단어장 설명
                </span>
                <button
                  onClick={() => setShowDescModal(true)}
                  className="text-purple-600 hover:bg-purple-100 p-2 rounded-lg transition-colors"
                >
                  <Edit3 size={16} />
                </button>
              </div>
              <p className="text-gray-600">{workbook.description}</p>
            </div>
          </div>

          {/* Word List */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">단어 목록</h2>
              <button
                onClick={handleAddWord}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={16} />
                단어 추가
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {workbook.wordList.map((word, index) => (
                <div
                  key={word.wordId || index}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4"
                >
                  {editingWordIndex === index ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={editingWord.content}
                          onChange={(e) =>
                            setEditingWord((prev) => ({
                              ...prev,
                              content: e.target.value,
                            }))
                          }
                          placeholder="단어"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={editingWord.meaning}
                          onChange={(e) =>
                            setEditingWord((prev) => ({
                              ...prev,
                              meaning: e.target.value,
                            }))
                          }
                          placeholder="의미"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <select
                          value={editingWord.partOfSpeech}
                          onChange={(e) =>
                            setEditingWord((prev) => ({
                              ...prev,
                              partOfSpeech: e.target.value,
                            }))
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="noun">명사</option>
                          <option value="verb">동사</option>
                          <option value="adjective">형용사</option>
                          <option value="adverb">부사</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleWordSave}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors"
                        >
                          <Save size={14} />
                          저장
                        </button>
                        <button
                          onClick={() => setEditingWordIndex(null)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors"
                        >
                          <X size={14} />
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {word.content}
                          </h3>
                          <p className="text-gray-600">{word.meaning}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                              {word.partOfSpeech}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleWordEdit(index)}
                              className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleWordDelete(index)}
                              className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex-none flex justify-between mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowDeleteWorkbookModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Trash2 size={16} />
              단어장 삭제
            </button>
            <button
              onClick={handleComplete}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              완료
            </button>
          </div>
        </div>
      </div>

      {/* Title Edit Modal */}
      {showTitleModal && (
        <div
          ref={titleModalRef}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleTitleSave();
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">제목 수정</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTitleSave();
              }}
            >
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
                placeholder="단어장 제목을 입력하세요"
              />
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowTitleModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Description Edit Modal */}
      {showDescModal && (
        <div
          ref={descModalRef}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleDescSave();
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">설명 수정</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDescSave();
              }}
            >
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4 h-24 resize-none"
                placeholder="단어장 설명을 입력하세요"
              />
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowDescModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Word Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          ref={deleteModalRef}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              confirmWordDelete();
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-500" size={24} />
              <h3 className="text-lg font-semibold">단어 삭제</h3>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                confirmWordDelete();
              }}
            >
              <p className="text-gray-600 mb-6">
                이 단어를 삭제하시겠습니까?
                <br />
                삭제된 단어는 복구할 수 없습니다.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  삭제
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Workbook Delete Confirmation Modal */}
      {showDeleteWorkbookModal && (
        <div
          ref={deleteWorkbookModalRef}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleDeleteWorkbook();
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-500" size={24} />
              <h3 className="text-lg font-semibold">단어장 삭제</h3>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDeleteWorkbook();
              }}
            >
              <p className="text-gray-600 mb-6">
                단어장을 완전히 삭제하시겠습니까?
                <br />
                삭제된 단어장은 복구할 수 없습니다.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteWorkbookModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  삭제
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Word Modal */}
      {showAddWordModal && (
        <div
          ref={addWordModalRef}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddWordSave();
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">단어 추가</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddWordSave();
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    단어
                  </label>
                  <input
                    type="text"
                    value={editingWord.content}
                    onChange={(e) =>
                      setEditingWord((prev) => ({
                        ...prev,
                        content: e.target.value.toLowerCase(),
                      }))
                    }
                    placeholder="영어 소문자로 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    의미
                  </label>
                  <input
                    type="text"
                    value={editingWord.meaning}
                    onChange={(e) =>
                      setEditingWord((prev) => ({
                        ...prev,
                        meaning: e.target.value,
                      }))
                    }
                    placeholder="한글로 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    품사
                  </label>
                  <select
                    value={editingWord.partOfSpeech}
                    onChange={(e) =>
                      setEditingWord((prev) => ({
                        ...prev,
                        partOfSpeech: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="noun">명사</option>
                    <option value="verb">동사</option>
                    <option value="adjective">형용사</option>
                    <option value="adverb">부사</option>
                  </select>
                </div>
                {addWordError && (
                  <div className="text-red-500 text-sm mt-2">
                    {addWordError}
                  </div>
                )}
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddWordModal(false);
                    setAddWordError("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifyWorkBook;
