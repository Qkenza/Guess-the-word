
import os


class Console:
    def __init__(self, name, cards):
        self.illustrate_cards(name, cards)

    def illustrate_cards(self, name, cards):
        card_lenght = 10
        tb_ruler = '#'  # '-'
        side_rule = '#'  # '|'

        info = ''
        if (name == 'table'):
            slen = len(self.parent.robot.playercards)
            info = name + f' [{self.currentcard[1]} -- robot have {str(slen)} card' + ('', 's')[
                slen > 1] + ']'
        # print the header
        print(info.center(sum([10 for _ in cards]) + len(info) + 10, '-'))
        # top ruler
        print(' '.join([tb_ruler * card_lenght for _ in cards]))
        # empty space
        print(
            ' '.join([side_rule + ' ' * (card_lenght - 2) + side_rule for _ in cards]))
        # print the card number
        print(
            ' '.join([side_rule + str(t[0]).center(card_lenght - 2) + side_rule for t in cards]))
        # print the card suit
        print(
            ' '.join([side_rule + t[1].center(card_lenght - 2) + side_rule for t in cards]))
        # print the card idx
        if (name != 'table'):
            print(' '.join([side_rule + f'id: {str(idx + 1)}'.center(card_lenght -
                                                                     2) + side_rule for idx in range(len(cards))]))
        # print empty space
        print(
            ' '.join([side_rule + (' ' * (card_lenght - 2)) + side_rule for _ in cards]))
        # bottom side_rule
        print(' '.join([tb_ruler * (card_lenght) for _ in cards]))
        print()

    def won_on_console(self):
        os.system('cls' if os.name == 'nt' else 'clear')
        print("""\n\n\n\n\n########################################################################\
               \n########                YOU WON BIG GUY                        #########\
               \n########################################################################\n\n\n\n\n""")
        return True

    def lost_on_console(self):
        os.system('cls' if os.name == 'nt' else 'clear')
        print("""\n\n\n\n\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\
               \n!!!!!!!!!!!!!!!!!!!!!       YOU LOST BABY GIRL             !!!!!!!!!!!!!!\
               \n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n\n\n\n""")
        return True


class Table(Console):

    def __init__(self, parent, name, cards):
        self.parent = parent
        self.table = name
        self.cards = cards
        self.last4cards = 0
        self.__currentcard = self.cards[-1]

    def show_table(self):
        os.system('cls' if os.name == 'nt' else 'clear')
        print()
        for i, message in enumerate(self.parent.lastmes[-4:]):
            print('-' * i + '> ' + message + '\n')
        self.illustrate_cards(self.table, self.cards[-6:])
        self.illustrate_cards(self.parent.user.name,
                              self.parent.user.playercards)

    def add_card(self, card):
        self.cards.append(card)

    def do_clear(self, card):
        self.cards

    @property
    def currentcard(self):
        if self.__currentcard[0] == 0 and self.cards[-1][0] == 11:
            return self.__currentcard
        self.__currentcard = self.cards[-1]
        return self.__currentcard

    @currentcard.setter
    def currentcard(self, value):
        self.__currentcard = value
