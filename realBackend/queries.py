from django.db.models import Q
from channels.db import database_sync_to_async

from .models import Game

@database_sync_to_async
def addToGame(sessionID):
    game = Game.objects.filter(Q(player2=None), ~Q(player1=None))
    if len(game) == 1:
        game[0].player2=sessionID
        game[0].save()
        return game[0].id
    else:
        game = Game(player1=sessionID, player2=None)
        game.save()
        return game.id


@database_sync_to_async
def getNumberOfPlayer(gameID, sessionID):
    game = Game.objects.get(id=gameID)
    if game.player1 == sessionID:
        return 1
    elif game.player2 == sessionID:
        return 2
    else:
        return -1
    
@database_sync_to_async
def endTheGame(gameID):
    try:
        game = Game.objects.get(id=gameID)
        game.delete()
    except:
        pass

@database_sync_to_async
def isGameReady(sessionID):
    game = Game.objects.get(Q(player1=sessionID) | Q(player2=sessionID))
    if game.player1 is not None and game.player2 is not None:
        return "True"
    else:
        return "False"