from django.urls import path
from editor import views

urlpatterns = [
    path('', views.editor_view, name='editor_view'),
    path('list/', views.image_list, name='image_list'),
    path('save/', views.save_edited, name='save_edited'),
    path('update/<int:pk>/', views.image_update, name='image_update'),
    path('delete/<int:pk>/', views.image_delete, name='image_delete'),
]
