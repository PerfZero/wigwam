from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('store', '0005_alter_cart_options_alter_cartitem_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='show_in_nav',
            field=models.BooleanField(default=False, verbose_name='Показывать в меню'),
        ),
        migrations.AddField(
            model_name='category',
            name='nav_order',
            field=models.PositiveIntegerField(default=0, verbose_name='Порядок в меню'),
        ),
        migrations.AddField(
            model_name='category',
            name='home_order',
            field=models.PositiveIntegerField(default=0, verbose_name='Порядок на главной'),
        ),
    ]
