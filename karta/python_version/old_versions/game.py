from random import randint, choice
from cmd import Cmd
from functools import reduce
from time import sleep
import os
from sys import stdout
import time

# print(UserCards, '##', OpsCards)


class StartGame(Cmd):
    prompt = ''
    gameround = 0

    messages = {
        11: 'what suit you wanted to choose: (coins, swords, cups, batons)',
        7: 'ops took two',
        6: 'ops took one',
        2: 'your turn again',
        -1: 'not the same suit'
    }
    currentmessage = ''
    CardEffect = {11: 'choose', 7: 'taketwo', 6: 'takeone', 2: 'pause'}
    UserCards = [(1, 'coins'), (2, 'coins'), (3, 'coins'),
                 (4, 'coins')]  # [(7, 'coins'), (1, 'coins')]
    OpsCards = []
    Table = [(6, 'coins')]  # [(6, 'coins')]
    AvailableSuits = ['cups', 'swords', 'batons', 'coins']
    AvailableCards = {'cups': [1, 2, 3, 4, 5, 6, 7, 10, 11, 12],
                      'swords': [1, 2, 3, 4, 5, 6, 7, 10, 11, 12],
                      'batons': [1, 2, 3, 4, 5, 6, 7, 10, 11, 12],
                      'coins': [1, 2, 3, 4, 5, 6, 7, 10, 11, 12]
                      }

    def generatemap(self, ncards):
        i = 0
        cards = []
        while (i < ncards):
            try:
                suit = choice(self.AvailableSuits)
                nums = self.AvailableCards[suit]
                num = randint(0, len(nums) - 1)
                card = (nums.pop(num), suit)
                cards.append(card)
                i += 1
            except:
                try:
                    self.AvailableSuits.remove(suit)
                    self.AvailableCards.pop(suit)
                    suit = choice(self.AvailableSuits)
                except:
                    print('clear the table')
                    return ([])
        return (cards)

    def __init__(self):
        # self.UserCards = self.generatemap(4)
        self.OpsCards = self.generatemap(4)
        # self.Table = self.generatemap(1)
        self.currentcard = []
        super().__init__()

    def robotturn(self):
        # orginal_set = self.disable_input()
        stdout.write('robot playing')
        stdout.flush()
        for _ in range(3):
            stdout.write('.')
            stdout.flush()
            sleep(0.2)
        print()
        sleep(2)
        self.currentmessage = 'robot played'
        # self.enable_input(orginal_set)
        for i, card in enumerate(self.OpsCards):
            if (card[1] == self.currentcard[1]):
                self.currentcard = card
                self.Table.append(card)
                self.OpsCards.pop(i)
                self.currentmessage = f'robot put the card {str(self.currentcard)}'
                self.gameillustartion()
                return
        self.currentmessage = 'robot draw a card'
        self.gameillustartion()
        self.OpsCards.extend(self.generatemap(1))

    def cardpresent(self, name, cards):
        print(name.center(sum([len(t[1])
                               for t in cards]) + len(name) + 10, '-'))
        print(' '.join(['#' * (len(t[1]) + 4) for t in cards]))
        print(' '.join(['#' + (' ' * (len(t[1]) + 2)) + '#' for t in cards]))
        print(
            ' '.join(['#' + str(t[0]).center(len(t[1]) + 2) + '#' for t in cards]))
        print(
            ' '.join(['#' + t[1].center(len(t[1]) + 2) + '#' for t in cards]))
        print(' '.join(['#' + (' ' * (len(t[1]) + 2)) + '#' for t in cards]))
        print(' '.join(['#' * (len(t[1]) + 4) for t in cards]))

    def gameillustartion(self):
        # os.system('cls' if os.name == 'nt' else 'clear')
        if self.currentmessage:
            print('---> ' + self.currentmessage + '\n')
        self.currentmessage = ''
        self.cardpresent('table', self.Table)
        self.cardpresent('usercards', self.UserCards)
        print()

    # def generatemap(self, num):
    #     if len(self.UserCards) + len(self.OpsCards) + len(self.Table) == 40:
    #         self.currentmessage = 'you should clear the table using clear cmd'
    #         return None
    #     card = list(zip(sample(self.AvailableCards, num),
    #                 sample(self.AvailableSuits, num)))
    #     while True:
    #         if set(card) & set(self.UserCards) & set(self.OpsCards) & set(self.Table):
    #             print(card, set(self.UserCards), set(
    #                 self.OpsCards), set(self.Table))
    #             card = list(zip(sample(self.AvailableCards, num),
    #                         sample(self.AvailableSuits, num)))
    #         else:
    #             return card
    #     # except:
    #     # return list(zip(sample(self.AvailableCards, num), sample(self.AvailableSuits, num)))

    def do_draw(self, line):
        self.UserCards.extend(self.generatemap(1))

    def do_choose(self, card):
        suit = input(self.messages[11]).strip()
        if suit in self.AvailableSuits or int(suit) < 4:
            self.currentsuit = suit if suit.isalpha(
            ) else self.AvailableSuits[suit]
        return 11

    def discard(self, card):
        if (card[1] == self.currentcard[1] or card[0] == self.currentcard[0]):
            self.Table.append(card)
            self.UserCards.pop(self.UserCards.index(card))
            self.currentmessage = self.messages[card[0]
                                                ] if card[0] in self.messages else ''
            self.currentcard = card
            return True
        else:
            self.currentmessage = 'not the same suit'
            return False

    def do_taketwo(self):
        return 7

    def do_takeone(self):
        return 6

    def do_pause(self):
        return 2

    def default(self, line: str) -> None:
        pass

    def parseline(self, line: str) -> tuple[str | None, str | None, str]:
        line = line.strip()
        if not line:
            return None, None, line
        elif line[0] == '?':
            line = 'help ' + line[1:]
        elif line[0] == '+' or line[0] == 'd':
            line = 'draw ' + line[1:]

        try:
            card = self.UserCards[int(line) - 1]
            print(f' .  round: {self.gameround}')
            if (self.discard(card) and card in self.CardEffect):
                return self.CardEffect[card], card, self.CardEffect[card]
            else:
                return None, None, ''
        except:
            i, n = 0, len(line)
            while i < n and line[i] in self.identchars:
                i = i+1
            cmd, arg = line[:i], line[i:].strip()
            return cmd, arg, line

    def preloop(self) -> None:
        self.gameillustartion()

    def do_EOF(self, line):
        return True

    def emptyline(self) -> bool:
        pass

    def precmd(self, line: str) -> str:
        self.currentcard = self.Table[-1]
        if self.gameround % 2:
            print()
            self.robotturn()
            self.gameround += 1
        return super().precmd(line)

    def postcmd(self, stop: bool, line: str) -> bool:
        self.currentcard = self.Table[-1]
        self.gameillustartion()

    def do_print(self, line):
        self.currentmessage = str(self.Table)

    def do_clear(self, line):
        self.Table = [self.currentcard]

    def do_printrobotscards(self, line):
        self.currentmessage = str(self.OpsCards)


StartGame().cmdloop()
