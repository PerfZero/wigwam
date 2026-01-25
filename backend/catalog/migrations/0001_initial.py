from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('store', '0010_alter_attribute_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[],
            options={
                'proxy': True,
                'verbose_name': 'Категория',
                'verbose_name_plural': 'Категории',
            },
            bases=('store.category',),
        ),
        migrations.CreateModel(
            name='Product',
            fields=[],
            options={
                'proxy': True,
                'verbose_name': 'Товар',
                'verbose_name_plural': 'Товары',
            },
            bases=('store.product',),
        ),
    ]
