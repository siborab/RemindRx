# Unit Testing Guideline

This guide provides instructions and examples of the unit testing framework for our project. We are using **Jest** and **pytest** as our unit testing framework.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Example Unit Tests](#example-unit-tests)
3. [Helpful Resources](#helpful-resources)

## Getting Started

### Installing Jest

Install **Jest** using your preferred package manager:

> npm install --save-dev jest </br>
> yarn add --dev jest </br>
> pnpm add --save-dev jest </br>

Similarly install **ts-jest** for transpilation and Typescript support:

> npm install --save-dev ts-jest </br>
> yarn add --dev ts-jest </br>
> pnpm add --save-dev ts-jest </br>

### Configurations

Generate a **Jest** configuration file with:

> npm init jest@latest </br>
> yarn create jest </br>
> pnpm create jest </br>

Generate a **ts-jest** configuration file with:

> npx ts-jest config:init </br>
> yarn ts-jest config:init </br>

However, answer no to the Jest question about whether or not to enable TypeScript. Instead, add the line: preset: "ts-jest" to the jest.config.js file afterwards.

### Installing pytest

Install **pytest** using pip:

> pip install pytest </br>

If you would like to utilize additional plugins such as pytest-mock for mocking, you can install them with:

> pip install pytest-mock </br>

### Configurations

Create a pytest.ini file in the root of your project and add the following content to the file:

> [pytest] </br>
> addopts = -v --cov=your_module --cov-report=html </br>
> testpaths = tests/ </br>

## Example Unit Tests

```
import UserRepository from './UserRepository';
import { supabase } from '../supabase/client';

const mockbase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
    };

    const mockUser: Partial<User> = {
        id: 1,
        first_name: 'Ben',
        last_name: 'Oviedo',
        phone_number: '11231333',
        date_of_birth: '2020-01-20',
    };

    const mockError = { message: `error updating user ${mockUser.first_name}` };

    interface User {
        id?: number;
        first_name?: string;
        last_name?: string;
        phone_number?: string;
        date_of_birth?: string;
        time_zone?: string;
        created_at?: string;
        updated_at?: string;
        }

    jest.mock('@supabase/supabase-js', () => ({
        createClient: jest.fn(() => mockbase),
    }));

    describe('read', () => {
        test('retrieving the user by id', async () => {
            (mockbase.from as jest.Mock).mockReturnThis();
            (mockbase.select as jest.Mock).mockReturnThis();
            (mockbase.eq as jest.Mock).mockReturnThis();

            (mockbase.eq as jest.Mock).mockResolvedValueOnce([mockUser]);

            const user = await userRepository.read(1);

            expect(user).toEqual([mockUser]);
            expect(mockbase.eq).toHaveBeenCalledWith('id', 1);
        })
    });
```

The unit test example here uses mocking to replace real database interaction with controlled responses allowing us to isolate the UserRepository class and test successful/failed insertion of a new user. As mocking is a common yet essential technique in unit testing, I would suggest you read more on it here: [Jest-Mocking](https://jestjs.io/docs/mock-function-api)

```
import pytest
import os
from scanner.model import extract_text_from_label

# Get the absolute path to the tests directory
TEST_ASSETS_DIR = os.path.join(os.path.dirname(__file__), "assets")

def test_valid_label():
    image_path = os.path.join(TEST_ASSETS_DIR, "nothing.jpg")
    detected_text = extract_text_from_label(image_path)
    assert isinstance(detected_text, str)
    assert detected_text.lower() == "nothing"

def test_empty_image():
    image_path = os.path.join(TEST_ASSETS_DIR, "black.jpg")
    detected_text = extract_text_from_label(image_path)
    assert detected_text == ""

def test_non_existant_file():
    image_path = os.path.join(TEST_ASSETS_DIR, "doesnotexist.jpg")
    with pytest.raises(FileNotFoundError):
        extract_text_from_label(image_path)

def test_invalid_image_format():
    invalid_file = os.path.join(TEST_ASSETS_DIR, "not_an_image.txt")

    with open(invalid_file, "w+") as f:
        f.write("This is not an image")

    with pytest.raises(ValueError):
        extract_text_from_label(invalid_file)

    os.remove(invalid_file)
```

The series of unit tests here verifies that the text extraction model behaves as expected by checking its response to a variety of unit tests varying from valid images, empty images, non-existent files, and invalid file formats, ensuring it correctly handles both successful and error cases.

## Helpful Resources

### Jest

[Jest Documentations](https://jestjs.io/)

### pytest

[pytest Documentation](https://docs.pytest.org/en/stable/)
