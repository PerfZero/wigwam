from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('store', '0008_attribute_models'),
    ]

    operations = [
        migrations.CreateModel(
            name='Subscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='Email')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата подписки')),
                ('is_active', models.BooleanField(default=True, verbose_name='Активна')),
            ],
            options={
                'verbose_name': 'Подписка',
                'verbose_name_plural': 'Подписки',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddField(
            model_name='attribute',
            name='unit',
            field=models.CharField(blank=True, max_length=40, verbose_name='Единица измерения'),
        ),
        migrations.AddField(
            model_name='attribute',
            name='is_filterable',
            field=models.BooleanField(default=True, verbose_name='Фильтруется'),
        ),
        migrations.AddField(
            model_name='productattributevalue',
            name='value_boolean',
            field=models.BooleanField(blank=True, null=True, verbose_name='Да/Нет'),
        ),
    ]
