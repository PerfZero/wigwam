from store.models import Category as BaseCategory
from store.models import Product as BaseProduct


class Category(BaseCategory):
    class Meta:
        proxy = True
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'


class Product(BaseProduct):
    class Meta:
        proxy = True
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'
