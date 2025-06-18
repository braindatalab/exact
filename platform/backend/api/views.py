import uuid 
import os 
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from .models import *
from .serializers import *
from .worker_utils import spawn_worker_container
from django.http import HttpResponse
from .forms import ChallengeForm
from .forms import ScoreForm
# from .utils.s3_utils import upload_file_to_amazon
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from .models import Challenge
from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from os.path import splitext
from django.http import FileResponse, Http404

@api_view(['POST'])
@parser_classes([MultiPartParser])
def xai_detail(request, challenge_id):
    # Get the XAI method file from the request
    form = ScoreForm(request.POST, request.FILES)
    input_file = None
    username = None
    if form.is_valid():
        input_file = form.cleaned_data['file']
        username = form.cleaned_data['username']

    if input_file is None or username is None:
        return Response({'error': f'error getting the input file'}, status=status.HTTP_400_BAD_REQUEST)

    xai_method = input_file.read().decode('utf-8')

    # Initialise a worker on the server that will evaluate the uploaded solution and return a score  
    (message, score) = spawn_worker_container(uuid.uuid4().hex, challenge_id, xai_method)

    # Return message in response when something went wrong while computing the score
    if (score == None):
        return Response({'message': message, score: None}, status=status.HTTP_200_OK)

    # Store score in the database
    serializer = ScoreSerializer(data={'score': score, 'challenge_id': challenge_id, 'username': username})
    if serializer.is_valid():
        serializer.save()
        return Response({'message': message, 'score': serializer.data}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def score_detail(request, challenge_id):

    try:
        score = Score.objects.filter(challenge_id=challenge_id).first()
    except Score.DoesNotExist:
        return Response(status=status.HTTP_404)

    if request.method == "GET":
        serializer = ScoreSerializer(score)
        return Response(serializer.data)

    if request.method == "POST":
        if score:  # If a score with this challenge_id already exists
            serializer = ScoreSerializer(score, data=request.data)
        else:
            # Create a new score if it doesn't exist
            serializer = ScoreSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)

