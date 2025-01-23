from django.shortcuts import render

from .models import House
from .forms import HouseForm

def create_view(request):
    context = {}

    form = HouseForm(request.POST or NONE)
    if form.is_valid():
        form.save()

    context['form'] = form
    return render(request, "create_view.html", context)

def index(request):
    return HttpResponse("Welcome to the housing index.")