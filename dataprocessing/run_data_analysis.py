# -*- coding: utf-8 -*-

from model import Model
from data import Data
from sklearn.linear_model import SGDClassifier
from sklearn.linear_model import LogisticRegression
from sklearn import svm
import os
import numpy as np

from sklearn.feature_extraction.text import TfidfVectorizer


def main():

    # =====Environmental variables=====
    host = os.environ['DBHOST']
    port = '5432'
    database = os.environ['DBDB']
    user = os.environ['DBUSER']
    password = os.environ['DBPASS']
    # ================================

    # ====Instatiation of Classes====
    model = Model(':/', ':/')
    database = Data(user=str(user), host=str(host), port=str(port),
                    database=str(database), password=str(password))

    # ===============================

    # ====Temp test sentances========
    test_sentances = ['jag är väldigt glad', 'jag älskar mitt liv',
                      'hata allt och alla', 'längre bort', 'fan va jobbig han är']
    test_targets = [model.emotions[0], model.emotions[0],
                    model.emotions[2], model.emotions[1], model.emotions[2]]
    # ===============================

    # Extract data
    df_anforanden = database.get_data_table('anforandetext')
    df_target = database.get_data_table('resultat_sentiment')
    anforande_texts = df_anforanden['text']

    # Build a pipeline
    text_clf = model.building_pipeline(
        classifier=SGDClassifier, test_sentances=test_sentances, test_targets=test_targets)

    # train the classifier
    text_clf.fit(model.training, model.train_target)

    # testing classifier
    docs_test = model.testing
    predicted = text_clf.predict(docs_test)

    res_test = model.test_classification(predicted)
    print(predicted, res_test)

    # strip anförande of <p>,</p>,...
    anforande_stripped = [anforande.strip('<p>').strip(
        '</p>').replace('</p><p>', '') for anforande in np.array(anforande_texts)]

    # Predict anforande and how close the sentiment is to neighouring sentiments
    test_desc_func = text_clf.decision_function(anforande_stripped)
    indicies = test_desc_func.argmax(axis=1)
    result = []
    for j in range(len(test_desc_func)):
        index = indicies[j]
        norm = np.linalg.norm(test_desc_func[j])
        if index == 0:
            # (label = pos ,neutral,neg)
            result.append((model.emotions[index], np.abs(
                test_desc_func[j][index]-test_desc_func[j][1])/norm, np.abs(test_desc_func[j][index]-test_desc_func[j][2])/norm))

        elif index == 1:
            # (label = neutral ,pos,neg)
            result.append((model.emotions[index], np.abs(
                test_desc_func[j][index]-test_desc_func[j][0])/norm, np.abs(test_desc_func[j][index]-test_desc_func[j][2])/norm))

        elif index == 2:
            # (label = negative ,neutral,pos)
            result.append((model.emotions[index], np.abs(
                test_desc_func[j][index]-test_desc_func[j][1])/norm, np.abs(test_desc_func[j][index]-test_desc_func[j][0])/norm))

    result_anforande = []
    for i in range(len(result)):
        res = result[i]
        if res[0] == '0':
            result_anforande.append(0 + res[1] - res[2])
        elif res[0] == '-1':
            result_anforande.append(-1 + res[1] + res[2])
        elif res[0] == '1':
            result_anforande.append(1 - res[1] - res[2])

    df_target['anforande_id'] = df_anforanden['anforande_id']
    df_target['resultat'] = result_anforande

    print(df_target)

    database.insert_data_table(df_target, df_target, 'resultat_sentiment')


if __name__ == '__main__':
    main()
