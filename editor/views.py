from django.shortcuts import get_object_or_404, render

import json, re, base64
from io import BytesIO
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
from PIL import Image
from .models import EditedImage
from .forms import UploadForm




def editor_view(request):
    form = UploadForm()
    return render(request, 'editor/editor.html', {'form': form})


@csrf_exempt
def save_edited(request):
    data = json.loads(request.body)
    match = re.match(r'data:image/\w+;base64,(.+)', data['image'])
    img_data = base64.b64decode(match.group(1))
    img = Image.open(BytesIO(img_data)).convert('RGBA')

    buffer = BytesIO()
    img.save(buffer, format='PNG')
    edited = EditedImage()
    edited.original.save('edited.png', ContentFile(buffer.getvalue()))
    return JsonResponse({'status': 'ok', 'id': edited.pk})

def image_list(request):
    images = EditedImage.objects.all().order_by('-created_at')
    return render(request, 'editor/list.html', {'images': images})


def image_update(request, pk):
    img = get_object_or_404(EditedImage, pk=pk)
    if request.method == 'POST':
        form = UploadForm(request.POST, request.FILES, instance=img)
        if form.is_valid():
            form.save()
            return redirect('image_list')
    else:
        form = UploadForm(instance=img)
    return render(request, 'editor/update.html', {'form': form, 'image': img})


def image_delete(request, pk):
    img = get_object_or_404(EditedImage, pk=pk)
    if request.method == 'POST':
        img.delete()
        return redirect('image_list')
    return render(request, 'editor/delete.html', {'image': img})
