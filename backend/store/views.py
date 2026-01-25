import json
from decimal import Decimal, InvalidOperation
from django.db.models import Q
from django.http import JsonResponse, HttpResponseNotAllowed
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from .models import Category, Product, Review, Document, FAQ, FAQCategory, Cart, CartItem, Subscription
from .models import Attribute, AttributeOption, ProductAttributeValue, ProductImage


def _json_response(payload, status=200):
    return JsonResponse(payload, status=status, json_dumps_params={'ensure_ascii': False})


def _parse_json(request):
    try:
        return json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return None


def _cart_from_request(request):
    token = request.headers.get('X-Cart-Token') or request.GET.get('token')
    if token:
        try:
            cart = Cart.objects.get(token=token)
        except Cart.DoesNotExist:
            cart = Cart.objects.create()
    else:
        cart = Cart.objects.create()
    return cart


def _product_image_url(request, product):
    if product.image:
        return request.build_absolute_uri(product.image.url)
    return product.image_url


def _product_images_payload(request, product):
    images = []
    if product.image:
        images.append(
            {
                'id': None,
                'image_url': request.build_absolute_uri(product.image.url),
                'sort_order': 0,
                'is_main': True,
            }
        )
    for image in product.images.order_by('sort_order', 'id'):
        images.append(
            {
                'id': image.id,
                'image_url': request.build_absolute_uri(image.image.url),
                'sort_order': image.sort_order,
                'is_main': False,
            }
        )
    if not images and product.image_url:
        images.append(
            {
                'id': None,
                'image_url': product.image_url,
                'sort_order': 0,
                'is_main': True,
            }
        )
    return images


def _category_image_url(request, category):
    if category.image:
        return request.build_absolute_uri(category.image.url)
    return None


def _cart_payload(request, cart):
    items = [
        {
            'id': item.id,
            'product': {
                'id': item.product.id,
                'name': item.product.name,
                'slug': item.product.slug,
                'price': str(item.product.price),
                'image_url': _product_image_url(request, item.product),
            },
            'quantity': item.quantity,
        }
        for item in cart.items.select_related('product')
    ]
    return {
        'token': str(cart.token),
        'items': items,
    }


def categories_list(request):
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])
    queryset = Category.objects.all()
    show_on_home = request.GET.get('show_on_home')
    if show_on_home in ['1', 'true', 'True', 'yes']:
        queryset = queryset.filter(show_on_home=True).order_by('home_order', 'name')
    show_in_nav = request.GET.get('show_in_nav')
    if show_in_nav in ['1', 'true', 'True', 'yes']:
        queryset = queryset.filter(show_in_nav=True).order_by('nav_order', 'name')
    categories = [
        {
            'id': category.id,
            'name': category.name,
            'slug': category.slug,
            'description': category.description,
            'image_url': _category_image_url(request, category),
            'show_on_home': category.show_on_home,
            'show_in_nav': category.show_in_nav,
            'nav_order': category.nav_order,
            'home_order': category.home_order,
        }
        for category in queryset
    ]
    return _json_response({'results': categories})


