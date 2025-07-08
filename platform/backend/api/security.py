import os
import re
import ast
import magic
from django.core.exceptions import ValidationError
from django.conf import settings

# File size limits (in bytes)
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
MAX_CODE_FILE_SIZE = 1 * 1024 * 1024  # 1MB for code files

# Allowed file types
ALLOWED_EXTENSIONS = {
    'dataset': ['.csv', '.json', '.pkl', '.txt', '.h5'],
    'model': ['.pkl', '.pt', '.h5', '.onnx', '.pb'],
    'xai_method': ['.py', '.txt']
}

# Dangerous Python patterns to block
DANGEROUS_PATTERNS = [
    r'import\s+os',
    r'import\s+sys',
    r'import\s+subprocess',
    r'import\s+socket',
    r'import\s+requests',
    r'from\s+os\s+import',
    r'from\s+sys\s+import',
    r'from\s+subprocess\s+import',
    r'__import__',
    r'exec\s*\(',
    r'eval\s*\(',
    r'open\s*\(',
    r'file\s*\(',
    r'input\s*\(',
    r'raw_input\s*\(',
    r'compile\s*\(',
    r'globals\s*\(',
    r'locals\s*\(',
    r'vars\s*\(',
    r'dir\s*\(',
    r'exit\s*\(',
    r'quit\s*\(',
]

class SecurityValidator:
    """Security validation for uploaded files and code"""
    
    @staticmethod
    def validate_file_size(file, file_type='general'):
        """Validate file size based on type"""
        max_size = MAX_CODE_FILE_SIZE if file_type == 'xai_method' else MAX_FILE_SIZE
        
        if file.size > max_size:
            raise ValidationError(
                f'File too large. Maximum size allowed: {max_size // (1024*1024)}MB'
            )
    
    @staticmethod
    def validate_file_extension(file, file_type):
        """Validate file extension"""
        file_ext = os.path.splitext(file.name)[1].lower()
        allowed_exts = ALLOWED_EXTENSIONS.get(file_type, [])
        
        if file_ext not in allowed_exts:
            raise ValidationError(
                f'File type not allowed. Allowed types: {", ".join(allowed_exts)}'
            )
    
    @staticmethod
    def validate_file_content(file):
        """Validate file content using python-magic"""
        try:
            # Read first 2048 bytes for magic number detection
            file.seek(0)
            file_start = file.read(2048)
            file.seek(0)
            
            file_type = magic.from_buffer(file_start, mime=True)
            
            # Allow text files, Python files, and common data formats
            allowed_mime_types = [
                'text/plain',
                'text/x-python',
                'application/json',
                'text/csv',
                'application/octet-stream',  # For .pkl, .pt files
                'application/x-hdf',  # For .h5 files
            ]
            
            if not any(allowed_type in file_type for allowed_type in allowed_mime_types):
                raise ValidationError(f'File content type not allowed: {file_type}')
                
        except Exception as e:
            raise ValidationError(f'File content validation failed: {str(e)}')
    
    @staticmethod
    def validate_python_code(code_content):
        """Validate Python code for dangerous patterns"""
        code_str = code_content if isinstance(code_content, str) else code_content.decode('utf-8')
        
        # Check for dangerous patterns
        for pattern in DANGEROUS_PATTERNS:
            if re.search(pattern, code_str, re.IGNORECASE):
                raise ValidationError(
                    f'Code contains potentially dangerous pattern: {pattern}'
                )
        
        # Try to parse the Python code
        try:
            ast.parse(code_str)
        except SyntaxError as e:
            raise ValidationError(f'Invalid Python syntax: {str(e)}')
        
        # Additional checks for specific dangerous imports/calls
        tree = ast.parse(code_str)
        dangerous_names = ['os', 'sys', 'subprocess', 'socket', 'requests', 'urllib']
        
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    if alias.name in dangerous_names:
                        raise ValidationError(f'Import "{alias.name}" is not allowed')
            
            elif isinstance(node, ast.ImportFrom):
                if node.module in dangerous_names:
                    raise ValidationError(f'Import from "{node.module}" is not allowed')
    
    @staticmethod
    def sanitize_filename(filename):
        """Sanitize filename to prevent path traversal"""
        # Remove any path components
        filename = os.path.basename(filename)
        
        # Remove potentially dangerous characters
        filename = re.sub(r'[^\w\-_\.]', '_', filename)
        
        # Ensure filename isn't empty
        if not filename or filename.startswith('.'):
            filename = f'safe_file_{filename}'
        
        return filename
    
    @staticmethod
    def validate_challenge_file(file, file_type):
        """Complete validation for challenge files"""
        # Basic validations
        SecurityValidator.validate_file_size(file, file_type)
        SecurityValidator.validate_file_extension(file, file_type)
        SecurityValidator.validate_file_content(file)
        
        # Special validation for Python code
        if file_type == 'xai_method':
            file.seek(0)
            content = file.read()
            SecurityValidator.validate_python_code(content)
            file.seek(0)
        
        return True