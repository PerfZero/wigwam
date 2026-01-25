from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('store', '0010_alter_attribute_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cart',
            fields=[],
            options={
                'proxy': True,
                'verbose_name': 'Корзина',
                'verbose_name_plural': 'Корзины',
            },
            bases=('store.cart',),
        ),
        migrations.CreateModel(
            name='CartItem',
            fields=[],
            options={
                'proxy': True,
                'verbose_name': 'Позиция корзины',
                'verbose_name_plural': 'Позиции корзины',
            },
            bases=('store.cartitem',),
        ),
    ]
