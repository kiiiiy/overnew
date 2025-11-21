from django.urls import path
from .views import *

app_name = "account"

urlpatterns = [
    path("onboarding/", splash, name="splash"),

    path("api/send-email-code/", send_signup_verification_code, name="send_email_code"),
    path("api/verify-email-code/", verify_signup_verification_code, name="verify_email_code"),

    path("signup/step1/", info_step1, name="info_step1"),
    path("signup/step2/", info_step2, name="info_step2"),
    path("signup/step3/", info_step3, name="info_step3"),
    path("signup/step4/", info_step4, name="info_step4"),
    path("signup/step5/", info_step5, name="info_step5"),
    path("signup/complete/", signup_complete, name="signup_complete"),
    

    path("api/signup/", api_signup, name="api_signup"),

    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),

    path("settings/", settings_view, name="settings"),
    path("profile/edit/", profile_edit_view, name="profile_edit"),

    path("notifications/", notifications_view, name="notifications"),

    path('mypage/', mypage, name="mypage"),
    path('update/', update, name="update"),
]
