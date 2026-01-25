from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('store', '0007_faq_category'),
    ]

    operations = [
        migrations.CreateModel(
            name='Attribute',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120, verbose_name='Название')),
                ('slug', models.SlugField(unique=True, verbose_name='Слаг')),
                ('type', models.CharField(choices=[('select', 'Список'), ('text', 'Текст'), ('number', 'Число')], default='select', max_length=20, verbose_name='Тип')),
                ('sort_order', models.PositiveIntegerField(default=0, verbose_name='Порядок')),
            ],
            options={
                'verbose_name': 'Атрибут',
                'verbose_name_plural': 'Атрибуты',
                'ordering': ['sort_order', 'name'],
            },
        ),
        migrations.CreateModel(
            name='AttributeOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(max_length=120, verbose_name='Значение')),
                ('slug', models.SlugField(verbose_name='Слаг')),
                ('sort_order', models.PositiveIntegerField(default=0, verbose_name='Порядок')),
                ('attribute', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='options', to='store.attribute', verbose_name='Атрибут')),
            ],
            options={
                'verbose_name': 'Опция атрибута',
                'verbose_name_plural': 'Опции атрибутов',
                'ordering': ['sort_order', 'value'],
                'unique_together': {('attribute', 'slug')},
            },
        ),
        migrations.CreateModel(
            name='ProductAttributeValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value_text', models.CharField(blank=True, max_length=200, verbose_name='Текстовое значение')),
                ('value_number', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True, verbose_name='Числовое значение')),
                ('attribute', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='product_values', to='store.attribute', verbose_name='Атрибут')),
                ('option', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='product_values', to='store.attributeoption', verbose_name='Опция')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attribute_values', to='store.product', verbose_name='Товар')),
            ],
            options={
                'verbose_name': 'Значение атрибута',
                'verbose_name_plural': 'Значения атрибутов',
                'unique_together': {('product', 'attribute')},
            },
        ),
    ]
