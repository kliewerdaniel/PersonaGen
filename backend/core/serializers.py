from rest_framework import serializers
from .models import Persona, BlogPost
from .utils import analyze_writing_sample
import logging

logger = logging.getLogger(__name__)

class PersonaSerializer(serializers.ModelSerializer):
    writing_sample = serializers.CharField(write_only=True)

    class Meta:
        model = Persona
        fields = ['id', 'name', 'writing_sample', 'data']
        read_only_fields = ['id', 'data']

    def create(self, validated_data):
        writing_sample = validated_data.pop('writing_sample')
        logger.debug(f"Writing sample received: {writing_sample[:100]}...")  # Log first 100 characters

        # Analyze the writing sample
        analyzed_data = analyze_writing_sample(writing_sample)
        logger.debug(f"Analyzed data: {analyzed_data}")

        if not analyzed_data:
            logger.error("analyze_writing_sample returned empty or invalid data.")
            raise serializers.ValidationError({"writing_sample": "Failed to analyze the writing sample."})

        # Store the analyzed data
        validated_data['data'] = analyzed_data

        # Save persona
        return Persona.objects.create(**validated_data)

class BlogPostSerializer(serializers.ModelSerializer):
    persona = serializers.StringRelatedField()  # Displays persona name

    class Meta:
        model = BlogPost
        fields = ['id', 'persona', 'title', 'content', 'created_at']
