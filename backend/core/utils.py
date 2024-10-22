import logging
import requests
import json
import re
from decouple import config

logger = logging.getLogger(__name__)

XAI_API_KEY = config('XAI_API_KEY')
XAI_API_BASE = "https://api.x.ai/v1"


def analyze_writing_sample(writing_sample):
    endpoint = f"{XAI_API_BASE}/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {XAI_API_KEY}"
    }
    payload = {
        "messages": [
            {
                "role": "system",
                "content": "You are an assistant that analyzes writing samples."
            },
            {
                "role": "user",
                "content": f'''
                Please analyze the writing style and personality of the given writing sample. Provide a detailed assessment of their characteristics using the following template. Rate each applicable characteristic on a scale of 1-10 where relevant, or provide a descriptive value. Return the results in a JSON format.

                "name": "[Author/Character Name]",
                "vocabulary_complexity": [1-10],
                "sentence_structure": "[simple/complex/varied]",
                "paragraph_organization": "[structured/loose/stream-of-consciousness]",
                "idiom_usage": [1-10],
                "metaphor_frequency": [1-10],
                "simile_frequency": [1-10],
                "tone": "[formal/informal/academic/conversational/etc.]",
                "punctuation_style": "[minimal/heavy/unconventional]",
                "contraction_usage": [1-10],
                "pronoun_preference": "[first-person/third-person/etc.]",
                "passive_voice_frequency": [1-10],
                "rhetorical_question_usage": [1-10],
                "list_usage_tendency": [1-10],
                "personal_anecdote_inclusion": [1-10],
                "pop_culture_reference_frequency": [1-10],
                "technical_jargon_usage": [1-10],
                "parenthetical_aside_frequency": [1-10],
                "humor_sarcasm_usage": [1-10],
                "emotional_expressiveness": [1-10],
                "emphatic_device_usage": [1-10],
                "quotation_frequency": [1-10],
                "analogy_usage": [1-10],
                "sensory_detail_inclusion": [1-10],
                "onomatopoeia_usage": [1-10],
                "alliteration_frequency": [1-10],
                "word_length_preference": "[short/long/varied]",
                "foreign_phrase_usage": [1-10],
                "rhetorical_device_usage": [1-10],
                "statistical_data_usage": [1-10],
                "personal_opinion_inclusion": [1-10],
                "transition_usage": [1-10],
                "reader_question_frequency": [1-10],
                "imperative_sentence_usage": [1-10],
                "dialogue_inclusion": [1-10],
                "regional_dialect_usage": [1-10],
                "hedging_language_frequency": [1-10],
                "language_abstraction": "[concrete/abstract/mixed]",
                "personal_belief_inclusion": [1-10],
                "repetition_usage": [1-10],
                "subordinate_clause_frequency": [1-10],
                "verb_type_preference": "[active/stative/mixed]",
                "sensory_imagery_usage": [1-10],
                "symbolism_usage": [1-10],
                "digression_frequency": [1-10],
                "formality_level": [1-10],
                "reflection_inclusion": [1-10],
                "irony_usage": [1-10],
                "neologism_frequency": [1-10],
                "ellipsis_usage": [1-10],
                "cultural_reference_inclusion": [1-10],
                "stream_of_consciousness_usage": [1-10],
                "openness_to_experience": [1-10],
                "conscientiousness": [1-10],
                "extraversion": [1-10],
                "agreeableness": [1-10],
                "emotional_stability": [1-10],
                "dominant_motivations": "[achievement/affiliation/power/etc.]",
                "core_values": "[integrity/freedom/knowledge/etc.]",
                "decision_making_style": "[analytical/intuitive/spontaneous/etc.]",
                "empathy_level": [1-10],
                "self_confidence": [1-10],
                "risk_taking_tendency": [1-10],
                "idealism_vs_realism": "[idealistic/realistic/mixed]",
                "conflict_resolution_style": "[assertive/collaborative/avoidant/etc.]",
                "relationship_orientation": "[independent/communal/mixed]",
                "emotional_response_tendency": "[calm/reactive/intense]",
                "creativity_level": [1-10],
                "age": "[age or age range]",
                "gender": "[gender]",
                "education_level": "[highest level of education]",
                "professional_background": "[brief description]",
                "cultural_background": "[brief description]",
                "primary_language": "[language]",
                "language_fluency": "[native/fluent/intermediate/beginner]",
                "background": "[A brief paragraph describing the author's context, major influences, and any other relevant information not captured above]"

                Writing Sample:
                {writing_sample}
                '''
            }
        ],
        "model": "grok-beta",
        "stream": False,
        "temperature": 0
    }

    try:
        response = requests.post(endpoint, headers=headers, json=payload)
        response.raise_for_status()  # Raises HTTPError for bad responses

 # Log the API response for debugging
        logger.debug(f"OpenAI API response: {response.text}")

        assistant_message = response.json()['choices'][0]['message']['content'].strip()
        logger.debug(f"Assistant message: {assistant_message}")

        # Extract JSON from the assistant's message
        json_str = re.search(r'\{.*\}', assistant_message, re.DOTALL)
        if json_str:
            analyzed_data = json.loads(json_str.group())
        else:
            logger.error("No JSON object found in the response.")
            return None

        return analyzed_data

    except requests.exceptions.RequestException as e:
        logger.error(f"HTTP Request failed: {e}")
        return None
    except json.JSONDecodeError as e:
        logger.error(f"JSON decoding failed: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return None


def generate_content(persona_data, prompt):
    endpoint = f"{XAI_API_BASE}/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {XAI_API_KEY}"
    }

    # Format the persona data into a readable string
    characteristics = '\n'.join([
        f"{key.replace('_', ' ').capitalize()}: {value}"
        for key, value in persona_data.items()
        if value is not None and key not in ['id', 'name']
    ])

    decoding_prompt = f'''
    You are to write a blog post in the style of {persona_data.get('name', 'Unknown Author')}, a writer with the following characteristics:

    {characteristics}

    Now, please write a response in this style about the following topic:
    "{prompt}"
    Begin with a compelling title that reflects the content of the post.
    '''

    payload = {
        "messages": [
            {"role": "system", "content": "You are an assistant that generates blog posts."},
            {"role": "user", "content": decoding_prompt}
        ],
        "model": "grok-beta",
        "stream": False,
        "temperature": 0
    }

    try:
        response = requests.post(endpoint, headers=headers, json=payload)
        response.raise_for_status()

        assistant_message = response.json()['choices'][0]['message']['content'].strip()
        logger.debug(f"Assistant message: {assistant_message}")

        return assistant_message

    except requests.exceptions.RequestException as e:
        logger.error(f"HTTP Request failed: {e}")
        return ''
    except json.JSONDecodeError as e:
        logger.error(f"JSON decoding failed: {e}")
        return ''
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return ''

def save_blog_post(blog_post, title):
    # Implement if needed
    pass

