import os
from cmd import Cmd
from random import choice, randint
from player import *


class GameEngine(Cmd, Player):

    def __init__(self, debug=False, simple=False):
        Cmd.__init__(self)
        self.gamerounds = 0
        self.lastmes = []
        self.currentmessage = ''
        self.availablecards = {'cups': [1, 2, 3, 4, 5, 6, 7, 10, 11, 12],
                               'swords': [1, 2, 3, 4, 5, 6, 7, 10, 11, 12],
                               'batons': [1, 2, 3, 4, 5, 6, 7, 10, 11, 12],
                               'coins': [1, 2, 3, 4, 5, 6, 7, 10, 11, 12]
                               }
        self.effects = {2: 'pause',
                        6: 'takeone',
                        7: 'taketwo',
                        11: 'choose'}
        if (debug):
            self.table = Table(self, 'table', [(4, 'swords'), (4, 'batons'), (3, 'batons'), (
                12, 'batons'), (12, 'coins')])
            self.user = Player(
                self, [(10, 'cups'), (11, 'swords'), (12, 'cups'), (1, 'swords'), (7, 'coins')])
            # self, [(1, 'coins'), (2, 'coins'), (3, 'coins'), (4, 'coins'), (5, 'coins')])

            self.robot = Robot(
                self, [(10, 'swords'), (4, 'cups'), (7, 'cups'), (3, 'cups')])
        else:
            self.table = Table(self, 'table', self.generatemap(1))
            self.user = Player(self, self.generatemap(4))
            self.robot = Robot(self, self.generatemap(4))

        if (simple):
            self.table.show_table = lambda *args: print(
                'message: ' +
                str(self.lastmes) + '                ' +
                str(self.table.currentcard),
                '\n       table: ' +
                str(self.table.cards),
                '\nuser: ' +
                str(self.user.playercards),
                '       robot: ' +
                str(self.robot.playercards))

        self.players = [self.user, self.robot]

    def generatemap(self, ncards):
        i = 0
        cards = []
        while (i < ncards):
            try:
                suit = choice(self.availablecards.keys())
                nums = self.availablecards[suit]
                num = randint(0, len(nums) - 1)
                card = (suit, nums.pop(num))
                cards.append(card)
                i += 1
            except:
                try:
                    suit, nums = choice(
                        [(k, v) for k, v in self.availablecards.items() if v != []])
                    num = randint(0, len(nums) - 1)
                    card = (nums.pop(num), suit)
                    cards.append(card)
                    i += 1
                except:
                    self.currentmessage = 'the table is cleared'
                    self.availablecards = {'cups': [1, 2, 3, 4, 5, 6, 7, 10, 11, 12],
                                           'swords': [1, 2, 3, 4, 5, 6, 7, 10, 11, 12],
                                           'batons': [1, 2, 3, 4, 5, 6, 7, 10, 11, 12],
                                           'coins': [1, 2, 3, 4, 5, 6, 7, 10, 11, 12]
                                           }
                    for player in self.players:
                        for card in player:
                            self.availablecards[card[1]].pop(card[0])
                    self.availablecards(
                        self.table.cards[-1][1]).pop(self.table.cards[-1][0])
                    return self.generatemap(ncards)
        return (cards)

    def do_discard(self, arg):
        return self.currentplayer.do_discard(arg)

    def do_draw(self, arg):
        self.lastmes.append('you drawed a card')
        self.currentplayer.draw_card(1, move=True)
        return False

    def do_robot(self, arg):
        return self.currentplayer.do_move()

    def preloop(self):
        self.table.show_table()

    def precmd(self, line):
        return line

    def parseline(self, line):
        line = line.strip()

        if not line:
            return None, None, line
        if line[0] == '?':
            line = 'help ' + line
        elif line[0] == '+' or line[0] == 'd':
            line = 'draw ' + line
        elif line.isnumeric():
            line = 'discard ' + line
        i, n = 0, len(line)
        while i < n and line[i] in self.identchars:
            i = i+1
        cmd, arg = line[:i], line[i:].strip()
        if arg.isnumeric():
            arg = int(arg)
        return cmd, arg, line

    def postcmd(self, stop, line):
        if not len(self.user.playercards):
            return self.table.won_on_console()
        if (line.isnumeric()):
            self.table.show_table()

        if (self.gamerounds % 2):
            self.currentplayer.do_move()
            self.table.show_table()
            if not len(self.robot.playercards):
                return self.table.lost_on_console()
        self.currentmessage = ''
        with open('history.txt', 'w') as f:
            f.write(str(self.table.cards))
        with open('history.txt', 'a') as f:
            f.write('\nrobots cards\n')
            f.write(str(self.robot.playercards))
        return False

    @ property
    def currentplayer(self):
        return self.players[self.gamerounds % 2]

    @ property
    def nextplayer(self):
        return self.players[(self.gamerounds + 1) % 2]

    def default(self, line):
        self.currentmessage = 'not a command'

    def emptyline(self) -> bool:
        return False

    def help_user():
        print('user help')

    ############
    # admin acrions (uncomment in case of test)
    def do_robot(self, arg):
        print(self.robot.name, self.robot.playercards)
        return False

    def do_user(self, arg):
        print(self.user.name, self.user.playercards)
        return False

    def do_table(self, arg):
        print(self.table.table, self.table.cards)
        return False

    def do_messages(self, arg):
        print(self.lastmes)
        return False


if __name__ == '__main__':
    game_instance = GameEngine()
    game_instance.cmdloop()
