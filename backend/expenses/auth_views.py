import random
import re
import urllib.request
import urllib.parse
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import PhoneOTP

def is_strong_password(password):
    regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$"
    return re.match(regex, password) is not None

def send_sms_otp(phone, otp):
    # VS Code Terminal-la print aagum
    print(f"\n==========================================")
    print(f"[SMS GATEWAY] OTP for {phone} is: {otp}")
    print(f"==========================================\n")

    # Fast2SMS Real SMS Integration (Optional API key)
    FAST2SMS_API_KEY = ""

    clean_number = "".join(filter(str.isdigit, phone))
    if len(clean_number) > 10 and clean_number.startswith("91"):
        clean_number = clean_number[2:]

    if FAST2SMS_API_KEY and len(clean_number) == 10:
        try:
            url = "https://www.fast2sms.com/dev/bulkV2"
            data = urllib.parse.urlencode({
                "authorization": FAST2SMS_API_KEY,
                "variables_values": otp,
                "route": "otp",
                "numbers": clean_number,
            }).encode("utf-8")

            req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/x-www-form-urlencoded"})
            with urllib.request.urlopen(req) as response:
                res_body = response.read().decode("utf-8")
                print(f"[REAL SMS SENT RESULT]: {res_body}")
        except Exception as e:
            print(f"[SMS SEND ERROR]: {str(e)}")


# 1. Register with Phone OTP (Public)
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            name = request.data.get("name", "").strip()
            email = request.data.get("email", "").strip().lower()
            phone = request.data.get("phone", "").strip()
            password = request.data.get("password", "")

            print(f"\n[REGISTER ATTEMPT]: name={name}, email={email}, phone={phone}")

            if not all([name, email, phone, password]):
                return Response(
                    {"error": "All fields are required. Please fill name, email, phone, and password."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if len(password) < 8:
                return Response(
                    {"error": "Password must be at least 8 characters long."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check duplicate user
            existing_user = User.objects.filter(username=email).first()
            if existing_user:
                if not existing_user.is_active:
                    # Account already created but not activated yet -> Re-generate OTP & allow
                    otp_code = str(random.randint(100000, 999999))
                    PhoneOTP.objects.update_or_create(
                        phone=phone,
                        defaults={"otp": otp_code, "verified": False},
                    )
                    existing_user.set_password(password)
                    existing_user.first_name = name
                    existing_user.save()
                    send_sms_otp(phone, otp_code)
                    return Response(
                        {"message": f"Account exists but inactive. New OTP sent to {phone}!"},
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {"error": "An account with this email already exists. Please login."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            # Generate OTP
            otp_code = str(random.randint(100000, 999999))
            PhoneOTP.objects.update_or_create(
                phone=phone,
                defaults={"otp": otp_code, "verified": False},
            )

            send_sms_otp(phone, otp_code)

            # Create new inactive user
            User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=name,
                is_active=False,
            )

            print(f"[REGISTER SUCCESS]: User created & OTP generated for {phone}")
            return Response(
                {"message": f"OTP sent to {phone} successfully!"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            print(f"[REGISTER EXCEPTION]: {str(e)}")
            return Response(
                {"error": f"Server error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
# 2. Verify Register OTP (Public)
class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        phone = request.data.get("phone")
        email = request.data.get("email")
        otp = request.data.get("otp")

        otp_record = PhoneOTP.objects.filter(phone=phone).first()
        if not otp_record or otp_record.otp != otp:
            return Response({"error": "Invalid OTP. Please check again."}, status=status.HTTP_400_BAD_REQUEST)

        if timezone.now() - otp_record.created_at > timedelta(minutes=5):
            return Response({"error": "OTP has expired. Request a new one."}, status=status.HTTP_400_BAD_REQUEST)

        otp_record.verified = True
        otp_record.save()

        user = User.objects.filter(username=email).first()
        if user:
            user.is_active = True
            user.save()
            return Response({"message": "Account activated successfully! Please login."}, status=status.HTTP_200_OK)

        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


# 3. Forgot Password - Send OTP (Public)
class ForgotPasswordSendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        phone = request.data.get("phone")
        email = request.data.get("email")

        user = User.objects.filter(username=email).first()
        if not user:
            return Response({"error": "No user found with this email."}, status=status.HTTP_404_NOT_FOUND)

        otp_code = str(random.randint(100000, 999999))
        PhoneOTP.objects.update_or_create(
            phone=phone,
            defaults={"otp": otp_code, "verified": False}
        )

        send_sms_otp(phone, otp_code)
        return Response({"message": f"Password reset OTP sent to {phone}."}, status=status.HTTP_200_OK)


# 4. Forgot Password - Verify OTP & Reset (Public)
class ResetPasswordWithOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        phone = request.data.get("phone")
        otp = request.data.get("otp")
        new_password = request.data.get("new_password")

        if not is_strong_password(new_password):
            return Response({
                "error": "Password must be at least 8 chars, contain uppercase, lowercase, number, and special character."
            }, status=status.HTTP_400_BAD_REQUEST)

        otp_record = PhoneOTP.objects.filter(phone=phone).first()
        if not otp_record or otp_record.otp != otp:
            return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(username=email).first()
        if not user:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        user.set_password(new_password)
        user.save()

        otp_record.delete()

        return Response({"message": "Password reset successful! You can now login with your new password."}, status=status.HTTP_200_OK)


# 5. User Profile View (Protected)
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "name": user.first_name or user.username.split("@")[0],
            "email": user.email,
            "date_joined": user.date_joined.strftime("%d %b %Y"),
        }, status=status.HTTP_200_OK)


# 6. Change Password View (Protected)
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            old_password = request.data.get("old_password")
            new_password = request.data.get("new_password")

            if not old_password or not new_password:
                return Response(
                    {"error": "Both current password and new password are required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not user.check_password(old_password):
                return Response(
                    {"error": "Current password is incorrect."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not is_strong_password(new_password):
                return Response(
                    {
                        "error": "New password must be at least 8 chars, contain uppercase, lowercase, number, and special character."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.set_password(new_password)
            user.save()

            return Response(
                {"message": "Password updated successfully!"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"error": f"Internal server error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )