from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('store', '0003_product_is_new'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='image',
            field=models.ImageField(
                blank=True,
                null=True,
                upload_to='categories/',
                verbose_name='Изображение',
            ),
        ),
        migrations.AddField(
            model_name='category',
            name='show_on_home',
            field=models.BooleanField(default=False, verbose_name='Показывать на главной'),
        ),
    ]