def products_list(request):
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])
    queryset = Product.objects.filter(is_active=True).select_related('category')
    query = (request.GET.get('q') or '').strip()
    if query:
        queryset = queryset.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )
    category_slug = request.GET.get('category')
    if category_slug:
        queryset = queryset.filter(category__slug=category_slug)
    price_min = request.GET.get('price_min')
    if price_min:
        try:
            queryset = queryset.filter(price__gte=Decimal(price_min))
        except (InvalidOperation, ValueError):
            pass
    price_max = request.GET.get('price_max')
    if price_max:
        try:
            queryset = queryset.filter(price__lte=Decimal(price_max))
        except (InvalidOperation, ValueError):
            pass
    is_new = request.GET.get('is_new')
    if is_new in ['1', 'true', 'True', 'yes']:
        queryset = queryset.filter(is_new=True)
    attr_filters = request.GET.getlist('attr')
    for raw_filter in attr_filters:
        if not raw_filter or ':' not in raw_filter:
            continue
        attr_slug, raw_values = raw_filter.split(':', 1)
        values = [value for value in raw_values.split(',') if value]
        if not values:
            continue
        option_q = Q(attribute_values__option__slug__in=values)
        text_q = Q()
        for value in values:
            text_q |= Q(attribute_values__value_text__iexact=value)
        number_values = []
        for value in values:
            try:
                number_values.append(Decimal(value))
            except (InvalidOperation, ValueError):
                continue
        number_q = Q()
        if number_values:
            number_q = Q(attribute_values__value_number__in=number_values)
        boolean_values = []
        for value in values:
            normalized = value.strip().lower()
            if normalized in ['1', 'true', 'yes', 'да']:
                boolean_values.append(True)
            elif normalized in ['0', 'false', 'no', 'нет']:
                boolean_values.append(False)
        boolean_q = Q()
        if boolean_values:
            boolean_q = Q(attribute_values__value_boolean__in=boolean_values)
        queryset = queryset.filter(
            Q(attribute_values__attribute__slug=attr_slug)
            & (option_q | text_q | number_q | boolean_q)
        )
    sort = request.GET.get('sort')
    if sort == 'price_asc':
        queryset = queryset.order_by('price')
    elif sort == 'price_desc':
        queryset = queryset.order_by('-price')
    elif sort == 'new':
        queryset = queryset.order_by('-created_at')
    queryset = queryset.distinct()
    products = [
        {
            'id': product.id,
            'name': product.name,
            'slug': product.slug,
            'price': str(product.price),
            'image_url': _product_image_url(request, product),
            'is_new': product.is_new,
            'category': {
                'name': product.category.name,
                'slug': product.category.slug,
            },
        }
        for product in queryset
    ]
    return _json_response({'results': products})


def attributes_list(request):
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])
    queryset = Attribute.objects.prefetch_related('options').order_by('sort_order', 'name')
    attributes = [
        {
            'id': attribute.id,
            'name': attribute.name,
            'slug': attribute.slug,
            'type': attribute.type,
            'unit': attribute.unit,
            'is_filterable': attribute.is_filterable,
            'options': [
                {
                    'id': option.id,
                    'value': option.value,
                    'slug': option.slug,
                    'sort_order': option.sort_order,
                }
                for option in attribute.options.all()
            ],
        }
        for attribute in queryset
    ]
    return _json_response({'results': attributes})


def product_detail(request, slug):
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])
    product = get_object_or_404(Product, slug=slug, is_active=True)
    attribute_values = (
        product.attribute_values.select_related('attribute', 'option')
        .all()
    )
    attributes = []
    for item in attribute_values:
        attribute = item.attribute
        value = None
        if item.option:
            value = item.option.value
        elif item.value_text:
            value = item.value_text
        elif item.value_number is not None:
            value = str(item.value_number)
        elif item.value_boolean is not None:
            value = item.value_boolean
        if value is None:
            continue
        attributes.append(
            {
                'name': attribute.name,
                'slug': attribute.slug,
                'type': attribute.type,
                'unit': attribute.unit,
                'value': value,
            }
        )
    data = {
        'id': product.id,
        'name': product.name,
        'slug': product.slug,
        'description': product.description,
        'price': str(product.price),
        'image_url': _product_image_url(request, product),
        'images': _product_images_payload(request, product),
        'category': {
            'name': product.category.name,
            'slug': product.category.slug,
        },
        'reviews': [
            {
                'id': review.id,
                'name': review.name,
                'rating': review.rating,
                'text': review.text,
                'created_at': review.created_at.isoformat(),
            }
            for review in product.reviews.all()
        ],
        'attributes': attributes,
    }
    return _json_response(data)


@csrf_exempt
def product_review_create(request, slug):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    product = get_object_or_404(Product, slug=slug, is_active=True)
    payload = _parse_json(request)
    if payload is None:
        return _json_response({'error': 'invalid_json'}, status=400)
    name = (payload.get('name') or '').strip()
    text = (payload.get('text') or '').strip()
    rating = payload.get('rating')
    if not name or not text:
        return _json_response({'error': 'name_and_text_required'}, status=400)
    if not isinstance(rating, int) or rating < 1 or rating > 5:
        return _json_response({'error': 'rating_must_be_1_to_5'}, status=400)
    review = Review.objects.create(product=product, name=name, text=text, rating=rating)
    return _json_response(
        {
            'id': review.id,
            'name': review.name,
            'rating': review.rating,
            'text': review.text,
            'created_at': review.created_at.isoformat(),
        },
        status=201,
    )


