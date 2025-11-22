import re
import google.generativeai as genai
from django.conf import settings

try:
    API_KEY = getattr(settings, "GEMINI_API_KEY", None)
    if not API_KEY:
        raise ValueError("GEMINI_API_KEY is not set in Django settings.")
    genai.configure(api_key=API_KEY)
except (AttributeError, ValueError) as e:
    print(f"Error configuring Gemini API: {e}. Check your settings.py and .env file.")
    API_KEY = None

MODEL_NAME = "gemini-2.5-flash"

# 1) 그냥 욕설 (개인/상대방 상관없이 무조건 막고 싶은 단어)
HARD_BAN_KEYWORDS = [
    "좆병신",
    "병신",
    "씨발",
    "시발",
    "씹새끼",
    "개새끼",
    # 필요하면 추가
]

# 2) "집단 + 폭력" 패턴용 키워드들
GROUP_KEYWORDS = [
    "한남",
    "남자",
    "여자",
    "페미",
    "흑인",
    "백인",
    "게이",
    "레즈",

]

VIOLENT_KEYWORDS = [
    "죽어",
    "죽어라",
    "죽여",
    "죽여라",
    "뒤져",
    "뒤져라",
    "없어져",
    "싹다죽어",
    "다죽어",
    # 필요 시 추가
]


def contains_hard_ban(text: str) -> bool:
    """
    1) 욕설 키워드 포함 여부
    2) 특정 집단 + 폭력 표현 여부 ("한남 죽어", "여자들 다 뒤져라" 등)
    """

    # 공백 제거한 버전 (한남 죽어 / 한남   죽어 / 한남죽어 다 잡기 위해)
    normalized = re.sub(r"\s+", "", text).lower()

    # 1) 욕설 키워드
    for kw in HARD_BAN_KEYWORDS:
        if kw in normalized:
            return True

    # 2) 집단 + 폭력 조합
    has_group = any(g in normalized for g in GROUP_KEYWORDS)
    has_violence = any(v in normalized for v in VIOLENT_KEYWORDS)

    if has_group and has_violence:
        return True

    return False


def check_for_hate_speech(comment_text: str) -> bool:
    """
    True = 차단, False = 통과
    1단계: 로컬 contains_hard_ban() 에서 걸리면 무조건 차단
    2단계: 나머지는 Gemini에게 넘기되, 'FILTER'라고 명확히 말한 경우에만 차단
    """

    # 1단계: 로컬 하드 필터
    if contains_hard_ban(comment_text):
        print("[Filter] 금지어/집단+폭력 패턴 탐지 → FILTER 처리")
        return True

    # 2단계: Gemini 느슨 필터
    if not API_KEY:
        print("[Gemini] API_KEY 없음, 필터링 스킵 → SAFE 처리")
        return False

    system_instruction = (
    "You are a filtering system that detects only clear and explicit hate speech in user comments. "
    "Classify as 'SAFE' whenever possible, even if the comment contains mild profanity, jokes, sarcasm, or general negativity. "
    "However, if the comment contains: "
    "- explicit hate or severe derogatory expressions "
    "- OR violence, harm, or elimination directed at a protected group (e.g., men, women, racial groups, nationalities, sexual orientations, religions, disabilities) "
    "- OR violence/harm directed at a specific individual "
    "then you must classify it as 'FILTER'. "
    "This rule applies regardless of the language used. "
    "Your response must be exactly one word: either 'FILTER' or 'SAFE'."
)

    try:
        model = genai.GenerativeModel(
            model_name=MODEL_NAME,
            system_instruction=system_instruction,
        )

        response = model.generate_content(
            comment_text,
            generation_config={
                "temperature": 0.0,
                "max_output_tokens": 5,
            },
        )

        try:
            raw_text = (response.text or "").strip()
        except Exception as e:
            print(f"[Gemini] response.text 접근 실패: {e} → SAFE 처리")
            return False  # 실패 시 너무 빡세지 않게 통과

        if not raw_text:
            print("[Gemini] 빈 응답 → SAFE 처리")
            return False

        result = raw_text.upper().strip()
        print(f"[Gemini] 입력: {comment_text}")
        print(f"[Gemini] 응답(raw): {repr(raw_text)} → 파싱: {result}")

        if result == "FILTER":
            return True
        if result == "SAFE":
            return False

        print("[Gemini] 예상 밖 응답 → SAFE 처리")
        return False

    except Exception as e:
        print(f"[Gemini] 호출 중 예외(비하 발언 체크): {e}")
        return False
