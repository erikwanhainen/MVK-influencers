# -*- coding: utf-8 -*-
"""
Created on Mon Feb 17 21:25:39 2020

@author: etarmol
following PEP8
"""

from sklearn import svm
from sklearn import feature_extraction
from sklearn.linear_model import SGDClassifier
from sklearn.pipeline import Pipeline
import numpy as np
import json
import pandas as pd
from nltk.corpus import stopwords
from sklearn.datasets import fetch_20newsgroups


class Model:

    # Constructor
    def __init__(self, path_to_traning_file, path_to_testing_file):
        self.traning_file = path_to_traning_file
        self.testing_file = path_to_testing_file
        #self.emotions = ['väldigt positivt','positivt','neutral','negativt','väldigt negativt']
        # 1= positive ; 0 = neutral ; -1 = negative
        self.emotions = ['1', '0', '-1']
        self.training = []
        self.train_target = []
        self.testing = []
        self.test_target = []

    ##METHODS##

    def read_json(self, path_to_file):
        # INPUT: path to json file
        # OUTPUT: dictionary-like data from json file
        with open(path_to_file) as dataBE:
            data = json.load(dataBE)
        return data

    def building_pipeline(self, classifier, test_sentances, test_targets):
        # INPUT: specific classifier in sklearn
        # OUTPUT: feature vector to be used by SVM

        stop_words_swedish = stopwords.words('swedish')

        self.fetch_train_test_data(test_sentances, test_targets)
        text_clf = Pipeline([('vect',  feature_extraction.text.CountVectorizer(stop_words=stop_words_swedish)),
                             ('tfidf',  feature_extraction.text.TfidfTransformer()),
                             ('clf',  classifier(loss='hinge', penalty='l2',
                                                 alpha=1e-3, random_state=42,
                                                 max_iter=5, tol=None))
                             ])

        return text_clf

    def test_classification(self, predicted):
        #INPUT: Prediction
        # OUTPUT: successful classification of test sentances

        nr_successful_classification = 0.0
        res_len = len(predicted)
        for i in range(res_len):
            if predicted[i] == self.test_target[i]:
                nr_successful_classification += 1

        prediction_success_ratio = nr_successful_classification/res_len
        return prediction_success_ratio

    def fetch_train_test_data(self, test_sentances, test_target):
        #INPUT: Nothing
        # OUTPUT: Assign training & testing data / target
        # TODO: read input file for larger sets of training/testing

        # set testing sentances & corresponding targets
        self.testing = test_sentances
        self.test_target = test_target

        line_nr = 0
        with open('sensaldo-base-v02.txt', 'r', encoding='utf-8') as f:
            for line in f:
                if line_nr > 53:
                    test = line.split("\t")
                    word = test[0][:-3]
                    score = test[1].strip()
                    if word not in self.training:
                        self.training.append(word)
                        self.train_target.append(score)
                line_nr += 1
