# -*- coding: utf-8 -*-

from model import Model
from sklearn.linear_model import SGDClassifier
def main():
    test = Model(':/',':/')
    # Markus C:/data_MVK/H7091-1.json
    #path_to_file = "/Users/aissata/mySkolfiler2/mvk/python/H7091-1.json"
    #test.read_json(path_to_file)

    #Build a pipeline 

    #TODO: Extract test_sentances from database & enter them into pipeline
    test_sentances = ['jag är väldigt glad','jag älskar mitt liv','hata allt och alla','längre bort','fan va jobbig han är']
    test_targets = [test.emotions[0],test.emotions[0],test.emotions[2],test.emotions[1],test.emotions[2]]
    
    
    text_clf = test.building_pipeline(SGDClassifier,test_sentances = test_sentances , test_targets = test_targets)

    #train the classifier
    text_clf.fit(test.training,test.train_target)

    #testing classifier
    docs_test = test.testing
    predicted = text_clf.predict(docs_test)
    #result
    res = test.test_classification(predicted)
    print(res)

    #TODO: Write predicted above to database


if __name__ == '__main__':
    main()
