from django.db import models

class Game(models.Model):
    player1 = models.CharField(max_length=30, blank=True, null=True)
    player2 = models.CharField(max_length=30, blank=True, null=True)
