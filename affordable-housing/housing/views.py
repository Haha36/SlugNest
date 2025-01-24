from django.shortcuts import render, redirect
from .models import House
from .forms import HouseForm

def create_view(request):
    form = HouseForm()
    if request.method == 'POST':
        form = HouseForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('show_url') ###
    template_name = 'create_view.html'
    context = {'form': form}
    return render(request, template_name, context)

def read_view(request):
    obj = House.objects.all()
    template_name = 'read_view.html'
    context = {'obj': obj} 
    return render(request, template_name, context)

def update_view(request, f_oid):
    obj = House.objects.get(oid = f_oid)
    form = HouseForm(instance=obj)
    if request.method == 'POST':
        form = HouseForm(request.POST, instance=obj)
        if form.is_valid():
            form.save()
            return redirect('show_url') ###
    template_name = 'create_view.html'
    context = {'form': form}
    return render(request, template_name, context) 

def delete_view(request, f_oid):
    obj = House.objects.get(oid=f_oid)
    if request.method == 'POST':
        obj.delete()
        return redirect('show_url') ###
    template_name = 'delete_view.html'
    context = {'obj':obj}
    return render(request, template_name, context)

def index(request):
    return HttpResponse("Welcome to the housing index.")
