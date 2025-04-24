from django import forms
from .models import EditedImage

class UploadForm(forms.ModelForm):
    class Meta:
        model = EditedImage
        fields = ['original']
