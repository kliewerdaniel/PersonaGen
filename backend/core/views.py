import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .serializers import PersonaSerializer, BlogPostSerializer
from .models import Persona, BlogPost
from .utils import generate_content

logger = logging.getLogger(__name__)

class AnalyzeWritingSampleView(APIView):
    def post(self, request, *args, **kwargs):
        logger.debug(f"Request data: {request.data}")
        serializer = PersonaSerializer(data=request.data)
        if serializer.is_valid():
            persona = serializer.save()
            return Response(PersonaSerializer(persona).data, status=status.HTTP_201_CREATED)
        else:
            logger.error(f"Serializer validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GenerateContentView(APIView):
    def post(self, request):
        persona_id = request.data.get('persona_id')
        prompt = request.data.get('prompt')

        if not persona_id:
            logger.warning('persona_id is required.')
            return Response({'error': 'persona_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not prompt:
            logger.warning('prompt is required.')
            return Response({'error': 'prompt is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            persona = Persona.objects.get(id=persona_id)
        except Persona.DoesNotExist:
            logger.warning(f"Persona with ID {persona_id} not found.")
            return Response({'error': f'Persona with ID {persona_id} not found'}, status=status.HTTP_404_NOT_FOUND)

        # Call generate_content to create the blog post content
        blog_post_content = generate_content(persona.data, prompt)

        if not blog_post_content:
            logger.error('Failed to generate blog post content.')
            return Response({'error': 'Failed to generate blog post content.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Ensure content is split into title and body
        lines = blog_post_content.strip().split('\n')
        title = lines[0] if lines else 'Untitled'
        content = '\n'.join(lines[1:]) if len(lines) > 1 else ''

        # Create the BlogPost object and save it to the database
        blog_post = BlogPost.objects.create(
            persona=persona,
            title=title,
            content=content,


        )

        # Log for debugging purposes
        logger.debug(f"Blog post created with title: {title}")

        # Return the serialized blog post data
        return Response(BlogPostSerializer(blog_post).data, status=status.HTTP_201_CREATED)
    
class PersonaListView(generics.ListAPIView):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer

class PersonaDetailView(APIView):
    def get(self, request, persona_id):
        try:
            persona = Persona.objects.get(id=persona_id)
        except Persona.DoesNotExist:
            logger.warning(f"Persona with ID {persona_id} not found.")
            return Response({'error': 'Persona not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PersonaSerializer(persona)
        return Response(serializer.data, status=status.HTTP_200_OK)

class BlogPostView(generics.ListAPIView):
    queryset = BlogPost.objects.all().order_by('-created_at')
    serializer_class = BlogPostSerializer
