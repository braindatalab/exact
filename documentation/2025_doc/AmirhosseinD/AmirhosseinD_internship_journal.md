# Amirhosein Dabaghmanesh Internship Journal - evalXAI Project

## Academic Poster Documentation

### Project Overview

The evalXAI project is a web-based platform for evaluating Explainable AI (XAI) methods. The platform allows users to upload XAI methods, which are then evaluated against ground truth explanations using metrics like Earth Mover's Distance (EMD) and Importance Mass Accuracy (IMA). The system consists of three main components:

1. **Backend (Django + DRF)**: API endpoints, user management, challenge creation
2. **Frontend (Next.js + Tailwind)**: User interface for competitions and submissions
3. **Worker (Python + Docker)**: Isolated execution environment for XAI method evaluation

---

## My Contributions & Learning Journey

### 1. Database Migration Automation (bb3aeb6)

**What I Did:**

- Created a custom Django management command `migrate_runserver.py`
- Added required `__init__.py` files in `api/management/` and `api/management/commands/` directories for Python package recognition
- Integrated database migration into the Docker container startup process
- Updated documentation to reflect the simplified setup process

**Technical Implementation:**

```python
class Command(BaseCommand):
    help = 'Run database migrations and then start the development server'

    def handle(self, *args, **options):
        # Run migrations first (unless skipped)
        if not options['skip_migrations']:
            # First create any new migrations
            call_command('makemigrations', verbosity=options['verbosity'])
            # Then apply all migrations
            call_command('migrate', verbosity=options['verbosity'])

        # Start the development server
        call_command('runserver', options['addrport'], **runserver_options)
```

**What I Learned:**

- **Django Management Commands**: Understanding how to extend Django's command-line interface to create custom commands that combine multiple operations
- **Python Package Structure**: The critical importance of `__init__.py` files in making directories recognizable as Python packages - Django management commands require proper package structure to be discovered
- **Django App Discovery**: How Django searches for and loads management commands through its app registry system
- **Docker Integration**: How to modify Docker entrypoints to automate database setup, reducing manual steps for deployment
- **Migration vs. Makemigrations**: The difference between creating migration files (`makemigrations`) and applying them (`migrate`) - both are needed for complete automation
- **Developer Experience**: The importance of reducing friction in the development setup process - what previously required manual migration commands now happens automatically
- **Error Handling**: Implementing graceful degradation where the server starts even if migrations fail, with appropriate user feedback
- **Debugging Django Commands**: When the initial automation didn't work, learned to debug missing Python packages and Django command discovery issues

**Problem-Solving Process:**

1. **Initial Issue**: Created the management command but it wasn't being recognized by Django
2. **Root Cause Discovery**: Missing `__init__.py` files prevented Django from recognizing the `management` directory as a Python package
3. **Solution**: Added `api/management/__init__.py` and confirmed `api/management/commands/__init__.py` existed
4. **Enhancement**: Extended the command to run `makemigrations` before `migrate` for complete automation
5. **Verification**: Tested the full workflow with `docker compose up --build` to ensure migrations are created and applied automatically

**Impact on Project:**

- Eliminated manual database migration steps for new developers
- Reduced setup complexity from multiple commands to a single `docker compose up`
- Improved consistency across different development environments
- Created a reusable pattern for other Django projects requiring automated setup
- Improved consistency across different development environments

---

### 2. CSRF Protection Implementation (13eee3c)

**What I Did:**

- Implemented CSRF (Cross-Site Request Forgery) protection for user authentication
- Created a dedicated CSRF token endpoint in the backend
- Modified frontend authentication flows to include CSRF tokens
- Updated Django settings to properly handle CSRF tokens

**Technical Implementation:**

_Backend (Django):_

```python
class CSRFTokenView(APIView):
    permission_classes = (permissions.AllowAny,)

    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return Response({'csrfToken': get_token(request)})
```

_Frontend (React/Next.js):_

```typescript
// Fetch CSRF token before authentication requests
const fetchCSRFToken = async () => {
  const response = await fetch("/api/csrf-token/");
  const data = await response.json();
  return data.csrfToken;
};
```

**What I Learned:**

- **Web Security Fundamentals**: Deep understanding of CSRF attacks and how they work - when a malicious site tricks a user's browser into making unauthorized requests to a trusted site
- **Django Security Middleware**: How Django's CSRF protection works behind the scenes, including token generation, validation, and cookie handling
- **Frontend-Backend Integration**: The complexity of coordinating security measures across different parts of a web application
- **State Management**: How to properly manage security tokens in React applications without exposing them inappropriately
- **HTTP Headers & Cookies**: Understanding the difference between cookie-based and header-based CSRF token transmission

**Security Impact:**

- Prevented potential CSRF attacks on user registration and login endpoints
- Established a secure foundation for all authenticated API requests
- Implemented industry-standard security practices

**Debugging Process:**
The most challenging part was debugging why authentication was failing. I learned to:

- Use browser developer tools to inspect network requests and responses
- Understand Django's security middleware stack and how it processes requests
- Read Django's CSRF documentation to understand the expected token flow

---

### 3. UI Enhancement - Duplicate Username Field Fix (053f783) and 'Create Account' Button Removal (b0e0e120)

**What I Did:**

- Identified and fixed a UI bug where the username field was displayed twice on the profile page
- Cleaned up the profile page component for better user experience
- Removed the 'Create Account' button from the home page when a user is already logged in to prevent confusion

**Technical Implementation:**

```tsx
// Removed duplicate username display in profile component and 'Create Account' button on home page after log in
// After: Clean, single username display - 'Create Account' button is not shown when user is signed in
```

**What I Learned:**

- **Code Review Skills**: How to identify redundant code and UI inconsistencies
- **React Component Architecture**: Understanding how component composition can lead to unintended duplication
- **User Experience**: The importance of clean, intuitive interfaces in web applications
- **Attention to Detail**: How small bugs can impact user perception of software quality

---

### 4. User Authentication Database Fix (January 2025)

**What I Did:**

- Debugged and resolved a critical authentication issue where users couldn't stay signed in after login
- Fixed missing database migrations for the `Company` model in the `user_api` app
- Enhanced the Django serializer to safely handle users without associated company records
- Verified the migration automation system was working correctly

**Technical Implementation:**

_Database Issue Resolution:_

```python
# Fixed UserSerializer to handle missing company relationships
class UserSerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField()

    class Meta:
        model = UserModel
        fields = ('email', 'username', 'company_name')

    def get_company_name(self, obj):
        try:
            return obj.company.name if hasattr(obj, 'company') and obj.company else None
        except Company.DoesNotExist:
            return None
```

_Migration Creation:_

```bash
# Commands that were automated but initially missing
docker compose exec backend python manage.py makemigrations user_api
docker compose exec backend python manage.py migrate user_api
```

**What I Learned:**

- **Database Relationship Debugging**: How to diagnose database table existence issues using Django error traces
- **Django ORM Relationships**: Understanding how OneToOneField relationships work and their failure modes when related tables don't exist
- **Migration Workflow**: The complete Django migration process from model changes to database schema updates
- **Serializer Error Handling**: How to write defensive code that gracefully handles missing database relationships
- **Docker Development Workflow**: How to execute Django management commands within containerized environments
- **Error Trace Analysis**: Reading and interpreting complex Django/PostgreSQL error stacktraces in Chrome Developer network tab to identify root causes
- **Testing Authentication Flows**: Using command-line tools (curl) to test authentication endpoints and verify fixes by reading logs on the Docker app or with commands like 'docker compose logs backend'


**Problem-Solving Process:**

1. **Issue Identification**: User creation and log in was not possible (Error 500)
2. **Error Analysis**: Analyzed the PostgreSQL error "relation 'user_api_company' does not exist"
3. **Root Cause**: The `Company` model existed in code but no migration had been created to build the database table
4. **Immediate Fix**: Manually created and applied migrations for the missing table
5. **Defensive Programming**: Enhanced the serializer to handle cases where users don't have company records
6. **Automation Verification**: Confirmed that the migration automation system now properly handles this scenario
7. **Testing**: Verified both existing and new users could authenticate without errors

**Database Migration Lessons:**

