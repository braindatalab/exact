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
    """
    Process XAI method submission and calculate both EMD and IMA scores.
    """
    form = ScoreForm(request.POST, request.FILES)
    if not form.is_valid():
        return Response({'error': 'Invalid form submission.'}, status=status.HTTP_400_BAD_REQUEST)

    input_file = form.cleaned_data['file']
    username = form.cleaned_data['username']
    method_name = form.cleaned_data.get('method_name', 'Unnamed Method')

    xai_method_code = input_file.read().decode('utf-8')

    (message, scores) = spawn_worker_container(uuid.uuid4().hex, challenge_id, xai_method_code)

    if message != "success" or not scores:
        return Response({'message': message, 'scores': None}, status=status.HTTP_200_OK)

    score_data = {
        'challenge_id': challenge_id,
        'username': username,
        'method_name': method_name,
        'status': 'completed',
        'emd_score': scores.get('emd_score'),
        'emd_std': scores.get('emd_std'),
        'ima_score': scores.get('ima_score'),
        'ima_std': scores.get('ima_std'),
        'score': scores.get('emd_score')  # Standard-Score ist EMD
    }

    serializer = ScoreSerializer(data=score_data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Evaluation completed successfully',
            'score': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def score_detail(request, challenge_id):
    """Get or update scores for a specific challenge."""
    try:
        score = Score.objects.filter(challenge_id=challenge_id).first()
    except Score.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = ScoreSerializer(score)
        return Response(serializer.data)

    if request.method == "POST":
        if score:
            serializer = ScoreSerializer(score, data=request.data)
        else:
            serializer = ScoreSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_leaderboard(request, challenge_id):
    """
    Get leaderboard for a challenge with option to sort by EMD or IMA.
    Query params: ?metric=emd or ?metric=ima (default: emd)
    """
    try:
        challenge = get_object_or_404(Challenge, challenge_id=challenge_id)
        metric = request.GET.get('metric', 'emd').lower()
        scores = Score.objects.filter(challenge_id=challenge_id, status='completed')
        
        if metric == 'ima':
            scores = scores.exclude(ima_score__isnull=True).order_by('-ima_score')
        else:
            scores = scores.exclude(emd_score__isnull=True).order_by('-emd_score')
        
        leaderboard = []
        for rank, score in enumerate(scores, 1):
            entry = {
                'rank': rank,
                'username': score.username,
                'method_name': score.method_name or 'Unnamed Method',
                'emd_score': score.emd_score,
                'emd_std': score.emd_std,
                'ima_score': score.ima_score,
                'ima_std': score.ima_std,
                'submitted_at': score.created_at.isoformat()
            }
            if metric == 'ima':
                entry['primary_score'] = score.ima_score
            else:
                entry['primary_score'] = score.emd_score
            leaderboard.append(entry)
        
        return Response({
            'challenge': {'id': challenge.challenge_id, 'title': challenge.title},
            'metric': metric,
            'leaderboard': leaderboard
        })
    except Challenge.DoesNotExist:
        return Response({'error': 'Challenge not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def dataset_detail(request, challenge_id):
    try:
        challenge = get_object_or_404(Challenge, challenge_id=challenge_id)
        dataset_file = challenge.dataset
        if dataset_file:
            file_extension = os.path.splitext(dataset_file.name)[1]
            custom_filename = f'dataset_file{file_extension}'
            return FileResponse(dataset_file.open('rb'), as_attachment=True, filename=custom_filename)
        else:
            return Response({'error': 'Dataset file not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def mlmodel_detail(request, challenge_id):
    try:
        challenge = get_object_or_404(Challenge, challenge_id=challenge_id)
        mlmodel_file = challenge.mlmodel
        if mlmodel_file:
            file_extension = os.path.splitext(mlmodel_file.name)[1]
            custom_filename = f'mlmodel_file{file_extension}'
            return FileResponse(mlmodel_file.open('rb'), as_attachment=True, filename=custom_filename)
        else:
            return Response({'error': 'Ml Method file not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def xaimethod_detail(request, challenge_id):
    try:
        challenge = get_object_or_404(Challenge, challenge_id=challenge_id)
        xaimethod_file = challenge.xaimethod
        if xaimethod_file:
            file_extension = os.path.splitext(xaimethod_file.name)[1]
            custom_filename = f'xai_method_file{file_extension}'
            return FileResponse(xaimethod_file.open('rb'), as_attachment=True, filename=custom_filename)
        else:
            return Response({'error': 'XAI Method file not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def create_challenge(request):
    if request.method == 'POST':
        form = ChallengeForm(request.POST, request.FILES)
        if form.is_valid():
            unique_id = str(uuid.uuid4())
            
            creator = "admin"  
            
            if 'created_by' in request.POST:
                creator = request.POST['created_by']
            
            elif hasattr(request, 'user') and request.user.is_authenticated:
                creator = request.user.username
            
            elif 'X-Username' in request.headers:
                creator = request.headers['X-Username']
            
            new_challenge = Challenge.objects.create(
                challenge_id=unique_id,
                title=form.cleaned_data['title'],
                description=form.cleaned_data['description'],
                created_by=creator,
                xaimethod=form.cleaned_data['xai_method'],
                dataset=form.cleaned_data['dataset'],
                mlmodel=form.cleaned_data['mlmodel'],
            )
            return Response({
                "message": "Challenge created successfully",
                "challenge_id": unique_id,
                "created_by": creator
            }, status=201)
        else: 
            return Response({"errors": form.errors}, status=400)

@csrf_exempt
def challenge_form_view(request):
    if request.method == 'POST':
        form = ChallengeForm(request.POST, request.FILES)
        if form.is_valid():
            unique_id = str(uuid.uuid4())
            Challenge.objects.create(
                challenge_id=unique_id,
                title=form.cleaned_data['title'],
                description=form.cleaned_data['description'],
                xaimethod=form.cleaned_data['xai_method'],
                dataset=form.cleaned_data['dataset'],
                mlmodel=form.cleaned_data['mlmodel'],
            )
            return redirect('success')
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
        return Response(serializer.data)
    except Challenge.DoesNotExist:
        return Response({"error": "Challenge not found"}, status=404)
    
@api_view(['GET'])
def get_challenges(request):
    challenges = Challenge.objects.all()
    serializer = ChallengeSerializer(challenges, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_scores(request): 
    scores = Score.objects.all()
    serializer = ScoreSerializer(scores, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_challenge_metadata(request, challenge_id):
    """
    Get challenge metadata including participant count and other info.
    """
    try:
        challenge = get_object_or_404(Challenge, challenge_id=challenge_id)
        
        metadata = {
            'challenge_id': challenge.challenge_id,
            'title': challenge.title,
            'description': challenge.description,
            'created_at': challenge.created_at.isoformat(),
            'created_by': challenge.created_by,
            'closes_on': challenge.closes_on.isoformat() if challenge.closes_on else None,
            'participant_count': challenge.participant_count,
        }
        
        return Response(metadata)
    except Challenge.DoesNotExist:
        return Response({'error': 'Challenge not found'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['DELETE'])
def delete_challenge(request, challenge_id):
    """
    Delete a challenge. Only the creator or admin can delete a challenge.
    """
    try:
        challenge = get_object_or_404(Challenge, challenge_id=challenge_id)
        
        current_user = None
        
        if 'username' in request.data:
            current_user = request.data['username']
        elif 'X-Username' in request.headers:
            current_user = request.headers['X-Username']
        elif hasattr(request, 'user') and request.user.is_authenticated:
            current_user = request.user.username
        
        if not current_user:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if challenge.created_by != current_user and current_user != 'admin':
            return Response({
                'error': 'Permission denied. You can only delete your own challenges.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        Score.objects.filter(challenge_id=challenge_id).delete()
        
        challenge.delete()
        
        return Response({
            'message': f'Challenge "{challenge.title}" deleted successfully'
        }, status=status.HTTP_200_OK)
        
    except Challenge.DoesNotExist:
        return Response({'error': 'Challenge not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
