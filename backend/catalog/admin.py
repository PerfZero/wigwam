from django.contrib import admin

from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'slug',
        'show_in_nav',
        'nav_order',
        'show_on_home',
        'home_order',
    )
    list_filter = ('show_in_nav', 'show_on_home')
    search_fields = ('name', 'slug')
    list_editable = ('show_in_nav', 'nav_order', 'show_on_home', 'home_order')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'is_new', 'is_active')
    list_filter = ('category', 'is_new', 'is_active')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
