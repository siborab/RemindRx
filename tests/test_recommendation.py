from recommend.recommendation import predict_times

def test_valid_input():
    times = predict_times("Take one tablet twice daily")
    assert times == ['06:00', '18:00']  
    
    times = predict_times("Take one tablet once daily")
    assert times == ['13:00']  
    
    times = predict_times("Take one tablet thrice daily")
    assert times == ['07:00', '13:00', '19:00']  
    

def test_invalid_input():
    times = predict_times("")
    
    assert times == ["No matching times found"]  

    times = predict_times("this is a sample input")

    assert times == ["No matching times found"]  

def test_error_handling():
    times = predict_times(456)
    
    assert times == ["Bad Input: Description must be a string"]  
    
    times = predict_times(None)

    assert times == ["Bad Input: Description must be a string"]  
