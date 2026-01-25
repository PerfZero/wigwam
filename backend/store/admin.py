from django.contrib import admin

from .models import Attribute, AttributeOption


class AttributeOptionInline(admin.TabularInline):
    model = AttributeOption
    extra = 0


@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'type', 'unit', 'is_filterable', 'sort_order')
    list_filter = ('type', 'is_filterable')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [AttributeOptionInline]
    fields = ('name', 'slug', 'type', 'unit', 'is_filterable', 'sort_order')
