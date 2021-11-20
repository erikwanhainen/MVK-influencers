from pathlib import Path


class Parser:
    def __init__(self):
        self.path_text = Path("classifierad_ord.txt")

    def parse(self):
        result = []
        with open(self.path_text, "r") as pt:
            for i in pt.readlines():
                if len(i.strip()) == 0:
                    continue
                tmp = i.rstrip().split(" ")
                result.append((tmp[0], tmp[1]))

            return result
