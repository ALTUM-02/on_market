from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from api.models import UserProfile


class UserSerializer(serializers.ModelSerializer):
    """Public user data returned after login, register, and auth checks."""

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class LoginSerializer(serializers.Serializer):
    """Validate login credentials."""

    username = serializers.CharField(
        required=True,
        allow_blank=False,
        trim_whitespace=True,
        error_messages={
            'blank': 'Username cannot be empty.',
            'required': 'Username is required.',
            'null': 'Username cannot be null.',
        },
    )
    password = serializers.CharField(
        required=True,
        allow_blank=False,
        trim_whitespace=False,
        write_only=True,
        error_messages={
            'blank': 'Password cannot be empty.',
            'required': 'Password is required.',
            'null': 'Password cannot be null.',
        },
    )

    def validate_username(self, value):
        return value.strip()

    def validate_password(self, value):
        if not value.strip():
            raise serializers.ValidationError('Password cannot be empty.')
        return value


class RegisterSerializer(serializers.ModelSerializer):
    """Validate and create new users."""

    username = serializers.CharField(
        required=True,
        allow_blank=False,
        trim_whitespace=True,
        max_length=150,
        error_messages={
            'blank': 'Username cannot be empty.',
            'required': 'Username is required.',
            'null': 'Username cannot be null.',
        },
    )
    email = serializers.EmailField(
        required=True,
        allow_blank=False,
        trim_whitespace=True,
        error_messages={
            'blank': 'Email cannot be empty.',
            'required': 'Email is required.',
            'null': 'Email cannot be null.',
            'invalid': 'Enter a valid email address.',
        },
    )
    password = serializers.CharField(
        required=True,
        allow_blank=False,
        trim_whitespace=False,
        write_only=True,
        error_messages={
            'blank': 'Password cannot be empty.',
            'required': 'Password is required.',
            'null': 'Password cannot be null.',
        },
    )
    password_confirm = serializers.CharField(
        required=True,
        allow_blank=False,
        trim_whitespace=False,
        write_only=True,
        error_messages={
            'blank': 'Password confirmation cannot be empty.',
            'required': 'Password confirmation is required.',
            'null': 'Password confirmation cannot be null.',
        },
    )
    first_name = serializers.CharField(
        required=False,
        allow_blank=True,
        trim_whitespace=True,
        max_length=150,
    )
    last_name = serializers.CharField(
        required=False,
        allow_blank=True,
        trim_whitespace=True,
        max_length=150,
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate_username(self, value):
        username = value.strip()
        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError('A user with this username already exists.')
        return username

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return email

    def validate_password(self, value):
        if not value.strip():
            raise serializers.ValidationError('Password cannot be empty.')
        return value

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})

        validate_password(data['password'])
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        UserProfile.objects.get_or_create(user=user)
        return user
