from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm # 기존 User 변경 시 사용
from django import forms
from .models import User  # users/models.py의 Custom User 모델
from account.models import UserNews, UserMedia # account 앱의 M2M 중개 모델
from django.utils.translation import gettext_lazy as _ 
from django.db import transaction

# =======================================================
# 1. M2M Inline 클래스 (account 모델 참조)
# =======================================================

class UserNewsInline(admin.TabularInline):
    """유저가 선택한 관심사 (UserNews)를 User 관리 페이지에 인라인으로 표시"""
    model = UserNews
    extra = 1

class UserMediaInline(admin.TabularInline):
    """유저가 선택한 언론사 (UserMedia)를 User 관리 페이지에 인라인으로 표시"""
    model = UserMedia
    extra = 1

# =======================================================
# 2. Custom Forms 정의 (ModelForm 기반으로 변경)
# =======================================================

class CustomUserCreationForm(forms.ModelForm):
    """사용자 추가(Add) 화면에서 사용할 폼 - 비밀번호 필드 직접 처리"""
    # 비밀번호 필드 정의
    password = forms.CharField(label=_("Password"), widget=forms.PasswordInput)
    password2 = forms.CharField(
        label=_("Password confirmation"), 
        widget=forms.PasswordInput, 
        help_text=_("Enter the same password as above, for verification.")
    )

    class Meta: 
        model = User
        # 폼에 필요한 모든 필드를 명시합니다.
        fields = (
            'username', 'email', 'nickname', 'age', 'gender', 'stance', 'profile_image',
            'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'
        ) 
    
    def clean(self):
        # 비밀번호 일치 여부 검사
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        password2 = cleaned_data.get("password2")

        if password and password2 and password != password2:
            self.add_error('password2', _("The two password fields didn't match.")) 
        return cleaned_data
        
    @transaction.atomic
    def save(self, commit=True):
        # User 모델 인스턴스 생성 및 비밀번호 해싱
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"]) # 비밀번호 해시 저장
        if commit:
            user.save()
        return user

# =======================================================
# 3. Custom User Admin 등록
# =======================================================

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    """User 모델을 관리자 페이지에 등록"""
    
    # Custom Form 지정
    add_form = CustomUserCreationForm 
    
    # 🌟🌟🌟 last_login, date_joined 필드를 수정 불가능하게 지정 🌟🌟🌟
    readonly_fields = ('date_joined', 'last_login')

    # '유저 추가' 화면의 필드셋
    add_fieldsets = (
        (None, {'fields': ('username', 'password', 'password2')}), 
        ('개인 정보', {'fields': ('email', 'nickname', 'age', 'gender', 'stance', 'profile_image')}),
        ('권한', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    
    # '유저 편집' 화면의 필드셋
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_('Personal info'), {
            'fields': ('email', 'nickname', 'age', 'gender', 'stance', 'profile_image')
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    list_display = ('id', 'username', 'email', 'nickname', 'is_staff')
    search_fields = ('username', 'email', 'nickname')
    ordering = ('id',)
    
    # M2M 인라인 연결
    inlines = (UserNewsInline, UserMediaInline)