from django.contrib.auth.tokens import PasswordResetTokenGenerator

# 사용자 계정 활성화 (이메일 인증) 토큰을 생성하기 위한 클래스
class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    """
    유저 객체와 타임스탬프를 기반으로 인증 토큰을 생성합니다.
    이 토큰은 이메일 인증 시 URL에 포함되어 사용자 인증에 사용됩니다.
    """
    def _make_hash_value(self, user, timestamp):
        return (
            str(user.pk) + str(user.is_active) + str(timestamp)
        )

# views.py에서 사용하고 있는 인스턴스
account_activation_token = AccountActivationTokenGenerator()