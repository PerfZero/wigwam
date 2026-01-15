from store.models import Cart as BaseCart
from store.models import CartItem as BaseCartItem


class Cart(BaseCart):
    class Meta:
        proxy = True
        verbose_name = 'Корзина'
        verbose_name_plural = 'Корзины'


class CartItem(BaseCartItem):
    class Meta:
        proxy = True
        verbose_name = 'Позиция корзины'
        verbose_name_plural = 'Позиции корзины'
