from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Expense

        fields = [
            "id",
            "title",
            "amount",
            "category",
            "merchant",
            "expense_date",
            "receipt",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]


class RegisterSerializer(serializers.Serializer):

    name = serializers.CharField(
        max_length=150
    )

    email = serializers.EmailField()

    password = serializers.CharField(
        min_length=6,
        write_only=True
    )

    def validate_email(self, value):

        value = value.lower().strip()

        if User.objects.filter(
            username=value
        ).exists():

            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value


class VerifyOTPSerializer(serializers.Serializer):

    email = serializers.EmailField()

    otp = serializers.CharField(
        min_length=6,
        max_length=6
    )