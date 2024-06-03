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
from .utils.s3_utils import upload_file_to_amazon
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from .models import Challenge, Xaimethod, Dataset, Mlmodel
from django.shortcuts import render, redirect

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
        dataset = Dataset.objects.get(challenge_id=challenge_id)
        dataset_url = dataset.dataset_url
        
        # Redirect to the dataset URL
        return redirect(dataset_url)
    
    except Dataset.DoesNotExist:
        return Response({'error': 'Dataset not found'}, status=status.HTTP_404_NOT_FOUND)

# redirect to download the mlmodel file associated with the challenge_id 
@api_view(['GET'])
def mlmodel_detail(request, challenge_id):
    try:
        mlmodel = Mlmodel.objects.get(challenge_id=challenge_id)
        mlmodel_url = mlmodel.model_url
        
        # Redirect to the dataset URL
        return redirect(mlmodel_url)
    
    except Dataset.DoesNotExist:
        return Response({'error': 'Machine learning Model not found'}, status=status.HTTP_404_NOT_FOUND)

# redirect to download the xaimethod file associated with the challenge_id 
@api_view(['GET'])
def xaimethod_detail(request, challenge_id):
    try:
        xaimethod = Xaimethod.objects.get(challenge_id=challenge_id)
        xaimethod_url = xaimethod.xai_method_url
        
        # Redirect to the dataset URL
        return redirect(xaimethod_url)
    
    except Dataset.DoesNotExist:
        return Response({'error': 'XAI Method not found'}, status=status.HTTP_404_NOT_FOUND)

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

            # create new Challenge object 
            new_challenge = Challenge.objects.create(
                challenge_id = unique_id,
                title = title,
                description = description
            )

            # Extract the extension 
            xai_method_ext = os.path.splitext(xai_method_file.name)[1]
            # Rename the file with a new name and the original extension
            new_xai_name = f"xaimethod{xai_method_ext}"
            xai_method_url = upload_file_to_amazon(xai_method_file, settings.AWS_STORAGE_BUCKET_NAME, f"{unique_id}/xai_method/{new_xai_name}")
            
            # Extract the extension 
            dataset_ext = os.path.splitext(dataset_file.name)[1]
            # Rename the file with a new name and the original extension
            new_dataset_name = f"dataset{dataset_ext}"
            dataset_url = upload_file_to_amazon(dataset_file, settings.AWS_STORAGE_BUCKET_NAME, f"{unique_id}/dataset/{new_dataset_name}")
            
            # Extract the extension 
            mlmodel_ext = os.path.splitext(mlmodel_file.name)[1]
            # Rename the file with a new name and the original extension
            new_mlmodel_name = f"mlmodel{mlmodel_ext}"
            mlmodel_url = upload_file_to_amazon(mlmodel_file, settings.AWS_STORAGE_BUCKET_NAME,  f"{unique_id}/mlmodel/{new_mlmodel_name}")

            # now save the urls in railway database 
            Xaimethod.objects.create(
                challenge_id = unique_id,
                xai_method_url = xai_method_url
            )

            Dataset.objects.create(
                challenge_id = unique_id,
                dataset_url = dataset_url
            )
            Mlmodel.objects.create(
                challenge_id = unique_id,
                model_url = mlmodel_url
            )
            
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

            # create new Challenge object 
            new_challenge = Challenge.objects.create(
                challenge_id = unique_id,
                title = title,
                description = description
            )

            # save the files into Amazon S3 and fetch urls

            # Extract the extension 
            xai_method_ext = os.path.splitext(xai_method_file.name)[1]
            # Rename the file with a new name and the original extension
            new_xai_name = f"xaimethod{xai_method_ext}"
            xai_method_url = upload_file_to_amazon(xai_method_file, settings.AWS_STORAGE_BUCKET_NAME, f"{unique_id}/xai_method/{new_xai_name}")
            
            # Extract the extension 
            dataset_ext = os.path.splitext(dataset_file.name)[1]
            # Rename the file with a new name and the original extension
            new_dataset_name = f"dataset{dataset_ext}"
            dataset_url = upload_file_to_amazon(dataset_file, settings.AWS_STORAGE_BUCKET_NAME, f"{unique_id}/dataset/{new_dataset_name}")
            
            # Extract the extension 
            mlmodel_ext = os.path.splitext(mlmodel_file.name)[1]
            # Rename the file with a new name and the original extension
            new_mlmodel_name = f"mlmodel{mlmodel_ext}"
            mlmodel_url = upload_file_to_amazon(mlmodel_file, settings.AWS_STORAGE_BUCKET_NAME,  f"{unique_id}/mlmodel/{new_mlmodel_name}")

            # now save the urls in railway database 
            Xaimethod.objects.create(
                challenge_id = unique_id,
                xai_method_url = xai_method_url
            )

            Dataset.objects.create(
                challenge_id = unique_id,
                dataset_url = dataset_url
            )
            Mlmodel.objects.create(
                challenge_id = unique_id,
                model_url = mlmodel_url
            )

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