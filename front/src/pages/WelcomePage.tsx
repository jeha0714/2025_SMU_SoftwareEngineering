import { BookOpen, Zap, Brain, Star, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 font-sans">
      {/* 히어로 섹션 */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              <span className="text-indigo-600">AI 기반</span> 맞춤형 영어
              단어장으로
              <br />
              학습 효율을 <span className="text-indigo-600">극대화</span>하세요
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Campus English는 최신 AI 기술로 대학생 여러분의 전공과 관심사에
              맞춘 개인화된 영어 단어장을 자동으로 생성합니다. 효율적인 학습
              경험을 지금 시작하세요.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
              >
                무료로 시작하기
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md">
                <div className="flex items-center mb-4">
                  <Brain className="h-8 w-8 text-indigo-600 mr-2" />
                  <h3 className="text-xl font-bold">AI 단어장 생성기</h3>
                </div>
                <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                  <p className="text-gray-800 mb-2">
                    전공: <span className="font-semibold">컴퓨터 과학</span>
                  </p>
                  <p className="text-gray-800 mb-2">
                    관심 분야:{" "}
                    <span className="font-semibold">인공지능, 웹 개발</span>
                  </p>
                  <p className="text-gray-800">
                    목표 레벨:{" "}
                    <span className="font-semibold">비즈니스 영어</span>
                  </p>
                </div>
                <div className="border rounded-lg p-4 bg-indigo-50">
                  <p className="font-semibold mb-2 text-indigo-700">
                    맞춤형 단어장이 생성되었습니다!
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded mr-2 text-sm">
                        algorithm
                      </span>
                      <span className="text-gray-700">알고리즘</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded mr-2 text-sm">
                        neural network
                      </span>
                      <span className="text-gray-700">신경망</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded mr-2 text-sm">
                        implementation
                      </span>
                      <span className="text-gray-700">구현</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded mr-2 text-sm">
                        scalability
                      </span>
                      <span className="text-gray-700">확장성</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 text-center">
                  <div className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg">
                    단어장 학습 시작하기
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-indigo-900 rounded-full px-3 py-1 font-bold text-sm transform rotate-12">
                AI 추천
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 주요 기능 섹션 */}
      <div id="features" className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              맞춤형 AI 영어 학습의 핵심 기능
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Campus English는 대학생 여러분의 학습 효율성을 극대화하기 위한
              다양한 AI 기반 기능을 제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-indigo-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Brain className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                AI 맞춤형 단어장
              </h3>
              <p className="text-gray-600">
                여러분의 전공, 관심사, 학습 목표에 맞는 단어장을 AI가 자동으로
                생성합니다. 필요한 어휘만 효율적으로 학습하세요.
              </p>
            </div>

            <div className="bg-indigo-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                스마트 학습 알고리즘
              </h3>
              <p className="text-gray-600">
                AI가 여러분의 학습 패턴을 분석하여 최적의 복습 타이밍을
                제안합니다. 망각 곡선을 이기는 효율적인 학습이 가능합니다.
              </p>
              <p className="mt-1 text-xs text-gray-400">(추후 업데이트 예정)</p>
            </div>

            <div className="bg-indigo-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                문맥 기반 학습
              </h3>
              <p className="text-gray-600">
                단순 암기가 아닌 실제 문장과 상황 속에서 단어를 학습합니다. AI가
                여러분의 분야에 맞는 예문을 제공합니다.
              </p>
              <p className="mt-1 text-xs text-gray-400">(추후 업데이트 예정)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 사용자 후기 섹션 */}
      <div id="testimonials" className="bg-indigo-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              대학생들의 생생한 후기
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Campus English와 함께 영어 실력을 향상시킨 대학생들의 이야기를
              들어보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-bold">JK</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">김**</h4>
                  <p className="text-gray-600">컴퓨터공학과 3학년</p>
                </div>
              </div>
              <p className="text-gray-700">
                "전공 영어 논문을 읽기 위해 시작했는데, AI가 추천해주는 단어들이
                정말 유용해요. 제 전공 분야에 꼭 필요한 단어들만 모아서 학습할
                수 있어서 시간이 절약되고 효율적입니다."
              </p>
              <div className="flex mt-4">
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-bold">SY</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">박**</h4>
                  <p className="text-gray-600">경영학과 4학년</p>
                </div>
              </div>
              <p className="text-gray-700">
                "취업 준비를 위해 비즈니스 영어를 공부하고 있었는데, Campus
                English의 맞춤형 단어장 덕분에 면접에서 자신있게 영어로 대답할
                수 있었어요. 취업에 큰 도움이 되었습니다!"
              </p>
              <div className="flex mt-4">
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA 섹션 */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            지금 바로 AI 맞춤형 영어 학습을 시작하세요
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            대학 생활과 미래 커리어에 필수적인 영어 실력, Campus English와 함께
            스마트하게 향상시키세요. 지금 가입하면 모든 기능을 무료로 사용할 수
            있습니다.
          </p>

          <div className="flex flex-col sm:flex-row justify-center max-w-lg mx-auto space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-3 bg-yellow-400 text-indigo-900 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              무료로 시작하기
            </button>
          </div>
          <p className="text-indigo-200 mt-4">
            이미 계정이 있으신가요?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-white underline cursor-pointer"
            >
              로그인하기
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
