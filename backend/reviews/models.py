from store.models import Review as BaseReview


class Review(BaseReview):
    class Meta:
        proxy = True
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
