```pre
               current           op number
          deck  suit   opponent  of cards
            ▼     ▼        ▼        ▼        
----------table [cups -- robot have 4 cards]----------

##########
#        #
#   3    # ᐊ current table card
#  cups  #   the max of 6 cards can be shown
#        #
##########

--------------------------------------------------
########## ########## ########## ##########
#        # #        # #        # #        #
#   4    # #   5    # #   11   # #   11   # ᐊ player cards
# swords # # batons # # swords # #  cups  #  
# id: 1  # # id: 2  # # id: 3  # # id: 4  # ᐊ card id to put on deck
#        # #        # #        # #        #
########## ########## ########## ##########

(Cmd) <card id>, d, +, draw
```

| Commands       | Description                              |
| -------------- | ---------------------------------------- |
| `<card id>`    | Places the specified card ID on the deck |
| `d` or `+`     | To draw a card                           |
| `draw`         | To draw a card                           |

| Dev Commands   | Description        |
| -------------- | ------------------ |
| `user`         | Print user cards   |
| `robot`        | Print robot cards  |
| `table`        | Print table cards  |

This format organizes your commands next to the `(Cmd)` prompt while providing clear descriptions for user and dev commands.
Here's the updated markdown for the `GameEngine` class, with information about the `debug` and `simple` parameters:

---

## Class: `GameEngine`

**Description:**  
`GameEngine` handles the core game logic, player actions, and manages the state of the game. It integrates with both the `Cmd` and `Player` classes.

### Parameters:
- `debug`: If set to `True`, the game initializes with predefined card sets for the user, robot, and table, useful for testing and debugging purposes.
- `simple`: If set to `True`, a simplified version of the game output is shown, displaying the current game state without detailed formatting, which is helpful for quick testing.

### Attributes:
| Attribute         | Type           | Description                                                              |
| ----------------- | -------------- | ------------------------------------------------------------------------ |
| `gamerounds`      | `int`          | Counter to track the number of game rounds.                              |
| `lastmes`         | `list`         | Stores the history of game messages.                                     |
| `currentmessage`  | `str`          | Stores the latest message in the game.                                   |
| `availablecards`  | `dict`         | Dictionary holding available cards for each suit.                        |
| `effects`         | `dict`         | Contains special effects for certain cards (e.g., 'pause', 'takeone').    |
| `table`           | `Table`        | Manages the game table and the cards on it.                              |
| `user`            | `Player`       | Instance representing the user/player in the game.                       |
| `robot`           | `Robot`        | Instance representing the robot opponent.                                |
| `players`         | `list`         | List of players in the game (user and robot).                            |

### Methods:
| Method             | Parameters      | Return Type   | Description                                                             |
| ------------------ | --------------- | ------------- | ----------------------------------------------------------------------- |
| `generatemap(ncards)` | `ncards: int`  | `list`        | Generates a set of random cards for players.                            |
| `do_discard(arg)`  | `arg: int`      | `None`        | Handles the discard action for the current player.                      |
| `do_draw(arg)`     | `arg: int`      | `None`        | Handles the draw action for the current player.                         |
| `preloop()`        | None            | `None`        | Displays the initial game table.                                        |
| `parseline(line)`  | `line: str`     | `tuple`       | Parses input and processes the appropriate command.                     |
| `postcmd(stop, line)` | `stop: bool`, `line: str` | `bool` | Handles post-command logic, updating the game state and rounds.         |
| `default(line)`    | `line: str`     | `None`        | Handles invalid commands.                                               |

### Example:
```python
# Example usage of GameEngine with debug and simple modes
game_instance = GameEngine(debug=True, simple=True)
game_instance.cmdloop()
```

---

## Class: `Actions`

**Description:**  
Provides common card handling functions for both players and robots, including card validation and effects management.

### Attributes:
| Attribute       | Type        | Description                                    |
| --------------- | ----------- | ---------------------------------------------- |
| `playercards`   | `list`      | List of cards in the player's hand.            |
| `parent`        | `GameEngine` | Reference to the parent `GameEngine` instance. |

### Methods:
| Method            | Parameters       | Return Type   | Description                                    |
| ----------------- | ---------------- | ------------- | ---------------------------------------------- |
| `isvalid(card)`   | `card`           | `bool`        | Checks if the card is valid to play.           |
| `discard_card(card)` | `card`       | `tuple`       | Discards the card and adds it to the table.    |
| `draw_card(num, move=None)` | `num`, `move` | `None`    | Draws the specified number of cards.           |
| `takeone(line)`   | `line`           | `None`        | Makes the next player draw one card.           |
| `taketwo(line)`   | `line`           | `None`        | Makes the next player draw two cards.          |
| `pause(line)`     | `line`           | `None`        | Pauses the next player for a turn.             |

