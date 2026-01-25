from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('store', '0010_alter_attribute_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProductImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='products/', verbose_name='Изображение')),
                ('sort_order', models.PositiveIntegerField(default=0, verbose_name='Порядок')),
                (
                    'product',
                    models.ForeignKey(
                        on_delete=models.deletion.CASCADE,
                        related_name='images',
                        to='store.product',
                        verbose_name='Товар',
                    ),
                ),
            ],
            options={
                'verbose_name': 'Изображение товара',
                'verbose_name_plural': 'Изображения товара',
                'ordering': ['sort_order', 'id'],
            },
        ),
    ]
