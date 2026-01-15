import json
from django.http import JsonResponse, HttpResponseNotAllowed
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from .models import Category, Product, Review, Document, FAQ, Cart, CartItem


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
    category_slug = request.GET.get('category')
    if category_slug:
        queryset = queryset.filter(category__slug=category_slug)
    is_new = request.GET.get('is_new')
    if is_new in ['1', 'true', 'True', 'yes']:
        queryset = queryset.filter(is_new=True)
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


def product_detail(request, slug):
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])
    product = get_object_or_404(Product, slug=slug, is_active=True)
    data = {
        'id': product.id,
        'name': product.name,
        'slug': product.slug,
        'description': product.description,
        'price': str(product.price),
        'image_url': _product_image_url(request, product),
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
    faq_items = [
        {
            'id': item.id,
            'question': item.question,
            'answer': item.answer,
        }
        for item in FAQ.objects.all()
    ]
    return _json_response({'results': faq_items})


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
