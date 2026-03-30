"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function TakeTest() {
  const { data: session } = useSession();
  const params = useParams();
  const testId = params.testId || params.id;
  const router = useRouter();

  const [test, setTest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [step, setStep] = useState("config");

  // SOZLAMALAR
  const [questionCount, setQuestionCount] = useState(10);
  const [timerMinutes, setTimerMinutes] = useState(0);

  // ISHLASH JARAYONI
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [lockedQuestions, setLockedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);

  // MODALLAR VA REYTING UCHUN STATELAR
  const [showExitModal, setShowExitModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [resultData, setResultData] = useState(null);
  
  // YANGI: REYTING STATELARI
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  useEffect(() => {
    if (!testId) {
      setError("Test ID si topilmadi!");
      setIsLoading(false);
      return;
    }

    const fetchTest = async () => {
      try {
        const res = await fetch(`/api/tests?id=${testId}`);
        const data = await res.json();

        if (res.ok && data.test) {
          setTest(data.test);
          setQuestionCount(data.test.questions.length);
        } else {
          setError(data.message || "Xatolik yuz berdi");
        }
      } catch (err) {
        setError("Server bilan ulanishda xato");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (step === "test" && timeLeft !== null && timeLeft > 0 && !resultData) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (step === "test" && timeLeft === 0 && !resultData) {
      handleCalculateResult(true); 
    }
  }, [timeLeft, step, resultData]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleStartTest = () => {
    let count = parseInt(questionCount);
    if (isNaN(count) || count <= 0) count = 1;
    if (count > test.questions.length) count = test.questions.length;

    const shuffled = shuffleArray(test.questions);
    setActiveQuestions(shuffled.slice(0, count));

    let mins = parseInt(timerMinutes);
    if (!isNaN(mins) && mins > 0) setTimeLeft(mins * 60);
    else setTimeLeft(null);

    setStep("test");
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setLockedQuestions({});
    setStartTime(Date.now());
  };

  // REYTINGNI YUKLASH FUNKSIYASI
  const fetchLeaderboard = async () => {
    setShowLeaderboard(true);
    setIsLoadingLeaderboard(true);
    try {
      const res = await fetch(`/api/leaderboard?testId=${testId}`);
      const data = await res.json();
      if (res.ok) setLeaderboardData(data.leaderboard || []);
    } catch (error) {
      console.log("Reytingni yuklashda xato");
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  const handleSelectOption = (option) => {
    if (lockedQuestions[currentQuestionIndex]) return; 
    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: option });
  };

  const lockCurrentQuestionIfNeeded = () => {
    if (selectedAnswers[currentQuestionIndex] && !lockedQuestions[currentQuestionIndex]) {
      setLockedQuestions(prev => ({ ...prev, [currentQuestionIndex]: true }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      lockCurrentQuestionIfNeeded();
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      lockCurrentQuestionIfNeeded();
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleJumpToQuestion = (idx) => {
    if (currentQuestionIndex !== idx) {
      lockCurrentQuestionIfNeeded();
      setCurrentQuestionIndex(idx);
    }
  };

  const handleCalculateResult = async (isTimeOut = false) => {
    setShowFinishModal(false); 
    
    let correctCount = 0;
    activeQuestions.forEach((q, index) => {
      const userAns = (selectedAnswers[index] || "").toLowerCase().trim();
      const rightAns = (q.answer || "").toLowerCase().trim();
      if (userAns && userAns === rightAns) correctCount++;
    });

    const total = activeQuestions.length;
    const unanswered = total - Object.keys(selectedAnswers).length;
    const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);

    setResultData({
      correctCount,
      total,
      unanswered,
      isTimeOut,
      timeSpent: timeSpentSeconds
    });

    if (session) {
      try {
        await fetch("/api/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            testId: testId,
            testTitle: test.title,
            totalQuestions: total,
            correctAnswers: correctCount,
            timeSpent: timeSpentSeconds
          })
        });
      } catch (error) {
        console.log("Saqlashda xato", error);
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-14 h-14 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-gray-400 text-lg">Test tayyorlanmoqda...</p>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
        <div className="text-7xl mb-6">🚫</div>
        <h1 className="text-3xl font-black text-red-600 mb-2">{error || "Test topilmadi"}</h1>
        <p className="text-gray-500 mb-8 max-w-md">Iltimos, bosh sahifaga qaytib boshqa testlarni ko'ring.</p>
        <Link href="/">
          <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95">Bosh sahifaga qaytish</button>
        </Link>
      </div>
    );
  }

  if (step === "config") {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-8 mt-10">
        <div className="bg-white p-8 sm:p-10 rounded-[2rem] border border-gray-100 shadow-xl animate-pop text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-blue-400 opacity-10"></div>
          
          <div className="flex justify-between items-start relative z-10 mb-2">
            <span className="text-5xl sm:text-6xl">⚙️</span>
            {/* YANGI: REYTING TUGMASI */}
            <button 
              onClick={fetchLeaderboard}
              className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-4 py-2 rounded-xl font-black text-sm transition-colors flex items-center gap-2 shadow-sm"
            >
              🏆 Top 10 Reyting
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2 mb-2 relative z-10">{test.title}</h1>
          <p className="text-gray-500 font-medium mb-10 relative z-10">Bazada jami: <span className="font-bold text-blue-600">{test.questions.length} ta savol</span></p>

          <div className="space-y-6 text-left max-w-sm mx-auto">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Qancha ishlaysiz? (Random)</label>
              <input 
                type="number" 
                min="1" 
                max={test.questions.length}
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-bold text-lg text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Vaqt (Minut, 0 = vaqtsiz)</label>
              <input 
                type="number" 
                min="0"
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-bold text-lg text-gray-800"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-12 relative z-10">
            <Link href="/" className="w-full sm:flex-1"><button className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Orqaga qaytish</button></Link>
            <button onClick={handleStartTest} className="w-full sm:flex-1 py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95">Testni Boshlash 🚀</button>
          </div>
        </div>

        {/* ================================================= */}
        {/* LEADERBOARD (REYTING) MODALI */}
        {/* ================================================= */}
        {showLeaderboard && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay">
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-pop relative max-h-[90vh] flex flex-col">
              
              <button 
                onClick={() => setShowLeaderboard(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold transition-colors"
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <span className="text-5xl block mb-2">🏆</span>
                <h3 className="text-2xl font-black text-gray-900">Kuchlilar reytingi</h3>
                <p className="text-gray-500 font-medium text-sm">Ushbu testdagi eng yaxshi 10 ta natija</p>
              </div>

              <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 mb-4">
                {isLoadingLeaderboard ? (
                  <div className="py-10 text-center text-gray-500 font-bold flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-yellow-500 rounded-full animate-spin mb-3"></div>
                    Yuklanmoqda...
                  </div>
                ) : leaderboardData.length > 0 ? (
                  <div className="space-y-3">
                    {leaderboardData.map((userResult, index) => (
                      <div key={userResult._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0
                            ${index === 0 ? "bg-yellow-100 text-yellow-600" : index === 1 ? "bg-gray-200 text-gray-600" : index === 2 ? "bg-orange-100 text-orange-600" : "bg-blue-50 text-blue-600"}
                          `}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 truncate max-w-[120px] sm:max-w-[180px]">
                              {userResult.userId?.name || "Noma'lum qahramon"}
                            </p>
                            <p className="text-xs text-gray-400 font-medium">⏱️ {formatTime(userResult.timeSpent)} sarfladi</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-green-600 text-lg">{userResult.correctAnswers}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">To'g'ri</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <span className="text-4xl block mb-2">📭</span>
                    <p className="text-gray-500 font-bold">Hali natijalar yo'q!</p>
                    <p className="text-sm text-gray-400">Birinchi bo'lib reytingga kiring.</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setShowLeaderboard(false)} 
                className="w-full py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-colors shadow-lg active:scale-95"
              >
                Yopish
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const isLocked = !!lockedQuestions[currentQuestionIndex];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 mt-4 mb-20 relative">
      
      <div className="sticky top-[80px] z-30 bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">{test.title}</h1>
          <p className="text-sm font-bold text-gray-400 mt-1">{activeQuestions.length} ta savol | {Object.keys(selectedAnswers).length} tasi yechildi</p>
        </div>
        
        <div className="flex items-center gap-4">
          {timeLeft !== null && (
            <div className={`px-4 py-2 rounded-xl font-black text-lg sm:text-xl tracking-wider shadow-inner flex items-center gap-2 ${timeLeft < 60 ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-900 text-white"}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          )}
          <button onClick={() => setShowExitModal(true)} className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors" title="Chiqib ketish">✕</button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        <div className="w-full lg:w-1/3 xl:w-1/4">
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-[180px]">
            <h3 className="font-bold text-gray-800 mb-4 text-center text-sm sm:text-base">Navigatsiya</h3>
            
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              {activeQuestions.map((_, idx) => {
                const answered = !!selectedAnswers[idx];
                const isCurrent = currentQuestionIndex === idx;
                
                return (
                  <button 
                    key={idx}
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all
                      ${answered ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                      ${isCurrent ? 'ring-2 ring-offset-2 ring-blue-500 scale-105' : ''}
                    `}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3 xl:w-3/4 flex flex-col gap-6">
          <div className="bg-white p-6 sm:p-10 rounded-[2rem] border border-gray-100 shadow-sm animate-pop">
            <div className="flex gap-4 mb-8">
              <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black shrink-0 shadow-md text-lg">
                {currentQuestionIndex + 1}
              </span>
              <p className="text-xl sm:text-2xl font-bold text-gray-800 leading-snug pt-1">{currentQuestion.text}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((opt, optIndex) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === opt;
                
                return (
                  <button 
                    key={optIndex} 
                    onClick={() => handleSelectOption(opt)}
                    disabled={isLocked}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all font-bold flex items-start gap-4 group 
                      ${isSelected ? "border-blue-600 bg-blue-50 text-blue-700 shadow-inner" : ""}
                      ${!isLocked && !isSelected ? "border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-600" : ""}
                      ${isLocked && !isSelected ? "border-gray-50 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60" : ""}
                      ${isLocked && isSelected ? "cursor-not-allowed opacity-90" : ""}
                    `}
                  >
                    <span className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-[10px] sm:text-xs transition-colors shrink-0 mt-0.5
                      ${isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-gray-200"}
                      ${!isLocked ? "group-hover:border-blue-300" : ""}
                    `}>
                      {String.fromCharCode(65 + optIndex)}
                    </span>
                    <span className="text-base sm:text-lg">{opt}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="flex justify-between items-center mt-10 border-t border-gray-100 pt-6">
              <button 
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                &larr; Oldingi
              </button>
              
              <button 
                onClick={handleNext}
                disabled={currentQuestionIndex === activeQuestions.length - 1}
                className="px-6 py-3 font-bold text-white bg-gray-800 rounded-xl hover:bg-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Keyingi &rarr;
              </button>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-bold text-gray-500 text-sm sm:text-base text-center sm:text-left">
              Hamma savollarni ko'rib chiqdingizmi? Yechilmaganlari xato hisoblanadi.
            </p>
            <button 
              onClick={() => setShowFinishModal(true)}
              className="w-full sm:w-auto px-8 py-4 bg-green-600 text-white font-black rounded-xl hover:bg-green-700 transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              Testni Yakunlash ✅
            </button>
          </div>
        </div>

      </div>

      {showExitModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-pop">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🚪</span>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">Chiqib ketish</h3>
            <p className="text-gray-600 mb-8 font-medium">Testni to'xtatmoqchimisiz? Natijalar saqlanmaydi va test bekor qilinadi.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowExitModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Yo'q, qolish</button>
              <button onClick={() => router.push("/")} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors">Ha, chiqish</button>
            </div>
          </div>
        </div>
      )}

      {showFinishModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-overlay">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-pop">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">Yakunlaysizmi?</h3>
            <p className="text-gray-600 mb-8 font-medium">
              Siz {activeQuestions.length} ta savoldan {Object.keys(selectedAnswers).length} tasiga javob berdingiz.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowFinishModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Orqaga</button>
              <button onClick={() => handleCalculateResult(false)} className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-md">Yakunlash</button>
            </div>
          </div>
        </div>
      )}

      {resultData && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-md animate-overlay">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl text-center animate-pop border border-gray-100">
            {resultData.isTimeOut && (
              <div className="bg-red-50 text-red-600 py-2 px-4 rounded-xl font-bold mb-6 text-sm flex justify-center items-center gap-2">
                ⏱️ Vaqt tugadi!
              </div>
            )}
            
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">✅</span>
            </div>
            
            <h2 className="text-3xl font-black text-gray-900 mb-2">Ajoyib natija!</h2>
            <p className="text-gray-500 font-medium mb-8">Natijangiz tarixga saqlandi.</p>
            
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-600">Jami savollar:</span>
                <span className="font-black text-gray-900 text-lg">{resultData.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-600">To'g'ri javoblar:</span>
                <span className="font-black text-green-600 text-lg">{resultData.correctCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-500">Sarflangan vaqt:</span>
                <span className="font-black text-blue-500 text-lg">{formatTime(resultData.timeSpent)}</span>
              </div>
            </div>

            <button onClick={() => router.push("/history")} className="w-full py-5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 text-lg">
              Tarixni ko'rish 📊
            </button>
          </div>
        </div>
      )}
    </div>
  );
}