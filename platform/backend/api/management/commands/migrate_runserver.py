from django.core.management.base import BaseCommand
from django.core.management import call_command
import sys


class Command(BaseCommand):
    help = 'Run database migrations and then start the development server'

    def add_arguments(self, parser):
        # Add arguments that can be passed to runserver
        parser.add_argument(
            'addrport', nargs='?', default='127.0.0.1:8000',
            help='Optional port number, or ipaddr:port'
        )
        parser.add_argument(
            '--noreload', action='store_false', dest='use_reloader',
            default=True, help='Tells Django to NOT use the auto-reloader.'
        )
        parser.add_argument(
            '--nothreading', action='store_false', dest='use_threading',
            default=True, help='Tells Django to NOT use threading.'
        )
        parser.add_argument(
            '--skip-migrations', action='store_true', dest='skip_migrations',
            default=False, help='Skip running migrations before starting the server.'
        )

    def handle(self, *args, **options):
        # Run migrations first (unless skipped)
        if not options['skip_migrations']:
            self.stdout.write(
                self.style.SUCCESS('Creating new migrations if needed...')
            )
            try:
                # First create any new migrations
                call_command('makemigrations', verbosity=options['verbosity'])
                self.stdout.write(
                    self.style.SUCCESS('Makemigrations completed.')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.WARNING(f'Makemigrations warning: {e}')
                )
            
            self.stdout.write(
                self.style.SUCCESS('Applying database migrations...')
            )
            try:
                # Then apply all migrations
                call_command('migrate', verbosity=options['verbosity'])
                self.stdout.write(
                    self.style.SUCCESS('Database migrations completed successfully.')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Migration failed: {e}')
                )
                self.stdout.write(
                    self.style.WARNING('Starting server anyway...')
                )
        else:
            self.stdout.write(
                self.style.WARNING('Skipping database migrations.')
            )

        # Start the development server
        self.stdout.write(
            self.style.SUCCESS(f'Starting development server on {options["addrport"]}...')
        )

        try:
            # Prepare runserver options
            runserver_options = {
                'use_reloader': options['use_reloader'],
                'use_threading': options['use_threading'],
                'verbosity': options['verbosity'],
            }

            call_command('runserver', options['addrport'], **runserver_options)
        except KeyboardInterrupt:
            self.stdout.write(
                self.style.SUCCESS('\nServer stopped.')
            )
            sys.exit(0)
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Failed to start server: {e}')
            )
            sys.exit(1)