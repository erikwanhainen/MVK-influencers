# -*- coding: utf-8 -*-
"""
ML play scripts


"""
from sklearn import svm
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def main():
    x,y = readData()
    H0,V0 = loadNumberData("0")
    H1,V1 = loadNumberData("1")
    H2,V2 = loadNumberData("2")
    H3,V3 = loadNumberData("3")
    H4,V4 = loadNumberData("4")
    #H5,V5 = loadNumberData("5")
    H6,V6 = loadNumberData("6")
    H7,V7 = loadNumberData("7")
    #H8,V8 = loadNumberData("8")
    H9,V9 = loadNumberData("9")
    
    
    
    
    
    
    #plt.imshow(pic[0:128,0:128], cmap='Greys')
    
    fig = plt.figure()
    ax = fig.add_axes([0,0,1,1])
    
    H0,V0 = l2norm(H0,V0)
    H6,V6 = l2norm(H6,V6)
    ax.scatter(H0,V0)
#    ax.scatter(H1,V1)
 #   ax.scatter(H2,V2)
 #   ax.scatter(H3,V3)
#    ax.scatter(H4,V4)
#    #ax.scatter(H5,V5)
    ax.scatter(H6,V6)
    #ax.scatter(H7,V7)
    #ax.scatter(H8,V8)
  #  ax.scatter(H9,V9)
    ax.set_xlim(0,1.5)


def l2norm(HR,VR):
    for i in range(len(HR)):
        norm = np.sqrt(HR[i]**2 + VR[i]**2)
        HR[i] = HR[i]/norm
        VR[i] = VR[i]/norm
    return HR , VR
    

def loadNumberData(nr):
    #store HR & VR data            
    HR_data = []
    VR_data = []
    for i in range(100):
        #Read number files
        if i < 10:    
            pic = readNumber(nr,nr + str(i))
        else:
            pic = readNumber(nr,str(i))
            
        #Calculate vertical / Horizontal Ratios
        VR = findRatio(pic)
        HR = findRatio(pic,False)
        #Append results
        HR_data.append(HR)
        VR_data.append(VR)
    return np.array(HR_data) , np.array(VR_data)
    
    
def findRatio(pic,VR = True):
    if VR:
        unique_TH, counts_TH = np.unique(pic[0:64,0:128], return_counts=True)
        unique_BH, counts_BH = np.unique(pic[64:128,0:128], return_counts=True)
    else:
        unique_TH, counts_TH = np.unique(pic[0:128,0:64], return_counts=True)
        unique_BH, counts_BH = np.unique(pic[0:128,64:128], return_counts=True)
    TH_dict = dict(zip(unique_TH,counts_TH))
    BH_dict = dict(zip(unique_BH,counts_BH))
    
    return TH_dict[1.0]/BH_dict[1.0]
    
    
def readNumber(folder,nr):
    f = open("C:/data/basicOCR-master/OCR/" + folder + "/" + folder + nr + ".pbm","r")
    #C:\Users\etarmol\Desktop\test.txt
    row = 0
    pic = np.zeros((128,128))
    for line in f:
        if row > 4:#skip first 5 rows
            col = 0
            for val in line:
                if val == '1':
                    pic[row,col] = float(val)
                if val != '\n':
                    col += 1
        row += 1
                       
    return pic


def readData():
    f = open("C:\data\iris.data","r")
    x = []
    y = []
    for line in f:
        information = line.split(",")
        if len(information) != 1:
            data = information[0:4]
            tag = information[4].strip('\n')
            if tag != "virginica":
                x.append([float(i) for i in data])
            if tag not in y:
                y.append(tag)
    return x , y    

def SVMTest(x,y,kernel):    
    clf = svm.SVC()
    clf.fit(x,y)
    print(clf.support_)
    
if __name__ == '__main__':
    main() 
    
    
    #    sl = []
#    sw = []
#    pl = []
#    pw = []
#    
#    for val in x:
#        sl.append(val[0])
#        sw.append(val[1])
#        pl.append(val[2])
#        pw.append(val[3])
#    sl= np.asarray(sl)
#    sw= np.asarray(sw)
#    pl= np.asarray(pl)
#    pw= np.asarray(pw)
#    
#    for i in range(len(sw)):
#        norm = np.sqrt(sw[i]**2 + pl[i]**2)
#        sw[i] = sw[i]/norm
#        pl[i] = pl[i]/norm
        
        
    
    #x_range = 
#    fig = plt.figure()
#    ax = fig.add_axes([0,0,1,1])
#    ax.scatter(sw,pl)
    #ax.scatter(pw,pl)
    #ax.set_xlim(2,10)
    #ax.set_ylim(0.5,7.5)
#    ax = Axes3D(fig)
#    ax.scatter(x_,y_,z_)
#    for angle in range(0, 360):
#        ax.view_init(30, angle)
#        plt.draw()
#        plt.pause(.001)
#        #plt.show()