def documents_list(request):
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])
    documents = [
        {
            'id': document.id,
            'title': document.title,
            'slug': document.slug,
            'body': document.body,
        }
        for document in Document.objects.all()
    ]
    return _json_response({'results': documents})


def faq_list(request):
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])
    queryset = FAQ.objects.select_related('category')
    category_slug = request.GET.get('category')
    if category_slug:
        queryset = queryset.filter(category__slug=category_slug)
    faq_items = [
        {
            'id': item.id,
            'question': item.question,
            'answer': item.answer,
            'category': {
                'id': item.category.id,
                'name': item.category.name,
                'slug': item.category.slug,
                'order': item.category.order,
            }
            if item.category
            else None,
        }
        for item in queryset
    ]
    categories = [
        {
            'id': category.id,
            'name': category.name,
            'slug': category.slug,
            'order': category.order,
        }
        for category in FAQCategory.objects.all()
    ]
    return _json_response({'results': faq_items, 'categories': categories})


@csrf_exempt
def cart_detail(request):
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])
    cart = _cart_from_request(request)
    return _json_response(_cart_payload(request, cart))


@csrf_exempt
def cart_add_item(request):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    payload = _parse_json(request)
    if payload is None:
        return _json_response({'error': 'invalid_json'}, status=400)
    product_slug = (payload.get('product_slug') or '').strip()
    quantity = payload.get('quantity')
    if not product_slug:
        return _json_response({'error': 'product_slug_required'}, status=400)
    if not isinstance(quantity, int) or quantity < 1:
        quantity = 1
    product = get_object_or_404(Product, slug=product_slug, is_active=True)
    cart = _cart_from_request(request)
    item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if created:
        item.quantity = quantity
    else:
        item.quantity = item.quantity + quantity
    item.save(update_fields=['quantity'])
    return _json_response(_cart_payload(request, cart), status=201)


@csrf_exempt
def cart_update_item(request, item_id):
    if request.method not in ['PATCH']:
        return HttpResponseNotAllowed(['PATCH'])
    payload = _parse_json(request)
    if payload is None:
        return _json_response({'error': 'invalid_json'}, status=400)
    quantity = payload.get('quantity')
    if not isinstance(quantity, int):
        return _json_response({'error': 'quantity_required'}, status=400)
    cart = _cart_from_request(request)
    item = get_object_or_404(CartItem, id=item_id, cart=cart)
    if quantity < 1:
        item.delete()
    else:
        item.quantity = quantity
        item.save(update_fields=['quantity'])
    return _json_response(_cart_payload(request, cart))


@csrf_exempt
def cart_delete_item(request, item_id):
    if request.method != 'DELETE':
        return HttpResponseNotAllowed(['DELETE'])
    cart = _cart_from_request(request)
    item = get_object_or_404(CartItem, id=item_id, cart=cart)
    item.delete()
    return _json_response(_cart_payload(request, cart))


@csrf_exempt
def subscribe_create(request):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    payload = _parse_json(request)
    if payload is None:
        return _json_response({'error': 'invalid_json'}, status=400)

    email = payload.get('email')
    if not email:
        return _json_response({'error': 'email_required'}, status=400)

    # Создаем или получаем существующую подписку
    subscription, created = Subscription.objects.get_or_create(
        email=email,
        defaults={'is_active': True}
    )

    if created:
        return _json_response({
            'message': 'Подписка успешно оформлена!',
            'email': email
        }, status=201)
    else:
        # Если подписка уже существует, активируем её
        if not subscription.is_active:
            subscription.is_active = True
            subscription.save()
            return _json_response({
                'message': 'Подписка активирована!',
                'email': email
            })
        else:
            return _json_response({
                'message': 'Вы уже подписаны на рассылку',
                'email': email
            }, status=409)
