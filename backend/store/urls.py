from django.urls import path

from . import views

urlpatterns = [
    path('api/categories/', views.categories_list, name='categories_list'),
    path('api/products/', views.products_list, name='products_list'),
    path('api/products/<slug:slug>/', views.product_detail, name='product_detail'),
    path('api/products/<slug:slug>/reviews/', views.product_review_create, name='product_review_create'),
    path('api/documents/', views.documents_list, name='documents_list'),
    path('api/faq/', views.faq_list, name='faq_list'),
    path('api/cart/', views.cart_detail, name='cart_detail'),
    path('api/cart/items/', views.cart_add_item, name='cart_add_item'),
    path('api/cart/items/<int:item_id>/', views.cart_update_item, name='cart_update_item'),
    path('api/cart/items/<int:item_id>/remove/', views.cart_delete_item, name='cart_delete_item'),
]