- **Model vs. Schema**: Understanding the difference between Django model definitions and actual database schema
- **Migration Dependencies**: How Django tracks and applies migrations across different apps
- **Development vs. Production**: The importance of ensuring migration files are committed and deployed properly
- **Defensive Serialization**: Always handle optional relationships gracefully in API serializers

**Impact on Project:**

- Resolved critical authentication bug affecting user experience
- Improved system reliability for handling optional user data
- Validated and enhanced the automated migration system
- Established better debugging practices for database-related issues

---

## Technical Skills Developed

### 1. Full-Stack Development

- **Backend**: Django REST Framework, custom management commands, database migrations
- **Frontend**: React/Next.js, TypeScript, authentication flows
- **Integration**: API design, security token handling, error management

### 2. Security Best Practices

- **CSRF Protection**: Understanding and implementing cross-site request forgery prevention
- **Authentication**: Session-based authentication with proper token handling

### 3. DevOps & Development Workflow

- **Docker**: Multi-service containerization with docker-compose
- **Database Management**: Automated migrations, PostgreSQL integration
- **Git Workflow**: Branch management, commit message best practices
- **Documentation**: Technical documentation writing and maintenance

### 4. Debugging & Problem-Solving

- **Network Debugging**: Using browser dev tools to trace authentication failures
- **Backend Debugging**: Django logging, middleware understanding
- **Integration Testing**: Testing frontend-backend communication

---

## Understanding of the Broader XAI Ecosystem

Through working on this project, I gained insights into:

### 1. Explainable AI Methods

- **Captum Library**: Understanding various XAI methods (LRP, LIME, SHAP, Integrated Gradients, DeepLift)
- **Evaluation Metrics**: Earth Mover's Distance (EMD) and Importance Mass Accuracy (IMA) for measuring explanation quality
- **Model Interpretability**: How different XAI methods provide different types of explanations for neural network decisions

### 2. Research Platform Development

- **Evaluation Infrastructure**: Building systems that can fairly compare different research approaches
- **Isolation & Security**: The challenges of running user-submitted code safely (using Docker containers)
- **Reproducibility**: Ensuring consistent evaluation environments for research comparisons

### 3. Academic Software Requirements

- **Documentation**: The importance of comprehensive documentation for research tools
- **Testing**: Unit testing for scientific software to ensure reliability
- **Extensibility**: Designing systems that researchers can easily extend with new methods

---

## Challenges Faced & Solutions

### 1. CSRF Token Implementation

**Challenge:** Authentication requests were failing silently, and it wasn't immediately clear that CSRF protection was the cause.

**Solution Process:**

1. Examined Django middleware settings to understand the request processing pipeline
2. Used browser network tab to identify missing CSRF tokens in request headers
3. Researched Django's CSRF documentation to understand proper implementation
4. Implemented both token retrieval endpoint and frontend token handling

**Learning:** The importance of understanding the full request/response cycle and how security middleware affects it.

### 2. Docker Integration Complexity

**Challenge:** The multi-service architecture required careful coordination between database, backend, frontend, and worker services.

**Solution:**

- Created the `migrate_runserver` command to handle database initialization automatically
- Updated Docker entrypoints to use the new command
- Documented the simplified setup process

**Learning:** How to balance automation with flexibility in containerized applications.

---

## Conclusion

This internship provided valuable experience in full-stack web development, security implementation, and research software engineering. The evalXAI project represents an interesting intersection of machine learning research and software engineering, requiring both technical skills and understanding of academic requirements.

Key takeaways:

1. **Developer Experience Matters**: Small improvements in setup and workflow can significantly impact productivity
2. **Documentation is Critical**: Especially in academic software where users may not be professional developers
3. **Integration Challenges**: Full-stack development requires understanding how all components interact

The experience has prepared me for future work in both academic research environments and commercial software development, with a particular appreciation for the unique challenges of building research infrastructure.

---

## Technical Artifacts :

### Git Commits:

- `bb3aeb66`: Database migration automation
- `13eee3cc`: CSRF protection implementation
- `053f783c`: UI bug fix for duplicate username field
- `781f38bd`: Fix for migration command in file structure
- `b0e0e120`: Removed 'Create User' button from home page when user is logged in
