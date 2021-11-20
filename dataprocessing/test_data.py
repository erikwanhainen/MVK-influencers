from data import Data
import pandas as pd
import os


def main():
    host = os.environ.get('DBHOST', 'localhost')
    port = '5432'
    database = os.environ.get('DBDB', 'mvk')
    user = os.environ.get('DBUSER', 'postgres')
    password = os.environ.get('DBPASS', '')

    test = Data(user, host, port, database, password)

    df = test.get_data_table('anforandetext')
    df_target = test.get_data_table('resultat_sentiment')

    # TEST INSERT QUERY
    # Should work as long as there is as many columns in target_table as in processed_table)
    test.insert_data_table(data_frame_processed=df,
                           data_frame_target=df_target, target_table_name="resultat_sentiment")
    # print(test.cursor)
    # test.get_data_table('"'+'Books'+'"')


if __name__ == '__main__':
    main()
