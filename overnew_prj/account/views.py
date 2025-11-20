from django.shortcuts import render
from users.models import *
from archive.models import *

# Create your views here.

def mypage(request):
    all_categories = NewsCategory.objects.all()

    selected_categories = NewsCategory.objects.filter(
        usernews__user=request.user
    )

    return render(request, 'account/mypage.html', {
        'all_categories': all_categories,
        'selected_categories': selected_categories,
    })