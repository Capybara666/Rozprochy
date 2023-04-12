def checkColumns(gameState):

    for col in range(7):
        for row in range(3):

            counter1, counter2 = 0, 0

            for index in range(4):
                if gameState[row + index][col] == 0:
                    break
                elif gameState[row + index][col] == 1:
                    counter1 += 1
                else:
                    counter2 += 1
            
            if counter1 == 4:
                return 1
            elif counter2 == 4:
                return 2
    
    return 0


def checkRows(gameState):

    for row in range(6):
        for col in range(4):

            counter1, counter2 = 0, 0

            for index in range(4):
                if gameState[row][col + index] == 0:
                    break
                elif gameState[row][col + index] == 1:
                    counter1 += 1
                else:
                    counter2 += 1
            
            if counter1 == 4:
                return 1
            elif counter2 == 4:
                return 2
    
    return 0


def checkDiagonals(gameState):
    
    for row in range(3):
        for col in range(4):

            counter1, counter2 = 0, 0

            for index in range(4):
                if gameState[row + index][col + index] == 0:
                    break
                elif gameState[row + index][col + index] == 1:
                    counter1 += 1
                else:
                    counter2 += 1
            
            if counter1 == 4:
                return 1
            elif counter2 == 4:
                return 2
    
    return 0


def checkAntiDiagonals(gameState):

    for row in range(3):
        for col in range(3, 7):

            counter1, counter2 = 0, 0

            for index in range(4):
                if gameState[row + index][col - index] == 0:
                    break
                elif gameState[row + index][col - index] == 1:
                    counter1 += 1
                else:
                    counter2 += 1
            
            if counter1 == 4:
                return 1
            elif counter2 == 4:
                return 2
    
    return 0


def checkGameState(gameState):

    table = gameState

    winner = checkColumns(table)
    if winner != 0:
        return winner
    winner = checkRows(table)
    if winner != 0:
        return winner
    winner = checkDiagonals(table)
    if winner != 0:
        return winner
    winner = checkAntiDiagonals(table)
    if winner != 0:
        return winner
    else:
        return 0

def isBoardFull(gameState):
    for i in range(7):
        if gameState[0][i] == 0:
            return False
    return True