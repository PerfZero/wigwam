from store.models import Document as BaseDocument
from store.models import FAQ as BaseFAQ


class Document(BaseDocument):
    class Meta:
        proxy = True
        verbose_name = 'Документ'
        verbose_name_plural = 'Документы'


class FAQ(BaseFAQ):
    class Meta:
        proxy = True
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQ'
