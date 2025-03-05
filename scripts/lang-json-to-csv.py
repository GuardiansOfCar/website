import json
import csv
import sys
import os

def flatten_dict(d, parent_key='', sep='.'):
    """
    Flatten a nested dictionary.

    :param d: Dictionary to be flattened
    :param parent_key: String used for the parent key
    :param sep: Separator between parent and child keys
    :return: Flattened dictionary
    """
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        elif isinstance(v, list):
            for i, item in enumerate(v):
                items.extend(flatten_dict({f"{new_key}[{i}]": item}).items())
        else:
            items.append((new_key, v))
    return dict(items)

def main(input_folder, output_file):
    # Get all JSON files in the specified folder
    json_files = [f for f in os.listdir(input_folder) if f.endswith('.json')]
    
    # Read all JSON files and flatten them
    flattened_data = {}
    for json_file in json_files:
        json_path = os.path.join(input_folder, json_file)
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            flattened_data[json_file] = flatten_dict(data)

    # Prepare data for CSV
    csv_data = []
    # Collect all keys from the flattened data using `en.json` as the reference
    en_data = flattened_data.get('en.json', {})
    all_keys = sorted(set(en_data.keys()))  # Sort the keys from en.json

    # Create a list for the header (file names as columns)
    header = ['key'] + json_files
    csv_data.append(header)

    # Create the rows for CSV
    for key in all_keys:
        row = [key]
        for json_file in json_files:
            file_data = flattened_data.get(json_file, {})
            # If the key is not found in other files, add an empty value
            if key in file_data:
                row.append(file_data[key])
            else:
                # If the key is missing in other files, add empty value
                row.append('')

        # Check if the key in the other files is not in `en.json`
        for json_file in json_files:
            file_data = flattened_data.get(json_file, {})
            if key not in en_data and key in file_data:
                print(f"Warning: Key '{key}' found in {json_file}, but not in en.json")

        csv_data.append(row)

    # Write the flattened data to a CSV file
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerows(csv_data)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python flatten_json_to_csv.py input_folder output_file")
        sys.exit(1)

    input_folder = sys.argv[1]
    output_file = sys.argv[2]
    main(input_folder, output_file)
