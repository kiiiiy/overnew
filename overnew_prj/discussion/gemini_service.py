import google.generativeai as genai
from django.conf import settings

# API 설정 (settings.py에서 GEMINI_API_KEY 변수를 설정했다고 가정)
try:
    API_KEY = getattr(settings, "GEMINI_API_KEY", None)
    if not API_KEY:
        raise ValueError("GEMINI_API_KEY is not set in Django settings.")
    genai.configure(api_key=API_KEY)
except (AttributeError, ValueError) as e:
    print(f"Error configuring Gemini API: {e}. Check your settings.py and .env file.")
    API_KEY = None

# 사용할 모델 정의
MODEL_NAME = "gemini-2.5-flash"


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


def check_for_hate_speech(comment_text: str) -> bool:
    """
    혐오 발언이면 True, 아니면 False
    API 오류나 안전 필터로 막힌 경우는 보수적으로 FILTER 처리(True)하거나
    필요하면 False로 바꿔도 됨
    """
    if not API_KEY:
        print("[Gemini] API_KEY 없음, 필터링 스킵")
        return False

    system_instruction = (
        "당신은 혐오 발언 필터링 시스템입니다. "
        "사용자 댓글을 분석하여 인종, 성별, 종교, 국적, 성적 지향 등에 대한 "
        "혐오, 비하, 공격적인 의도가 담겨 있는지 판단하고, 판단 결과만 단일 단어로 응답하세요. "
        "명확히 감지되면 'FILTER', 감지되지 않으면 'SAFE'만 응답합니다."
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

        # 1. 후보가 하나도 없으면 → 보수적으로 FILTER로 처리
        if not getattr(response, "candidates", None):
            print("[Gemini] candidates 없음, finish_reason 확인 불가 → FILTER 처리")
            return True

        candidate = response.candidates[0]
        finish_reason = getattr(candidate, "finish_reason", None)
        print(f"[Gemini] finish_reason: {finish_reason}")

        # finish_reason이 비정상(텍스트 안 나온 상황 포함)이면 FILTER로 취급
        # 필요하면 여기 로직은 너가 완화해도 됨
        if finish_reason is not None and finish_reason != 1:  # 1 = STOP(정상 종료)
            print("[Gemini] finish_reason 비정상 → FILTER 처리")
            return True

        # 2. 이제 텍스트 뽑기 (response.text가 또 예외 날 수 있으니 안전하게)
        try:
            raw_text = (response.text or "").strip()
        except Exception as e:
            print(f"[Gemini] response.text 접근 실패: {e} → FILTER 처리")
            return True

        result = raw_text.upper()
        print(f"[Gemini] 입력: {comment_text}")
        print(f"[Gemini] 응답: {repr(raw_text)} → 파싱: {result}")

        return "FILTER" in result

    except Exception as e:
        print(f"[Gemini] 호출 중 예외(비하 발언 체크): {e}")
        # 여기서는 보수적으로 True/False 둘 다 가능
        # 댓글을 막는 쪽으로 가려면 True로 바꿔도 됨
        return False
