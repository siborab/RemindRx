import io
import pytest
from tests.model_utils import create_high_quality_test_image
from server.app.factory import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_scan_valid_image(client):
    image = create_high_quality_test_image("Testing flask api")
    
    data = {
        'image': (image, 'test,jpg')
    }
    
    response = client.post('/api/models/scan', data=data, content_type='multipart/form-data')
    
    assert response.status_code == 200
    json_data = response.get_json()
    assert 'text' in json_data
    assert isinstance(json_data['text'], str)

