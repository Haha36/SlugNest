from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response

from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings


class LogoutView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = ()
    # For logout
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, TokenError):
            return Response(status=status.HTTP_400_BAD_REQUEST)


class PasswordRecoveryView(APIView):
    # Accepts an email address and sends account recovery instructions.

    permission_classes = (AllowAny,)
    authentication_classes = ()

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(email__iexact=email)

        if users.exists():
            for user in users:
                # Build uid/token for password reset using Django's utilities
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                token = default_token_generator.make_token(user)

                # Compose a reset URL. Prefer DJOSER setting if available.
                reset_path = settings.DJOSER.get(
                    "PASSWORD_RESET_CONFIRM_URL",
                    "auth/password/reset-password-confirmation/?uid={uid}&token={token}",
                )
                domain = getattr(settings, "DOMAIN", "localhost")
                # Ensure there's no duplicate slashes
                reset_url = f"https://{domain}/{reset_path.format(uid=uid, token=token)}"

                subject = f"Account recovery for {getattr(settings, 'SITE_NAME', 'Site')}"
                message = (
                    f"Hello,\n\nWe received a request to recover your account.\n\n"
                    f"Username: {user.username}\n\n"
                    f"To reset your password, visit the following link:\n{reset_url}\n\n"
                    "If you didn't request this, you can safely ignore this email.\n\n"
                    "Thanks,\nSlugNest"
                )

                # send_mail will use EMAIL_BACKEND from settings. In development it's console backend.
                try:
                    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)
                except Exception:
                    # Don't leak internal email errors to the caller; log in a real app.
                    pass

        # Always return a 200 to avoid revealing whether the email exists.
        return Response(
            {"detail": "If an account with that email exists, we've sent recovery instructions."},
            status=status.HTTP_200_OK,
        )