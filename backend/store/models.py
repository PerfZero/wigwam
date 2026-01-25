import uuid
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=120, verbose_name='Название')
    slug = models.SlugField(unique=True, verbose_name='Слаг')
    description = models.TextField(blank=True, verbose_name='Описание')
    image = models.ImageField(
        upload_to='categories/',
        blank=True,
        null=True,
        verbose_name='Изображение',
    )
    show_in_nav = models.BooleanField(default=False, verbose_name='Показывать в меню')
    nav_order = models.PositiveIntegerField(default=0, verbose_name='Порядок в меню')
    show_on_home = models.BooleanField(default=False, verbose_name='Показывать на главной')
    home_order = models.PositiveIntegerField(default=0, verbose_name='Порядок на главной')

    class Meta:
        ordering = ['name']
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self) -> str:
        return self.name


class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name='Категория',
    )
    name = models.CharField(max_length=200, verbose_name='Название')
    slug = models.SlugField(unique=True, verbose_name='Слаг')
    description = models.TextField(blank=True, verbose_name='Описание')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена')
    image = models.ImageField(
        upload_to='products/',
        blank=True,
        null=True,
        verbose_name='Изображение',
    )
    image_url = models.URLField(blank=True, verbose_name='Ссылка на изображение')
    is_new = models.BooleanField(default=False, verbose_name='Новинка')
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')

    class Meta:
        ordering = ['name']
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'

    def __str__(self) -> str:
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name='Товар',
    )
    image = models.ImageField(upload_to='products/', verbose_name='Изображение')
    sort_order = models.PositiveIntegerField(default=0, verbose_name='Порядок')

    class Meta:
        ordering = ['sort_order', 'id']
        verbose_name = 'Изображение товара'
        verbose_name_plural = 'Изображения товара'

    def __str__(self) -> str:
        return f'{self.product} ({self.sort_order})'


class Attribute(models.Model):
    TYPE_SELECT = 'select'
    TYPE_TEXT = 'text'
    TYPE_NUMBER = 'number'
    TYPE_BOOLEAN = 'boolean'
    TYPE_CHOICES = [
        (TYPE_SELECT, 'Список'),
        (TYPE_TEXT, 'Текст'),
        (TYPE_NUMBER, 'Число'),
        (TYPE_BOOLEAN, 'Да/Нет'),
    ]

    name = models.CharField(max_length=120, verbose_name='Название')
    slug = models.SlugField(unique=True, verbose_name='Слаг')
    type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default=TYPE_SELECT,
        verbose_name='Тип',
    )
    sort_order = models.PositiveIntegerField(default=0, verbose_name='Порядок')
    unit = models.CharField(max_length=40, blank=True, verbose_name='Единица измерения')
    is_filterable = models.BooleanField(default=True, verbose_name='Фильтруется')

    class Meta:
        ordering = ['sort_order', 'name']
        verbose_name = 'Атрибут'
        verbose_name_plural = 'Атрибуты'

    def __str__(self) -> str:
        return self.name


class AttributeOption(models.Model):
    attribute = models.ForeignKey(
        Attribute,
        on_delete=models.CASCADE,
        related_name='options',
        verbose_name='Атрибут',
    )
    value = models.CharField(max_length=120, verbose_name='Значение')
    slug = models.SlugField(verbose_name='Слаг')
    sort_order = models.PositiveIntegerField(default=0, verbose_name='Порядок')

    class Meta:
        ordering = ['sort_order', 'value']
        unique_together = ['attribute', 'slug']
        verbose_name = 'Опция атрибута'
        verbose_name_plural = 'Опции атрибутов'

    def __str__(self) -> str:
        return f'{self.attribute}: {self.value}'


class ProductAttributeValue(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='attribute_values',
        verbose_name='Товар',
    )
    attribute = models.ForeignKey(
        Attribute,
        on_delete=models.CASCADE,
        related_name='product_values',
        verbose_name='Атрибут',
    )
    option = models.ForeignKey(
        AttributeOption,
        on_delete=models.CASCADE,
        related_name='product_values',
        null=True,
        blank=True,
        verbose_name='Опция',
    )
    value_text = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='Текстовое значение',
    )
    value_number = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Числовое значение',
    )
    value_boolean = models.BooleanField(
        null=True,
        blank=True,
        verbose_name='Да/Нет',
    )

    class Meta:
        unique_together = ['product', 'attribute']
        verbose_name = 'Значение атрибута'
        verbose_name_plural = 'Значения атрибутов'

    def __str__(self) -> str:
        return f'{self.product} - {self.attribute}'


class Review(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name='Товар',
    )
    name = models.CharField(max_length=120, verbose_name='Имя')
    rating = models.PositiveSmallIntegerField(verbose_name='Оценка')
    text = models.TextField(verbose_name='Текст')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'

    def __str__(self) -> str:
        return f'{self.product} ({self.rating})'


class Document(models.Model):
    title = models.CharField(max_length=200, verbose_name='Заголовок')
    slug = models.SlugField(unique=True, verbose_name='Слаг')
    body = models.TextField(verbose_name='Текст')

    class Meta:
        ordering = ['title']
        verbose_name = 'Документ'
        verbose_name_plural = 'Документы'

    def __str__(self) -> str:
        return self.title


class FAQCategory(models.Model):
    name = models.CharField(max_length=120, verbose_name='Название')
    slug = models.SlugField(unique=True, verbose_name='Слаг')
    order = models.PositiveIntegerField(default=0, verbose_name='Порядок')

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Категория FAQ'
        verbose_name_plural = 'Категории FAQ'

    def __str__(self) -> str:
        return self.name


class FAQ(models.Model):
    category = models.ForeignKey(
        FAQCategory,
        on_delete=models.SET_NULL,
        related_name='faqs',
        null=True,
        blank=True,
        verbose_name='Категория',
    )
    question = models.CharField(max_length=255, verbose_name='Вопрос')
    answer = models.TextField(verbose_name='Ответ')
    order = models.PositiveIntegerField(default=0, verbose_name='Порядок')

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQ'

    def __str__(self) -> str:
        return self.question


class Cart(models.Model):
    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        verbose_name='Токен',
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлено')

    class Meta:
        verbose_name = 'Корзина'
        verbose_name_plural = 'Корзины'

    def __str__(self) -> str:
        return str(self.token)


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Корзина',
    )
    product = models.ForeignKey(Product, on_delete=models.PROTECT, verbose_name='Товар')
    quantity = models.PositiveIntegerField(default=1, verbose_name='Количество')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')

    class Meta:
        unique_together = ['cart', 'product']
        verbose_name = 'Позиция корзины'
        verbose_name_plural = 'Позиции корзины'

    def __str__(self) -> str:
        return f'{self.product} x {self.quantity}'


class Subscription(models.Model):
    email = models.EmailField(unique=True, verbose_name='Email')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата подписки')
    is_active = models.BooleanField(default=True, verbose_name='Активна')

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Подписка'
        verbose_name_plural = 'Подписки'

    def __str__(self) -> str:
        return f'{self.email} ({self.created_at.date()})'
