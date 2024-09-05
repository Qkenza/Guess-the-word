
from table import *
from sys import stdout
from time import sleep


class Actions:

    def isvalid(self, card):
        return card[0] == self.parent.table.currentcard[0] or card[1] == self.parent.table.currentcard[1]

    def discard_card(self, card):
        self.playercards.remove(card)
        self.parent.table.add_card(card)
        return card

    def draw_card(self, num, move=None):
        self.playercards.extend(self.parent.generatemap(num))
        if (move):
            self.parent.gamerounds += 1

    def takeone(self, line):
        self.parent.lastmes.append(line)
        self.parent.nextplayer.draw_card(1)

    def taketwo(self, line):
        self.parent.lastmes.append(line)
        self.parent.nextplayer.draw_card(2)

    def pause(self, line):
        self.parent.lastmes.append(line)


class Robot(Actions):
    def __init__(self, parent, playercards):
        self.name = 'robot'
        self.playercards = playercards
        self.parent = parent
        self.effectmessage = {2: 'robot paused you and played again',
                              6: 'robot makes you take a card',
                              7: 'robot is paused play again',
                              11: ''}

    def choose(self, line):
        suits = [t[1] for t in self.playercards]
        suits = {i: suits.count(i) for i in suits}
        suits = sorted(suits.items(), key=lambda item: item[1])
        self.parent.table.currentcard = (0, suits[-1][0])

    def do_move(self):
        if not len(self.playercards):
            return self.parent.table.lost_on_console()
        found = False
        self.parent.lastmes.append('robot played')
        for card in self.playercards:
            if (self.isvalid(card)):
                card = self.discard_card(card)
                try:
                    func = getattr(self, self.parent.effects[card[0]])
                    func(self.effectmessage[card[0]])
                    self.do_move()
                except Exception as e:
                    print(e)
                    self.parent.gamerounds += 1
                found = True
                break

        if not found:
            self.parent.lastmes.append('robot draw a card')
            self.draw_card(1, move=True)


class Player(Actions):
    def __init__(self, parent, playercards):
        self.name = 'user'
        self.playercards = playercards
        self.parent = parent
        self.effectmessage = {2: 'you paused the robot',
                              6: 'robot took a card play again',
                              7: 'robot took two cards play again',
                              11: ''}

    def choose(self, line):
        while (True):
            id = input(
                'what suit you want [1: cups, 2: swords, 3: batons, 4: coins] ')
            try:
                self.parent.table.currentcard = (0,
                                                 list(self.parent.availablecards.keys())[int(id) - 1])
                self.parent
                break
            except Exception as e:
                # print(e)
                print('choose a valid answer!')
        self.parent.gamerounds += 1

    def do_clear(self, arg):
        self.table.cards[-1]

    def do_discard(self, arg):
        try:
            if self.isvalid(self.playercards[arg - 1]):
                card = self.discard_card(self.playercards[arg - 1])
                try:
                    func = getattr(self, self.parent.effects[card[0]])
                    func(self.effectmessage[card[0]])
                except Exception as e:
                    # print(e)
                    self.parent.lastmes.append('you played')
                    self.parent.gamerounds += 1
            else:
                try:
                    message = 'not the same suit ' + \
                        str(self.parent.table.currentcard[0]) + \
                        ' ' + self.parent.table.currentcard[1]
                    self.parent.lastmes.append(message)
                except Exception as e:
                    print(e)
        except:
            message = f"you don't have that much of cards the last card id is {len(self.playercards)}"
            self.parent.lastmes.append(message)
