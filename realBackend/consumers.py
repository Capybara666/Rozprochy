import json
import uuid
from channels.generic.websocket import AsyncWebsocketConsumer

from .functions import checkGameState, isBoardFull
from .queries import *


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        id = str(uuid.uuid4().hex)
        self.id = id
        self.gameID = await addToGame(id)
        
        self.group_name = "game_%d" % self.gameID

        # wywołac funcke tworzącą gre

        self.playerNumber = await getNumberOfPlayer(self.gameID, self.id)

        await self.channel_layer.group_add(self.group_name, self.channel_name)

        await self.accept()

        await self.send(json.dumps({
            'type': 'start_info',
            'number': self.playerNumber,
            'ID' : self.id,
        }))

        if self.playerNumber == 2:
            gameState = [[0]*7 for _ in range(6)]
            winner = 0
            await self.channel_layer.group_send(
                self.group_name,
                {   
                    "type": "game_info",
                    "gameState": gameState,
                    "winner" : winner,
                    "gameEnded": False
                }
            )

    async def disconnect(self, close_code):

        await endTheGame(self.gameID)
        await self.channel_layer.group_send(self.group_name,{'type': 'end_info'})
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        if "gameState" in text_data_json:  # sending game info to both players
            gameState = text_data_json["gameState"]
            winner = checkGameState(gameState)
            gameEnded = isBoardFull(gameState)
            # Send message to room group
            await self.channel_layer.group_send(
                self.group_name,
                {   
                    "type": "game_info",
                    "gameState": gameState,
                    "winner" : winner,
                    "gameEnded": gameEnded
                }
            )
        elif "isGameReady" in text_data_json:
            answer = await isGameReady(self.id)   # sending info to one player if the second one is ready to play
            
            await self.send(json.dumps({
                'type': 'is_game_info',
                'answer': answer
            }))

    async def game_info(self, event):
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps(event))

    async def end_info(self, event):

        # Send message to WebSocket
        await self.send(text_data=json.dumps(event))

    async def start_info(self, event):

        # Send message to WebSocket
        await self.send(text_data=json.dumps(event))