# redirect to download the dataset file associated with the challenge_id 
@api_view(['GET'])
def dataset_detail(request, challenge_id):
    try:
        # Get the challenge by challenge_id
        challenge = get_object_or_404(Challenge, challenge_id=challenge_id)
        
        # Get the xaimethod file path
        dataset_file = challenge.dataset
        
        # Serve the xaimethod file
        if dataset_file:
            file_extension = os.path.splitext(dataset_file.name)[1]
            custom_filename = f'dataset_file{file_extension}'
            response = FileResponse(dataset_file.open('rb'), as_attachment=True, filename=custom_filename)
            return response
        else:
            return Response({'error': 'Dataset file not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# redirect to download the mlmodel file associated with the challenge_id 
@api_view(['GET'])
def mlmodel_detail(request, challenge_id):
    try:
        # Get the challenge by challenge_id
        challenge = get_object_or_404(Challenge, challenge_id=challenge_id)
        
        # Get the xaimethod file path
        mlmodel_file = challenge.mlmodel
        
        # Serve the xaimethod file
        if mlmodel_file:
            file_extension = os.path.splitext(mlmodel_file.name)[1]
            custom_filename = f'mlmodel_file{file_extension}'
            response = FileResponse(mlmodel_file.open('rb'), as_attachment=True, filename=custom_filename)
            return response
        else:
            return Response({'error': 'Ml Method file not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# redirect to download the xaimethod file associated with the challenge_id 
@api_view(['GET'])
def xaimethod_detail(request, challenge_id):
    try:
        # Get the challenge by challenge_id
        challenge = get_object_or_404(Challenge, challenge_id=challenge_id)
        
        # Get the xaimethod file path
        xaimethod_file = challenge.xaimethod
        
        # Serve the xaimethod file
        if xaimethod_file:
            file_extension = os.path.splitext(xaimethod_file.name)[1]
            custom_filename = f'xai_method_file{file_extension}'
            response = FileResponse(xaimethod_file.open('rb'), as_attachment=True, filename=custom_filename)
            return response
        else:
            return Response({'error': 'XAI Method file not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# POST request for creating a new challenge 
@api_view(['POST'])
def create_challenge(request):
    if request.method == 'POST':
        # fetch the data from the POST request, strings and files 
        form = ChallengeForm(request.POST, request.FILES)

        if form.is_valid():
            # parse the important data for new challenge creation 
            title = form.cleaned_data['title']
            description = form.cleaned_data['description']
            xai_method_file = form.cleaned_data['xai_method']
            dataset_file = form.cleaned_data['dataset']
            mlmodel_file = form.cleaned_data['mlmodel']
            
            # Get creator from request data or use authenticated user
            creator = request.user.username if request.user.is_authenticated else request.data.get('creator', None)

            # generate a unique challenge_id in form of a string 
            unique_id = str(uuid.uuid4())

            # Upload files to storage and get URLs
            new_challenge = Challenge.objects.create(
                challenge_id=unique_id,
                title=title,
                description=description,
                xaimethod=xai_method_file,
                dataset=dataset_file,
                mlmodel=mlmodel_file,
                creator=creator,
            )
            new_challenge.save()
            
            # entries in database created. 
            return Response({"message": "Challenge created successfully"}, status = 201)
        else: 
            return Response({"errors":form.errors}, status=400)


@csrf_exempt  # Temporarily disable CSRF for testing
def challenge_form_view(request):
    if request.method == 'POST':
        # fetch the data from the POST request, strings and files 
        form = ChallengeForm(request.POST, request.FILES)

        if form.is_valid():
            # parse the important data for new challenge creation 
            title = form.cleaned_data['title']
            description = form.cleaned_data['description']
            xai_method_file = form.cleaned_data['xai_method']
            dataset_file = form.cleaned_data['dataset']
            mlmodel_file = form.cleaned_data['mlmodel']
            # Get creator from authenticated user or form data
            creator = request.user.username if request.user.is_authenticated else form.cleaned_data.get('creator', None)

            # generate a unique challenge_id in form of a string 
            unique_id = str(uuid.uuid4())

            # Upload files to storage and get URLs
            new_challenge = Challenge.objects.create(
                challenge_id=unique_id,
                title=title,
                description=description,
                xaimethod=xai_method_file,
                dataset=dataset_file,
                mlmodel=mlmodel_file,
                creator=creator,
            )
            new_challenge.save()
    
        return redirect('success')  # Redirect to a success page (create this view separately)
    else:
        form = ChallengeForm()

    return render(request, 'api/challenge_form.html', {'form': form})

def success_view(request):
    return render(request, 'api/success.html')

@api_view(['GET'])
def get_challenge(request, challenge_id):
    try: 
        challenge = Challenge.objects.get(challenge_id=challenge_id)
        serializer = ChallengeSerializer(challenge)
        serialized_data = serializer.data
        return Response(serialized_data)
    
    except:
        return Response({"error": "Challenge not found"}, status =404)
    
@api_view(['GET'])
def get_challenges(request):
    challenges = Challenge.objects.all()
    serializer = ChallengeSerializer(challenges, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_paginated_challenges(request):
    page = int(request.GET.get('page', 1))
    page_size = int(request.GET.get('page_size', 10))
    
    challenges = Challenge.objects.all().order_by('-created_at')
    total_challenges = challenges.count()
    
    start = (page - 1) * page_size
    end = start + page_size
    
    paginated_challenges = challenges[start:end]
    serializer = ChallengeSerializer(paginated_challenges, many=True)
    
    return Response({
        'challenges': serializer.data,
        'pagination': {
            'total': total_challenges,
            'page': page,
            'page_size': page_size,
            'total_pages': (total_challenges + page_size - 1) // page_size
        }
    })

# upload a new score (we don't need this endpoint anymore, because xai_detail function now automatically adds the score to the database)
# @api_view(['POST'])
# def add_score(request):
#     serializer = ScoreSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# fetch all scores 
@api_view(['GET'])
def get_scores(request): 
    scores = Score.objects.all()
    serializer = ScoreSerializer(scores, many=True)
    return Response(serializer.data)

# delete a challenge
@api_view(['DELETE'])
def delete_challenge(request, challenge_id):
    try:
        challenge = get_object_or_404(Challenge, challenge_id=challenge_id)
        
        # Optional: Check if the user has permission to delete the challenge
        # if request.user.username != challenge.creator and not request.user.is_staff:
        #     return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        # Delete the challenge
        challenge.delete()
        return Response({"message": "Challenge deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)