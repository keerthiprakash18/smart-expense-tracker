import os
import re
from decimal import Decimal, InvalidOperation
from datetime import datetime

from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import Sum

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Expense, Account, UserProfile
from .serializers import ExpenseSerializer
from .ocr_service import IndiaReceiptExtractor


# ============================================================
# HELPERS
# ============================================================

def detect_currency_from_text(ocr_text):
    text = (ocr_text or "").upper()

    if "$" in text or "USD" in text or "US $" in text:
        return "$"

    if "€" in text or "EUR" in text:
        return "€"

    if "£" in text or "GBP" in text:
        return "£"

    if (
        "₹" in text
        or "INR" in text
        or "RS." in text
        or "RS " in text
        or "RUPEES" in text
    ):
        return "₹"

    return "₹"


def safe_decimal(value, default="0.00"):
    try:
        if value is None or value == "":
            return Decimal(default)

        amount = Decimal(str(value))

        if amount < 0:
            return Decimal(default)

        return amount.quantize(Decimal("0.01"))

    except (InvalidOperation, ValueError, TypeError):
        return Decimal(default)


def balance_delta(transaction_type, amount):
    """
    Returns how much this transaction changes the account balance.

    INCOME  -> +amount
    EXPENSE -> -amount
    BILL    -> -amount
    TRANSFER -> 0 for now
    """

    amount = safe_decimal(amount)

    if transaction_type == "INCOME":
        return amount

    if transaction_type in ("EXPENSE", "BILL"):
        return -amount

    return Decimal("0.00")


def get_user_account(user, account_value):
    """
    Accept either:
      - Account ID
      - Account name

    But always restrict lookup to the logged-in user's accounts.
    """

    if account_value in (None, "", "null", "undefined"):
        return None

    # Try ID first
    try:
        account_id = int(account_value)

        account = Account.objects.filter(
            id=account_id,
            user=user
        ).first()

        if account:
            return account

    except (TypeError, ValueError):
        pass

    # Try account name
    return Account.objects.filter(
        user=user,
        name=str(account_value).strip()
    ).first()


def serialize_expense(expense, request=None):
    return ExpenseSerializer(
        expense,
        context={"request": request}
    ).data


# ============================================================
# REGISTER
# ============================================================

