from django.contrib import admin

from store.models import ProductAttributeValue, ProductImage
from .models import Category, Product


class ProductAttributeValueInline(admin.TabularInline):
    model = ProductAttributeValue
    extra = 0
    fields = ('attribute', 'option', 'value_text', 'value_number', 'value_boolean')


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0
    fields = ('image', 'sort_order')


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
    inlines = [ProductImageInline, ProductAttributeValueInline]
