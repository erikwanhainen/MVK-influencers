from parser import Parser
from pathlib import Path


def main():
    path_text_neg_to_classify = Path("negative.txt")
    path_text_pos_to_classify = Path("positive.txt")

    file_neg = open(path_text_neg_to_classify, 'rt')
    file_pos = open(path_text_pos_to_classify, 'rt')

    text_neg = file_neg.read()
    text_pos = file_pos.read()

    file_neg.close()
    file_pos.close()

    # split into words by white space
    words_array_neg = text_neg.split()
    words_array_pos = text_pos.split()

    classified_words = Parser().parse()
    print("Negative text score :" +
          str(compare(classified_words, words_array_neg)))
    print("Positive text score :" +
          str(compare(classified_words, words_array_pos)))


def compare(classified_words, words_array):
    total_score = 0
    for w in words_array:
        for key, value in classified_words:
            if w == key:
                total_score += int(value)
    return total_score


if __name__ == '__main__':
    main()
