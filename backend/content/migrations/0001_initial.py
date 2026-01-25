from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('store', '0010_alter_attribute_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Document',
            fields=[],
            options={
                'proxy': True,
                'verbose_name': 'Документ',
                'verbose_name_plural': 'Документы',
            },
            bases=('store.document',),
        ),
        migrations.CreateModel(
            name='FAQ',
            fields=[],
            options={
                'proxy': True,
                'verbose_name': 'FAQ',
                'verbose_name_plural': 'FAQ',
            },
            bases=('store.faq',),
        ),
    ]