### Example:
```python
# Example usage of Actions
actions = Actions()
actions.discard_card((3, 'swords'))
```

---

## Class: `Robot`

**Description:**  
Inherits from `Actions` and manages the robot's moves, including playing cards and applying effects.

### Attributes:
| Attribute       | Type        | Description                                    |
| --------------- | ----------- | ---------------------------------------------- |
| `name`          | `str`       | Name of the robot.                             |
| `playercards`   | `list`      | List of cards in the robot's hand.             |
| `parent`        | `GameEngine` | Reference to the parent `GameEngine` instance. |
| `effectmessage` | `dict`      | Messages associated with card effects.         |

### Methods:
| Method            | Parameters       | Return Type   | Description                                    |
| ----------------- | ---------------- | ------------- | ---------------------------------------------- |
| `choose(line)`    | `line`           | `None`        | Chooses the suit based on the most common card. |
| `do_move()`       | `None`           | `None`        | Plays a card or draws one if no valid card is found. |

### Example:
```python
# Example usage of Robot
robot = Robot(parent_instance, [(10, 'swords'), (4, 'cups')])
robot.do_move()
```

---

## Class: `Player`

**Description:**  
Inherits from `Actions` and handles the player's actions, including choosing a suit and discarding cards.

### Attributes:
| Attribute       | Type        | Description                                    |
| --------------- | ----------- | ---------------------------------------------- |
| `name`          | `str`       | Name of the player.                            |
| `playercards`   | `list`      | List of cards in the player's hand.            |
| `parent`        | `GameEngine` | Reference to the parent `GameEngine` instance. |
| `effectmessage` | `dict`      | Messages associated with card effects.         |

### Methods:
| Method            | Parameters       | Return Type   | Description                                    |
| ----------------- | ---------------- | ------------- | ---------------------------------------------- |
| `choose(line)`    | `line`           | `None`        | Prompts the player to choose a suit.          |
| `do_clear(arg)`   | `arg`            | `None`        | Clears the last card from the table.          |
| `do_discard(arg)` | `arg`            | `None`        | Discards a specified card, applying effects.  |

### Example:
```python
# Example usage of Player
player = Player(parent_instance, [(10, 'cups'), (5, 'swords')])
player.do_discard(1)
```
---

## Class: `Console`

**Description:**  
Handles console output for illustrating cards and displaying game results.

### Attributes:
| Attribute       | Type        | Description                                    |
| --------------- | ----------- | ---------------------------------------------- |
| `name`          | `str`       | Name associated with the console display.      |
| `cards`         | `list`      | List of cards to be displayed.                |

### Methods:
| Method                   | Parameters          | Return Type   | Description                                    |
| ------------------------ | -------------------- | ------------- | ---------------------------------------------- |
| `__init__(name, cards)`  | `name`, `cards`     | `None`        | Initializes the console and displays cards.    |
| `illustrate_cards(name, cards)` | `name`, `cards` | `None`        | Illustrates cards in the console with formatting. |
| `won_on_console()`       | `None`              | `bool`        | Clears the console and displays a win message. |
| `lost_on_console()`      | `None`              | `bool`        | Clears the console and displays a loss message. |

### Example:
```python
# Example usage of Console
console = Console('table', [(7, 'cups'), (3, 'swords')])
console.won_on_console()
```

---

## Class: `Table`

**Description:**  
Inherits from `Console` and manages the game table, including displaying cards and tracking the current card.

### Attributes:
| Attribute       | Type        | Description                                    |
| --------------- | ----------- | ---------------------------------------------- |
| `parent`        | `GameEngine` | Reference to the parent `GameEngine` instance. |
| `table`         | `str`       | Name of the table.                             |
| `cards`         | `list`      | List of cards currently on the table.          |
| `last4cards`    | `int`       | Tracks the number of last cards displayed.     |
| `__currentcard` | `tuple`     | The current card on the table (private).       |

### Methods:
| Method            | Parameters       | Return Type   | Description                                    |
| ----------------- | ---------------- | ------------- | ---------------------------------------------- |
| `__init__(parent, name, cards)` | `parent`, `name`, `cards` | `None` | Initializes the table and displays cards. |
| `show_table()`    | `None`           | `None`        | Clears the console and displays the table and player cards. |
| `add_card(card)`  | `card`           | `None`        | Adds a card to the table.                     |
| `do_clear(card)`  | `card`           | `None`        | Clears the specified card (implementation missing). |
| `currentcard` (getter) | `None`     | `tuple`       | Gets the current card, handling special cases. |
| `currentcard` (setter) | `value`     | `None`        | Sets the current card.                        |

### Example:
```python
# Example usage of Table
table = Table(parent_instance, 'table', [(5, 'coins'), (2, 'batons')])
table.show_table()
```