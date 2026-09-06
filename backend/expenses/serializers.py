from decimal import Decimal

from rest_framework import serializers

from .models import Expense, Account


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            "id",
            "name",
            "account_type",
            "balance",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
        ]


class ExpenseSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(
        source="account.name",
        read_only=True,
        allow_null=True,
    )

    account = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.none(),
        required=False,
        allow_null=True,
    )

    amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=Decimal("0.01"),
    )

    ocr_confidence = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        min_value=Decimal("0"),
        max_value=Decimal("100"),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Expense

        fields = [
            "id",
            "user",
            "account",
            "account_name",
            "title",
            "amount",
            "transaction_type",
            "category",
            "payment_method",
            "date",
            "time",
            "notes",
            "is_recurring",
            "receipt_image",
            "ocr_confidence",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "account_name",
            "created_at",
        ]

        extra_kwargs = {
            "title": {
                "required": False,
            },
            "category": {
                "required": False,
            },
            "payment_method": {
                "required": False,
            },
            "date": {
                "required": False,
            },
            "time": {
                "required": False,
            },
            "notes": {
                "required": False,
                "allow_blank": True,
            },
            "is_recurring": {
                "required": False,
            },
            "receipt_image": {
                "required": False,
                "allow_null": True,
            },
            "transaction_type": {
                "required": False,
            },
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")

        if request and getattr(request, "user", None):
            user = request.user

            if user.is_authenticated:
                self.fields["account"].queryset = Account.objects.filter(
                    user=user
                )

    def validate_title(self, value):
        value = (value or "").strip()

        if not value:
            raise serializers.ValidationError(
                "Title cannot be empty."
            )

        return value

    def validate_time(self, value):
        value = (value or "").strip()

        if not value:
            return "12:00"

        if len(value) > 10:
            raise serializers.ValidationError(
                "Time must be 10 characters or fewer."
            )

        return value

    def validate(self, attrs):
        request = self.context.get("request")

        user = (
            getattr(request, "user", None)
            if request
            else None
        )

        account = attrs.get("account")

        # Security: user can only select their own account
        if (
            account is not None
            and user
            and user.is_authenticated
        ):
            if account.user_id != user.id:
                raise serializers.ValidationError(
                    {
                        "account": (
                            "You can only use your own account."
                        )
                    }
                )

        transaction_type = attrs.get(
            "transaction_type",
            getattr(
                self.instance,
                "transaction_type",
                "EXPENSE",
            ),
        )

        valid_types = dict(
            Expense.TRANSACTION_TYPES
        )

        if transaction_type not in valid_types:
            raise serializers.ValidationError(
                {
                    "transaction_type": (
                        "Invalid transaction type."
                    )
                }
            )

        return attrs

    def create(self, validated_data):
        request = self.context.get("request")

        user = (
            getattr(request, "user", None)
            if request
            else None
        )

        if user and user.is_authenticated:
            validated_data["user"] = user

        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Never allow changing transaction owner
        validated_data.pop("user", None)

        # Read-only field
        validated_data.pop("account_name", None)

        return super().update(
            instance,
            validated_data
        )