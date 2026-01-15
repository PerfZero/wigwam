from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('store', '0002_product_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='is_new',
            field=models.BooleanField(default=False, verbose_name='Новинка'),
        ),
    ]
