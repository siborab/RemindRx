import pandas as pd
import numpy as np
import pickle 
from sklearn.feature_extraction.text import TfidfVectorizer 
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MultiLabelBinarizer
from recommendation import predict_times
import pytest

def test_init():
    assert predict_times("Take one tablet twice daily")==['06:00', '18:00']  #should return the times for the first entry in dummy_data
    assert predict_times("Take one tablet once daily")==['13:00']  #should return the times for the second entry in dummy_data
    assert predict_times("Take one tablet thrice daily")==['07:00', '13:00', '19:00']  #should return the times for the third entry in dummy_data
    #assuming the model is trained and saved correctly these should pass, yippie!

def test_bad_input():
    assert predict_times("")==["No matching times found"]  #empty string should return no matching times found
    assert predict_times("this is a meme input")==["No matching times found"]  #invalid description should also return no matching times found

def test_exception_handling():
    assert predict_times(123)==["Bad Input: Description must be a string"]  #passing an integer should also raise an exception and return the error message
    assert predict_times(None)==["Bad Input: Description must be a string"]  #passing None should also raise an exception and return the error message
    # these tests should catch any exceptions regarding bad inputs. will add more as needed