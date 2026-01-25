from django.test import TestCase

from store.models import (
    Attribute,
    AttributeOption,
    Category,
    Product,
    ProductAttributeValue,
)


class ProductFiltersTests(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name='Категория', slug='category')
        self.brand = Attribute.objects.create(
            name='Бренд',
            slug='brand',
            type=Attribute.TYPE_SELECT,
        )
        self.origin = Attribute.objects.create(
            name='Страна',
            slug='origin',
            type=Attribute.TYPE_TEXT,
        )
        self.strength = Attribute.objects.create(
            name='Крепость',
            slug='strength',
            type=Attribute.TYPE_NUMBER,
        )
        self.limited = Attribute.objects.create(
            name='Лимитированное',
            slug='limited',
            type=Attribute.TYPE_BOOLEAN,
        )
        self.filterable = Attribute.objects.create(
            name='Вес',
            slug='weight',
            type=Attribute.TYPE_NUMBER,
            unit='г',
            is_filterable=False,
        )
        self.alpha = AttributeOption.objects.create(
            attribute=self.brand,
            value='Alpha',
            slug='alpha',
            sort_order=0,
        )
        self.beta = AttributeOption.objects.create(
            attribute=self.brand,
            value='Beta',
            slug='beta',
            sort_order=1,
        )
        self.p1 = Product.objects.create(
            category=self.category,
            name='Товар 1',
            slug='product-1',
            price='100.00',
            is_active=True,
        )
        self.p2 = Product.objects.create(
            category=self.category,
            name='Товар 2',
            slug='product-2',
            price='200.00',
            is_active=True,
        )
        self.p3 = Product.objects.create(
            category=self.category,
            name='Товар 3',
            slug='product-3',
            price='300.00',
            is_active=True,
        )
        ProductAttributeValue.objects.create(
            product=self.p1,
            attribute=self.brand,
            option=self.alpha,
        )
        ProductAttributeValue.objects.create(
            product=self.p2,
            attribute=self.brand,
            option=self.beta,
        )
        ProductAttributeValue.objects.create(
            product=self.p3,
            attribute=self.brand,
            option=self.alpha,
        )
        ProductAttributeValue.objects.create(
            product=self.p1,
            attribute=self.origin,
            value_text='Cuba',
        )
        ProductAttributeValue.objects.create(
            product=self.p2,
            attribute=self.origin,
            value_text='Nicaragua',
        )
        ProductAttributeValue.objects.create(
            product=self.p3,
            attribute=self.origin,
            value_text='cuba',
        )
        ProductAttributeValue.objects.create(
            product=self.p1,
            attribute=self.strength,
            value_number='5',
        )
        ProductAttributeValue.objects.create(
            product=self.p2,
            attribute=self.strength,
            value_number='7',
        )
        ProductAttributeValue.objects.create(
            product=self.p3,
            attribute=self.strength,
            value_number='9',
        )
        ProductAttributeValue.objects.create(
            product=self.p1,
            attribute=self.limited,
            value_boolean=True,
        )
        ProductAttributeValue.objects.create(
            product=self.p2,
            attribute=self.limited,
            value_boolean=False,
        )
        ProductAttributeValue.objects.create(
            product=self.p3,
            attribute=self.limited,
            value_boolean=False,
        )

    def test_price_filtering(self):
        response = self.client.get('/api/products/', {'price_min': '150'})
        names = {item['name'] for item in response.json()['results']}
        self.assertEqual(names, {'Товар 2', 'Товар 3'})

        response = self.client.get('/api/products/', {'price_max': '250'})
        names = {item['name'] for item in response.json()['results']}
        self.assertEqual(names, {'Товар 1', 'Товар 2'})

        response = self.client.get(
            '/api/products/',
            {'price_min': '150', 'price_max': '250'},
        )
        names = {item['name'] for item in response.json()['results']}
        self.assertEqual(names, {'Товар 2'})

    def test_select_attribute_filter(self):
        response = self.client.get('/api/products/', {'attr': 'brand:alpha'})
        names = {item['name'] for item in response.json()['results']}
        self.assertEqual(names, {'Товар 1', 'Товар 3'})

        response = self.client.get('/api/products/', {'attr': 'brand:alpha,beta'})
        names = {item['name'] for item in response.json()['results']}
        self.assertEqual(names, {'Товар 1', 'Товар 2', 'Товар 3'})

    def test_text_attribute_filter_is_case_insensitive(self):
        response = self.client.get('/api/products/', {'attr': 'origin:cuba'})
        names = {item['name'] for item in response.json()['results']}
        self.assertEqual(names, {'Товар 1', 'Товар 3'})

    def test_number_attribute_filter(self):
        response = self.client.get('/api/products/', {'attr': 'strength:7'})
        names = {item['name'] for item in response.json()['results']}
        self.assertEqual(names, {'Товар 2'})

    def test_boolean_attribute_filter(self):
        response = self.client.get('/api/products/', {'attr': 'limited:true'})
        names = {item['name'] for item in response.json()['results']}
        self.assertEqual(names, {'Товар 1'})

        response = self.client.get('/api/products/', {'attr': 'limited:false'})
        names = {item['name'] for item in response.json()['results']}
        self.assertEqual(names, {'Товар 2', 'Товар 3'})

    def test_attributes_list_exposes_filtering_fields(self):
        response = self.client.get('/api/attributes/')
        payload = response.json()['results']
        weight = next(item for item in payload if item['slug'] == 'weight')
        self.assertEqual(weight['unit'], 'г')
        self.assertFalse(weight['is_filterable'])
