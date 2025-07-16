import os
import re
import ast
from django.core.exceptions import ValidationError

# File size limit für Python Code
MAX_CODE_FILE_SIZE = 1 * 1024 * 1024  # 1MB

DANGEROUS_PATTERNS = [
    # import statements that can lead to security issues
    r'import\s+os\b',
    r'import\s+sys\b', 
    r'import\s+subprocess\b',
    r'from\s+os\s+import',
    r'from\s+sys\s+import',
    r'from\s+subprocess\s+import',
    
    # code execution
    r'exec\s*\(',
    r'eval\s*\(',
    r'__import__\s*\(',
    
    # file access
    r'open\s*\(',
    r'file\s*\(',
    
    # networking
    r'import\s+requests\b',
    r'import\s+urllib\b',
    r'import\s+socket\b',
    
    # process management
    r'exit\s*\(',
    r'quit\s*\(',
]

class SecurityValidator:
    
    @staticmethod
    def validate_file_size(file):
        if file.size > MAX_CODE_FILE_SIZE:
            raise ValidationError(f'Datei zu groß! Maximum: 1MB')
    
    @staticmethod
    def validate_python_code(code_content):
        try:
            code_str = code_content if isinstance(code_content, str) else code_content.decode('utf-8')
        except UnicodeDecodeError:
            raise ValidationError('Datei-Encoding nicht unterstützt')
        
        # check for dangerous patterns
        for pattern in DANGEROUS_PATTERNS:
            if re.search(pattern, code_str, re.IGNORECASE):
                raise ValidationError(f'Sicherheitsrisiko: Code enthält gefährlichen Befehl')
        
        # check if the code is valid Python syntax
        try:
            ast.parse(code_str)
        except SyntaxError:
            raise ValidationError('Ungültiger Python Code')
    
    @staticmethod
    def validate_xai_method(file):
        SecurityValidator.validate_file_size(file)
        
        file.seek(0)
        content = file.read()
        SecurityValidator.validate_python_code(content)
        file.seek(0)  
        
        return True