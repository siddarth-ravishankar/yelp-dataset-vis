# yelp-dataset-vis

This project is a visualization tool for Yelp Challenge Dataset written in Django and leaflet / d3.

When running the project download yelp challenge dataset from https://www.yelp.com/dataset_challenge/dataset.
The dataset path needs to be added in business/util/constants.py
By default, the path points to ../Data/yelp_dataset_challenge_academic_dataset.
This path should contain all the yelp challange dataset in json format.

Businesses are categorized under 700 categories.
These categories are grouped into 21 main categories based on occurances of one category with the 21 main categories.
For the first time, these categories are clustered by running through all businesses in O(n^2) time (I have not figured a better algorithm yet).
This data is then cached and reused every time in constant time.
Cached file details are present in business/resources/cached_data.
Look into business/util/cluster_categories.py for working of categories clustering.

This application does not use any database. I'm reading all data into main memory as dictionary.
Hence models.py is my customized class for storing all data from json files.
