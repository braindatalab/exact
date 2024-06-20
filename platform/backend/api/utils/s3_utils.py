# import boto3
# from django.conf import settings 

# s3_client = boto3.client(
#     's3',
#     aws_access_key_id = settings.AWS_ACCESS_KEY_ID, 
#     aws_secret_access_key = settings.AWS_SECRET_ACCESS_KEY, 
#     region_name = settings.AWS_S3_REGION_NAME,
# ) 

# def upload_file_to_amazon(file, bucket_name, object_name=None):
#     "uploading the file to the s3 bucket on amazon cloud storage"
#     if object_name is None: 
#         object_name = file.name 
    
#     try: 
#         s3_client.upload_fileobj(file, bucket_name, object_name)
#         return f"https://{bucket_name}.s3.amazonaws.com/{object_name}" 
#     except Exception as e: 
#         print(e)
#         return None 
    