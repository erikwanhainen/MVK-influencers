
import java.util.Random;
import java.math.BigInteger;

public class generateSQLInsertData{
  
  
   public static void main(String[] args) {
       
       BigInteger[] persId = new BigInteger[personID.length]; 

        for(int i=0; i<personID.length; i++){
            persId[i]= new BigInteger(personID[i]);
        }

       printInsertDataVot(persId, votID, votRes);
        
     }


    public static void printInsertDataSA(String [] anfID){
        
        Random rand = new Random();
        for(int i=0; i<anfID.length; i++){
 
            System.out.println("INSERT INTO resultat_sentiment (anforande_id, resultat) VALUES ('" + anfID[i] + "', " + String.valueOf(rand.nextFloat()) + ");");

        }
    }

    public static void printInsertDataVot(BigInteger [] personID, String [] votID, String [] votRes){
        
        Random rand = new Random();
        
        for(int i=0; i<votID.length; i++){
            for(int j=0; j<personID.length; j++){
            
            System.out.println("INSERT INTO voteringar  (voterings_id, person_id, vot, vot_datum) VALUES (" + votID[i] + ","+ personID[j] + ","+ votRes[rand.nextInt(3)] + "," + votDates[i] + ");");
                
            }
        }

    }


       public String[] anfID= {"00a2128a-986a-ea11-912e-901b0eac4c78",
                            "01a2128a-986a-ea11-912e-901b0eac4c78",
                            "3efe9e47-166a-ea11-912e-901b0eac4c78",
                            "3ffe9e47-166a-ea11-912e-901b0eac4c78",
                            "40fe9e47-166a-ea11-912e-901b0eac4c78",
                            "41fe9e47-166a-ea11-912e-901b0eac4c78",
                            "42fe9e47-166a-ea11-912e-901b0eac4c78",
                            "43fe9e47-166a-ea11-912e-901b0eac4c78",
                            "45fe9e47-166a-ea11-912e-901b0eac4c78",
                            "47fe9e47-166a-ea11-912e-901b0eac4c78",
                            "48fe9e47-166a-ea11-912e-901b0eac4c78",
                            "49fe9e47-166a-ea11-912e-901b0eac4c78",
                            "4afe9e47-166a-ea11-912e-901b0eac4c78",
                            "4bfe9e47-166a-ea11-912e-901b0eac4c78",
                            "4cfe9e47-166a-ea11-912e-901b0eac4c78",
                            "4efe9e47-166a-ea11-912e-901b0eac4c78",
                            "4ffe9e47-166a-ea11-912e-901b0eac4c78",
                            "50fe9e47-166a-ea11-912e-901b0eac4c78",
                            "51fe9e47-166a-ea11-912e-901b0eac4c78",
                            "52fe9e47-166a-ea11-912e-901b0eac4c78",
                            "53fe9e47-166a-ea11-912e-901b0eac4c78",
                            "55fe9e47-166a-ea11-912e-901b0eac4c78",
                            "56fe9e47-166a-ea11-912e-901b0eac4c78",
                            "57fe9e47-166a-ea11-912e-901b0eac4c78",
                            "58fe9e47-166a-ea11-912e-901b0eac4c78",
                            "59fe9e47-166a-ea11-912e-901b0eac4c78",
                            "5cfe9e47-166a-ea11-912e-901b0eac4c78",
                            "5dfe9e47-166a-ea11-912e-901b0eac4c78",
                            "5efe9e47-166a-ea11-912e-901b0eac4c78",
                            "5ffe9e47-166a-ea11-912e-901b0eac4c78",
                            "60fe9e47-166a-ea11-912e-901b0eac4c78",
                            "61fe9e47-166a-ea11-912e-901b0eac4c78",
                            "62fe9e47-166a-ea11-912e-901b0eac4c78",
                            "63fe9e47-166a-ea11-912e-901b0eac4c78",
                            "64fe9e47-166a-ea11-912e-901b0eac4c78",
                            "65fe9e47-166a-ea11-912e-901b0eac4c78",
                            "66fe9e47-166a-ea11-912e-901b0eac4c78",
                            "67fe9e47-166a-ea11-912e-901b0eac4c78",
                            "68fe9e47-166a-ea11-912e-901b0eac4c78",
                            "69fe9e47-166a-ea11-912e-901b0eac4c78",
                            "6afe9e47-166a-ea11-912e-901b0eac4c78"};
     
     public static String[] personID = { "643844865712",
                                            "173210620224",
                                            "538982776628",
                                            "695090885212",
                                            "792474127508",
                                            "582811195313",
                                            "201207390210",
                                            "72019517020",
                                            "165360915617",
                                            "427127522211",
                                            "40421445103",
                                            "731809135516",
                                            "456070504608",
                                            "361964723211",
                                            "549025722425",
                                            "324473031398",
                                            "599390849728",
                                            "909948830718",
                                            "920966427818",
                                            "891971250317",
                                            "539819850007",
                                            "315172621102",
                                            "61124537800",
                                            "594584559201",
                                            "362377089307",
                                            "501397157002",
                                            "538777624511",
                                            "364687971222",
                                            "895706637124",
                                            "469915585804"};

        
        public static String[] votID = {"'D40CF5B8-8928-482D-851A-6D2E0C73AC2F'",
                                "'34C857AC-D054-4A04-8C88-053751262692'",
                                "'F95AB17E-2C81-4A18-97F6-E793A5C789DE'"};

        public static String[] votRes = {"'Ja'","'Nej'","'Frånvarande'"};
        
        public static String[] votDates = {"'2020-02-27'","'2020-03-05'","'2020-03-12'"};


}