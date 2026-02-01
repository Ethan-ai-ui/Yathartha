"""
Django migration for AIInteractionLog model.
"""
from django.db import migrations, models
import uuid
import django.db.models.deletion

class Migration(migrations.Migration):
    initial = True
    dependencies = [
        ('ai', '0001_initial'),
        ('users', '0001_initial'),
    ]
    operations = [
        migrations.CreateModel(
            name='AIInteractionLog',
            fields=[
                ('id', models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)),
                ('input_type', models.CharField(max_length=32)),
                ('input_data', models.TextField()),
                ('output_data', models.TextField(blank=True, null=True)),
                ('success', models.BooleanField(default=True)),
                ('error_message', models.TextField(blank=True, null=True)),
                ('fallback_used', models.BooleanField(default=False)),
                ('request_metadata', models.JSONField(blank=True, null=True)),
                ('response_metadata', models.JSONField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('model', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='ai.aimodel')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='users.user')),
            ],
            options={
                'db_table': 'ai_interaction_log',
                'ordering': ['-created_at'],
            },
        ),
    ]
