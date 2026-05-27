from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from housing.models import House


class Command(BaseCommand):
    help = 'Delete listings older than 60 days where auto_delete is enabled'

    def handle(self, *args, **kwargs):
        cutoff = timezone.now() - timedelta(days=60)
        expired = House.objects.filter(auto_delete=True, created_at__lt=cutoff)
        count = expired.count()
        expired.delete()
        self.stdout.write(f'Deleted {count} expired listing(s).')
