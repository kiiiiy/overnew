from django.shortcuts import render

# Create your views here.

def community(request):
    return render(request, 'discussion/community.html')

def discussion_anonymous(request):
    return render(request, 'discussion/discussion-anonymous.html')

def discussion_anonymous(request):
    return render(request, 'discussion/discussion-article-detail.html')

def discussion_realname(request):
    return render(request, 'discussion/discussion-realname.html')

def discussion_article_detail(request):
    return render(request, 'discussion/discussion-article-detail.html')
