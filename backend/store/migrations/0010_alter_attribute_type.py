from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('store', '0009_attribute_filtering'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attribute',
            name='type',
            field=models.CharField(
                choices=[
                    ('select', 'Список'),
                    ('text', 'Текст'),
                    ('number', 'Число'),
                    ('boolean', 'Да/Нет'),
                ],
                default='select',
                max_length=20,
                verbose_name='Тип',
            ),
        ),
    ]
