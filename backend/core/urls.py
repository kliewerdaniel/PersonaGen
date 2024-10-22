from django.urls import path
from .views import (
    AnalyzeWritingSampleView,
    GenerateContentView,
    PersonaListView,
    PersonaDetailView,
    BlogPostView
)

urlpatterns = [
    path('analyze/', AnalyzeWritingSampleView.as_view(), name='analyze-writing-sample'),
    path('generate-content/', GenerateContentView.as_view(), name='generate-content'),
    path('personas/', PersonaListView.as_view(), name='persona-list'),
    path('personas/<int:persona_id>/', PersonaDetailView.as_view(), name='persona-detail'),
    path('blog-posts/', BlogPostView.as_view(), name='blogpost-list'),
]
