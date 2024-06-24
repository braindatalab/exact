import uuid 
import os 
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from .models import *
from .serializers import *
from .worker_utils import trigger_evaluation_script_inside_worker
from django.http import HttpResponse
from .forms import ChallengeForm
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

    input_file = request.FILES.get('file')

    if input_file is None:
        return Response({'error': f'error getting the input file'}, status=status.HTTP_400_BAD_REQUEST)

    file_contents = input_file.read().decode('utf-8')

    # initialise a worker on the server that will evaluate the uploaded solution and return a score  
    message = trigger_evaluation_script_inside_worker(file_contents)

    return Response({'message': message}, status=status.HTTP_200_OK)


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
@csrf_exempt
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