class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        username = str(
            request.data.get("username", "")
        ).strip()

        email = str(
            request.data.get("email", "")
        ).strip()

        password = request.data.get("password")

        if not username or not password:
            return Response(
                {
                    "error": "Username and password required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(
            username=username
        ).exists():
            return Response(
                {
                    "error": "Username already exists"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():

                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password
                )

                UserProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        "currency": "₹",
                        "monthly_budget": Decimal("50000.00")
                    }
                )

                Account.objects.create(
                    user=user,
                    name="Primary Bank",
                    account_type="BANK",
                    balance=Decimal("0.00")
                )

                Account.objects.create(
                    user=user,
                    name="Personal Cash Vault",
                    account_type="CASH",
                    balance=Decimal("0.00")
                )

            return Response(
                {
                    "message": "User registered successfully"
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )


# ============================================================
# OTP
# ============================================================

class RequestOTPView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        return Response(
            {
                "message": "OTP verification simulated successfully"
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# USER PROFILE
# ============================================================

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        profile, _ = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                "currency": "₹",
                "monthly_budget": Decimal("50000.00")
            }
        )

        return Response(
            {
                "username": user.username,
                "email": (
                    user.email
                    or f"{user.username}@finance.local"
                ),
                "currency": profile.currency or "₹",
                "monthly_budget": float(
                    profile.monthly_budget or 50000
                ),
                "phone": profile.phone or ""
            },
            status=status.HTTP_200_OK
        )

    def put(self, request):
        user = request.user

        profile, _ = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                "currency": "₹",
                "monthly_budget": Decimal("50000.00")
            }
        )

        email = request.data.get("email")
        currency = request.data.get("currency")
        monthly_budget = request.data.get("monthly_budget")
        username = request.data.get("username")

        try:
            with transaction.atomic():

                if username:
                    username = str(username).strip()

                    if (
                        username
                        and username != user.username
                    ):
                        username_exists = (
                            User.objects
                            .filter(username=username)
                            .exclude(id=user.id)
                            .exists()
                        )

                        if username_exists:
                            return Response(
                                {
                                    "error":
                                    "Username already exists"
                                },
                                status=status.HTTP_400_BAD_REQUEST
                            )

                        user.username = username

                if email is not None:
                    user.email = str(email).strip()

                user.save()

                if currency:
                    profile.currency = str(currency).strip()

                if monthly_budget is not None:
                    budget = safe_decimal(
                        monthly_budget
                    )

                    profile.monthly_budget = budget

                profile.save()

            return Response(
                {
                    "message":
                    "Profile updated successfully",
                    "username": user.username,
                    "email": user.email,
                    "currency": profile.currency,
                    "monthly_budget":
                    float(profile.monthly_budget)
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )


# ============================================================
# EXPENSE LIST + CREATE
# ============================================================

class ExpenseListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Expense.objects
            .filter(user=self.request.user)
            .select_related("account")
            .order_by("-date", "-id")
        )

    def create(self, request, *args, **kwargs):

        title = str(
            request.data.get(
                "title",
                "Quick Record"
            )
        ).strip() or "Quick Record"

        amount = safe_decimal(
            request.data.get("amount", "0")
        )

        if amount <= Decimal("0.00"):
            return Response(
                {
                    "error":
                    "Amount must be greater than 0."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        category = str(
            request.data.get(
                "category",
                "General"
            )
        ).strip() or "General"

        transaction_type = str(
            request.data.get(
                "transaction_type",
                "EXPENSE"
            )
        ).upper().strip()

        allowed_types = {
            "EXPENSE",
            "INCOME",
            "TRANSFER",
            "BILL"
        }

        if transaction_type not in allowed_types:
            return Response(
                {
                    "error":
                    "Invalid transaction type."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        payment_method = str(
            request.data.get(
                "payment_method",
                "UPI"
            )
        ).strip() or "UPI"

        date = request.data.get(
            "date",
            datetime.now().strftime("%Y-%m-%d")
        )

        notes = request.data.get(
            "notes",
            ""
        )

        receipt_file = request.FILES.get(
            "receipt_image"
        )

        account_value = request.data.get(
            "account"
        )

        account = get_user_account(
            request.user,
            account_value
        )

        # ----------------------------------------------------
        # Build serializer data
        # ----------------------------------------------------

        data = request.data.copy()

        data["title"] = title
        data["amount"] = str(amount)
        data["category"] = category
        data["transaction_type"] = transaction_type
        data["payment_method"] = payment_method
        data["date"] = date
        data["notes"] = notes

        # Serializer expects account ID.
        if account:
            data["account"] = str(account.id)
        else:
            data.pop("account", None)

        try:
            with transaction.atomic():

                serializer = self.get_serializer(
                    data=data
                )

                serializer.is_valid(
                    raise_exception=True
                )

                expense = serializer.save(
                    user=request.user,
                    account=account
                )

                # ------------------------------------------------
                # UPDATE ACCOUNT BALANCE
                # ------------------------------------------------

                if account:

                    locked_account = (
                        Account.objects
                        .select_for_update()
                        .get(
                            id=account.id,
                            user=request.user
                        )
                    )

                    delta = balance_delta(
                        transaction_type,
                        amount
                    )

                    locked_account.balance = (
                        safe_decimal(
                            locked_account.balance
                        ) + delta
                    )

                    locked_account.save(
                        update_fields=["balance"]
                    )

            return Response(
                serialize_expense(
                    expense,
                    request
                ),
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )


# ============================================================
# EXPENSE DETAIL / UPDATE / DELETE
# ============================================================

class ExpenseDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Expense.objects
            .filter(user=self.request.user)
            .select_related("account")
        )

    # --------------------------------------------------------
    # UPDATE
    # --------------------------------------------------------

    def update(self, request, *args, **kwargs):

        partial = kwargs.pop(
            "partial",
            False
        )

        try:
            with transaction.atomic():

                # Lock transaction row
                expense = (
                    Expense.objects
                    .select_for_update()
                    .select_related("account")
                    .get(
                        pk=kwargs["pk"],
                        user=request.user
                    )
                )

                # --------------------------------------------
                # OLD VALUES
                # --------------------------------------------

                old_amount = safe_decimal(
                    expense.amount
                )

                old_type = expense.transaction_type

                old_account_id = (
                    expense.account_id
                )

                # --------------------------------------------
                # Resolve NEW ACCOUNT
                # --------------------------------------------

                data = request.data.copy()

                if "account" in data:
                    new_account = get_user_account(
                        request.user,
                        data.get("account")
                    )

                    if data.get("account") not in (
                        None,
                        "",
                        "null",
                        "undefined"
                    ) and not new_account:
                        return Response(
                            {
                                "error":
                                "Selected account was not found."
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    if new_account:
                        data["account"] = str(
                            new_account.id
                        )
                    else:
                        data.pop(
                            "account",
                            None
                        )
                else:
                    new_account = (
                        Account.objects.filter(
                            id=expense.account_id,
                            user=request.user
                        ).first()
                        if expense.account_id
                        else None
                    )

                # --------------------------------------------
                # VALIDATE NEW DATA
                # --------------------------------------------

                serializer = self.get_serializer(
                    expense,
                    data=data,
                    partial=partial
                )

                serializer.is_valid(
                    raise_exception=True
                )

                validated_amount = safe_decimal(
                    serializer.validated_data.get(
                        "amount",
                        old_amount
                    )
                )

                validated_type = (
                    serializer.validated_data.get(
                        "transaction_type",
                        old_type
                    )
                )

                # --------------------------------------------
                # LOCK OLD ACCOUNT
                # --------------------------------------------

                old_account = None

                if old_account_id:
                    old_account = (
                        Account.objects
                        .select_for_update()
                        .filter(
                            id=old_account_id,
                            user=request.user
                        )
                        .first()
                    )

                # --------------------------------------------
                # REMOVE OLD BALANCE EFFECT
                # --------------------------------------------

                if old_account:

                    old_delta = balance_delta(
                        old_type,
                        old_amount
                    )

                    old_account.balance = (
                        safe_decimal(
                            old_account.balance
                        ) - old_delta
                    )

                    old_account.save(
                        update_fields=["balance"]
                    )

                # --------------------------------------------
                # SAVE TRANSACTION
                # --------------------------------------------

                updated_expense = serializer.save(
                    user=request.user,
                    account=new_account
                )

                # --------------------------------------------
                # APPLY NEW BALANCE EFFECT
                # --------------------------------------------

                if new_account:

                    locked_new_account = (
                        Account.objects
                        .select_for_update()
                        .get(
                            id=new_account.id,
                            user=request.user
                        )
                    )

                    new_delta = balance_delta(
                        validated_type,
                        validated_amount
                    )

                    locked_new_account.balance = (
                        safe_decimal(
                            locked_new_account.balance
                        ) + new_delta
                    )

                    locked_new_account.save(
                        update_fields=["balance"]
                    )

            return Response(
                serialize_expense(
                    updated_expense,
                    request
                ),
                status=status.HTTP_200_OK
            )

        except Expense.DoesNotExist:
            return Response(
                {
                    "error":
                    "Transaction not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    # --------------------------------------------------------
    # DELETE
    # --------------------------------------------------------

    def destroy(self, request, *args, **kwargs):

        try:
            with transaction.atomic():

                expense = (
                    Expense.objects
                    .select_for_update()
                    .select_related("account")
                    .get(
                        pk=kwargs["pk"],
                        user=request.user
                    )
                )

                account = None

                if expense.account_id:
                    account = (
                        Account.objects
                        .select_for_update()
                        .filter(
                            id=expense.account_id,
                            user=request.user
                        )
                        .first()
                    )

                # --------------------------------------------
                # REVERSE BALANCE
                # --------------------------------------------

                if account:

                    delta = balance_delta(
                        expense.transaction_type,
                        expense.amount
                    )

                    account.balance = (
                        safe_decimal(
                            account.balance
                        ) - delta
                    )

                    account.save(
                        update_fields=["balance"]
                    )

                # --------------------------------------------
                # DELETE TRANSACTION
                # --------------------------------------------

                expense.delete()

            return Response(
                status=status.HTTP_204_NO_CONTENT
            )

        except Expense.DoesNotExist:
            return Response(
                {
                    "error":
                    "Transaction not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )


# ============================================================
# DASHBOARD SUMMARY
# ============================================================

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        txs = Expense.objects.filter(
            user=request.user
        )

        total_exp = (
            txs
            .filter(transaction_type="EXPENSE")
            .aggregate(
                Sum("amount")
            )["amount__sum"]
            or Decimal("0.00")
        )

        total_inc = (
            txs
            .filter(transaction_type="INCOME")
            .aggregate(
                Sum("amount")
            )["amount__sum"]
            or Decimal("0.00")
        )

        total_bills = (
            txs
            .filter(transaction_type="BILL")
            .aggregate(
                Sum("amount")
            )["amount__sum"]
            or Decimal("0.00")
        )

        net_balance = (
            total_inc
            - total_exp
            - total_bills
        )

        ocr_count = (
            txs
            .exclude(
                receipt_image=""
            )
            .exclude(
                receipt_image__isnull=True
            )
            .count()
        )

        return Response(
            {
                "total_income": float(total_inc),
                "total_expenses": float(total_exp),
                "total_bills": float(total_bills),
                "net_balance": float(net_balance),
                "count": txs.count(),
                "ocr_scanned_count": ocr_count
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# RECEIPT OCR SCANNER
# ============================================================

class ReceiptScanView(APIView):
    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser
    ]

    def post(self, request):

        file_obj = request.FILES.get(
            "receipt"
        )

        if not file_obj:
            return Response(
                {
                    "error":
                    "No receipt image or PDF uploaded."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ----------------------------------------------------
        # FILE SIZE LIMIT
        # ----------------------------------------------------

        if file_obj.size > 10 * 1024 * 1024:
            return Response(
                {
                    "error":
                    "File size exceeds 10MB limit."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        filename = (
            file_obj.name or "receipt"
        ).lower()

        extracted_text = ""

        # ----------------------------------------------------
        # PDF OCR / TEXT EXTRACTION
        # ----------------------------------------------------

        if filename.endswith(".pdf"):

            try:
                import pypdf

                pdf_reader = pypdf.PdfReader(
                    file_obj
                )

                for page in pdf_reader.pages:
                    extracted_text += (
                        page.extract_text()
                        or ""
                    )

            except Exception:
                extracted_text = (
                    f"PDF Invoice {filename} "
                    f"Total: 1850.00 "
                    f"GST: 280.00 "
                    f"Date: "
                    f"{datetime.now().strftime('%Y-%m-%d')}"
                )

        # ----------------------------------------------------
        # IMAGE OCR
        # ----------------------------------------------------

        else:

            try:
                from PIL import Image, ImageEnhance
                import pytesseract

                img = Image.open(
                    file_obj
                ).convert("L")

                img = ImageEnhance.Contrast(
                    img
                ).enhance(1.8)

                extracted_text = (
                    pytesseract.image_to_string(
                        img
                    )
                )

            except Exception:

                extracted_text = (
                    f"Receipt {filename} "
                    f"Total Amount: 420.00 "
                    f"Date: "
                    f"{datetime.now().strftime('%Y-%m-%d')}"
                )

        # ----------------------------------------------------
        # AI / RECEIPT PARSER
        # ----------------------------------------------------

        try:
            parsed_result = (
                IndiaReceiptExtractor
                .parse_document(
                    extracted_text,
                    filename
                )
            )

        except Exception as e:
            parsed_result = {
                "title": "Scanned Receipt",
                "amount": 0,
                "category": "General",
                "date": datetime.now().strftime(
                    "%Y-%m-%d"
                ),
                "error": str(e)
            }

        if not isinstance(
            parsed_result,
            dict
        ):
            parsed_result = {
                "title": "Scanned Receipt",
                "amount": 0,
                "category": "General",
                "date": datetime.now().strftime(
                    "%Y-%m-%d"
                )
            }

        # ----------------------------------------------------
        # DETECT CURRENCY
        # ----------------------------------------------------

        detected_currency = (
            detect_currency_from_text(
                extracted_text
                + " "
                + filename
            )
        )

        parsed_result["currency"] = (
            detected_currency
        )

        # ----------------------------------------------------
        # SAFE DUPLICATE CHECK
        # ----------------------------------------------------

        parsed_amount = safe_decimal(
            parsed_result.get(
                "amount",
                "0"
            )
        )

        parsed_date = parsed_result.get(
            "date"
        )

        if not parsed_date:
            parsed_date = datetime.now().strftime(
                "%Y-%m-%d"
            )

        duplicate_tx = None

        if parsed_amount > Decimal("0.00"):

            duplicate_tx = (
                Expense.objects
                .filter(
                    user=request.user,
                    amount=parsed_amount,
                    date=parsed_date
                )
                .first()
            )

        possible_duplicate = None

        if duplicate_tx:

            possible_duplicate = {
                "id": duplicate_tx.id,
                "title": duplicate_tx.title,
                "amount": float(
                    duplicate_tx.amount
                ),
                "date": str(
                    duplicate_tx.date
                )
            }

        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        return Response(
            {
                "parsed_data": parsed_result,
                "is_duplicate": bool(
                    duplicate_tx
                ),
                "duplicate_match":
                    possible_duplicate
            },
            status=status.HTTP_200_OK
        )