from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('store', '0010_alter_attribute_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Review',
            fields=[],
            options={
                'proxy': True,
                'verbose_name': 'Отзыв',
                'verbose_name_plural': 'Отзывы',
            },
            bases=('store.review',),
        ),
    ]
